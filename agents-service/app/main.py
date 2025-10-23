"""FastAPI entrypoint for orchestrating ContentFlow AI agents."""

from __future__ import annotations

import os
from typing import Any, Dict
from uuid import UUID, uuid4

from dotenv import load_dotenv
from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel, field_validator

from app.fact_checker import run_factcheck_step
from app.supa import get_sb
from app.writer import run_writer_step

load_dotenv()

AGENTS_KEY = os.getenv("AGENTS_KEY", "")

app = FastAPI()


class RunBody(BaseModel):
    """Request body for running the agent pipeline."""

    prd_id: str

    @field_validator("prd_id")
    @classmethod
    def validate_uuid(cls, value: str) -> str:
        try:
            UUID(value)
        except Exception as exc:  # noqa: BLE001 - wrap validation error
            raise ValueError("prd_id must be a valid UUID") from exc
        return value


@app.get("/health")
def health() -> Dict[str, bool]:
    """Simple health endpoint."""
    return {"ok": True}


def ensure_research_stage(prd_id: str) -> Dict[str, Any]:
    """Make sure a research stage exists for the PRD, insert a stub if missing."""
    sb = get_sb()
    existing = (
        sb.table("content_version")
        .select("id,stage,content,created_at")
        .eq("prd_id", prd_id)
        .eq("stage", "research")
        .order("created_at", desc=True)
        .limit(1)
        .execute()
    )
    if existing.data:
        return existing.data[0]

    research_text = (
        "Research notes (stub):\n"
        "- Goal clarified\n"
        "- Three differentiators documented\n"
        "- Success metrics outlined\n"
        "(Replace with LangGraph-powered research stage)."
    )
    inserted = (
        sb.table("content_version")
        .insert({"prd_id": prd_id, "stage": "research", "content": research_text})
        .execute()
    )
    if not inserted.data:
        raise RuntimeError("Failed to insert research stage stub")
    return inserted.data[0]


@app.post("/run")
def run_pipeline(body: RunBody, x_api_key: str = Header(default="")) -> Dict[str, Any]:
    """Run the orchestrated pipeline for a PRD."""
    if not AGENTS_KEY or x_api_key != AGENTS_KEY:
        raise HTTPException(status_code=401, detail="bad key")

    sb = get_sb()
    prd = (
        sb.table("prd")
        .select("id")
        .eq("id", body.prd_id)
        .limit(1)
        .execute()
    )
    if not prd.data:
        raise HTTPException(status_code=404, detail="prd_not_found")

    research_record = ensure_research_stage(body.prd_id)

    try:
        writer_result = run_writer_step(body.prd_id)
    except ValueError as exc:
        message = str(exc)
        if message == "prd_not_found":
            raise HTTPException(status_code=404, detail="prd_not_found") from exc
        if message == "missing_research":
            raise HTTPException(status_code=409, detail="missing_research") from exc
        raise HTTPException(status_code=400, detail=message) from exc

    try:
        factcheck_report = run_factcheck_step(body.prd_id)
    except ValueError as exc:
        message = str(exc)
        if message in {"missing_research", "missing_draft"}:
            raise HTTPException(status_code=409, detail=message) from exc
        if message == "prd_not_found":
            raise HTTPException(status_code=404, detail="prd_not_found") from exc
        raise HTTPException(status_code=400, detail=message) from exc

    if factcheck_report.get("status") == "FAIL":
        raise HTTPException(status_code=422, detail={"factcheck": factcheck_report})

    run_id = f"research+draft+fact-{uuid4()}"
    return {
        "ok": True,
        "run_id": run_id,
        "result": {
            "research": research_record,
            "draft": writer_result,
            "factcheck": factcheck_report,
        },
    }
