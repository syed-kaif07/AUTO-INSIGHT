"""
ReportingAgent
==============
The final stage of the AutoInsight LangGraph pipeline.

Responsibilities:
1. Fetch EDA results and ML prediction results from Supabase for the given pipeline
2. Use Groq (llama-3.3-70b-versatile) to generate an AI Executive Summary and Recommendations
3. Compile a multi-page PDF report using ReportLab
4. Upload the PDF to Supabase Storage (bucket: 'reports')
5. Insert a row into the `reports` table with status = 'ready'
6. Log progress to agent_logs and update the pipelines row

Graceful fallbacks: if EDA or prediction data is missing, those sections are
omitted from the PDF rather than crashing the pipeline.
"""

from __future__ import annotations

import io
import json
import uuid
from datetime import datetime, timezone
from typing import Any

from groq import Groq
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    HRFlowable,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

from agents.base_agent import BaseAgent
from core.config import settings
from core.database import supabase
from pipelines.state import PipelineState

# ─── Colour Palette ──────────────────────────────────────────────────────────

BRAND_DARK = colors.HexColor("#0A0A0F")
BRAND_PRIMARY = colors.HexColor("#6C63FF")
BRAND_ACCENT = colors.HexColor("#A78BFA")
BRAND_SUCCESS = colors.HexColor("#10B981")
BRAND_WARNING = colors.HexColor("#F59E0B")
BRAND_DANGER = colors.HexColor("#EF4444")
GREY_LIGHT = colors.HexColor("#E5E7EB")
GREY_MID = colors.HexColor("#6B7280")
WHITE = colors.white
BLACK = colors.black


# ─── Style Helpers ───────────────────────────────────────────────────────────

def _build_styles() -> dict[str, ParagraphStyle]:
    base = getSampleStyleSheet()
    return {
        "cover_title": ParagraphStyle(
            "cover_title",
            parent=base["Title"],
            fontSize=32,
            textColor=WHITE,
            alignment=TA_CENTER,
            spaceAfter=6,
            fontName="Helvetica-Bold",
        ),
        "cover_subtitle": ParagraphStyle(
            "cover_subtitle",
            parent=base["Normal"],
            fontSize=13,
            textColor=colors.HexColor("#C4B5FD"),
            alignment=TA_CENTER,
            spaceAfter=4,
            fontName="Helvetica",
        ),
        "cover_meta": ParagraphStyle(
            "cover_meta",
            parent=base["Normal"],
            fontSize=10,
            textColor=GREY_MID,
            alignment=TA_CENTER,
            fontName="Helvetica",
        ),
        "section_heading": ParagraphStyle(
            "section_heading",
            parent=base["Heading1"],
            fontSize=16,
            textColor=BRAND_PRIMARY,
            fontName="Helvetica-Bold",
            spaceBefore=14,
            spaceAfter=4,
        ),
        "subsection_heading": ParagraphStyle(
            "subsection_heading",
            parent=base["Heading2"],
            fontSize=12,
            textColor=BRAND_ACCENT,
            fontName="Helvetica-Bold",
            spaceBefore=8,
            spaceAfter=2,
        ),
        "body": ParagraphStyle(
            "body",
            parent=base["Normal"],
            fontSize=10,
            textColor=colors.HexColor("#1F2937"),
            fontName="Helvetica",
            leading=15,
            spaceAfter=6,
        ),
        "bullet": ParagraphStyle(
            "bullet",
            parent=base["Normal"],
            fontSize=10,
            textColor=colors.HexColor("#1F2937"),
            fontName="Helvetica",
            leading=14,
            leftIndent=14,
            spaceAfter=3,
            bulletIndent=4,
        ),
        "caption": ParagraphStyle(
            "caption",
            parent=base["Normal"],
            fontSize=8,
            textColor=GREY_MID,
            fontName="Helvetica-Oblique",
            alignment=TA_CENTER,
            spaceAfter=6,
        ),
        "metric_value": ParagraphStyle(
            "metric_value",
            parent=base["Normal"],
            fontSize=22,
            textColor=BRAND_PRIMARY,
            fontName="Helvetica-Bold",
            alignment=TA_CENTER,
        ),
        "metric_label": ParagraphStyle(
            "metric_label",
            parent=base["Normal"],
            fontSize=9,
            textColor=GREY_MID,
            fontName="Helvetica",
            alignment=TA_CENTER,
        ),
    }


