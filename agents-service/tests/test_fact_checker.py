from app.fact_checker import extract_keywords, score_draft


def test_extract_keywords_prefers_repeated_and_long_terms() -> None:
    prd = {
        "title": "AI onboarding assistant",
        "body": "Onboarding assistant for onboarding docs and employee questions.",
    }

    keywords = extract_keywords(prd)

    assert "onboarding" in keywords
    assert "assistant" in keywords


def test_score_draft_passes_when_research_and_prd_align() -> None:
    prd = {
        "title": "AI onboarding copilot",
        "body": "Improves onboarding workflow and reduces repetitive employee questions. AI onboarding helps teams onboard faster.",
    }
    research = """
    - Improves onboarding workflow for new hires
    - Reduces repetitive employee questions with faster answers
    - Helps teams find docs quickly
    """
    draft = """
    AI onboarding copilot improves onboarding workflow for new hires and reduces repetitive employee questions with faster answers.
    This AI onboarding solution helps teams find docs quickly and onboard faster.
    """

    score, checks, issues = score_draft(prd, research, draft)

    assert score >= 7
    assert not issues
    assert any("matched" in check for check in checks)
    assert any("found" in check for check in checks)


def test_score_draft_flags_weak_alignment() -> None:
    prd = {
        "title": "AI onboarding copilot",
        "body": "Improves onboarding workflow and reduces repetitive employee questions.",
    }
    research = "- Helps teams find docs quickly"
    draft = "This game-changing platform transforms everything overnight."

    score, checks, issues = score_draft(prd, research, draft)

    assert score < 7
    assert "Draft cites too few research insights" in issues
    assert "Draft needs more alignment with PRD terminology" in issues
    assert checks == ["Vague language supported by research context"]
