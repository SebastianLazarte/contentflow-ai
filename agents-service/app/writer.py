"""Utilities for composing deterministic draft content from PRD research."""

from __future__ import annotations

import re
from typing import Any, Dict, List, Mapping, Sequence

from supabase import Client

from app.supa import get_sb

MIN_KEY_POINTS: int = 3
MAX_KEY_POINTS: int = 6
PREVIEW_LENGTH: int = 240


def get_prd(sb: Client, prd_id: str) -> Dict[str, Any]:
    """Fetch a PRD record by ID or raise if missing."""
    response = (
        sb.table("prd")
        .select("id,title,body")
        .eq("id", prd_id)
        .limit(1)
        .execute()
    )
    if not response.data:
        raise ValueError("prd_not_found")
    return response.data[0]


def get_latest_research(sb: Client, prd_id: str) -> Dict[str, Any]:
    """Return the most recent research stage for a PRD."""
    response = (
        sb.table("content_version")
        .select("id,stage,content,created_at")
        .eq("prd_id", prd_id)
        .eq("stage", "research")
        .order("created_at", desc=True)
        .limit(1)
        .execute()
    )
    if not response.data:
        raise ValueError("missing_research")
    return response.data[0]


def _normalize_sentence(text: str, max_length: int) -> str:
    compact = " ".join(text.split())
    if not compact:
        return ""
    if len(compact) <= max_length:
        return compact
    shortened = compact[:max_length].rsplit(" ", 1)[0]
    return shortened or compact[:max_length]


def _extract_points(research_text: str) -> List[str]:
    points: List[str] = []
    for raw_line in research_text.splitlines():
        if len(points) >= MAX_KEY_POINTS:
            break
        stripped = raw_line.strip()
        if not stripped:
            continue
        stripped = re.sub(r"^[-*\u2022]+\s*", "", stripped)
        if stripped:
            points.append(stripped)
    if not points:
        sentences = [
            segment.strip()
            for segment in re.split(r"(?<=[.!?])\s+", research_text)
            if segment.strip()
        ]
        for sentence in sentences:
            if len(points) >= MAX_KEY_POINTS:
                break
            points.append(sentence)
    return points[:MAX_KEY_POINTS]


def _ensure_min_points(points: Sequence[str], fallback_source: str) -> List[str]:
    cleaned = [point for point in points if point]
    if len(cleaned) >= MIN_KEY_POINTS:
        return list(cleaned)
    fallback_sentences = [
        sentence.strip()
        for sentence in re.split(r"(?<=[.!?])\s+", fallback_source)
        if sentence.strip()
    ]
    for sentence in fallback_sentences:
        if len(cleaned) >= MIN_KEY_POINTS:
            break
        cleaned.append(sentence)
    while len(cleaned) < MIN_KEY_POINTS:
        cleaned.append("Further detail to be refined with the team.")
    return cleaned[:MAX_KEY_POINTS]


def build_draft(prd: Mapping[str, Any], research: Mapping[str, Any]) -> str:
    """Compose a deterministic blog draft from PRD data and research notes."""
    title = (prd.get("title") or "Untitled Concept").strip()
    body = prd.get("body") or ""
    research_text = research.get("content") or ""

    intro_body = _normalize_sentence(body, 320)
    intro = (
        f"{title} aims to deliver {intro_body}."
        if intro_body
        else f"{title} is a concept under exploration within ContentFlow AI."
    )

    points = _extract_points(research_text)
    points = _ensure_min_points(points, body or research_text)

    closing = (
        f"Interested in shaping the next iteration of {title}? "
        "Share feedback and help steer the roadmap."
    )

    lines = [title, "", intro, "", "Key Points:"]
    lines.extend([f"- {point}" for point in points])
    lines.extend(["", closing])
    return "\n".join(lines).strip()


def insert_draft_version(sb: Client, prd_id: str, content: str) -> List[Dict[str, Any]]:
    """Persist the draft content as a new content_version row."""
    response = (
        sb.table("content_version")
        .insert({"prd_id": prd_id, "stage": "draft", "content": content})
        .execute()
    )
    return response.data or []


def run_writer_step(prd_id: str) -> Dict[str, Any]:
    """Execute the writer agent for a PRD and return the inserted draft metadata."""
    sb = get_sb()
    prd = get_prd(sb, prd_id)
    research = get_latest_research(sb, prd_id)
    draft = build_draft(prd, research)
    inserted = insert_draft_version(sb, prd_id, draft)
    preview = draft[:PREVIEW_LENGTH]
    return {"draft_preview": preview, "inserted": inserted}