# ─── Table Style ─────────────────────────────────────────────────────────────

def _default_table_style(header_bg: Any = BRAND_PRIMARY) -> TableStyle:
    return TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), header_bg),
        ("TEXTCOLOR", (0, 0), (-1, 0), WHITE),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, 0), 10),
        ("ALIGN", (0, 0), (-1, -1), "LEFT"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
        ("FONTSIZE", (0, 1), (-1, -1), 9),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [WHITE, colors.HexColor("#F9FAFB")]),
        ("GRID", (0, 0), (-1, -1), 0.4, GREY_LIGHT),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ("ROWBACKGROUNDS", (0, 0), (-1, 0), [header_bg]),
    ])


# ─── Groq AI Helper ──────────────────────────────────────────────────────────

def _ask_groq(prompt: str, max_tokens: int = 400) -> str:
    """Call Groq and return the assistant reply, with a safe fallback."""
    try:
        client = Groq(api_key=settings.GROQ_API_KEY)
        response = client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a senior data scientist writing concise, professional "
                        "sections for a business analytics report. Use plain English. "
                        "Keep output under the requested token limit."
                    ),
                },
                {"role": "user", "content": prompt},
            ],
            max_tokens=max_tokens,
            temperature=0.4,
        )
        return response.choices[0].message.content.strip()
    except Exception as exc:
        return f"AI summary unavailable: {exc}"


# ─── Page Background Callback ─────────────────────────────────────────────────

def _on_page(canvas: Any, doc: Any) -> None:
    """Draw branding elements on every page except the cover (page 1)."""
    canvas.saveState()
    w, h = A4

    if doc.page == 1:
        # Full dark cover background
        canvas.setFillColor(BRAND_DARK)
        canvas.rect(0, 0, w, h, fill=1, stroke=0)
        # Purple accent bar at bottom
        canvas.setFillColor(BRAND_PRIMARY)
        canvas.rect(0, 0, w, 6, fill=1, stroke=0)
    else:
        # Subtle top bar
        canvas.setFillColor(BRAND_PRIMARY)
        canvas.rect(0, h - 4, w, 4, fill=1, stroke=0)
        # Footer rule + page number
        canvas.setStrokeColor(GREY_LIGHT)
        canvas.setLineWidth(0.5)
        canvas.line(20 * mm, 14 * mm, w - 20 * mm, 14 * mm)
        canvas.setFillColor(GREY_MID)
        canvas.setFont("Helvetica", 8)
        canvas.drawString(20 * mm, 10 * mm, "AutoInsight · Confidential")
        canvas.drawRightString(w - 20 * mm, 10 * mm, f"Page {doc.page}")

    canvas.restoreState()


# ─── Section Builders ─────────────────────────────────────────────────────────

def _build_cover(styles: dict, title: str, dataset_name: str, generated_at: str) -> list:
    """Cover page elements (rendered on the dark background set by _on_page)."""
    elems: list = [Spacer(1, 60 * mm)]

    # AutoInsight badge text
    elems.append(Paragraph("⬡ AUTOINSIGHT ANALYTICS", styles["cover_subtitle"]))
    elems.append(Spacer(1, 8 * mm))

    elems.append(Paragraph(title, styles["cover_title"]))
    elems.append(Spacer(1, 6 * mm))

    elems.append(Paragraph(f"Dataset: {dataset_name}", styles["cover_subtitle"]))
    elems.append(Spacer(1, 4 * mm))
    elems.append(Paragraph(f"Generated: {generated_at}", styles["cover_meta"]))
    elems.append(Spacer(1, 4 * mm))
    elems.append(Paragraph("Powered by LangGraph · Groq · ReportLab", styles["cover_meta"]))
    elems.append(PageBreak())
    return elems


