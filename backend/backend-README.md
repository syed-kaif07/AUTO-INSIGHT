# AutoInsight — Backend Service

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Celery](https://img.shields.io/badge/Celery-5.3+-37814A?style=flat-square&logo=celery&logoColor=white)](https://docs.celeryq.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-336791?style=flat-square&logo=postgresql&logoColor=white)](https://postgresql.org)
[![Redis](https://img.shields.io/badge/Redis-7+-DC382D?style=flat-square&logo=redis&logoColor=white)](https://redis.io)

The AutoInsight backend is a Python-based asynchronous service that powers the multi-agent analytics pipeline. It exposes a versioned REST API, orchestrates agent execution, and manages the full lifecycle of data analysis jobs.

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

The backend is designed as a stateless API layer over a distributed task execution system. When a user submits a dataset for analysis, the API creates a job record, pushes the pipeline to a Celery task queue, and returns a job ID. Agents execute asynchronously in isolated worker processes, writing results to shared storage as each stage completes.

The system is built for horizontal scalability — additional Celery workers can be added without modifying any application code.

---

## Responsibilities

The backend service is responsible for:

- **API Gateway** — Accepting and validating all client requests via a versioned FastAPI router
- **Job Orchestration** — Scheduling, monitoring, and managing the state of analysis pipeline jobs
- **Agent Execution** — Running the ordered sequence of AI agents with fault isolation between stages
- **LLM Integration** — Interfacing with OpenAI / Anthropic APIs for insight and report generation
- **Data Storage** — Persisting cleaned datasets, model artifacts, and analysis results
- **Report Generation** — Compiling structured PDF and JSON reports from pipeline outputs
- **Authentication** — Issuing and validating JWT tokens for all API requests

---

## Agent System

The agent system is the core of AutoInsight. Each agent is an independent Python class that implements a standard `run(state: PipelineState) -> PipelineState` interface, allowing agents to be composed, swapped, or extended without coupling.

### Agent Contracts

```python
from abc import ABC, abstractmethod
from models.state import PipelineState

class BaseAgent(ABC):
    """All agents implement this interface."""

    @abstractmethod
    def run(self, state: PipelineState) -> PipelineState:
        """Execute the agent's logic and return the updated state."""
        ...

    @abstractmethod
    def validate_input(self, state: PipelineState) -> bool:
        """Verify required state fields exist before execution."""
        ...
```

### Agent Descriptions

| Agent | Module | Responsibility |
|---|---|---|
| **Ingestion Agent** | `agents/ingestion_agent.py` | Parses uploaded files (CSV, Excel, JSON, Parquet), infers column types, extracts dataset metadata, and validates schema integrity |
| **Cleaning Agent** | `agents/cleaning_agent.py` | Identifies and handles missing values, removes duplicate records, detects and treats outliers, and normalizes numeric distributions |
| **EDA Agent** | `agents/eda_agent.py` | Computes descriptive statistics, generates correlation matrices, performs distribution analysis, and flags anomalous patterns |
| **ML Selection Agent** | `agents/ml_selection_agent.py` | Benchmarks multiple scikit-learn algorithms against the dataset using cross-validation, selects the best-performing model based on task type (classification/regression) |
| **Prediction Agent** | `agents/prediction_agent.py` | Trains the selected model on the full cleaned dataset, generates predictions and confidence intervals, and computes SHAP feature importances |
| **Insight Agent** | `agents/insight_agent.py` | Uses an LLM to generate natural language interpretations of EDA findings, model performance, and key patterns in the data |
| **Report Agent** | `agents/report_agent.py` | Assembles all pipeline outputs into a structured, stakeholder-ready PDF and JSON report |

### Orchestrator

The `Orchestrator` class in `pipelines/orchestrator.py` manages agent sequencing, error recovery, and pipeline state throughout execution.

```python
from pipelines.orchestrator import Orchestrator

pipeline = Orchestrator(agents=[
    IngestionAgent(),
    CleaningAgent(),
    EDAAgent(),
    MLSelectionAgent(),
    PredictionAgent(),
    InsightAgent(),
    ReportAgent(),
])

result = pipeline.run(job_id="job_abc123", dataset_path="s3://bucket/data.csv")
```

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Runtime | Python | 3.11+ |
| API Framework | FastAPI | 0.110+ |
| Data Processing | Pandas | 2.0+ |
| Numerical Computing | NumPy | 1.26+ |
| Machine Learning | Scikit-learn | 1.4+ |
| Explainability | SHAP | 0.44+ |
| Agent Orchestration | LangChain | 0.1+ |
| LLM Client | OpenAI / Anthropic SDK | Latest |
| Task Queue | Celery | 5.3+ |
| Message Broker | Redis | 7+ |
| ORM | SQLAlchemy | 2.0+ |
| Database | PostgreSQL | 15+ |
| Schema Validation | Pydantic v2 | 2.5+ |
| Object Storage | boto3 (S3/MinIO) | 1.34+ |
| Testing | pytest | 7.4+ |
| Code Quality | ruff, mypy | Latest |

---

## Project Structure

```
backend/
│
├── agents/
│   ├── __init__.py
│   ├── base_agent.py            # Abstract base class for all agents
│   ├── ingestion_agent.py       # File parsing and schema inference
│   ├── cleaning_agent.py        # Data quality and preprocessing
│   ├── eda_agent.py             # Statistical analysis and profiling
│   ├── ml_selection_agent.py    # Algorithm benchmarking and selection
│   ├── prediction_agent.py      # Model training and inference
│   ├── insight_agent.py         # LLM-powered narrative generation
│   └── report_agent.py          # Report compilation and export
│
├── pipelines/
│   ├── __init__.py
│   ├── orchestrator.py          # Agent pipeline coordinator
│   ├── pipeline_config.py       # Stage definitions and ordering
│   ├── state_manager.py         # Shared pipeline state management
│   └── tasks.py                 # Celery task definitions
│
├── services/
│   ├── __init__.py
│   ├── llm_service.py           # Abstracted LLM client (OpenAI/Anthropic)
│   ├── storage_service.py       # S3/MinIO upload/download operations
│   ├── job_service.py           # Job lifecycle and status management
│   └── notification_service.py  # Webhook and event dispatching
│
├── api/
│   ├── __init__.py
│   ├── main.py                  # FastAPI application factory
│   ├── dependencies.py          # Shared dependency injection
│   ├── v1/
│   │   ├── __init__.py
│   │   ├── datasets.py          # Dataset CRUD endpoints
│   │   ├── jobs.py              # Pipeline job endpoints
│   │   ├── reports.py           # Report retrieval endpoints
│   │   └── health.py            # Health and readiness checks
│   └── middleware/
│       ├── auth.py              # JWT authentication
│       ├── rate_limit.py        # Request rate limiting
│       └── logging.py           # Structured request logging
│
├── models/
│   ├── __init__.py
│   ├── state.py                 # PipelineState dataclass
│   ├── job.py                   # Job ORM model
│   ├── dataset.py               # Dataset ORM model
│   └── report.py                # Report ORM model
│
├── utils/
│   ├── __init__.py
│   ├── logger.py                # Structured logging with structlog
│   ├── validators.py            # Input validation helpers
│   ├── converters.py            # Data format conversion utilities
│   └── metrics.py               # Prometheus metrics instrumentation
│
├── tests/
│   ├── unit/
│   │   ├── test_cleaning_agent.py
│   │   ├── test_eda_agent.py
│   │   └── test_ml_selection_agent.py
│   ├── integration/
│   │   ├── test_pipeline.py
│   │   └── test_api_endpoints.py
│   └── conftest.py
│
├── alembic/                     # Database migration scripts
├── Dockerfile
├── requirements.txt
├── requirements-dev.txt
├── pyproject.toml
└── README.md
```

---

## Setup Instructions

### Prerequisites

- Python 3.11+
- PostgreSQL 15+
- Redis 7+
- An OpenAI or Anthropic API key

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

# For development (includes linting, testing tools)
pip install -r requirements-dev.txt
```

### 3. Configure Environment

```bash
cp ../.env.example .env
```

Required variables:

```env
# Application
APP_ENV=development
SECRET_KEY=your-secret-key-min-32-chars

# Database
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/autoinsight

# Redis
REDIS_URL=redis://localhost:6379/0

# LLM
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Storage
S3_BUCKET=autoinsight-datasets
S3_ENDPOINT_URL=http://localhost:9000   # For local MinIO
AWS_ACCESS_KEY_ID=minioadmin
AWS_SECRET_ACCESS_KEY=minioadmin
```

### 4. Initialize Database

```bash
# Run migrations
alembic upgrade head

# (Optional) Seed with sample data
python scripts/seed_db.py
```

---

## Running the Backend

### API Server

```bash
# Development (with hot reload)
uvicorn api.main:app --reload --host 0.0.0.0 --port 8000

# Production
uvicorn api.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Celery Worker (required for pipeline execution)

```bash
# Start a worker with 4 concurrent processes
celery -A pipelines.tasks worker --concurrency=4 --loglevel=info

# Start Flower (task monitoring UI)
celery -A pipelines.tasks flower --port=5555
```

### Via Docker Compose

```bash
# From project root
docker compose -f docker/docker-compose.yml up backend worker --build
```

The API will be available at `http://localhost:8000`.  
Interactive API documentation: `http://localhost:8000/docs`

---

## API Reference

### Core Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/datasets` | Upload a dataset file |
| `GET` | `/api/v1/datasets` | List all uploaded datasets |
| `DELETE` | `/api/v1/datasets/{id}` | Delete a dataset |
| `POST` | `/api/v1/jobs` | Start an analysis pipeline job |
| `GET` | `/api/v1/jobs` | List all jobs |
| `GET` | `/api/v1/jobs/{id}` | Get job status and progress |
| `DELETE` | `/api/v1/jobs/{id}` | Cancel a running job |
| `GET` | `/api/v1/reports/{job_id}` | Retrieve the generated report |
| `GET` | `/api/v1/reports/{job_id}/pdf` | Download report as PDF |
| `GET` | `/api/v1/health` | Health and readiness check |

Full OpenAPI spec is auto-generated and available at `/docs` when the server is running.

---

## Testing

```bash
# Run all tests
pytest

# Run with coverage report
pytest --cov=. --cov-report=html

# Run only unit tests
pytest tests/unit/

# Run specific test file
pytest tests/unit/test_cleaning_agent.py -v
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `APP_ENV` | Yes | `development`, `staging`, or `production` |
| `SECRET_KEY` | Yes | JWT signing key (min 32 characters) |
| `DATABASE_URL` | Yes | PostgreSQL async connection string |
| `REDIS_URL` | Yes | Redis connection string |
| `OPENAI_API_KEY` | Yes* | OpenAI API key (*or Anthropic) |
| `ANTHROPIC_API_KEY` | Yes* | Anthropic API key (*or OpenAI) |
| `S3_BUCKET` | Yes | Object storage bucket name |
| `AWS_ACCESS_KEY_ID` | Yes | S3/MinIO access key |
| `AWS_SECRET_ACCESS_KEY` | Yes | S3/MinIO secret key |
| `S3_ENDPOINT_URL` | No | Override for local MinIO |
| `MAX_UPLOAD_SIZE_MB` | No | Maximum dataset upload size (default: 500) |
| `CELERY_CONCURRENCY` | No | Worker process count (default: 4) |
| `LOG_LEVEL` | No | Logging level (default: `INFO`) |
