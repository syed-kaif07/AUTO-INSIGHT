import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from core.database import supabase
from core.auth import get_current_user

router = APIRouter(prefix="/api/v1/datasets", tags=["Datasets"])

@router.post("")
async def upload_dataset(file: UploadFile = File(...)):
    """
    Accepts a file upload, uploads it directly to Supabase Storage, and inserts a row
    into the 'datasets' table to record the metadata.
    """
    try:
        content = await file.read()
        file_size = len(content)
        
        usr_res = supabase.table("users").select("id").limit(1).execute()
        user_id = usr_res.data[0]["id"] if usr_res.data else "00000000-0000-0000-0000-000000000000"
        dataset_id = str(uuid.uuid4())
        
        # Determine basic file type based on extension
        file_extension = file.filename.split(".")[-1] if "." in file.filename else "csv"
        storage_path = f"raw/{user_id}/{dataset_id}.{file_extension}"
        
        # 1. Upload safely to Supabase Storage (bucket: 'datasets')
        supabase.storage.from_("datasets").upload(
            storage_path,
            content,
            {"content-type": file.content_type or "text/csv"}
        )
        
        # 2. Insert reference row into the PostgreSQL DB
        payload = {
            "id": dataset_id,
            "user_id": user_id,
            "name": file.filename,
            "original_filename": file.filename,
            "file_type": file_extension,
            "file_size": file_size,
            "storage_path": storage_path,
            "status": "ready"
        }
        supabase.table("datasets").insert(payload).execute()
        
        return {
            "message": "Dataset uploaded successfully", 
            "dataset_id": dataset_id, 
            "storage_path": storage_path
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Dataset Upload failed: {str(e)}")

@router.get("")
def list_datasets():
    """Fetch all dataset metadata"""
    usr_res = supabase.table("users").select("id").limit(1).execute()
    user_id = usr_res.data[0]["id"] if usr_res.data else None
    if not user_id: return {"datasets": []}
    res = supabase.table("datasets").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
    return {"datasets": res.data}

@router.get("/{dataset_id}")
def get_dataset(dataset_id: str, current_user: dict = Depends(get_current_user)):
    """Fetch specific dataset metadata"""
    res = supabase.table("datasets").select("*").eq("id", dataset_id).eq("user_id", current_user["id"]).single().execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Dataset not found or strictly unauthorized")
    return res.data
