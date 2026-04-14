from abc import ABC, abstractmethod
from datetime import datetime, timezone
from typing import Any

from core.database import supabase
from pipelines.state import PipelineState


class BaseAgent(ABC):
    """
    Abstract base class for all AutoInsight pipeline agents.

    Provides:
    - A `run(state)` abstract method that each agent must implement
    - `_log()` to write structured entries to the `agent_logs` Supabase table
    - `_update_pipeline_stage()` to keep the pipelines row current_agent + progress in sync
    """

    # Override in each concrete subclass
    agent_name: str = "base"

    @abstractmethod
    def run(self, state: PipelineState) -> PipelineState:
        """
        Execute the agent's logic. Receives the shared PipelineState,
        mutates it with results, and returns the updated state.
        """
        ...

    # ─── Supabase Logging Helpers ─────────────────────────────────────────────

    def _log(
        self,
        pipeline_id: str,
        status: str,
        message: str,
    ) -> None:
        """
        Write a structured log entry to the `agent_logs` table.

        Args:
            pipeline_id: UUID of the running pipeline
            status:      "running" | "completed" | "error"
            message:     Human-readable status message
        """
        try:
            now = datetime.now(timezone.utc).isoformat()
            payload: dict[str, Any] = {
                "pipeline_id": pipeline_id,
                "agent_name": self.agent_name,
                "status": status,
                "message": message,
                "created_at": now,
            }
            if status == "running":
                payload["started_at"] = now
            elif status in ("completed", "error"):
                payload["completed_at"] = now

            supabase.table("agent_logs").insert(payload).execute()
        except Exception:
            # Logging failures must never crash the pipeline
            pass

    def _update_pipeline_stage(
        self,
        pipeline_id: str,
        stage: str,
        progress: int,
        status: str = "running",
        error_message: str | None = None,
    ) -> None:
        """
        Update the `pipelines` table row to reflect current agent progress.

        Args:
            pipeline_id:   UUID of the pipeline
            stage:         Current agent name (e.g. "reporting")
            progress:      Integer 0–100
            status:        "running" | "completed" | "error"
            error_message: Only set on error
        """
        try:
            update_payload: dict[str, Any] = {
                "current_agent": stage,
                "progress": progress,
                "status": status,
                "updated_at": datetime.now(timezone.utc).isoformat(),
            }
            if status == "completed":
                update_payload["completed_at"] = datetime.now(timezone.utc).isoformat()
            if error_message:
                update_payload["error_message"] = error_message

            supabase.table("pipelines").update(update_payload).eq("id", pipeline_id).execute()
        except Exception:
            pass
