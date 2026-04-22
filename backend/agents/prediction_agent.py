import json
import pandas as pd
import numpy as np
from typing import Any

from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error, accuracy_score, f1_score
from xgboost import XGBRegressor, XGBClassifier

from core.database import supabase
from agents.base_agent import BaseAgent
from pipelines.state import PipelineState

class PredictionAgent(BaseAgent):
    """
    Prediction Agent for AutoInsight.
    - Identifies target column (defaults to the last column).
    - Prepares data (One-Hot Encoding, Train/Test Split).
    - Trains an XGBoost Model (Regression or Classification).
    - Extracts performance metrics and feature importances.
    - Saves results into the Supabase `predictions` table.
    """
    
    agent_name = "prediction"

    def run(self, state: PipelineState) -> PipelineState:
        pipeline_id = state.get("pipeline_id")
        dataset_id = state.get("dataset_id")
        user_id = state.get("user_id")
        df = state.get("clean_df")
        
        target_col = state.get("target_column")
        task_type = state.get("task_type", "regression") # default to regression if unknown

        if not pipeline_id or not dataset_id or not user_id:
            raise ValueError("pipeline_id, dataset_id, and user_id must be provided in the state.")
        if df is None or not isinstance(df, pd.DataFrame) or df.empty:
            raise ValueError("clean_df is missing or empty in state.")

        self._log(pipeline_id, "running", "Prediction Agent started ML modeling.")
        self._update_pipeline_stage(pipeline_id, self.agent_name, 10, "running")

        try:
            # 1. Target Column Identification
            if not target_col or target_col not in df.columns:
                target_col = df.columns[-1] # Fallback to the last column
                self._log(pipeline_id, "running", f"No valid target column provided. Defaulting to: {target_col}")
            
            # Auto-detect task type if not explicitly set correctly
            if pd.api.types.is_object_dtype(df[target_col]) or pd.api.types.is_categorical_dtype(df[target_col]) or df[target_col].nunique() < 15:
                task_type = "classification"
            else:
                task_type = "regression"

            self._log(pipeline_id, "running", f"Task determined as {task_type} for target '{target_col}'.")
            self._update_pipeline_stage(pipeline_id, self.agent_name, 20, "running")

            # 2. Data Preparation
            # Drop rows where target is missing
            modeling_df = df.dropna(subset=[target_col]).copy()
            
            y = modeling_df[target_col]
            X = modeling_df.drop(columns=[target_col])
            
            # One-Hot Encode categorical features
            X = pd.get_dummies(X, drop_first=True)
            
            # Label Encoding target if classification
            if task_type == "classification":
                # Convert string labels to 0, 1, 2...
                y = y.astype('category').cat.codes
            
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
            
            self._update_pipeline_stage(pipeline_id, self.agent_name, 40, "running")

            # 3. Model Training
            model_name = f"XGBoost {task_type.capitalize()}"
            self._log(pipeline_id, "running", f"Training {model_name}...")
            
            if task_type == "regression":
                model = XGBRegressor(n_estimators=100, random_state=42)
            else:
                model = XGBClassifier(n_estimators=100, random_state=42, use_label_encoder=False, eval_metric="logloss")
                
            model.fit(X_train, y_train)
            
            # 4. Predictions and Metrics
            self._log(pipeline_id, "running", "Evaluating model performance.")
            self._update_pipeline_stage(pipeline_id, self.agent_name, 70, "running")
            
            y_pred = model.predict(X_test)
            
            metrics = {
                "r2_score": None,
                "mae": None,
                "rmse": None,
                "accuracy": None,
                "f1_score": None
            }
            
            if task_type == "regression":
                metrics["r2_score"] = float(r2_score(y_test, y_pred))
                metrics["mae"] = float(mean_absolute_error(y_test, y_pred))
                metrics["rmse"] = float(np.sqrt(mean_squared_error(y_test, y_pred)))
            else:
                metrics["accuracy"] = float(accuracy_score(y_test, y_pred))
                metrics["f1_score"] = float(f1_score(y_test, y_pred, average='weighted'))

            # 5. Extract Feature Importance
            importance_dict = dict(zip(X.columns, model.feature_importances_))
            # Sort and take top 10
            sorted_importance = {k: float(v) for k, v in sorted(importance_dict.items(), key=lambda item: item[1], reverse=True)[:10]}
            
            # Sample actuals vs predictions (limit 50 to avoid massive db rows)
            sample_predictions = {
                "actual": [float(val) if task_type == "regression" else int(val) for val in y_test[:50].values],
                "predicted": [float(val) if task_type == "regression" else int(val) for val in y_pred[:50]]
            }

            self._log(pipeline_id, "running", "Saving model results to database.")

            # 6. Save to Supabase `predictions` table
            payload = {
                "pipeline_id": pipeline_id,
                "user_id": user_id,
                "dataset_id": dataset_id,
                "model_name": model_name,
                "target_column": target_col,
                "r2_score": metrics.get("r2_score"),
                "mae": metrics.get("mae"),
                "rmse": metrics.get("rmse"),
                "feature_importance": sorted_importance,
                "predictions_data": sample_predictions,
                "all_models_comparison": {"XGBoost": metrics} # Extensible later
            }
            
            res = supabase.table("predictions").insert(payload).execute()
            prediction_id = res.data[0]["id"] if res.data else None

            # 7. Update State
            state["model_results"] = {
                "prediction_id": prediction_id,
                "model_name": model_name,
                "target_column": target_col,
                "metrics": metrics,
                "feature_importance": sorted_importance
            }
            state["current_stage"] = self.agent_name

            self._log(pipeline_id, "completed", f"ML Prediction completed. Best model: {model_name}.")
            self._update_pipeline_stage(pipeline_id, self.agent_name, 100, "running")

            return state

        except Exception as e:
            error_msg = f"Prediction Agent Failed: {str(e)}"
            self._log(pipeline_id, "error", error_msg)
            self._update_pipeline_stage(pipeline_id, self.agent_name, 0, "error", error_msg)
            state["errors"] = state.get("errors", []) + [error_msg]
            raise e
