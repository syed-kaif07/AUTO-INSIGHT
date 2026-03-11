# AutoInsight — Backend Service

[![Python](https://img.shields.io/badge/Python-3.12+-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-Latest-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![LangGraph](https://img.shields.io/badge/LangGraph-Agent%20Orchestration-FF6B35?style=flat-square)](https://langchain-ai.github.io/langgraph)
[![Supabase](https://img.shields.io/badge/Supabase-DB%20%26%20Storage-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)

The AutoInsight backend is a Python 3.12 FastAPI service that powers the multi-agent analytics pipeline. It exposes a versioned REST API, orchestrates LangGraph agent execution, and manages all data processing, machine learning, and report generation workflows.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Responsibilities](#responsibilities)
- [Agent System](#agent-system)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Running the Backend](#running-the-backend)
- [API Reference](#api-reference)
- [Testing](#testing)
- [Environment Variables](#environment-variables)

---

## Overview

The backend is a stateless API service built on FastAPI with asynchronous request handling. When a user submits a dataset for analysis, the API creates a job record in Supabase, retrieves the file from Supabase Storage, and executes the LangGraph pipeline. Each agent runs sequentially as a node in the graph, writing results back to Supabase as each stage completes.

File uploads never pass through the backend server directly — files are stored in **Supabase Storage** and referenced by URL, keeping the API lightweight and the storage layer independently scalable.

---

## Responsibilities

- **API Gateway** — Accepting and validating all client requests via a versioned FastAPI router with auto-generated OpenAPI docs
- **Agent Orchestration** — Running the LangGraph pipeline graph for each analysis job
- **Data Processing** — Executing cleaning, EDA, and prediction logic using Pandas, Scikit-learn, and related libraries
- **Storage Integration** — Reading datasets from and writing reports to Supabase Storage
- **Database Integration** — Persisting job state, agent logs, analysis results, and report metadata in Supabase PostgreSQL
- **Report Generation** — Compiling Plotly charts and model metrics into downloadable PDF reports using Matplotlib

---

## Agent System

The agent system is built on **LangGraph**, which models the pipeline as a directed graph where each node is a specialized agent. Agents share a typed state object (`PipelineState`) that is passed and updated at each stage.

### Agent Pipeline Graph

```python
# pipelines/graph.py
from langgraph.graph import StateGraph
from agents import IngestionAgent, CleaningAgent, EDAAgent, PredictionAgent, ReportingAgent
from pipelines.state import PipelineState

graph = StateGraph(PipelineState)

graph.add_node("ingestion",  IngestionAgent().run)
graph.add_node("cleaning",   CleaningAgent().run)
graph.add_node("eda",        EDAAgent().run)
graph.add_node("prediction", PredictionAgent().run)
graph.add_node("reporting",  ReportingAgent().run)

graph.set_entry_point("ingestion")
graph.add_edge("ingestion",  "cleaning")
graph.add_edge("cleaning",   "eda")
graph.add_edge("eda",        "prediction")
graph.add_edge("prediction", "reporting")

pipeline = graph.compile()
```

### Agent Descriptions

| Agent | File | Responsibility |
|---|---|---|
| **Ingestion Agent** | `agents/ingestion_agent.py` | Retrieves file from Supabase Storage, parses CSV/Excel/JSON, infers column types, extracts dataset metadata |
| **Cleaning Agent** | `agents/cleaning_agent.py` | Handles missing values, removes duplicates, coerces data types, detects and treats outliers |
| **EDA Agent** | `agents/eda_agent.py` | Computes descriptive statistics, correlation matrices, distribution analysis; generates Plotly chart configs |
| **Prediction Agent** | `agents/prediction_agent.py` | Trains and benchmarks Scikit-learn, XGBoost, and LightGBM models; selects best performer; generates predictions |
| **Reporting Agent** | `agents/reporting_agent.py` | Assembles all pipeline outputs into a structured PDF report using Matplotlib; uploads report to Supabase Storage |

### Shared Pipeline State

```python
# pipelines/state.py
from dataclasses import dataclass, field
from typing import Any

@dataclass
class PipelineState:
    job_id: str
    dataset_url: str                   # Supabase Storage URL
    raw_df: Any = None                 # Original DataFrame
    clean_df: Any = None               # Post-cleaning DataFrame
    eda_results: dict = field(default_factory=dict)
    model_results: dict = field(default_factory=dict)
    report_url: str = ""               # Supabase Storage URL of final report
    current_stage: str = "ingestion"
    errors: list = field(default_factory=list)
```

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Runtime | Python | 3.12+ |
| API Framework | FastAPI | Latest |
| API Docs | Swagger / OpenAPI | Auto-generated |
| Agent Orchestration | LangGraph | Latest |
| Data Processing | Pandas | 2.x |
| Numerical Computing | NumPy | Latest |
| Columnar Processing | PyArrow | Latest |
| Machine Learning | Scikit-learn | Latest |
| Gradient Boosting | XGBoost | Latest |
| Gradient Boosting | LightGBM | Latest |
| Interactive Charts | Plotly | Latest |
| Static Charts / PDF | Matplotlib | Latest |
| Schema Validation | Pydantic v2 | 2.x |
| Database + Storage | Supabase | Latest |
| Testing | pytest | 7.4+ |
| Code Quality | ruff, mypy | Latest |

---

## Project Structure

```
backend/
│
├── agents/
│   ├── __init__.py
│   ├── base_agent.py              # Abstract base class for all agents
│   ├── ingestion_agent.py         # File retrieval and schema inference
│   ├── cleaning_agent.py          # Data quality and preprocessing
│   ├── eda_agent.py               # Statistical analysis and Plotly chart generation
│   ├── prediction_agent.py        # Model training, benchmarking, and inference
│   └── reporting_agent.py         # PDF report compilation and Supabase upload
│
├── pipelines/
│   ├── __init__.py
│   ├── graph.py                   # LangGraph pipeline definition and compilation
│   ├── state.py                   # PipelineState dataclass (shared agent context)
│   └── orchestrator.py            # Pipeline execution entry point
│
├── api/
│   ├── __init__.py
│   ├── main.py                    # FastAPI app factory and router registration
│   ├── dependencies.py            # Shared dependency injection
│   └── v1/
│       ├── __init__.py
│       ├── datasets.py            # Dataset upload and management endpoints
│       ├── jobs.py                # Pipeline job creation and status endpoints
│       ├── reports.py             # Report retrieval and download endpoints
│       └── health.py              # Health and readiness check
│
├── services/
│   ├── __init__.py
│   ├── supabase_service.py        # Supabase DB queries and Storage operations
│   └── job_service.py             # Job lifecycle and status management
│
├── models/
│   ├── __init__.py
│   ├── job.py                     # Job Pydantic model
│   ├── dataset.py                 # Dataset Pydantic model
│   └── report.py                  # Report Pydantic model
│
├── utils/
│   ├── __init__.py
│   ├── logger.py                  # Structured logging
│   └── validators.py              # Input validation helpers
│
├── tests/
│   ├── unit/
│   │   ├── test_cleaning_agent.py
│   │   ├── test_eda_agent.py
│   │   └── test_prediction_agent.py
│   ├── integration/
│   │   ├── test_pipeline.py
│   │   └── test_api_endpoints.py
│   └── conftest.py
│
├── Dockerfile
├── requirements.txt
├── requirements-dev.txt
├── pyproject.toml
└── README.md
```

---

## Setup Instructions

### Prerequisites

- Python 3.12+
- A [Supabase](https://supabase.com) project with a Storage bucket named `datasets`

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv
source venv/bin/activate          # Linux/macOS
# .\venv\Scripts\activate         # Windows
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt

# For development (linting and testing tools)
pip install -r requirements-dev.txt
```

### 3. Configure Environment

```bash
cp ../.env.example .env
```

Required variables:

```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App
APP_ENV=development
SECRET_KEY=your-secret-key-min-32-chars

# Storage
SUPABASE_STORAGE_BUCKET=datasets
```

---

## Running the Backend

### Development Server

```bash
uvicorn api.main:app --reload --host 0.0.0.0 --port 8000
```

### Production

```bash
uvicorn api.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Via Docker

```bash
# From project root
docker compose -f docker/docker-compose.yml up backend --build
```

- API: `http://localhost:8000`
- Interactive Docs: `http://localhost:8000/docs`
- OpenAPI Schema: `http://localhost:8000/openapi.json`

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/datasets` | Upload a dataset file to Supabase Storage |
| `GET` | `/api/v1/datasets` | List all uploaded datasets for the current user |
| `DELETE` | `/api/v1/datasets/{id}` | Delete a dataset and its Storage file |
| `POST` | `/api/v1/jobs` | Start a new LangGraph analysis pipeline job |
| `GET` | `/api/v1/jobs` | List all jobs for the current user |
| `GET` | `/api/v1/jobs/{id}` | Get job status, current stage, and progress |
| `DELETE` | `/api/v1/jobs/{id}` | Cancel a running job |
| `GET` | `/api/v1/reports/{job_id}` | Retrieve the generated report metadata |
| `GET` | `/api/v1/reports/{job_id}/download` | Download the report PDF from Supabase Storage |
| `GET` | `/api/v1/health` | Health and readiness check |

Full interactive documentation is available at `/docs` when the server is running.

---

## Testing

```bash
# Run all tests
pytest

# With coverage report
pytest --cov=. --cov-report=html

# Unit tests only
pytest tests/unit/ -v

# Integration tests only
pytest tests/integration/ -v
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `SUPABASE_URL` | Yes | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key for server-side access |
| `SUPABASE_STORAGE_BUCKET` | Yes | Storage bucket name for dataset files |
| `APP_ENV` | Yes | `development`, `staging`, or `production` |
| `SECRET_KEY` | Yes | JWT/session signing key (min 32 chars) |
| `MAX_UPLOAD_SIZE_MB` | No | Maximum file size accepted (default: `500`) |
| `LOG_LEVEL` | No | Logging level (default: `INFO`) |
