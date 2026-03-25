# ADR-001: Adopt a solo-first SDLC with docs in the repo

## Status

Accepted

## Date

2026-03-25

## Context

The repository already has meaningful product behavior:

- a Next.js app for PRDs,
- a FastAPI agent pipeline,
- Supabase-backed persistence,
- tests and migrations in progress.

What was missing was not more implementation surface, but a stable operating model. The project had no project-specific README, no source-of-truth product docs, no explicit quality gates, and no lightweight governance for deciding what gets built next.

## Decision

We will run this repository with a lightweight `solo-first` SDLC.

The source of truth for intent and operating rules will live in versioned Markdown files inside the repository:

- vision and scope in `docs/`,
- backlog in `docs/roadmap.md`,
- repeatable quality rules in `docs/quality-gates.md`,
- feature-level intent in `docs/prds/`,
- repeated technical decisions in `docs/decisions/`.

## Consequences

### Positive

- Product intent and technical behavior become inspectable together.
- The repo becomes easier to resume after time away.
- Future collaborators can onboard from the repository instead of private context.
- Changes can be evaluated against explicit acceptance criteria.

### Negative

- There is a small maintenance cost to keeping docs current.
- Some decisions will require updating docs before the code change feels "done".

## Alternatives considered

### Chat-only process

Rejected because important decisions disappear too easily and do not travel with the code.

### Formal heavyweight process

Rejected for now because the project is still early and operated by a solo builder; the overhead would likely outgrow the benefit.
