"""Unit tests for the deterministic writer utilities."""

from __future__ import annotations

from typing import Dict

from app.writer import build_draft


def _make_prd(title: str, body: str) -> Dict[str, str]:
    return {"id": "dummy-prd", "title": title, "body": body}


def _make_research(content: str) -> Dict[str, str]:
    return {"id": "dummy-research", "content": content, "stage": "research"}


def test_build_draft_basic_includes_title_points_and_closing() -> None:
    prd = _make_prd("Solar Launch", "Compact launch overview.")
    research = _make_research("- Panel efficiency\n- Storage upgrade\n- Market timing")

    draft = build_draft(prd, research)
    lines = draft.splitlines()

    assert lines[0] == prd["title"]
    assert "Key Points:" in lines
    bullet_lines = [line for line in lines if line.startswith("- ")]
    assert len(bullet_lines) >= 3
    assert lines[-1].startswith("Interested in shaping the next iteration of Solar Launch?")


def test_build_draft_handles_empty_research_with_fallback_points() -> None:
    body = "First insight. Second detail with context. Third angle for consideration."
    prd = _make_prd("Fallback Test", body)
    research = _make_research("")

    draft = build_draft(prd, research)
    lines = draft.splitlines()

    bullet_lines = [line for line in lines if line.startswith("- ")]
    assert len(bullet_lines) >= 3
    assert "Key Points:" in lines
    assert lines[-1].startswith("Interested in shaping the next iteration of Fallback Test?")


def test_build_draft_truncates_long_body_in_intro() -> None:
    long_body = " ".join(["This detail explains the roadmap"] * 40)
    prd = _make_prd("Long Body Project", long_body)
    research = _make_research("- Hardware readiness\n- Supply chain checks\n- Pilot schedule")

    draft = build_draft(prd, research)
    lines = draft.splitlines()

    intro_line = lines[2]
    prefix = f"{prd['title']} aims to deliver "
    assert intro_line.startswith(prefix)
    intro_body = intro_line[len(prefix) :].rstrip(".")
    assert len(intro_body) <= 320
    bullet_lines = [line for line in lines if line.startswith("- ")]
    assert len(bullet_lines) >= 3
