from types import SimpleNamespace

import pytest
from fastapi import HTTPException

from app import main


class FakeQuery:
    def __init__(self, result):
        self.result = result

    def select(self, *_args, **_kwargs):
        return self

    def eq(self, *_args, **_kwargs):
        return self

    def order(self, *_args, **_kwargs):
        return self

    def limit(self, *_args, **_kwargs):
        return self

    def insert(self, *_args, **_kwargs):
        return self

    def execute(self):
        return SimpleNamespace(data=self.result)


class FakeSupabase:
    def __init__(self, responses):
        self.responses = responses

    def table(self, name):
        return FakeQuery(self.responses.get(name, []))


def test_ensure_research_stage_returns_existing_record(monkeypatch: pytest.MonkeyPatch) -> None:
    existing = [{"id": "research-1", "stage": "research", "content": "ready"}]
    monkeypatch.setattr(main, "get_sb", lambda: FakeSupabase({"content_version": existing}))

    result = main.ensure_research_stage("prd-1")

    assert result["id"] == "research-1"
    assert result["stage"] == "research"


def test_run_pipeline_rejects_bad_api_key(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(main, "AGENTS_KEY", "secret")

    with pytest.raises(HTTPException) as exc:
        main.run_pipeline(main.RunBody(prd_id="123e4567-e89b-12d3-a456-426614174000"), x_api_key="wrong")

    assert exc.value.status_code == 401
    assert exc.value.detail == "bad key"


def test_run_pipeline_returns_combined_result(monkeypatch: pytest.MonkeyPatch) -> None:
    prd_id = "123e4567-e89b-12d3-a456-426614174000"
    monkeypatch.setattr(main, "AGENTS_KEY", "secret")
    monkeypatch.setattr(main, "get_sb", lambda: FakeSupabase({"prd": [{"id": prd_id}]}))
    monkeypatch.setattr(main, "ensure_research_stage", lambda _prd_id: {"id": "research-1", "stage": "research"})
    monkeypatch.setattr(main, "run_writer_step", lambda _prd_id: {"draft_preview": "preview", "inserted": []})
    monkeypatch.setattr(main, "run_factcheck_step", lambda _prd_id: {"status": "PASS", "score": 8, "checks": [], "issues": []})

    result = main.run_pipeline(main.RunBody(prd_id=prd_id), x_api_key="secret")

    assert result["ok"] is True
    assert result["result"]["research"]["id"] == "research-1"
    assert result["result"]["draft"]["draft_preview"] == "preview"
    assert result["result"]["factcheck"]["status"] == "PASS"


def test_run_pipeline_returns_422_when_factcheck_fails(monkeypatch: pytest.MonkeyPatch) -> None:
    prd_id = "123e4567-e89b-12d3-a456-426614174000"
    monkeypatch.setattr(main, "AGENTS_KEY", "secret")
    monkeypatch.setattr(main, "get_sb", lambda: FakeSupabase({"prd": [{"id": prd_id}]}))
    monkeypatch.setattr(main, "ensure_research_stage", lambda _prd_id: {"id": "research-1", "stage": "research"})
    monkeypatch.setattr(main, "run_writer_step", lambda _prd_id: {"draft_preview": "preview", "inserted": []})
    monkeypatch.setattr(main, "run_factcheck_step", lambda _prd_id: {"status": "FAIL", "score": 3, "checks": [], "issues": ["weak evidence"]})

    with pytest.raises(HTTPException) as exc:
        main.run_pipeline(main.RunBody(prd_id=prd_id), x_api_key="secret")

    assert exc.value.status_code == 422
    assert exc.value.detail["factcheck"]["status"] == "FAIL"
