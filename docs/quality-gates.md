# Quality Gates

## Definition of Ready

Before coding, each task should have:

- a clear objective,
- an explicit acceptance criterion,
- the affected layer identified: frontend, agents, data, docs, or cross-cutting,
- one main risk called out,
- a roadmap entry in `docs/roadmap.md`,
- and a PRD in `docs/prds/` when the work is medium or large.

## Definition of Done

A task is only done when:

- the intended code or docs change exists,
- the validation run is recorded or reported,
- product or contract changes are reflected in docs,
- backlog state is updated,
- and any remaining debt is moved to `Next` or `Later`.

## Validation baseline

Run the smallest useful set of checks for the change. The default baseline for this repo is:

```bash
npm run lint
npm run check:migrations
npm run test:agents
```

Add more checks when the change affects behavior that is not covered by the baseline.

## Branch rules

- Use `codex/feat/...` for product or feature work.
- Use `codex/fix/...` for defects or regressions.
- Use `codex/chore/...` for maintenance and tooling.
- Use `codex/docs/...` for documentation-only changes.

## Commit rules

Prefer intention-first commits such as:

- `feat(prd): add version timeline`
- `fix(run-api): handle missing agents service`
- `chore(ci): add migration validation`
- `docs(sdlc): bootstrap repo operating model`

## Change design checklist

Before implementing, confirm which layer changes:

- Frontend: routes, components, forms, loading states, error states.
- Agents: prompts, contracts, retries, fallback behavior, logs.
- Data: tables, migrations, RLS, persistence rules, backward compatibility.

## Documentation rules

Update docs when you change:

- product intent,
- a public route or payload,
- persistence behavior,
- environment setup,
- or a repeated engineering decision.

Code should not become the only source of truth for behavior that affects how the team works or how the product is supposed to operate.
