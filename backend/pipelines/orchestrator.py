import threading
from typing import Optional

from pipelines.graph import app
from pipelines.state import PipelineState
from core.database import supabase

def run_pipeline_async(
    pipeline_id: str, 
    user_id: str, 
    dataset_id: str, 
    target_column: Optional[str] = None, 
    task_type: str = "regression"
) -> None:
    """
    Kicks off the complete AutoInsight LangGraph pipeline in a background thread 
    so the REST API endpoint can return a 200 OK immediately to the frontend.
    """
    
    initial_state: PipelineState = {
        "pipeline_id": pipeline_id,
        "user_id": user_id,
        "dataset_id": dataset_id,
        "target_column": target_column,
        "task_type": task_type,
        "errors": []
    }
    
    def execute_graph():
        try:
            # Mark the pipeline as officially started in the database
            supabase.table("pipelines").update({
                "status": "running",
                "current_agent": "system_boot"
            }).eq("id", pipeline_id).execute()
            
            # Execute the compiled LangGraph App
            app.invoke(initial_state)
            
            # Mark the pipeline as permanently finished 
            supabase.table("pipelines").update({
                "status": "completed"
            }).eq("id", pipeline_id).execute()
            
        except Exception as e:
            error_msg = f"Fatal Orchestrator Crash: {str(e)}"
            print(error_msg)
            # Catch catastrophic failure
            supabase.table("pipelines").update({
                "status": "error",
                "error_message": error_msg
            }).eq("id", pipeline_id).execute()

    # Dispatch to background thread
    thread = threading.Thread(target=execute_graph)
    thread.daemon = True
    thread.start()