def _build_toc(styles: dict, sections: list[str]) -> list:
    """Simple Table of Contents."""
    elems: list = []
    elems.append(Paragraph("Table of Contents", styles["section_heading"]))
    elems.append(HRFlowable(width="100%", thickness=0.5, color=BRAND_PRIMARY, spaceAfter=6))
    for i, sec in enumerate(sections, start=1):
        elems.append(Paragraph(f"{i}.  {sec}", styles["body"]))
    elems.append(PageBreak())
    return elems


def _build_executive_summary(styles: dict, context: str) -> list:
    """AI-generated executive summary section."""
    elems: list = []
    elems.append(Paragraph("Executive Summary", styles["section_heading"]))
    elems.append(HRFlowable(width="100%", thickness=0.5, color=BRAND_PRIMARY, spaceAfter=6))

    prompt = (
        f"Write a 3–4 sentence executive summary for a data analytics report. "
        f"Context about the analysis: {context}. "
        f"Be concise, professional, and highlight the most important finding."
    )
    summary = _ask_groq(prompt, max_tokens=250)
    elems.append(Paragraph(summary, styles["body"]))
    elems.append(Spacer(1, 4 * mm))
    return elems


def _build_data_overview(styles: dict, dataset_info: dict) -> list:
    """Dataset overview: row count, column count, and schema table."""
    elems: list = []
    elems.append(Paragraph("Data Overview", styles["section_heading"]))
    elems.append(HRFlowable(width="100%", thickness=0.5, color=BRAND_PRIMARY, spaceAfter=6))

    # Key metric boxes as a mini-table
    rows_count = dataset_info.get("rows_count", "N/A")
    cols_count = dataset_info.get("columns_count", "N/A")
    file_type = dataset_info.get("file_type", "N/A").upper()
    file_size_mb = round(dataset_info.get("file_size", 0) / (1024 * 1024), 2)

    metrics = [
        ["Rows", "Columns", "File Type", "File Size"],
        [
            str(rows_count),
            str(cols_count),
            file_type,
            f"{file_size_mb} MB" if file_size_mb > 0 else "N/A",
        ],
    ]
    t = Table(metrics, colWidths=[40 * mm, 40 * mm, 40 * mm, 40 * mm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), BRAND_PRIMARY),
        ("TEXTCOLOR", (0, 0), (-1, 0), WHITE),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTNAME", (0, 1), (-1, 1), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, 0), 9),
        ("FONTSIZE", (0, 1), (-1, 1), 18),
        ("TEXTCOLOR", (0, 1), (-1, 1), BRAND_PRIMARY),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ("GRID", (0, 0), (-1, -1), 0.4, GREY_LIGHT),
    ]))
    elems.append(t)
    elems.append(Spacer(1, 5 * mm))

    # Column schema table (if available)
    columns_info = dataset_info.get("columns_info")
    if columns_info:
        if isinstance(columns_info, str):
            try:
                columns_info = json.loads(columns_info)
            except Exception:
                columns_info = None

    if columns_info and isinstance(columns_info, list):
        elems.append(Paragraph("Column Schema", styles["subsection_heading"]))
        header = ["Column Name", "Data Type", "Non-Null Count", "Unique Values"]
        rows = [header]
        for col in columns_info[:30]:  # cap at 30 columns
            rows.append([
                str(col.get("name", "")),
                str(col.get("dtype", "")),
                str(col.get("non_null_count", "N/A")),
                str(col.get("unique_count", "N/A")),
            ])
        col_widths = [55 * mm, 35 * mm, 40 * mm, 35 * mm]
        t2 = Table(rows, colWidths=col_widths)
        t2.setStyle(_default_table_style())
        elems.append(t2)

    elems.append(Spacer(1, 4 * mm))
    return elems


