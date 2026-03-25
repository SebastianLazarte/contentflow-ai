from app.writer import _ensure_min_points, _extract_points, build_draft


def test_extract_points_reads_bullets_in_order() -> None:
    research = """
    - First finding
    - Second finding
    - Third finding
    """

    points = _extract_points(research)

    assert points[:3] == ["First finding", "Second finding", "Third finding"]


def test_ensure_min_points_pads_when_research_is_short() -> None:
    points = _ensure_min_points(["Only one point"], "Sentence one. Sentence two.")

    assert len(points) >= 3
    assert "Only one point" in points


def test_build_draft_includes_title_intro_and_key_points() -> None:
    prd = {
        "title": "AI onboarding copilot",
        "body": "helping new hires understand tools, docs, and next steps quickly.",
    }
    research = {
        "content": "- Faster ramp time\n- Fewer repeated onboarding questions\n- Better doc discoverability"
    }

    draft = build_draft(prd, research)

    assert "AI onboarding copilot" in draft
    assert "Key Points:" in draft
    assert "Faster ramp time" in draft
    assert "Share feedback and help steer the roadmap." in draft
