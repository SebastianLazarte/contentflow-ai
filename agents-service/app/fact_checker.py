"""Deterministic fact-checker agent that validates draft content."""

from __future__ import annotations

import re
from collections import Counter
from typing import Any, Dict, Iterable, List, Mapping, Optional, Sequence, Tuple

from supabase import Client

from app.supa import get_sb

PASS_SCORE_THRESHOLD: int = 7
MIN_KEYWORD_MATCHES: int = 2
MIN_RESEARCH_MATCHES: int = 2
VAGUE_TERMS = {"revolutionize", "unprecedented", "game-changing"}


def get_latest_version(sb: Client, prd_id: str, stage: str) -> Optional[Dict[str, Any]]:
    """Fetch the latest version for a PRD and stage if it exists."""
    response = (
        sb.table("content_version")
        .select("id,stage,content,created_at")
        .eq("prd_id", prd_id)
        .eq("stage", stage)
        .order("created_at", desc=True)
        .limit(1)
        .execute()
    )
    return response.data[0] if response.data else None


def _tokenize(text: str) -> List[str]:
    return re.findall(r"[a-zA-Z0-9]+", text.lower())


def extract_keywords(prd: Mapping[str, Any]) -> List[str]:
    """Derive keywords from PRD title and body."""
    title = (prd.get("title") or "").strip().lower()
    body = (prd.get("body") or "").strip().lower()
    tokens = _tokenize(" ".join([title, body]))
    counts = Counter(tokens)
    keywords = [word for word, freq in counts.items() if freq > 1 or len(word) > 5]
    return keywords[:12]


def _extract_bullets(research_content: str) -> List[str]:
    bullets: List[str] = []
    for line in research_content.splitlines():
        stripped = line.strip()
        if not stripped:
            continue
        stripped = re.sub(r"^[-*\u2022]+\s*", "", stripped)
        if stripped:
            bullets.append(stripped.lower())
    if not bullets:
        sentences = [
            segment.strip().lower()
            for segment in re.split(r"(?<=[.!?])\s+", research_content)
            if segment.strip()
        ]
        bullets = sentences[:6]
    return bullets


def _count_research_hits(draft: str, research_bullets: Sequence[str]) -> int:
    draft_lower = draft.lower()
    hits = 0
    for bullet in research_bullets:
        snippet = bullet[:80]
        if snippet and snippet in draft_lower:
            hits += 1
    return hits


def score_draft(
    prd: Mapping[str, Any],
    research_content: str,
    draft_content: str,
) -> Tuple[int, List[str], List[str]]:
    """Score the draft against simple heuristic checks."""
    issues: List[str] = []
    checks: List[str] = []
    score = 0

    research_bullets = _extract_bullets(research_content)
    research_hits = _count_research_hits(draft_content, research_bullets)
    if research_hits >= MIN_RESEARCH_MATCHES:
        checks.append(f"matched {research_hits} research bullets")
        score += min(research_hits, 5)
    else:
        issues.append("Draft cites too few research insights")

    keywords = extract_keywords(prd)
    keyword_hits = sum(1 for keyword in keywords if keyword in draft_content.lower())
    if keyword_hits >= MIN_KEYWORD_MATCHES:
        checks.append(f"found {keyword_hits} PRD keywords")
        score += min(keyword_hits, 4)
    else:
        issues.append("Draft needs more alignment with PRD terminology")

    if not research_bullets and any(term in draft_content.lower() for term in VAGUE_TERMS):
        issues.append("Vague claims detected without supporting research")
        score -= 2
    elif any(term in draft_content.lower() for term in VAGUE_TERMS):
        checks.append("Vague language supported by research context")
        score += 1

    return score, checks, issues


def insert_factchecked_version(sb: Client, prd_id: str, report: Mapping[str, Any]) -> List[Dict[str, Any]]:
    """Persist the fact-check report as a content_version entry."""
    response = (
        sb.table("content_version")
        .insert({"prd_id": prd_id, "stage": "fact_checked", "content": report})
        .execute()
    )
    return response.data or []


def run_factcheck_step(prd_id: str) -> Dict[str, Any]:
    """Execute fact-checking for the latest draft and return the report."""
    sb = get_sb()

    prd = (
        sb.table("prd")
        .select("id,title,body")
        .eq("id", prd_id)
        .limit(1)
        .execute()
    )
    if not prd.data:
        raise ValueError("prd_not_found")
    prd_record = prd.data[0]

    research = get_latest_version(sb, prd_id, "research")
    if not research:
        raise ValueError("missing_research")

    draft = get_latest_version(sb, prd_id, "draft")
    if not draft:
        raise ValueError("missing_draft")

    draft_content = draft.get("content") or ""
    research_content = research.get("content") or ""

    score, checks, issues = score_draft(prd_record, research_content, draft_content)
    status = "PASS" if score >= PASS_SCORE_THRESHOLD and not issues else "FAIL"

    report: Dict[str, Any] = {
        "status": status,
        "score": score,
        "checks": checks,
        "issues": issues,
    }

    inserted: List[Dict[str, Any]] = []
    if status == "PASS":
        inserted = insert_factchecked_version(sb, prd_id, report)
        report["inserted"] = inserted

    return report
