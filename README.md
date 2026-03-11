<div align="center">

# 🔍 AutoInsight

### Autonomous Multi-Agent Analytics Platform

[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python%203.12+-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Storage-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
[![LangGraph](https://img.shields.io/badge/LangGraph-Agent%20Orchestration-FF6B35?style=flat-square)](https://langchain-ai.github.io/langgraph)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active%20Development-brightgreen?style=flat-square)]()

**AutoInsight** automates the complete data science workflow — from raw dataset ingestion to machine learning predictions and structured reports — using a coordinated pipeline of specialized AI agents.

[Documentation](#) · [Demo](#-demo) · [Report an Issue](issues) · [Request a Feature](issues)

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

Upload a dataset. AutoInsight deploys a coordinated team of specialized AI agents built on **LangGraph** that process your data end-to-end, train the best-fit machine learning model, generate predictions, and produce a structured downloadable report — all without manual intervention.

Think of it as a **senior data science team, running at API speed**.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 📂 **Dataset Upload** | Upload CSV, Excel, or JSON files up to 500MB directly via Supabase Storage |
| 🤖 **Multi-Agent Pipeline** | LangGraph-orchestrated agents for each workflow stage — cleaning, EDA, prediction, and reporting |
| 🧹 **Automated Data Cleaning** | Missing value handling, duplicate removal, type coercion, and outlier detection |
| 📊 **Autonomous EDA** | Statistical profiling, distribution analysis, correlation mapping, and anomaly flagging with interactive Plotly charts |
| 🔮 **Predictive Modeling** | Automatic model training and prediction generation using Scikit-learn, XGBoost, and LightGBM |
| 📝 **Automated Reports** | Structured downloadable reports with charts, metrics, and summaries |
| 🔭 **Agent Monitoring** | Real-time pipeline status page showing each agent's live progress and state |
| 🔐 **Authentication** | Email login and OAuth via Google and GitHub using Auth.js (NextAuth v5) |

---

## 🏗 System Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                        AutoInsight Platform                          │
│                                                                      │
│  ┌──────────────────────┐   Auth.js    ┌──────────────────────────┐ │
│  │    Next.js 15 App    │◄────────────►│  Google / GitHub OAuth   │ │
│  │  (Frontend + SSR)    │              └──────────────────────────┘ │
│  └───────────┬──────────┘                                           │
│              │  REST API                                             │
│  ┌───────────▼──────────┐                                           │
│  │   FastAPI Backend    │                                           │
│  │   (Python 3.12+)     │                                           │
│  └───────────┬──────────┘                                           │
│              │                                                       │
│  ┌───────────▼──────────────────────────────────────────┐          │
│  │             LangGraph Agent Pipeline                  │          │
│  │                                                       │          │
│  │  [Ingestion] → [Cleaning] → [EDA] →                  │          │
│  │  [Prediction] → [Reporting]                           │          │
│  └───────────┬──────────────────────────────────────────┘          │
│              │                                                       │
│  ┌───────────┴──────────────────────────────┐                       │
│  │                 Supabase                  │                       │
│  │  ┌──────────────────┐  ┌───────────────┐ │                       │
│  │  │  PostgreSQL DB    │  │ File Storage  │ │                       │
│  │  │  (users, jobs,    │  │ (datasets,    │ │                       │
│  │  │  results, logs)   │  │  reports)     │ │                       │
│  │  └──────────────────┘  └───────────────┘ │                       │
│  └───────────────────────────────────────────┘                       │
│                                                                      │
│  Deployment:  Frontend → Vercel  |  Backend → Render                │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 🤖 AI Agent Workflow

AutoInsight uses **LangGraph** to orchestrate a deterministic multi-agent pipeline. Each agent is a node in the graph with a defined input contract, processing logic, and output schema. Agents execute sequentially, passing shared state between each stage.

```
User Uploads Dataset (CSV / Excel / JSON → Supabase Storage)
                │
                ▼
┌───────────────────────┐
│    Ingestion Agent    │  →  File validation, schema inference, metadata extraction
└──────────┬────────────┘
           │
           ▼
┌───────────────────────┐
│    Cleaning Agent     │  →  Null handling, duplicate removal, type coercion, outlier detection
└──────────┬────────────┘
           │
           ▼
┌───────────────────────┐
│      EDA Agent        │  →  Statistical summaries, distributions, correlation heatmaps (Plotly)
└──────────┬────────────┘
           │
           ▼
┌───────────────────────┐
│   Prediction Agent    │  →  Model training (Scikit-learn / XGBoost / LightGBM), inference
└──────────┬────────────┘
           │
           ▼
┌───────────────────────┐
│   Reporting Agent     │  →  Compiles charts, metrics, and summaries → downloadable report
└──────────┬────────────┘
           │
           ▼
    Dashboard + Report Download
```

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| Next.js | 15 | SSR framework with App Router and server components |
| React | 19 | UI component library |
| TypeScript | 5.0+ | Static typing and developer tooling |
| Tailwind CSS | v4 | Utility-first styling |
| ShadCN UI | Latest | Accessible, production-ready dashboard components |
| Auth.js (NextAuth) | v5 | Email login + Google and GitHub OAuth |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Python | 3.12+ | Core runtime |
| FastAPI | Latest | High-performance async REST API with auto OpenAPI docs |
| Pandas | 2.x | Dataset manipulation and transformation |
| NumPy | Latest | Numerical computing |
| PyArrow | Latest | Efficient columnar data processing |
| Scikit-learn | Latest | ML model training and evaluation |
| XGBoost | Latest | Gradient boosted tree models |
| LightGBM | Latest | Fast gradient boosting |

### AI / Agent Orchestration
| Technology | Purpose |
|---|---|
| LangGraph | Deterministic multi-agent pipeline orchestration |
| Plotly | Interactive charts embedded in the dashboard |
| Matplotlib | Static chart generation for downloadable PDF reports |

### Infrastructure & Storage
| Technology | Purpose |
|---|---|
| Supabase PostgreSQL | Primary database — user accounts, dataset metadata, agent logs, analytics results |
| Supabase Storage | File storage — uploaded datasets and generated reports (up to 500MB) |
| Vercel | Frontend hosting with edge deployment |
| Render | Backend API hosting |
| Docker | Containerized local development |
| GitHub Actions | CI/CD pipeline |

---

## 📁 Project Structure

```
AUTO-INSIGHT/
│
├── frontend/                          # Next.js 15 application
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/                 # Login page
│   │   │   └── register/              # Registration page
│   │   ├── dashboard/                 # Main analytics dashboard
│   │   ├── upload/                    # Dataset upload page
│   │   ├── analysis/                  # EDA charts and outputs
│   │   ├── predictions/               # ML results and metrics
│   │   ├── reports/                   # Report viewer and download
│   │   ├── agents/                    # Agent pipeline monitoring
│   │   ├── about/                     # About page
│   │   ├── layout.tsx                 # Root layout
│   │   └── page.tsx                   # Landing page
│   │
│   ├── components/
│   │   ├── ui/                        # ShadCN base components
│   │   ├── Upload/                    # File upload components
│   │   ├── Pipeline/                  # Agent monitoring UI
│   │   ├── Charts/                    # Plotly chart wrappers
│   │   ├── Report/                    # Report viewer components
│   │   └── common/                    # Shared layout components
│   │
│   ├── lib/
│   │   ├── auth.ts                    # Auth.js configuration
│   │   ├── supabase.ts                # Supabase client
│   │   └── api.ts                     # Backend API client
│   │
│   ├── hooks/                         # Custom React hooks
│   ├── types/                         # TypeScript interfaces
│   ├── public/                        # Static assets
│   ├── tailwind.config.ts
│   ├── next.config.ts
│   └── README.md
│
├── backend/                           # FastAPI application
│   ├── agents/
│   │   ├── ingestion_agent.py
│   │   ├── cleaning_agent.py
│   │   ├── eda_agent.py
│   │   ├── prediction_agent.py
│   │   └── reporting_agent.py
│   │
│   ├── pipelines/
│   │   ├── graph.py                   # LangGraph pipeline definition
│   │   ├── state.py                   # Shared agent state schema
│   │   └── orchestrator.py
│   │
│   ├── api/
│   │   ├── main.py
│   │   └── v1/
│   │       ├── datasets.py
│   │       ├── jobs.py
│   │       ├── reports.py
│   │       └── health.py
│   │
│   ├── services/
│   │   ├── supabase_service.py        # Supabase DB + Storage client
│   │   └── job_service.py
│   │
│   ├── utils/
│   ├── tests/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── README.md
│
├── docs/
│   ├── architecture.png
│   └── workflow.png
│
├── docker/
│   └── docker-compose.yml
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── .env.example
└── README.md
```

---

## ⚙️ Installation

### Prerequisites

- Node.js 20+ and npm 9+
- Python 3.12+
- A [Supabase](https://supabase.com) project (free tier works)
- Docker (optional)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/auto-insight.git
cd auto-insight
```

### 2. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Auth.js
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Backend
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
# Available at http://localhost:3000
```

### 4. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Linux/macOS
# .\venv\Scripts\activate       # Windows

pip install -r requirements.txt
uvicorn api.main:app --reload --port 8000
# API at http://localhost:8000
# Docs at http://localhost:8000/docs
```

### 5. Docker (Full Stack)

```bash
docker compose -f docker/docker-compose.yml up --build
```

---

## 🚀 Usage Guide

### Web Interface

1. Go to `http://localhost:3000` and sign in with email, Google, or GitHub
2. Navigate to **Upload** — drag and drop a CSV, Excel, or JSON file (up to 500MB)
3. Preview your dataset and configure the target column and task type
4. Click **Run AutoInsight** — the LangGraph pipeline starts immediately
5. Monitor each agent's progress on the **Agent Monitor** page
6. View EDA charts on the **Analysis** page and ML results on the **Predictions** page
7. Download your full report from the **Reports** page

### REST API

```bash
# Upload a dataset
curl -X POST http://localhost:8000/api/v1/datasets \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@sales_data.csv"

# Start pipeline
curl -X POST http://localhost:8000/api/v1/jobs \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"dataset_id": "ds_abc123", "target_column": "revenue", "task_type": "regression"}'

# Check job status
curl http://localhost:8000/api/v1/jobs/job_xyz456 \
  -H "Authorization: Bearer $TOKEN"

# Download report
curl http://localhost:8000/api/v1/reports/job_xyz456 \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🎬 Demo

```
Step 1 — Sign In
  User authenticates via Google OAuth

Step 2 — Upload
  User uploads sales_data_2024.csv (50,000 rows)
  File stored directly in Supabase Storage

Step 3 — Ingestion Agent
  Schema inferred, column types detected, metadata saved to Supabase DB

Step 4 — Cleaning Agent
  Handles 3.2% missing values, removes 47 duplicate rows, flags 12 outliers

Step 5 — EDA Agent
  Generates interactive Plotly charts: distributions, correlations, anomalies
  Detects strong correlation between ad_spend and revenue (r=0.87)

Step 6 — Prediction Agent
  Benchmarks Scikit-learn, XGBoost, LightGBM
  Selects XGBoost Regressor (RMSE: 1,243 | R²: 0.91)

Step 7 — Reporting Agent
  Compiles EDA charts + model metrics into a structured PDF report
  Available for download on the Reports page

Total pipeline runtime for 50K rows: ~4 minutes
```

---

## 🗺 Roadmap

### Phase 1 — Core Pipeline ✅
- Dataset upload via Supabase Storage
- FastAPI backend with LangGraph agent graph
- Ingestion and cleaning agents

### Phase 2 — Analysis & Prediction 🔄 *(In Progress)*
- EDA agent with Plotly visualizations
- Prediction agent with Scikit-learn / XGBoost / LightGBM
- Analysis and Predictions pages in Next.js

### Phase 3 — Reporting & Monitoring ⏳
- PDF report generation with Matplotlib
- Agent monitoring page with live pipeline status
- Report storage and download via Supabase

### Phase 4 — Auth & User Accounts ⏳
- Auth.js with email, Google, and GitHub login
- User-scoped dataset and job history

### Phase 5 — Production Deployment ⏳
- Frontend → Vercel
- Backend → Render
- CI/CD via GitHub Actions

### Phase 6 — SaaS Features ⏳
- Multi-tenant organization support
- Natural language data querying
- Usage-based billing

---

## 🔮 Future Improvements

- **Natural language queries** — Ask questions about your dataset in plain English via an AI-assisted query interface
- **Additional data connectors** — Native integrations with Google Sheets, Notion, and REST APIs
- **WebSocket pipeline updates** — Real-time agent progress without polling
- **Cloudflare R2 storage** — Alternative object storage backend for high-volume usage
- **Custom agent plugins** — SDK for registering domain-specific agents into the pipeline
- **Model registry** — Version-controlled model storage with drift detection and retraining triggers
- **Collaborative workspaces** — Shared dashboards with team roles and access control

---

## 🤝 Contributing

```bash
# Fork and clone
git clone https://github.com/your-username/auto-insight.git

# Create a feature branch
git checkout -b feat/your-feature-name

# Make changes, then run tests
cd backend && pytest
cd frontend && npm run test

# Commit using Conventional Commits
git commit -m "feat: add EDA agent correlation heatmap"

# Push and open a pull request
git push origin feat/your-feature-name
```

### Standards

- Python: `ruff` linting + type hints required
- TypeScript: `eslint` + no `any` types
- All new features require tests
- Follow [Conventional Commits](https://www.conventionalcommits.org/) format

---

<div align="center">

Built with ⚙️ precision · AutoInsight Engineering

[Documentation](#) · [Issues](issues) · [Discussions](#)

</div>
