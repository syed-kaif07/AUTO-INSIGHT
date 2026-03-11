# AutoInsight — Frontend Application

[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20Storage-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com)

The AutoInsight frontend is a Next.js 15 application with server-side rendering, server components, and a full SaaS dashboard interface. It handles authentication, dataset uploads to Supabase Storage, pipeline monitoring, EDA visualizations, and report downloads — all within a dark-themed, responsive UI.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Pages](#pages)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Running the Frontend](#running-the-frontend)
- [Environment Variables](#environment-variables)
- [Design System](#design-system)
- [Contributing](#contributing)

---

## Overview

The frontend is built with **Next.js 15 App Router**, using server components for fast initial page loads and client components for interactive dashboard elements. Authentication is handled by **Auth.js (NextAuth v5)** with email login, Google OAuth, and GitHub OAuth. File uploads go directly to **Supabase Storage**, bypassing the backend server for performance.

The UI follows the AutoInsight design system: dark backgrounds, purple accents, and a clean SaaS layout using **Tailwind CSS v4** and **ShadCN UI** components.

Target page load time: **2–3 seconds** for primary pages.

---

## Pages

| Route | Page | Description |
|---|---|---|
| `/` | Landing Page | Product overview, features, pricing, and CTAs |
| `/login` | Login | Email login and OAuth sign-in |
| `/register` | Register | Account creation |
| `/dashboard` | Dashboard | Main analytics workspace and job overview |
| `/upload` | Data Sources | Upload datasets or connect external data sources |
| `/analysis` | Analysis | EDA charts, statistical summaries, and visualizations |
| `/predictions` | Predictions | ML model results, metrics, and prediction outputs |
| `/reports` | Reports | Generated report viewer and PDF download |
| `/agents` | Agent Monitor | Real-time pipeline stage progress and agent logs |
| `/about` | About | Project information and tech overview |

---

## Features

### Authentication
- Email and password login
- Google OAuth and GitHub OAuth via Auth.js (NextAuth v5)
- Session-based access control — all dashboard routes are protected
- User-scoped data — each user sees only their own datasets and jobs

### Dataset Upload
- Drag-and-drop file upload (CSV, Excel, JSON — up to 500MB)
- Files upload directly to Supabase Storage from the browser
- Dataset preview with paginated tabular view before running the pipeline
- Upload progress indicator with file size display

### Pipeline Monitoring
- Real-time agent stage tracker (Ingestion → Cleaning → EDA → Prediction → Reporting)
- Live status updates for each pipeline node
- Agent log viewer with per-stage output
- Error display with contextual diagnostics for failed jobs

### EDA Dashboard
- Interactive Plotly charts: histograms, correlation heatmaps, distribution plots
- Statistical summary cards (mean, median, std, nulls, unique values)
- Anomaly and outlier flags surfaced from the EDA agent

### Predictions Page
- Model leaderboard comparing benchmarked algorithms
- Performance metric cards (RMSE, R², AUC, F1 — by task type)
- Feature importance visualization
- Prediction results table with actual vs. predicted comparison

### Reports
- Structured report viewer with section navigation
- One-click PDF download from Supabase Storage
- Report history with per-job archive access

---

## Tech Stack

| Category | Technology | Version | Purpose |
|---|---|---|---|
| **Framework** | Next.js | 15 | App Router, SSR, server components, Vercel deployment |
| **UI Library** | React | 19 | Component model |
| **Language** | TypeScript | 5.0+ | Static typing |
| **Styling** | Tailwind CSS | v4 | Utility-first CSS |
| **Components** | ShadCN UI | Latest | Accessible dashboard components (tables, dialogs, dropdowns) |
| **Auth** | Auth.js (NextAuth) | v5 | Email + Google + GitHub OAuth |
| **Storage Client** | Supabase JS | Latest | Direct browser uploads to Supabase Storage |
| **DB Client** | Supabase JS | Latest | Read dataset metadata and job results |
| **Charts** | Plotly.js | Latest | Interactive EDA and prediction visualizations |
| **HTTP Client** | Fetch / Axios | Latest | Backend API communication |
| **Routing** | Next.js App Router | Built-in | File-based routing with layouts |
| **Testing** | Vitest + Testing Library | Latest | Unit and component testing |

---

## Project Structure

```
frontend/
│
├── app/                                # Next.js App Router
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx               # Login page
│   │   └── register/
│   │       └── page.tsx               # Registration page
│   │
│   ├── dashboard/
│   │   └── page.tsx                   # Main analytics workspace
│   │
│   ├── upload/
│   │   └── page.tsx                   # Dataset upload and data sources
│   │
│   ├── analysis/
│   │   └── page.tsx                   # EDA charts and outputs
│   │
│   ├── predictions/
│   │   └── page.tsx                   # ML model results and metrics
│   │
│   ├── reports/
│   │   ├── page.tsx                   # Report list
│   │   └── [jobId]/
│   │       └── page.tsx               # Individual report viewer
│   │
│   ├── agents/
│   │   └── page.tsx                   # Agent pipeline monitoring
│   │
│   ├── about/
│   │   └── page.tsx                   # About page
│   │
│   ├── layout.tsx                     # Root layout (Navbar, auth session)
│   ├── page.tsx                       # Landing page
│   └── globals.css                    # Global styles and Tailwind directives
│
├── components/
│   ├── ui/                            # ShadCN base components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── table.tsx
│   │   └── ...
│   │
│   ├── Upload/
│   │   ├── DropZone.tsx               # Drag-and-drop upload area
│   │   ├── UploadProgress.tsx         # Upload progress indicator
│   │   └── DatasetPreview.tsx         # Tabular dataset preview
│   │
│   ├── Pipeline/
│   │   ├── PipelineStatus.tsx         # Agent stage timeline
│   │   ├── AgentCard.tsx              # Per-agent status card
│   │   └── LogViewer.tsx              # Agent log output
│   │
│   ├── Charts/
│   │   ├── CorrelationHeatmap.tsx     # Plotly correlation matrix
│   │   ├── DistributionChart.tsx      # Histogram and KDE
│   │   ├── FeatureImportance.tsx      # Feature importance bar chart
│   │   └── ModelLeaderboard.tsx       # Algorithm comparison table
│   │
│   ├── Report/
│   │   ├── ReportViewer.tsx           # Full report layout
│   │   ├── MetricCard.tsx             # Summary stat card
│   │   └── DownloadButton.tsx         # PDF download from Supabase Storage
│   │
│   └── common/
│       ├── Navbar.tsx                 # Top navigation bar
│       ├── Sidebar.tsx                # Dashboard sidebar
│       ├── LoadingSpinner.tsx
│       └── EmptyState.tsx
│
├── lib/
│   ├── auth.ts                        # Auth.js (NextAuth v5) configuration
│   ├── supabase.ts                    # Supabase browser client setup
│   └── api.ts                         # Backend FastAPI client
│
├── hooks/
│   ├── useJob.ts                      # Job status polling hook
│   ├── useDataset.ts                  # Dataset management hook
│   └── useUpload.ts                   # File upload with progress tracking
│
├── types/
│   ├── dataset.ts                     # Dataset TypeScript interfaces
│   ├── job.ts                         # Job and pipeline state types
│   └── report.ts                      # Report structure types
│
├── public/                            # Static assets
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
├── .eslintrc.cjs
└── README.md
```

---

## Setup & Installation

### Prerequisites

- Node.js 20+
- npm 9+
- A [Supabase](https://supabase.com) project with a Storage bucket named `datasets`
- Google and GitHub OAuth apps configured (for social login)
- AutoInsight backend running on `http://localhost:8000`

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

```bash
cp ../.env.example .env.local
```

Edit `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Auth.js
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000

# OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Running the Frontend

### Development

```bash
npm run dev
# Available at http://localhost:3000
```

### Production Build

```bash
npm run build
npm run start
```

### Linting and Type Checking

```bash
npm run lint
npm run type-check
```

### Tests

```bash
npm run test
npm run test:coverage
```

### Deploying to Vercel

The frontend is configured for zero-config deployment to Vercel:

```bash
vercel deploy
```

Set all `.env.local` variables in the Vercel project environment settings before deploying.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase public anon key for browser client |
| `NEXTAUTH_SECRET` | Yes | Auth.js session signing secret |
| `NEXTAUTH_URL` | Yes | Canonical URL of the application |
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth app client ID |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth app client secret |
| `GITHUB_CLIENT_ID` | Yes | GitHub OAuth app client ID |
| `GITHUB_CLIENT_SECRET` | Yes | GitHub OAuth app client secret |
| `NEXT_PUBLIC_API_URL` | Yes | FastAPI backend base URL |
| `NEXT_PUBLIC_MAX_UPLOAD_MB` | No | Max upload size shown in UI (default: `500`) |

---

## Design System

The AutoInsight UI follows a consistent dark-theme design system defined in `tailwind.config.ts`.

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| `background` | `#0B0B1A` | Primary page background |
| `surface` | `#1A1838` | Card and panel backgrounds |
| `border` | `#2B2956` | Card borders and dividers |
| `primary` | `#8B5CF6` | Buttons, active states, accents |
| `primary-hover` | `#A855F7` | Button hover state |
| `text` | `#FFFFFF` | Primary text |
| `text-secondary` | `#C9C7FF` | Supporting text |
| `text-muted` | `#8A88B5` | Placeholder and muted labels |
| `success` | `#10B981` | Completed pipeline states |
| `error` | `#EF4444` | Failed states and error messages |

### Typography

| Role | Font | Size | Weight |
|---|---|---|---|
| Hero titles | Space Grotesk | 64px | 700 |
| Section titles | Space Grotesk | 40px | 600 |
| Card headings | Inter | 24px | 600 |
| Body text | Inter | 16px | 400 |
| Labels | Inter | 14px | 400 |
| Buttons | Inter | 15px | 600 |

### Component Conventions

- **Cards** — background `#1A1838`, border `1px solid #2B2956`, border-radius `16px`, padding `24px`
- **Primary buttons** — gradient `#8B5CF6 → #6366F1`, border-radius `10px`, hover glow shadow
- **Hover animations** — `translateY(-4px)` lift, duration `200–350ms`
- **Inputs** — background `#14132E`, focus border `#8B5CF6`

---

## Contributing

```bash
# Run tests before committing
npm run test
npm run lint
npm run type-check

# Commit using Conventional Commits
git commit -m "feat(upload): add file size validation"
git commit -m "fix(charts): resolve heatmap render on mobile"
git commit -m "chore: update ShadCN components"
```

### Guidelines

- No `any` TypeScript types — all props and responses must be fully typed
- New pages must be added to the App Router with a corresponding layout if needed
- New components require a test file in `tests/components/`
- Tailwind utility classes only — avoid custom CSS files unless strictly necessary
- Follow the existing file naming: PascalCase for components, camelCase for hooks and utilities