def _build_statistical_summary(styles: dict, summary_stats: dict | None) -> list:
    """Statistical summary table from EDA results."""
    elems: list = []
    elems.append(Paragraph("Statistical Analysis", styles["section_heading"]))
    elems.append(HRFlowable(width="100%", thickness=0.5, color=BRAND_PRIMARY, spaceAfter=6))

    if not summary_stats:
        elems.append(Paragraph(
            "Statistical analysis data not available for this pipeline.",
            styles["body"],
        ))
        return elems

    # summary_stats expected format: {column: {mean, std, min, max, median, ...}, ...}
    header = ["Column", "Mean", "Std Dev", "Min", "Median", "Max"]
    rows = [header]
    for col, stats in list(summary_stats.items())[:20]:
        rows.append([
            str(col),
            _fmt(stats.get("mean")),
            _fmt(stats.get("std")),
            _fmt(stats.get("min")),
            _fmt(stats.get("50%") or stats.get("median")),
            _fmt(stats.get("max")),
        ])

    col_widths = [45 * mm, 28 * mm, 28 * mm, 28 * mm, 28 * mm, 28 * mm]
    t = Table(rows, colWidths=col_widths)
    t.setStyle(_default_table_style())
    elems.append(t)
    elems.append(Spacer(1, 4 * mm))
    return elems


def _build_missing_values(styles: dict, missing_values: dict | None) -> list:
    """Missing values table from EDA results."""
    elems: list = []
    elems.append(Paragraph("Missing Values Analysis", styles["section_heading"]))
    elems.append(HRFlowable(width="100%", thickness=0.5, color=BRAND_PRIMARY, spaceAfter=6))

    if not missing_values:
        elems.append(Paragraph(
            "No missing value data available for this pipeline.",
            styles["body"],
        ))
        return elems

    # Filter to columns that actually have missing values
    has_missing = {k: v for k, v in missing_values.items() if isinstance(v, (int, float)) and v > 0}
    if not has_missing:
        elems.append(Paragraph(
            "✓ No missing values detected in the cleaned dataset.",
            styles["body"],
        ))
        return elems

    header = ["Column", "Missing Count", "Missing %"]
    rows = [header]
    total = sum(has_missing.values())
    for col, count in sorted(has_missing.items(), key=lambda x: -x[1])[:25]:
        pct = f"{(count / total * 100):.1f}%" if total > 0 else "N/A"
        rows.append([str(col), str(int(count)), pct])

    col_widths = [80 * mm, 45 * mm, 45 * mm]
    t = Table(rows, colWidths=col_widths)
    t.setStyle(_default_table_style(header_bg=BRAND_WARNING))
    elems.append(t)
    elems.append(Spacer(1, 4 * mm))
    return elems


def _build_correlations(styles: dict, correlation_matrix: dict | None) -> list:
    """Top correlations narrative from EDA results."""
    elems: list = []
    elems.append(Paragraph("Correlation Analysis", styles["section_heading"]))
    elems.append(HRFlowable(width="100%", thickness=0.5, color=BRAND_PRIMARY, spaceAfter=6))

    if not correlation_matrix:
        elems.append(Paragraph(
            "Correlation data not available for this pipeline.",
            styles["body"],
        ))
        return elems

    # Extract top positive and negative correlations (exclude self-correlations)
    pairs: list[tuple[str, str, float]] = []
    for col_a, row in correlation_matrix.items():
        if not isinstance(row, dict):
            continue
        for col_b, val in row.items():
            if col_a >= col_b:
                continue
            try:
                pairs.append((col_a, col_b, float(val)))
            except (TypeError, ValueError):
                pass

    if not pairs:
        elems.append(Paragraph("No correlation pairs could be computed.", styles["body"]))
        return elems

    pairs.sort(key=lambda x: abs(x[2]), reverse=True)
    top = pairs[:15]

    header = ["Feature A", "Feature B", "Correlation (r)", "Strength"]
    rows = [header]
    for col_a, col_b, r in top:
        if abs(r) >= 0.7:
            strength = "Strong"
        elif abs(r) >= 0.4:
            strength = "Moderate"
        else:
            strength = "Weak"
        rows.append([col_a, col_b, f"{r:.4f}", strength])

    col_widths = [48 * mm, 48 * mm, 38 * mm, 30 * mm]
    t = Table(rows, colWidths=col_widths)
    t.setStyle(_default_table_style())
    elems.append(t)
    elems.append(Spacer(1, 4 * mm))
    return elems


