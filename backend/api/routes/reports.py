"""
Reports API Routes
==================

Endpoints:
  POST /api/v1/reports/{pipeline_id}/generate  — Trigger the reporting agent
  GET  /api/v1/reports                          — List all reports for the current user
  GET  /api/v1/reports/{pipeline_id}            — Get a single report's metadata
  GET  /api/v1/reports/{pipeline_id}/download   — Stream the PDF from Supabase Storage

All endpoints require a valid JWT (via get_current_user dependency).
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
import httpx

from core.auth import get_current_user
from core.database import supabase
from agents.reporting_agent import ReportingAgent

router = APIRouter(prefix="/api/v1/reports", tags=["Reports"])


# ─── POST /api/v1/reports/{pipeline_id}/generate ─────────────────────────────

@router.post("/{pipeline_id}/generate", status_code=status.HTTP_202_ACCEPTED)
async def generate_report(
    pipeline_id: str,
    current_user: dict = Depends(get_current_user),
):
    """
    Trigger the ReportingAgent for a given pipeline.

    Validates that:
    - The pipeline exists and belongs to the current user
    - The pipeline has not already generated a ready report

    Runs the agent synchronously and returns the new report row on completion.
    """
    user_id = current_user["id"]

    # ── 1. Validate pipeline ownership ───────────────────────────────────────
    pipeline_res = (
        supabase.table("pipelines")
        .select("id,user_id,dataset_id,status")
        .eq("id", pipeline_id)
        .eq("user_id", user_id)
        .execute()
    )
    if not pipeline_res.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pipeline not found or access denied",
        )
    pipeline = pipeline_res.data[0]
    dataset_id = pipeline["dataset_id"]

    # ── 2. Check for an existing ready report ────────────────────────────────
    existing = (
        supabase.table("reports")
        .select("id,status")
        .eq("pipeline_id", pipeline_id)
        .eq("status", "ready")
        .execute()
    )
    if existing.data:
        report = existing.data[0]
        return {
            "report_id": report["id"],
            "status": "ready",
            "message": "Report already generated for this pipeline",
        }

    # ── 3. Run the reporting agent ────────────────────────────────────────────
    try:
        agent = ReportingAgent()
        report_row_id = agent.generate(
            pipeline_id=pipeline_id,
            user_id=user_id,
            dataset_id=dataset_id,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Report generation failed: {exc}",
        )

    # ── 4. Return the new report metadata ─────────────────────────────────────
    report_res = (
        supabase.table("reports")
        .select("*")
        .eq("id", report_row_id)
        .single()
        .execute()
    )
    return {
        "report_id": report_row_id,
        "status": "ready",
        "report": report_res.data,
    }


# ─── GET /api/v1/reports ─────────────────────────────────────────────────────

@router.get("")
async def list_reports(
    current_user: dict = Depends(get_current_user),
):
    """
    List all reports for the authenticated user, newest first.
    Joins dataset name for convenience.
    """
    user_id = current_user["id"]

    res = (
        supabase.table("reports")
        .select("*, datasets(name, original_filename, file_type), pipelines(status)")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .execute()
    )

    reports = res.data or []
    # Flatten nested joins for the frontend
    for r in reports:
        ds = r.pop("datasets", None) or {}
        pl = r.pop("pipelines", None) or {}
        r["dataset_name"] = ds.get("name") or ds.get("original_filename", "Unknown")
        r["dataset_file_type"] = ds.get("file_type", "")
        r["pipeline_status"] = pl.get("status", "")

    return {"reports": reports, "count": len(reports)}


# ─── GET /api/v1/reports/{pipeline_id} ───────────────────────────────────────

@router.get("/{pipeline_id}")
async def get_report(
    pipeline_id: str,
    current_user: dict = Depends(get_current_user),
):
    """
    Fetch metadata for the report associated with a specific pipeline.
    """
    user_id = current_user["id"]

    res = (
        supabase.table("reports")
        .select("*, datasets(name, original_filename)")
        .eq("pipeline_id", pipeline_id)
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .limit(1)
        .execute()
    )

    if not res.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No report found for this pipeline",
        )

    report = res.data[0]
    ds = report.pop("datasets", None) or {}
    report["dataset_name"] = ds.get("name") or ds.get("original_filename", "Unknown")
    return report


# ─── GET /api/v1/reports/{pipeline_id}/download ──────────────────────────────

@router.get("/{pipeline_id}/download")
async def download_report(
    pipeline_id: str,
    current_user: dict = Depends(get_current_user),
):
    """
    Stream the PDF report to the client by generating a short-lived signed URL
    from Supabase Storage, then proxying the bytes.
    """
    user_id = current_user["id"]

    # ── 1. Fetch the report row ───────────────────────────────────────────────
    res = (
        supabase.table("reports")
        .select("storage_path,title,status")
        .eq("pipeline_id", pipeline_id)
        .eq("user_id", user_id)
        .eq("status", "ready")
        .order("created_at", desc=True)
        .limit(1)
        .execute()
    )

    if not res.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not ready or not found",
        )

    report = res.data[0]
    storage_path: str = report["storage_path"]
    title: str = report.get("title", "report")
    safe_title = title.replace(" ", "_").replace("/", "-")[:80]

    # ── 2. Generate a signed download URL (valid 60 seconds) ─────────────────
    try:
        signed = supabase.storage.from_("reports").create_signed_url(
            path=storage_path,
            expires_in=60,
        )
        download_url: str = signed["signedURL"]
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not generate download URL: {exc}",
        )

    # ── 3. Proxy the PDF bytes back to the client ─────────────────────────────
    async def _stream():
        async with httpx.AsyncClient() as client:
            async with client.stream("GET", download_url) as resp:
                async for chunk in resp.aiter_bytes(chunk_size=8192):
                    yield chunk

    return StreamingResponse(
        _stream(),
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{safe_title}.pdf"',
        },
    )
