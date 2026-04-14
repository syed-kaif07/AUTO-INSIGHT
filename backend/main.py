from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from core.config import settings
from api.routes import auth, reports

app = FastAPI(
    title="AutoInsight API",
    description="AI-powered multi-agent analytics platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# ─── Middleware ─────────────────────────────────────────────────────────────

app.add_middleware(GZipMiddleware, minimum_size=1000)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ────────────────────────────────────────────────────────────────

app.include_router(auth.router)
app.include_router(reports.router)

# ─── Health Check ───────────────────────────────────────────────────────────

@app.get("/", tags=["Health"])
async def root():
    return {
        "status": "running",
        "app": "AutoInsight API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health", tags=["Health"])
async def health():
    return {"status": "healthy"}
