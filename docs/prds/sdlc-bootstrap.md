# PRD: SDLC bootstrap

## Problem

The project has real product code, tests, and migrations, but no project-specific operating model. Important intent is easy to lose, and there is no shared place in the repo that explains what the product is, what the pipeline guarantees, or what "done" means for future work.

## User

The primary user is the solo builder maintaining ContentFlow AI and any future contributor who needs to resume work without hidden context.

## Goal

Bootstrap a lightweight SDLC directly in the repo so future changes start from a documented vision, explicit backlog, stable quality gates, and minimum automation.

## Expected flow

- The builder starts in the README and sees how the system is organized.
- New work begins by adding or updating an item in `docs/roadmap.md`.
- Medium or large work uses a short PRD in `docs/prds/`.
- Repeated technical decisions are captured in an ADR.
- Validation can be run locally and in CI with a small standard command set.

## Affected areas

- Frontend: none directly, except documentation of the existing routes and behavior.
- Agents service: none directly, except documentation of the current contract and test execution.
- Data / migrations: no schema change; add validation around migration files.
- Docs / process: add docs, templates, release notes, README, and CI workflow.

## APIs or contracts touched

- Route: `POST /api/run`
- Request shape: documented as `{ prdId }`
- Response shape: documented for external-service mode and local mock mode
- Persistence side effects: documented for `content_version`, `agent_logs`, and `posts`

## Data touched

- Existing tables: `prd`, `content_version`, `agent_logs`, `posts`
- New tables or columns: none
- Migration needed: no

## Risks

- Main risk: docs drift away from the real implementation.
- Fallback or mitigation: tie docs updates to Definition of Done and add minimum CI checks.

## Validation required

- Manual checks: confirm README and docs match the current code shape and routes.
- Automated checks: `npm run lint`, `npm run check:migrations`, `npm run test:agents`.

## Done means

- The repo has product and process docs under `docs/`.
- The README explains purpose, architecture, setup, env vars, and runtime contracts.
- A PRD template exists for future work.
- Minimal CI exists for lint, migration validation, and agent tests.
- The release note for the bootstrap is recorded.
