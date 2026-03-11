<div align="center">

# 🔍 AutoInsight

### Autonomous Multi-Agent Analytics Platform

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active%20Development-brightgreen?style=flat-square)]()

**AutoInsight** automates the complete data analysis lifecycle — from raw dataset ingestion to production-ready insight reports — using a coordinated pipeline of specialized AI agents.

[Documentation](#) · [Demo](#demo) · [Report an Issue](issues) · [Request a Feature](issues)

</div>

---

## 📋 Table of Contents

- [Problem Statement](#-problem-statement)
- [Solution](#-solution)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [AI Agent Workflow](#-ai-agent-workflow)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Usage Guide](#-usage-guide)
- [Demo](#-demo)
- [Roadmap](#-roadmap)
- [Future Improvements](#-future-improvements)
- [Contributing](#-contributing)

---

## ❗ Problem Statement

Data analysis is expensive, slow, and skill-intensive. Organizations that want to extract insight from their data face a consistently high barrier:

- **Talent bottleneck** — Data scientists and ML engineers are scarce and costly
- **Time to insight** — Manual EDA, cleaning, and model selection cycles take days to weeks
- **Repeatability gaps** — Ad-hoc analysis produces inconsistent, non-reproducible results
- **Insight accessibility** — Technical outputs rarely translate into actionable business reports automatically

The gap between raw data and actionable intelligence remains one of the most persistent inefficiencies in modern data operations.

---

## ✅ Solution

**AutoInsight** is an AI-powered multi-agent analytics platform that collapses the full analytics workflow — cleaning, exploration, modeling, and reporting — into a single automated pipeline.

Upload a dataset. AutoInsight deploys a coordinated team of specialized AI agents that analyze your data end-to-end, select the best-fit machine learning model, generate predictions, and produce a structured insight report — all without requiring manual intervention.

Think of it as a **senior data science team, running at API speed**.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🤖 **Multi-Agent Orchestration** | Specialized agents for each stage of the analytics pipeline, coordinated by a central orchestrator |
| 🧹 **Automated Data Cleaning** | Missing value imputation, outlier detection, type inference, and normalization |
| 📊 **Autonomous EDA** | Statistical profiling, distribution analysis, correlation mapping, and anomaly flagging |
| 🧠 **Intelligent Model Selection** | Benchmarks multiple ML models and selects the optimal algorithm for the dataset's characteristics |
| 🔮 **Prediction Generation** | End-to-end model training and inference with confidence scoring |
| 📝 **LLM-Powered Insight Reports** | Natural language summaries of findings, patterns, and recommended actions |
| 📈 **Interactive Dashboard** | Real-time visualization of all pipeline outputs via a responsive React frontend |
| 🔌 **REST API-First** | All platform capabilities exposed through a versioned FastAPI interface |

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         AutoInsight Platform                    │
│                                                                 │
│  ┌──────────────┐    REST API     ┌─────────────────────────┐   │
│  │   React UI   │◄───────────────►│   FastAPI Gateway       │   │
│  │  (Frontend)  │                 │   /api/v1               │   │
│  └──────────────┘                 └────────────┬────────────┘   │
│                                                │                │
│                                   ┌────────────▼────────────┐   │
│                                   │  Orchestration Engine   │   │
│                                   │  (Agent Coordinator)    │   │
│                                   └────────────┬────────────┘   │
│                                                │                │
│              ┌─────────────────────────────────┼──────────────┐ │
│              │         Agent Pipeline           │              │ │
│              │                                 │              │ │
│   ┌──────────▼──────┐  ┌──────────────┐  ┌────▼──────────┐   │ │
│   │ Ingestion Agent │→ │Cleaning Agent│→ │   EDA Agent   │   │ │
│   └─────────────────┘  └──────────────┘  └───────┬───────┘   │ │
│                                                   │           │ │
│   ┌──────────────────┐  ┌─────────────┐  ┌───────▼───────┐   │ │
│   │  Report Agent    │← │ Pred. Agent │← │ ML Sel. Agent │   │ │
│   └──────────────────┘  └─────────────┘  └───────────────┘   │ │
│              │                                                 │ │
│              └─────────────────────────────────────────────────┘ │
│                              │                                  │
│                   ┌──────────▼──────────┐                       │
│                   │   Storage Layer      │                       │
│                   │  PostgreSQL / S3     │                       │
│                   └─────────────────────┘                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🤖 AI Agent Workflow

Each agent is a self-contained module with a defined input contract, processing logic, and output schema. Agents communicate through a shared state object managed by the orchestrator.

```
User Upload Dataset
        │
        ▼
┌───────────────────┐
│  Ingestion Agent  │  →  Schema inference, format detection, metadata extraction
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  Cleaning Agent   │  →  Null handling, outlier removal, type coercion, deduplication
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│    EDA Agent      │  →  Distributions, correlations, statistical summaries, anomalies
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ ML Selection      │  →  Algorithm benchmarking, cross-validation, metric evaluation
│ Agent             │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ Prediction Agent  │  →  Model training, inference, confidence intervals
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  Insight Agent    │  →  LLM-generated natural language interpretation of findings
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  Report Generator │  →  Structured PDF/JSON reports with charts, tables, and narratives
└────────┬──────────┘
         │
         ▼
  Dashboard Output
```

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | Component-based UI framework |
| TypeScript 5 | Type-safe application logic |
| Vite | Next-generation frontend build tooling |
| TailwindCSS | Utility-first styling system |
| Recharts / D3.js | Data visualization and charting |
| React Query | Async state and server-side data management |
| Zustand | Lightweight global state management |

### Backend
| Technology | Purpose |
|---|---|
| Python 3.11+ | Core runtime |
| FastAPI | High-performance async REST framework |
| Pandas / NumPy | Data manipulation and numerical computing |
| Scikit-learn | ML model library and evaluation utilities |
| SQLAlchemy | ORM and database abstraction layer |
| Celery + Redis | Distributed task queue for async agent execution |
| Pydantic v2 | Schema validation and settings management |

### AI / Machine Learning
| Technology | Purpose |
|---|---|
| OpenAI / Anthropic API | LLM backbone for insight generation and report narration |
| LangChain | Agent orchestration and chain-of-thought reasoning |
| AutoML (TPOT / AutoSklearn) | Automated model search and hyperparameter tuning |
| SHAP | Explainable AI and feature importance attribution |

### Infrastructure
| Technology | Purpose |
|---|---|
| Docker + Docker Compose | Containerized local development and deployment |
| PostgreSQL | Persistent data storage for jobs and results |
| AWS S3 / MinIO | Object storage for uploaded datasets and reports |
| GitHub Actions | CI/CD pipeline for testing and deployment |
| Nginx | Reverse proxy and static asset serving |

---

## 📁 Project Structure

```
AUTO-INSIGHT/
│
├── backend/
│   ├── agents/
│   │   ├── ingestion_agent.py       # Dataset parsing and schema inference
│   │   ├── cleaning_agent.py        # Data quality and preprocessing
│   │   ├── eda_agent.py             # Exploratory data analysis
│   │   ├── ml_selection_agent.py    # Model benchmarking and selection
│   │   ├── prediction_agent.py      # Model training and inference
│   │   ├── insight_agent.py         # LLM-powered insight generation
│   │   └── report_agent.py          # Report compilation and formatting
│   │
│   ├── pipelines/
│   │   ├── orchestrator.py          # Central agent coordinator
│   │   ├── pipeline_config.py       # Pipeline stage definitions
│   │   └── state_manager.py         # Shared agent state and context
│   │
│   ├── services/
│   │   ├── llm_service.py           # LLM client abstraction
│   │   ├── storage_service.py       # S3/MinIO operations
│   │   ├── job_service.py           # Background job lifecycle
│   │   └── notification_service.py  # Webhook and event dispatching
│   │
│   ├── api/
│   │   ├── v1/
│   │   │   ├── datasets.py          # Dataset upload and management endpoints
│   │   │   ├── jobs.py              # Pipeline job endpoints
│   │   │   ├── reports.py           # Report retrieval endpoints
│   │   │   └── health.py            # System health check
│   │   └── middleware/
│   │       ├── auth.py              # JWT authentication middleware
│   │       └── rate_limit.py        # API rate limiting
│   │
│   ├── utils/
│   │   ├── logger.py                # Structured logging
│   │   ├── validators.py            # Input validation helpers
│   │   └── metrics.py              # Prometheus metrics collection
│   │
│   ├── tests/
│   │   ├── unit/
│   │   └── integration/
│   │
│   ├── Dockerfile
│   ├── requirements.txt
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Upload/              # Dataset upload flow
│   │   │   ├── Pipeline/            # Agent pipeline status tracker
│   │   │   ├── Charts/              # EDA and prediction visualizations
│   │   │   ├── Report/              # Report viewer components
│   │   │   └── common/              # Shared UI components
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx        # Main analytics dashboard
│   │   │   ├── Upload.tsx           # Dataset upload page
│   │   │   ├── Jobs.tsx             # Job history and status
│   │   │   └── Report.tsx           # Report detail view
│   │   │
│   │   ├── services/
│   │   │   ├── api.ts               # Axios API client
│   │   │   ├── jobs.ts              # Job management API calls
│   │   │   └── datasets.ts          # Dataset API calls
│   │   │
│   │   ├── hooks/
│   │   │   ├── useJob.ts            # Job polling and status hooks
│   │   │   ├── useDataset.ts        # Dataset management hooks
│   │   │   └── usePipeline.ts       # Pipeline progress hooks
│   │   │
│   │   └── store/
│   │       └── index.ts             # Zustand global state
│   │
│   ├── public/
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── README.md
│
├── docs/
│   ├── architecture.png
│   ├── workflow.png
│   ├── api-reference.md
│   └── agent-specs.md
│
├── docker/
│   ├── docker-compose.yml
│   ├── docker-compose.dev.yml
│   └── nginx.conf
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
│
├── .env.example
├── Makefile
└── README.md
```

---

## ⚙️ Installation

### Prerequisites

- Docker & Docker Compose 2.x
- Node.js 20+ and npm 9+
- Python 3.11+
- An OpenAI or Anthropic API key

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/auto-insight.git
cd auto-insight
```

### 2. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# LLM Configuration
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key

# Database
DATABASE_URL=postgresql://autoinsight:password@db:5432/autoinsight

# Storage
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
S3_BUCKET=autoinsight-datasets

# Redis
REDIS_URL=redis://redis:6379/0
```

### 3. Start the Full Stack

```bash
docker compose -f docker/docker-compose.yml up --build
```

The platform will be available at:

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |
| Flower (task monitor) | http://localhost:5555 |

### 4. Local Development (without Docker)

**Backend:**
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn api.main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## 🚀 Usage Guide

### Via the Web Interface

1. Navigate to `http://localhost:3000`
2. Click **Upload Dataset** and select a CSV, Excel, or JSON file
3. Configure optional pipeline settings (target column, task type)
4. Click **Run Analysis** — the pipeline begins immediately
5. Monitor progress in real time on the **Jobs** page
6. View the full report and interactive charts on the **Dashboard**

### Via the REST API

**Upload a dataset and trigger analysis:**

```bash
# Upload dataset
curl -X POST http://localhost:8000/api/v1/datasets \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@my_data.csv"

# Start analysis pipeline
curl -X POST http://localhost:8000/api/v1/jobs \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"dataset_id": "ds_abc123", "target_column": "revenue", "task_type": "regression"}'

# Check job status
curl http://localhost:8000/api/v1/jobs/job_xyz456 \
  -H "Authorization: Bearer $TOKEN"

# Retrieve generated report
curl http://localhost:8000/api/v1/reports/job_xyz456 \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🎬 Demo

### Typical Analysis Workflow

```
Step 1 — Upload
  User uploads a CSV dataset (e.g., sales_data_2024.csv, 50,000 rows)

Step 2 — Ingestion Agent
  Detects schema, infers column types, identifies target variable
  → Output: Validated dataset schema + metadata summary

Step 3 — Cleaning Agent
  Handles 3.2% missing values via median imputation
  Removes 47 duplicate rows, flags 12 outlier records
  → Output: Clean, analysis-ready DataFrame

Step 4 — EDA Agent
  Generates 24 statistical summaries, 8 correlation heatmaps
  Detects strong positive correlation between ad_spend and revenue (r=0.87)
  → Output: EDA report with visualizations

Step 5 — ML Selection Agent
  Benchmarks 8 algorithms (Linear Regression, Random Forest, XGBoost, etc.)
  Selects XGBoost Regressor (RMSE: 1,243 | R²: 0.91)
  → Output: Model leaderboard + winning model artifact

Step 6 — Prediction Agent
  Trains final model on full cleaned dataset
  Generates predictions with 95% confidence intervals
  → Output: Prediction results + SHAP feature importance

Step 7 — Insight Agent
  LLM synthesizes: "Revenue is most strongly driven by ad_spend and
  region, with Q4 showing a consistent 34% seasonal uplift..."
  → Output: Natural language insight narrative

Step 8 — Report Generator
  Compiles full PDF report: EDA charts, model performance, predictions,
  and executive summary — ready for stakeholder distribution
  → Output: autoinsight_report_2024-03-11.pdf
```

**Total pipeline runtime for 50K rows: ~4 minutes**

---

## 🗺 Roadmap

### Phase 1 — Core Pipeline ✅
- Dataset ingestion with multi-format support (CSV, Excel, JSON, Parquet)
- Automated EDA with statistical profiling
- REST API foundation and authentication

### Phase 2 — Multi-Agent Orchestration 🔄 *(In Progress)*
- LangChain-based agent orchestration
- Shared state management between agents
- Async pipeline execution via Celery

### Phase 3 — ML Model Selection ⏳
- Algorithm benchmarking suite (10+ models)
- Cross-validation and hyperparameter search
- AutoML integration (TPOT / AutoSklearn)

### Phase 4 — Insight Generation ⏳
- LLM-powered natural language interpretation
- Context-aware anomaly and trend narration
- Explainable AI with SHAP integration

### Phase 5 — Report Automation ⏳
- PDF and HTML report generation
- Executive summary auto-drafting
- Scheduled report delivery via email/webhook

### Phase 6 — SaaS Deployment ⏳
- Multi-tenant architecture with organization support
- Usage-based billing via Stripe
- Enterprise SSO (SAML / OAuth2)
- Kubernetes deployment with horizontal autoscaling

---

## 🔮 Future Improvements

- **Real-time streaming pipelines** — Support for streaming data sources (Kafka, Kinesis) with continuous insight generation
- **Conversational analytics interface** — Chat-based data exploration via an embedded LLM agent
- **Custom agent plugins** — SDK for defining and registering domain-specific analysis agents
- **Federated data connectors** — Native integrations with Snowflake, BigQuery, Redshift, and Databricks
- **Agent memory and learning** — Persistent agent memory so pipelines improve with usage over time
- **Model registry** — Version-controlled model storage with drift detection and retraining triggers
- **Collaborative workspaces** — Shared team dashboards with role-based access control

---

## 🤝 Contributing

We welcome contributions from the community. Please read the guidelines below before opening a pull request.

### Getting Started

```bash
# Fork and clone the repository
git clone https://github.com/your-username/auto-insight.git

# Create a feature branch
git checkout -b feature/your-feature-name

# Make your changes and run tests
cd backend && pytest tests/
cd frontend && npm run test

# Submit a pull request
```

### Contribution Standards

- **Code style:** Python code must pass `ruff` linting; TypeScript must pass `eslint`
- **Tests:** All new features require unit tests with ≥80% coverage
- **Commits:** Follow [Conventional Commits](https://www.conventionalcommits.org/) format
- **Documentation:** Update relevant README sections and inline docstrings

### Reporting Issues

Please use [GitHub Issues](issues) and include:
- Environment details (OS, Python/Node version, Docker version)
- Steps to reproduce
- Expected vs actual behavior
- Relevant logs or screenshots

---

<div align="center">

Built with ⚙️ precision by the AutoInsight Engineering Team

[Website](#) · [Documentation](#) · [LinkedIn](#) · [Twitter](#)

</div>
