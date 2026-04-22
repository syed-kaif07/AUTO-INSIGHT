import json
import pandas as pd
import numpy as np

from core.database import supabase
from agents.base_agent import BaseAgent
from pipelines.state import PipelineState

class EDAAgent(BaseAgent):
    """
    EDA Agent (Exploratory Data Analysis) for AutoInsight.
    - Computes statistical summaries.
    - Generates a correlation matrix for numerical features.
    - Captures distributions metrics.
    - Stores the analysis payloads in the `analysis_results` Supabase table.
    """
    
    agent_name = "eda"

    def run(self, state: PipelineState) -> PipelineState:
        pipeline_id = state.get("pipeline_id")
        dataset_id = state.get("dataset_id")
        user_id = state.get("user_id")
        df = state.get("clean_df")
        
        if not pipeline_id or not dataset_id or not user_id:
            raise ValueError("pipeline_id, dataset_id, and user_id must be provided in the state.")
        if df is None or not isinstance(df, pd.DataFrame) or df.empty:
            raise ValueError("clean_df is missing or empty in state.")

        self._log(pipeline_id, "running", "EDA Agent started analyzing data.")
        self._update_pipeline_stage(pipeline_id, self.agent_name, 10, "running")

        try:
            # 1. Summary Statistics
            self._log(pipeline_id, "running", "Computing summary statistics.")
            
            # describe() outputs NaN for string stats on numeric cols and vice versa, 
            # so we replace NaNs with None to make it JSON serializable.
            summary_df = df.describe(include="all")
            summary_df = summary_df.replace({np.nan: None})
            summary_stats = summary_df.to_dict()
            
            self._update_pipeline_stage(pipeline_id, self.agent_name, 40, "running")

            # 2. Correlation Matrix
            self._log(pipeline_id, "running", "Generating correlation matrix.")
            num_cols = df.select_dtypes(include=["number"])
            
            correlation_matrix = {}
            if not num_cols.empty and len(num_cols.columns) > 1:
                corr_df = num_cols.corr()
                corr_df = corr_df.replace({np.nan: None})
                correlation_matrix = corr_df.to_dict()

            self._update_pipeline_stage(pipeline_id, self.agent_name, 70, "running")

            # 3. Handle data structure for analysis_results (Distribution formatting)
            # For charts in the frontend, they often need frequency counts for categoricals
            # and bin distributions for numericals.
            charts_data = {}
            for col in df.columns[:10]: # Limit to 10 features to avoid massive JSON blobs
                if pd.api.types.is_numeric_dtype(df[col]):
                    # create 10 bins for a histogram representation
                    counts, bin_edges = np.histogram(df[col].dropna(), bins=10)
                    charts_data[col] = {
                        "type": "histogram",
                        "counts": counts.tolist(),
                        "bin_edges": bin_edges.tolist()
                    }
                else:
                    # top 10 value counts for categorical data
                    val_counts = df[col].value_counts().head(10).to_dict()
                    charts_data[col] = {
                        "type": "bar",
                        "labels": list(val_counts.keys()),
                        "values": list(val_counts.values())
                    }

            # 4. Save to Supabase `analysis_results` table
            self._log(pipeline_id, "running", "Saving analysis to database.")
            
            payload = {
                "pipeline_id": pipeline_id,
                "user_id": user_id,
                "dataset_id": dataset_id,
                "summary_stats": summary_stats,
                "correlation_matrix": correlation_matrix,
                "charts": charts_data,
                "missing_values": {}, # Already handled by cleaning agent, so its clean
                "ai_insights": "Analysis completed automatically."
            }
            
            supabase.table("analysis_results").insert(payload).execute()

            # 5. Attach payload to state for the next agents (like Reporting)
            state["eda_results"] = payload
            state["current_stage"] = self.agent_name

            self._log(pipeline_id, "completed", "Exploratory Data Analysis completed successfully.")
            self._update_pipeline_stage(pipeline_id, self.agent_name, 100, "running")

            return state

        except Exception as e:
            error_msg = f"EDA Agent Failed: {str(e)}"
            self._log(pipeline_id, "error", error_msg)
            self._update_pipeline_stage(pipeline_id, self.agent_name, 0, "error", error_msg)
            state["errors"] = state.get("errors", []) + [error_msg]
            raise e
