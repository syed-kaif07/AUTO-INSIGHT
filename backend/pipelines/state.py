from typing import Any, TypedDict


class PipelineState(TypedDict, total=False):
    """
    Shared state object passed between all LangGraph agent nodes.
    Each agent reads what it needs and writes its output back into this dict.
    """

    # ─── Identity ────────────────────────────────────────────────────────────
    pipeline_id: str       # UUID of the pipelines row in Supabase
    user_id: str           # UUID of the owning user
    dataset_id: str        # UUID of the dataset row in Supabase
    target_column: str     # User-selected column to predict
    task_type: str         # "regression" | "classification"

    # ─── Data ────────────────────────────────────────────────────────────────
    dataset_url: str       # Supabase Storage public/signed URL of the raw file
    raw_df: Any            # Original pandas DataFrame (post-ingestion)
    clean_df: Any          # Cleaned pandas DataFrame (post-cleaning)

    # ─── Agent Outputs ───────────────────────────────────────────────────────
    eda_results: dict      # Output of EDAAgent: stats, charts, correlations
    model_results: dict    # Output of PredictionAgent: metrics, feature importance

    # ─── Reporting ───────────────────────────────────────────────────────────
    report_url: str        # Supabase Storage URL of the generated PDF report

    # ─── Pipeline Metadata ───────────────────────────────────────────────────
    current_stage: str     # e.g. "ingestion" | "cleaning" | "eda" | "prediction" | "reporting"
    errors: list           # List of error strings accumulated across stages