def _build_ml_results(styles: dict, model_results: dict | None) -> list:
    """ML model metrics and feature importance from prediction results."""
    elems: list = []
    elems.append(Paragraph("Machine Learning Results", styles["section_heading"]))
    elems.append(HRFlowable(width="100%", thickness=0.5, color=BRAND_PRIMARY, spaceAfter=6))

    if not model_results:
        elems.append(Paragraph(
            "ML prediction results not available for this pipeline.",
            styles["body"],
        ))
        return elems

    model_name = model_results.get("model_name", "Unknown")
    target_col = model_results.get("target_column", "Unknown")
    r2 = model_results.get("r2_score")
    mae = model_results.get("mae")
    rmse = model_results.get("rmse")
    cv = model_results.get("cross_val_score")

    elems.append(Paragraph(
        f"Best Model: <b>{model_name}</b>  ·  Target: <b>{target_col}</b>",
        styles["body"],
    ))
    elems.append(Spacer(1, 3 * mm))

    # Metrics summary table
    metrics_data = [
        ["Metric", "Value", "Interpretation"],
        ["R² Score", _fmt(r2), _interpret_r2(r2)],
        ["MAE", _fmt(mae), "Mean absolute prediction error"],
        ["RMSE", _fmt(rmse), "Root mean squared error"],
        ["Cross-Val Score", _fmt(cv), "Average score across k-folds"],
    ]
    col_widths = [55 * mm, 40 * mm, 75 * mm]
    t = Table(metrics_data, colWidths=col_widths)
    t.setStyle(_default_table_style(header_bg=BRAND_SUCCESS))
    elems.append(t)
    elems.append(Spacer(1, 5 * mm))

    # All models comparison (if present)
    all_models = model_results.get("all_models_comparison")
    if all_models and isinstance(all_models, dict):
        elems.append(Paragraph("Model Comparison", styles["subsection_heading"]))
        header = ["Model", "R²", "MAE", "RMSE"]
        rows = [header]
        for mn, mvals in all_models.items():
            if isinstance(mvals, dict):
                rows.append([
                    mn,
                    _fmt(mvals.get("r2_score")),
                    _fmt(mvals.get("mae")),
                    _fmt(mvals.get("rmse")),
                ])
        col_widths2 = [60 * mm, 35 * mm, 35 * mm, 35 * mm]
        t2 = Table(rows, colWidths=col_widths2)
        t2.setStyle(_default_table_style())
        elems.append(t2)
        elems.append(Spacer(1, 4 * mm))

    # Feature importance (top 15)
    feat_imp = model_results.get("feature_importance")
    if feat_imp and isinstance(feat_imp, dict):
        elems.append(Paragraph("Top Feature Importances", styles["subsection_heading"]))
        sorted_feats = sorted(feat_imp.items(), key=lambda x: x[1], reverse=True)[:15]
        header = ["Feature", "Importance Score"]
        rows = [header] + [[f, _fmt(v)] for f, v in sorted_feats]
        col_widths3 = [110 * mm, 55 * mm]
        t3 = Table(rows, colWidths=col_widths3)
        t3.setStyle(_default_table_style())
        elems.append(t3)

    elems.append(Spacer(1, 4 * mm))
    return elems


def _build_recommendations(styles: dict, context: str) -> list:
    """AI-generated recommendations section."""
    elems: list = []
    elems.append(Paragraph("Recommendations", styles["section_heading"]))
    elems.append(HRFlowable(width="100%", thickness=0.5, color=BRAND_PRIMARY, spaceAfter=6))

    prompt = (
        f"Based on the following data analysis context, provide 4–6 concise, actionable "
        f"business recommendations as a numbered list. Context: {context}. "
        f"Start each recommendation directly, no preamble."
    )
    recs_text = _ask_groq(prompt, max_tokens=350)

    for line in recs_text.split("\n"):
        line = line.strip()
        if line:
            elems.append(Paragraph(f"• {line}", styles["bullet"]))

    elems.append(Spacer(1, 4 * mm))
    return elems


