import io
import pandas as pd
from typing import Any

from core.database import supabase
from agents.base_agent import BaseAgent
from pipelines.state import PipelineState

class IngestionAgent(BaseAgent):
    """
    Ingestion Agent for AutoInsight.
    - Downloads the dataset from Supabase Stoarge
    - Infers schema (row count, column count, dtypes)
    - Updates dataset metadata in the database
    - Passes the raw Pandas DataFrame to the next stage
    """
    
    agent_name = "ingestion"

    def run(self, state: PipelineState) -> PipelineState:
        pipeline_id = state.get("pipeline_id")
        dataset_id = state.get("dataset_id")
        
        if not pipeline_id or not dataset_id:
            raise ValueError("pipeline_id and dataset_id must be provided in the state.")

        self._log(pipeline_id, "running", "Ingestion agent started extracting dataset.")
        self._update_pipeline_stage(pipeline_id, self.agent_name, 10, "running")

        try:
            # 1. Fetch dataset metadata
            dataset_res = supabase.table("datasets").select("storage_path, file_type").eq("id", dataset_id).single().execute()
            if not dataset_res.data:
                raise ValueError(f"Dataset {dataset_id} not found in database.")
                
            storage_path = dataset_res.data.get("storage_path")
            file_type = dataset_res.data.get("file_type", "").lower()
            
            if not storage_path:
                raise ValueError("Storage path is empty for the dataset.")

            self._log(pipeline_id, "running", f"Downloading dataset from storage: {storage_path}")
            
            # 2. Download from Supabase Storage
            # Assuming 'datasets' is the bucket name for raw datasets
            file_bytes = supabase.storage.from_("datasets").download(storage_path)
            
            self._log(pipeline_id, "running", "Loading data into Pandas DataFrame.")
            self._update_pipeline_stage(pipeline_id, self.agent_name, 50, "running")
            
            # 3. Load into DataFrame
            df = self._load_dataframe(file_bytes, file_type)
            
            # 4. Infer Schema and Extract Metadata
            rows_count = len(df)
            columns_count = len(df.columns)
            columns_info = [
                {"name": str(col), "type": str(dtype)} 
                for col, dtype in df.dtypes.items()
            ]
            
            self._log(pipeline_id, "running", f"Inferred schema: {rows_count} rows, {columns_count} columns.")
            
            # 5. Update Database Record
            supabase.table("datasets").update({
                "rows_count": rows_count,
                "columns_count": columns_count,
                "columns_info": columns_info,
                "status": "ingested"
            }).eq("id", dataset_id).execute()
            
            # 6. Update State
            state["raw_df"] = df
            state["current_stage"] = self.agent_name
            
            # Initialize clean_df with raw_df so subsequent agents don't break if cleaning is skipped
            state["clean_df"] = df.copy()

            self._log(pipeline_id, "completed", "Ingestion completed successfully.")
            self._update_pipeline_stage(pipeline_id, self.agent_name, 100, "running")  # Let Orchestrator mark pipeline as completed later
            
            return state

        except Exception as e:
            error_msg = f"Ingestion Agent Failed: {str(e)}"
            self._log(pipeline_id, "error", error_msg)
            self._update_pipeline_stage(pipeline_id, self.agent_name, 0, "error", error_msg)
            state["errors"] = state.get("errors", []) + [error_msg]
            raise e

    def _load_dataframe(self, file_bytes: bytes, file_type: str) -> pd.DataFrame:
        """Helper to parse raw bytes into a DataFrame based on file type."""
        if 'csv' in file_type:
            return pd.read_csv(io.BytesIO(file_bytes))
        elif 'xls' in file_type or 'excel' in file_type:
            return pd.read_excel(io.BytesIO(file_bytes))
        elif 'json' in file_type:
            return pd.read_json(io.BytesIO(file_bytes))
        else:
            # Fallback to CSV parsing try
            try:
                return pd.read_csv(io.BytesIO(file_bytes))
            except Exception:
                raise ValueError(f"Unsupported file_type for pandas parsing: {file_type}")
