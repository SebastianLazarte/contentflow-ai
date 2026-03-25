# ContentFlow AI

ContentFlow AI is a small content operations product that turns a PRD into research notes, draft content, fact-check feedback, and a polished post with traceability across the pipeline.

This repository now uses a lightweight SDLC with docs in the repo as the source of truth. Start in [docs/vision.md](docs/vision.md), then use [docs/roadmap.md](docs/roadmap.md) and [docs/quality-gates.md](docs/quality-gates.md) before shipping changes.

## Architecture

- `src/`: Next.js app for creating PRDs, listing them, viewing versions, and triggering runs.
- `agents-service/`: FastAPI service that orchestrates `research -> writer -> fact_check -> polisher`.
- `supabase/`: schema, local config, seed data, and SQL migrations.
- `docs/`: product intent, operating rules, ADRs, PRDs, roadmap, and release notes.

## Current Runtime Model

### Main entities

- `prd`: product requirement documents created from the web app.
- `content_version`: generated artifacts for pipeline stages `research`, `draft`, and `fact_checked`.
- `agent_logs`: execution logs for researcher, writer, fact checker, and polisher.
- `posts`: final polished content created by the polisher.

### Main routes

- `GET /api/prd`: list PRDs.
- `POST /api/prd`: create a PRD with `title` and `body`.
- `GET /api/prd/[id]/versions`: list versions for a PRD.
- `POST /api/run`: accept `{ "prdId": "<uuid>" }`; calls the agents service when configured, otherwise returns a local mock response.
- `GET /health` on the FastAPI service: basic health check.
- `POST /run` on the FastAPI service: accept `{ "prd_id": "<uuid>" }` plus `x-api-key`.

### Pipeline behavior

1. Researcher reads the PRD, optionally calls SerpAPI, stores a `research` version, and logs the run.
2. Writer reads the latest `research`, creates a `draft` version, and logs the run.
3. Fact checker evaluates the draft against PRD and research. It stores `fact_checked` only on `PASS`.
4. Polisher rewrites the approved draft, stores the final post in `posts`, and logs the run.

## Local Development

### 1. Frontend

```bash
npm install
npm run dev
```

The Next.js app runs on `http://localhost:3000`.

### 2. Agents service

Create or update `agents-service/.env`, then run:

```bash
cd agents-service
python -m pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

The FastAPI service usually runs on `http://localhost:8000`.

### 3. Supabase local stack

If you are using the Supabase CLI locally:

```bash
supabase start
supabase db reset
```

The local config lives in `supabase/config.toml` and the schema history lives in `supabase/migrations/`.

## Environment Variables

### Root app (`.env`)

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL for the Next.js app.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: public anon key used by the app server helpers.
- `SUPABASE_SERVICE_ROLE`: service role key for privileged inserts and updates.
- `NEXT_PUBLIC_BASE_URL`: optional absolute base URL used by server-side fetches; defaults to `http://localhost:3000`.
- `AGENTS_URL`: optional URL of the FastAPI service.
- `AGENTS_KEY`: shared API key used by `/api/run` when it calls the agents service.

### Agents service (`agents-service/.env`)

- `SUPABASE_URL`: Supabase project URL used by the Python service.
- `SUPABASE_SERVICE_ROLE`: service role key for writing versions, logs, and posts.
- `AGENTS_KEY`: required API key for `POST /run`.
- `MAX_FACTCHECK_RETRIES`: optional retry count before the pipeline fails; defaults to `2`.
- `OPENAI_API_KEY`: required for non-fallback writer, fact checker, and polisher behavior.
- `OPENAI_WRITER_MODEL`: optional; defaults to `gpt-4o-mini`.
- `OPENAI_FACTCHECK_MODEL`: optional; defaults to `gpt-4o-mini`.
- `OPENAI_POLISHER_MODEL`: optional; defaults to `gpt-4o-mini`.
- `SERPAPI_API_KEY`: optional; when missing, research falls back to PRD-only synthesis.

## Validation Commands

Run these before closing a task:

```bash
npm run lint
npm run check:migrations
npm run test:agents
```

## Working Model

- Every meaningful change starts in [docs/roadmap.md](docs/roadmap.md).
- Medium or large work also gets a short PRD in `docs/prds/`.
- Repeated technical decisions go into `docs/decisions/`.
- Weekly close-out updates [docs/releases.md](docs/releases.md).

## Reference Docs

- [docs/vision.md](docs/vision.md)
- [docs/product-scope.md](docs/product-scope.md)
- [docs/roadmap.md](docs/roadmap.md)
- [docs/quality-gates.md](docs/quality-gates.md)
- [docs/decisions/ADR-001-solo-first-documentation.md](docs/decisions/ADR-001-solo-first-documentation.md)
- [docs/prds/TEMPLATE.md](docs/prds/TEMPLATE.md)