def _build_footer_page(styles: dict, generated_at: str) -> list:
    """Closing page."""
    elems: list = [Spacer(1, 60 * mm)]
    elems.append(HRFlowable(width="100%", thickness=1, color=BRAND_PRIMARY, spaceAfter=10))
    elems.append(Paragraph(
        "Report generated by <b>AutoInsight</b> — Autonomous Multi-Agent Analytics Platform",
        ParagraphStyle("footer_hero", parent=styles["body"], alignment=TA_CENTER, fontSize=11),
    ))
    elems.append(Paragraph(
        f"Generated at {generated_at} · All analysis performed automatically by AI agents",
        ParagraphStyle("footer_sub", parent=styles["caption"], alignment=TA_CENTER),
    ))
    return elems


# ─── Utility Formatters ───────────────────────────────────────────────────────

def _fmt(val: Any) -> str:
    if val is None:
        return "N/A"
    try:
        f = float(val)
        if abs(f) >= 1_000_000:
            return f"{f:,.0f}"
        if abs(f) >= 100:
            return f"{f:,.2f}"
        return f"{f:.4f}"
    except (TypeError, ValueError):
        return str(val)


def _interpret_r2(r2: Any) -> str:
    try:
        v = float(r2)
        if v >= 0.9:
            return "Excellent fit"
        if v >= 0.75:
            return "Good fit"
        if v >= 0.5:
            return "Moderate fit"
        return "Weak fit — consider feature engineering"
    except (TypeError, ValueError):
        return "N/A"


# ─── Main Agent ───────────────────────────────────────────────────────────────

