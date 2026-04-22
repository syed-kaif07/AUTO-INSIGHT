import pandas as pd
import numpy as np

from agents.base_agent import BaseAgent
from pipelines.state import PipelineState

class CleaningAgent(BaseAgent):
    """
    Cleaning Agent for AutoInsight.
    - Duplicates removal.
    - Missing value imputation (median for numeric, mode for categorical).
    - Basic outlier detection and flagging (logging counts).
    - Passes the cleaned DataFrame back to state.
    """
    
    agent_name = "cleaning"

    def run(self, state: PipelineState) -> PipelineState:
        pipeline_id = state.get("pipeline_id")
        raw_df = state.get("raw_df")
        
        if not pipeline_id:
            raise ValueError("pipeline_id must be provided in the state.")
        if raw_df is None or not isinstance(raw_df, pd.DataFrame):
            raise ValueError("raw_df is missing or not a valid Pandas DataFrame in state.")

        self._log(pipeline_id, "running", "Cleaning agent started inspecting data.")
        self._update_pipeline_stage(pipeline_id, self.agent_name, 10, "running")

        try:
            # We work on a copy to preserve raw_df
            df = raw_df.copy()
            initial_rows = len(df)
            
            # 1. Remove Duplicates
            df.drop_duplicates(inplace=True)
            duplicates_removed = initial_rows - len(df)
            
            self._log(pipeline_id, "running", f"Removed {duplicates_removed} duplicate rows.")
            self._update_pipeline_stage(pipeline_id, self.agent_name, 30, "running")
            
            # 2. Handle Missing Values
            missing_stats = df.isna().sum()
            total_missing = int(missing_stats.sum())
            total_cells = df.shape[0] * df.shape[1]
            missing_percentage = round((total_missing / total_cells) * 100, 2) if total_cells > 0 else 0

            # Impute Numerical Columns (Median)
            num_cols = df.select_dtypes(include=['number']).columns
            for col in num_cols:
                if df[col].isna().sum() > 0:
                    df[col] = df[col].fillna(df[col].median())
                    
            # Impute Categorical Columns (Mode or "Unknown")
            cat_cols = df.select_dtypes(include=['object', 'category']).columns
            for col in cat_cols:
                if df[col].isna().sum() > 0:
                    # mode() returns a Series, take the first value or fallback
                    mode_series = df[col].mode()
                    fill_val = mode_series.iloc[0] if not mode_series.empty else "Unknown"
                    df[col] = df[col].fillna(fill_val)

            self._log(pipeline_id, "running", f"Handled {total_missing} missing values ({missing_percentage}% of data).")
            self._update_pipeline_stage(pipeline_id, self.agent_name, 60, "running")

            # 3. Basic Outlier Flagging (IQR Method for logging)
            outliers_count = 0
            for col in num_cols:
                Q1 = df[col].quantile(0.25)
                Q3 = df[col].quantile(0.75)
                IQR = Q3 - Q1
                lower_bound = Q1 - 1.5 * IQR
                upper_bound = Q3 + 1.5 * IQR
                
                # Count how many are outside the bounds
                col_outliers = ((df[col] < lower_bound) | (df[col] > upper_bound)).sum()
                outliers_count += int(col_outliers)
                
            self._log(pipeline_id, "running", f"Flagged {outliers_count} potential outliers across numeric columns.")
            self._update_pipeline_stage(pipeline_id, self.agent_name, 90, "running")
            
            # 4. Save clean data back to state
            state["clean_df"] = df
            state["current_stage"] = self.agent_name

            self._log(pipeline_id, "completed", "Data cleaning completed successfully.")
            self._update_pipeline_stage(pipeline_id, self.agent_name, 100, "running")
            
            return state

        except Exception as e:
            error_msg = f"Cleaning Agent Failed: {str(e)}"
            self._log(pipeline_id, "error", error_msg)
            self._update_pipeline_stage(pipeline_id, self.agent_name, 0, "error", error_msg)
            state["errors"] = state.get("errors", []) + [error_msg]
            raise e
