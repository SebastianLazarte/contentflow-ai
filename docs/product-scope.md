# Product Scope

## Current product surface

### Web app

- Create PRDs.
- List PRDs.
- View version history for a PRD.
- Trigger a content generation run from the app.

### Agent pipeline

- `researcher`: creates a research summary from the PRD and optional external search.
- `writer`: converts PRD + research into a draft.
- `fact_checker`: validates the draft against PRD and research, and can force retries.
- `polisher`: turns an approved draft into a final post.

### Data model

- `prd`: source product intent.
- `content_version`: stored pipeline artifacts.
- `agent_logs`: execution trace for debugging and auditability.
- `posts`: final polished output.

## Contracts to preserve

### PRD contract

- A `prd` row represents the source document for a content generation flow.
- Minimum required fields today: `title`, `body`.
- The PRD is the canonical input for pipeline generation.

### Version contract

- `content_version` stores generated artifacts tied to a PRD.
- Valid stages today are `research`, `draft`, and `fact_checked`.
- `fact_checked` only persists when the report passes.
- Final polished output does not currently live in `content_version`; it lives in `posts`.

### Run contract

- Next.js `POST /api/run` receives `{ prdId }`.
- FastAPI `POST /run` receives `{ prd_id }` and requires `x-api-key`.
- The orchestrated order is `research -> writer -> fact_check -> polisher`.
- The pipeline currently persists intermediate and final artifacts in Supabase.

## V1 boundaries

In scope for v1:

- single-project operation,
- public or developer-managed access,
- basic pipeline execution,
- stored artifact history,
- lightweight debugging through logs and versions,
- fallback behavior when search or model calls fail.

Out of scope for v1:

- user auth and multi-tenant permissions,
- full review/approval workflows,
- social publishing integrations,
- asynchronous job queues,
- advanced observability dashboards,
- autoscaling or production-grade deployment orchestration,
- a rich text editor for posts.

## Current product risks

- Contract drift between the Next.js API and the FastAPI service.
- Environment variable mismatch between root app and Python service naming.
- Pipeline persistence rules are real but still under-documented.
- Existing tests cover utility logic better than full integration paths.

## Scope discipline

Any new feature should clearly state whether it changes:

- product behavior,
- agent pipeline behavior,
- schema or persistence,
- runtime contracts,
- or only internal implementation.