class ReportingAgent(BaseAgent):
    """
    LangGraph-compatible agent that compiles a PDF report from pipeline outputs.

    Call via `ReportingAgent().run(state)` or register as a graph node.
    Also callable standalone via `ReportingAgent().generate(pipeline_id, user_id, dataset_id)`.
    """

    agent_name = "reporting"

    # ── LangGraph entry point ────────────────────────────────────────────────

    def run(self, state: PipelineState) -> PipelineState:
        pipeline_id = state.get("pipeline_id", "")
        user_id = state.get("user_id", "")
        dataset_id = state.get("dataset_id", "")

        self._log(pipeline_id, "running", "Reporting agent started")
        self._update_pipeline_stage(pipeline_id, "reporting", 80)

        try:
            report_url = self._execute(pipeline_id, user_id, dataset_id)
            state["report_url"] = report_url
            state["current_stage"] = "complete"
            self._update_pipeline_stage(pipeline_id, "reporting", 100, status="completed")
            self._log(pipeline_id, "completed", f"Report generated: {report_url}")
        except Exception as exc:
            err = f"Reporting agent error: {exc}"
            state.setdefault("errors", []).append(err)  # type: ignore[union-attr]
            self._log(pipeline_id, "error", err)
            self._update_pipeline_stage(pipeline_id, "reporting", 80, status="error", error_message=err)

        return state

    # ── Standalone (called directly from the API route) ─────────────────────

    def generate(self, pipeline_id: str, user_id: str, dataset_id: str) -> str:
        """
        Generate a PDF report for a completed pipeline and return the report row ID.
        Intended to be called directly from the /generate API endpoint.
        """
        self._log(pipeline_id, "running", "Report generation requested via API")
        self._update_pipeline_stage(pipeline_id, "reporting", 80)
        report_row_id = self._execute(pipeline_id, user_id, dataset_id)
        self._update_pipeline_stage(pipeline_id, "reporting", 100, status="completed")
        self._log(pipeline_id, "completed", "Report ready")
        return report_row_id

    # ── Core Logic ───────────────────────────────────────────────────────────

    def _execute(self, pipeline_id: str, user_id: str, dataset_id: str) -> str:
        """
        Orchestrate the full report build. Returns the Supabase report row ID.
        """
        generated_at = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")

        # 1. Fetch all necessary data from Supabase (graceful fallbacks on missing)
        dataset_info = self._fetch_dataset(dataset_id)
        eda_results = self._fetch_eda(pipeline_id)
        model_results = self._fetch_predictions(pipeline_id)

        dataset_name = dataset_info.get("name", dataset_info.get("original_filename", "Unknown Dataset"))
        report_title = f"AutoInsight Report — {dataset_name}"

        # 2. Build Groq context string
        context_parts = [f"Dataset: {dataset_name}"]
        if eda_results:
            n_stats = len(eda_results.get("summary_stats") or {})
            context_parts.append(f"EDA completed on {n_stats} numeric columns")
            ai_insights = eda_results.get("ai_insights")
            if ai_insights:
                context_parts.append(f"AI Insights: {ai_insights[:300]}")
        if model_results:
            context_parts.append(
                f"Best ML model: {model_results.get('model_name', 'N/A')}, "
                f"R²={_fmt(model_results.get('r2_score'))}, "
                f"RMSE={_fmt(model_results.get('rmse'))}, "
                f"target column: {model_results.get('target_column', 'N/A')}"
            )
        groq_context = ". ".join(context_parts)

        # 3. Determine which sections to include
        sections = ["Executive Summary", "Data Overview"]
        if eda_results and eda_results.get("summary_stats"):
            sections.append("Statistical Analysis")
        if eda_results and eda_results.get("missing_values"):
            sections.append("Missing Values Analysis")
        if eda_results and eda_results.get("correlation_matrix"):
            sections.append("Correlation Analysis")
        if model_results:
            sections.append("Machine Learning Results")
        sections.append("Recommendations")

        # 4. Build PDF in memory
        pdf_buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            pdf_buffer,
            pagesize=A4,
            leftMargin=20 * mm,
            rightMargin=20 * mm,
            topMargin=20 * mm,
            bottomMargin=20 * mm,
            title=report_title,
            author="AutoInsight",
        )

        styles = _build_styles()
        story: list = []

        # Cover
        story.extend(_build_cover(styles, report_title, dataset_name, generated_at))

        # TOC
        story.extend(_build_toc(styles, sections))

        # Sections
        story.extend(_build_executive_summary(styles, groq_context))
        story.extend(_build_data_overview(styles, dataset_info))

        if eda_results and eda_results.get("summary_stats"):
            story.extend(_build_statistical_summary(styles, eda_results["summary_stats"]))

        if eda_results and eda_results.get("missing_values"):
            story.extend(_build_missing_values(styles, eda_results["missing_values"]))

        if eda_results and eda_results.get("correlation_matrix"):
            story.extend(_build_correlations(styles, eda_results["correlation_matrix"]))

        if model_results:
            story.extend(_build_ml_results(styles, model_results))

        story.extend(_build_recommendations(styles, groq_context))
        story.extend(_build_footer_page(styles, generated_at))

        doc.build(story, onFirstPage=_on_page, onLaterPages=_on_page)

        # 5. Upload to Supabase Storage
        pdf_bytes = pdf_buffer.getvalue()
        storage_path = f"reports/{pipeline_id}/{uuid.uuid4()}.pdf"

        supabase.storage.from_("reports").upload(
            path=storage_path,
            file=pdf_bytes,
            file_options={"content-type": "application/pdf"},
        )

        # 6. Insert report row
        report_row_id = str(uuid.uuid4())
        supabase.table("reports").insert({
            "id": report_row_id,
            "pipeline_id": pipeline_id,
            "user_id": user_id,
            "dataset_id": dataset_id,
            "title": report_title,
            "storage_path": storage_path,
            "file_size": len(pdf_bytes),
            "status": "ready",
        }).execute()

        return report_row_id

    # ── Supabase Fetchers ────────────────────────────────────────────────────

    def _fetch_dataset(self, dataset_id: str) -> dict:
        try:
            res = supabase.table("datasets").select("*").eq("id", dataset_id).single().execute()
            return res.data or {}
        except Exception:
            return {}

    def _fetch_eda(self, pipeline_id: str) -> dict | None:
        try:
            res = (
                supabase.table("analysis_results")
                .select("summary_stats,missing_values,correlation_matrix,ai_insights")
                .eq("pipeline_id", pipeline_id)
                .single()
                .execute()
            )
            return res.data or None
        except Exception:
            return None

    def _fetch_predictions(self, pipeline_id: str) -> dict | None:
        try:
            res = (
                supabase.table("predictions")
                .select(
                    "model_name,target_column,r2_score,mae,rmse,"
                    "cross_val_score,feature_importance,all_models_comparison"
                )
                .eq("pipeline_id", pipeline_id)
                .single()
                .execute()
            )
            return res.data or None
        except Exception:
            return None
