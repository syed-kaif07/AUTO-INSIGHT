# AutoInsight — Frontend Application

[![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4+-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![React Query](https://img.shields.io/badge/React%20Query-5.0+-FF4154?style=flat-square&logo=reactquery&logoColor=white)](https://tanstack.com/query)

The AutoInsight frontend is a responsive, data-rich single-page application that provides users with a full-featured interface to upload datasets, monitor analysis pipelines in real time, explore EDA visualizations, and consume generated reports.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Running the Frontend](#running-the-frontend)
- [Environment Variables](#environment-variables)
- [Component Architecture](#component-architecture)
- [State Management](#state-management)
- [Design System](#design-system)
- [Contributing](#contributing)

---

## Overview

The AutoInsight frontend is engineered for clarity and performance. It is built with React 18, TypeScript, and Vite — prioritizing type safety, fast iteration, and a production-grade developer experience. The UI is designed to make complex analytical outputs accessible to both technical users and business stakeholders.

The application communicates exclusively with the AutoInsight backend through a centralized API service layer, with all server state managed via React Query for caching, background refresh, and optimistic updates.

---

## Features

### Dataset Management
- Drag-and-drop file upload with format validation (CSV, Excel, JSON, Parquet)
- Upload progress tracking with file size and estimated time display
- Dataset library view with metadata (row count, column count, size, upload date)
- Dataset preview with paginated tabular view of raw data

### Pipeline Monitoring
- Real-time job status tracking with per-agent progress indicators
- Live log streaming from backend worker processes
- Pipeline stage timeline showing duration and status for each agent
- Error display with contextual diagnostics for failed jobs

### EDA Dashboard
- Interactive correlation heatmaps with drill-down on column pairs
- Distribution charts (histogram, KDE, box plot) for all numeric columns
- Missing value visualizations (heatmap and percentage summary)
- Outlier detection flags with configurable threshold controls

### ML Model Results
- Model leaderboard table comparing all benchmarked algorithms
- Performance metric cards (RMSE, R², AUC, F1 — depending on task type)
- Feature importance chart (SHAP values, rendered as waterfall and bar charts)
- Prediction results table with actual vs. predicted comparison

### Insight Reports
- Structured report viewer with section navigation
- LLM-generated narrative sections rendered as readable prose
- One-click PDF download for stakeholder distribution
- Report history with per-job archive access

---

## Tech Stack

| Category | Technology | Version | Purpose |
|---|---|---|---|
| **Framework** | React | 18+ | Component-based UI architecture |
| **Language** | TypeScript | 5.0+ | Static typing and developer tooling |
| **Build Tool** | Vite | 5.0+ | Fast HMR development server and optimized production builds |
| **Styling** | TailwindCSS | 3.4+ | Utility-first CSS with design token configuration |
| **Server State** | TanStack Query (React Query) | 5.0+ | Data fetching, caching, and background sync |
| **Client State** | Zustand | 4.0+ | Lightweight global state for UI concerns |
| **Charting** | Recharts | 2.0+ | Composable SVG charts for EDA visualizations |
| **Advanced Viz** | D3.js | 7.0+ | Custom heatmaps and correlation matrices |
| **HTTP Client** | Axios | 1.6+ | API communication with interceptor support |
| **Routing** | React Router | 6.0+ | Client-side navigation |
| **Forms** | React Hook Form + Zod | Latest | Validated form handling |
| **Icons** | Lucide React | Latest | Consistent icon system |
| **Testing** | Vitest + Testing Library | Latest | Unit and integration testing |

---

## Project Structure

```
frontend/
│
├── src/
│   │
│   ├── components/
│   │   ├── Upload/
│   │   │   ├── DropZone.tsx             # Drag-and-drop file upload area
│   │   │   ├── UploadProgress.tsx       # Upload progress bar and status
│   │   │   └── DatasetPreview.tsx       # Tabular preview of uploaded data
│   │   │
│   │   ├── Pipeline/
│   │   │   ├── PipelineStatus.tsx       # Overall job status and timeline
│   │   │   ├── AgentCard.tsx            # Per-agent progress indicator
│   │   │   ├── LogStream.tsx            # Real-time log output viewer
│   │   │   └── ErrorPanel.tsx           # Job failure diagnostics display
│   │   │
│   │   ├── Charts/
│   │   │   ├── CorrelationHeatmap.tsx   # D3-based correlation matrix
│   │   │   ├── DistributionChart.tsx    # Histogram and KDE chart
│   │   │   ├── BoxPlot.tsx              # Box plot for outlier visualization
│   │   │   ├── FeatureImportance.tsx    # SHAP waterfall/bar chart
│   │   │   ├── ModelLeaderboard.tsx     # Algorithm comparison table
│   │   │   └── PredictionTable.tsx      # Actual vs. predicted results
│   │   │
│   │   ├── Report/
│   │   │   ├── ReportViewer.tsx         # Full report layout with navigation
│   │   │   ├── InsightSection.tsx       # LLM narrative prose renderer
│   │   │   ├── MetricCard.tsx           # Summary stat display card
│   │   │   └── DownloadButton.tsx       # PDF export trigger
│   │   │
│   │   └── common/
│   │       ├── Layout.tsx               # App shell with nav and sidebar
│   │       ├── Navbar.tsx               # Top navigation bar
│   │       ├── Sidebar.tsx              # Left navigation panel
│   │       ├── LoadingSpinner.tsx       # Animated loading state
│   │       ├── EmptyState.tsx           # Zero-data placeholder component
│   │       ├── Badge.tsx                # Status and label badges
│   │       └── Modal.tsx                # Generic modal wrapper
│   │
│   ├── pages/
│   │   ├── Dashboard.tsx                # Main analytics overview
│   │   ├── Upload.tsx                   # Dataset upload workflow
│   │   ├── Jobs.tsx                     # Job history and management
│   │   ├── JobDetail.tsx                # Single job monitoring view
│   │   ├── Report.tsx                   # Report detail and download
│   │   └── NotFound.tsx                 # 404 page
│   │
│   ├── services/
│   │   ├── api.ts                       # Axios instance with auth interceptors
│   │   ├── datasets.ts                  # Dataset API functions
│   │   ├── jobs.ts                      # Job API functions
│   │   └── reports.ts                   # Report API functions
│   │
│   ├── hooks/
│   │   ├── useDataset.ts                # Dataset CRUD React Query hooks
│   │   ├── useJob.ts                    # Job status and polling hooks
│   │   ├── usePipeline.ts               # Pipeline progress hooks
│   │   ├── useReport.ts                 # Report retrieval hooks
│   │   └── useUpload.ts                 # File upload with progress tracking
│   │
│   ├── store/
│   │   ├── index.ts                     # Zustand store root
│   │   ├── uiStore.ts                   # UI state (sidebar, modals, theme)
│   │   └── uploadStore.ts               # Upload session state
│   │
│   ├── types/
│   │   ├── dataset.ts                   # Dataset TypeScript interfaces
│   │   ├── job.ts                       # Job and pipeline state types
│   │   ├── report.ts                    # Report structure types
│   │   └── api.ts                       # API response type definitions
│   │
│   ├── utils/
│   │   ├── formatters.ts                # Date, number, file size formatters
│   │   ├── chartHelpers.ts              # Chart data transformation utilities
│   │   └── constants.ts                 # App-wide constants
│   │
│   ├── App.tsx                          # Root component with router setup
│   ├── main.tsx                         # Application entry point
│   └── index.css                        # Global styles and Tailwind directives
│
├── public/
│   ├── favicon.ico
│   └── og-image.png
│
├── tests/
│   ├── components/
│   │   └── Upload.test.tsx
│   ├── hooks/
│   │   └── useJob.test.ts
│   └── setup.ts
│
├── Dockerfile
├── nginx.conf                           # Production static file serving config
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── .eslintrc.cjs
└── README.md
```

---

## Setup & Installation

### Prerequisites

- Node.js 20+
- npm 9+ or pnpm 8+
- AutoInsight backend running on `http://localhost:8000`

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_APP_ENV=development
VITE_APP_VERSION=0.1.0
```

---

## Running the Frontend

### Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000` with hot module replacement enabled.

### Production Build

```bash
npm run build
npm run preview       # Preview the production build locally
```

Build output is written to `dist/`. The `nginx.conf` in the project root is configured to serve this directory with proper SPA routing support.

### Via Docker

```bash
docker build -t autoinsight-frontend .
docker run -p 3000:80 autoinsight-frontend
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_API_BASE_URL` | Yes | Base URL for the AutoInsight backend API |
| `VITE_APP_ENV` | No | Application environment (`development`, `production`) |
| `VITE_APP_VERSION` | No | Application version string displayed in the UI |
| `VITE_POLLING_INTERVAL_MS` | No | Job status polling interval in ms (default: `3000`) |
| `VITE_MAX_UPLOAD_SIZE_MB` | No | Max upload file size in MB shown in UI (default: `500`) |

All variables must be prefixed with `VITE_` to be exposed to the browser bundle.

---

## Component Architecture

Components follow a layered structure:

**Page components** — Top-level route components that compose features. They own data fetching via custom hooks and pass data down to feature components.

**Feature components** — Domain-specific UI blocks (e.g., `PipelineStatus`, `CorrelationHeatmap`) that receive typed props and handle their own internal state.

**Common components** — Reusable primitives (`Badge`, `Modal`, `LoadingSpinner`) with no domain knowledge. These form the application's internal design system.

```
Page
 └── Feature Component (receives data via props)
      ├── Common Component (purely presentational)
      └── Common Component
```

---

## State Management

State is split into two layers based on ownership:

**Server state** (React Query) — All data that originates from the backend API: datasets, jobs, reports. React Query manages fetching, caching, background refetching, and mutation lifecycle. Job status pages poll the `/jobs/{id}` endpoint on a configurable interval until the job reaches a terminal state.

**Client state** (Zustand) — UI-only state with no server equivalent: sidebar open/close, active modal, theme preference, in-progress upload session. Zustand stores are small, focused slices rather than a monolithic store.

---

## Design System

The application uses TailwindCSS with a custom design token configuration defined in `tailwind.config.ts`.

**Color palette:**

| Token | Usage |
|---|---|
| `primary` | Interactive elements, CTAs, active states |
| `surface` | Card backgrounds, panel backgrounds |
| `muted` | Secondary text, placeholder content |
| `success` | Completed job states, positive metrics |
| `warning` | In-progress states, cautionary metrics |
| `destructive` | Failed job states, error messages |

**Typography:** Inter (body text) + JetBrains Mono (code, data values, log output)

All components are WCAG 2.1 AA compliant with accessible color contrast ratios and keyboard navigation support.

---

## Contributing

### Development Workflow

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Lint and type check
npm run lint
npm run type-check

# Format code
npm run format
```

### Guidelines

- All new components must have a corresponding test file
- Component props must be fully typed with TypeScript interfaces — avoid `any`
- New pages must be added to the React Router configuration in `App.tsx`
- Tailwind classes should be applied directly; avoid custom CSS unless absolutely necessary
- Follow the existing file naming convention: PascalCase for components, camelCase for hooks and utilities
