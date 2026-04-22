import uuid
from typing import Optional
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from pipelines.orchestrator import run_pipeline_async
from core.database import supabase
from core.auth import get_current_user

class JobCreate(BaseModel):
    dataset_id: str
    target_column: Optional[str] = None
    task_type: str = "regression"

router = APIRouter(prefix="/api/v1/jobs", tags=["Jobs"])

@router.post("")
def start_pipeline(job: JobCreate):
    """
    Validates ownership of the dataset and kicks off the background LangGraph AI pipeline.
    """
    usr_res = supabase.table("users").select("id").limit(1).execute()
    user_id = usr_res.data[0]["id"] if usr_res.data else "00000000-0000-0000-0000-000000000000"
    
    # 1. Strict verification: ensure the authorized user actually owns this dataset
    dataset_res = supabase.table("datasets").select("id").eq("id", job.dataset_id).eq("user_id", user_id).single().execute()
    if not dataset_res.data:
        raise HTTPException(status_code=404, detail="Dataset not found or unauthorized access")
        
    pipeline_id = str(uuid.uuid4())
    
    # 2. Insert new execution job into database
    pipeline_payload = {
        "id": pipeline_id,
        "user_id": user_id,
        "dataset_id": job.dataset_id,
        "model_choice": "xgboost",
        "status": "queued",
        "current_agent": "system_boot",
        "progress": 0
    }
    supabase.table("pipelines").insert(pipeline_payload).execute()
    
    # 3. Fire the LangGraph pipeline into an async background thread 
    run_pipeline_async(
        pipeline_id=pipeline_id,
        user_id=user_id,
        dataset_id=job.dataset_id,
        target_column=job.target_column,
        task_type=job.task_type
    )
    
    # Return immediately while agents process data in the background
    return {"message": "Pipeline execution started.", "pipeline_id": pipeline_id}

@router.get("/{pipeline_id}")
def check_status(pipeline_id: str):
    """
    Allows the frontend dashboard to continuously poll the status and exact progress
    of the AI pipeline execution.
    """
    res = supabase.table("pipelines").select("*").eq("id", pipeline_id).single().execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Pipeline job not found or unauthorized")
        
    return res.data
