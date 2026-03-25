# Roadmap

This file is the working backlog and weekly planning board for the project.

## How to use it

- Keep exactly one primary objective in `Now`.
- Keep at most two supporting items in `Now`.
- Start every meaningful change here before coding.
- Move unfinished work to `Next` or `Later`; do not leave it implicit.
- If the change is medium or large, add a PRD in `docs/prds/`.

## Entry template

Use this structure for every item:

```md
### <title>
- Status: planned | in_progress | blocked | done
- Objective:
- Expected impact:
- Area:
- Acceptance criteria:
- Main risk:
- Linked PRD:
- Linked ADR:
```

## Now

### Harden the run contract
- Status: planned
- Objective: align and document the behavior between `POST /api/run` and FastAPI `POST /run`.
- Expected impact: fewer integration surprises and clearer failure handling.
- Area: frontend API + agents service + docs
- Acceptance criteria: request/response expectations, fallback behavior, and persistence side effects are explicit in docs and reflected in tests.
- Main risk: hidden contract mismatch between local mock mode and external service mode.
- Linked PRD: `docs/prds/TEMPLATE.md`
- Linked ADR: none

### Expand pipeline tests around failure paths
- Status: planned
- Objective: cover retry exhaustion, missing research, and degraded external dependency behavior.
- Expected impact: safer changes to agent orchestration.
- Area: agents service
- Acceptance criteria: tests cover both success and failure-oriented branches for the current pipeline.
- Main risk: false confidence from utility-only tests.
- Linked PRD: `docs/prds/TEMPLATE.md`
- Linked ADR: none

### Normalize environment naming
- Status: planned
- Objective: reduce confusion between root app env vars and Python service env vars.
- Expected impact: faster setup and fewer local configuration errors.
- Area: app + agents service + docs
- Acceptance criteria: the minimum env contract is documented and inconsistencies are intentionally resolved or called out.
- Main risk: breaking local setups if names change without compatibility planning.
- Linked PRD: none
- Linked ADR: none

## Next

### Improve PRD detail experience
- Status: planned
- Objective: make the PRD detail view easier to understand when versions or logs are missing.
- Expected impact: better usability for manual verification.
- Area: frontend
- Acceptance criteria: empty, loading, and error states are explicit on the PRD detail page.
- Main risk: the UI remains technically functional but operationally unclear.
- Linked PRD: none
- Linked ADR: none

### Expose posts in the product surface
- Status: planned
- Objective: make final polished outputs first-class in the app instead of only storing them in Supabase.
- Expected impact: better end-to-end visibility from PRD to final content.
- Area: frontend + API + data
- Acceptance criteria: a user can view the latest generated post for a PRD.
- Main risk: ambiguity between draft versions and final posts.
- Linked PRD: none
- Linked ADR: none

## Later

### Add authentication and stronger access rules
- Status: planned
- Objective: move from open developer access toward controlled access.
- Expected impact: safer deployment posture.
- Area: frontend + API + Supabase
- Acceptance criteria: user identity and data access boundaries are explicit.
- Main risk: introducing auth before the product workflow is stable.
- Linked PRD: none
- Linked ADR: none

### Introduce async job execution
- Status: planned
- Objective: decouple long-running pipeline work from synchronous request handling.
- Expected impact: more reliable execution and better UX for long runs.
- Area: agents service + app + data
- Acceptance criteria: runs can be queued and their state can be inspected later.
- Main risk: infrastructure complexity arriving too early.
- Linked PRD: none
- Linked ADR: none

## Weekly cadence

### Start of week

- Choose one primary item from `Now`.
- Confirm acceptance criteria before coding.
- Add or update a PRD if the work is medium or large.

### During the week

- Use small branches such as `codex/feat/...`, `codex/fix/...`, `codex/chore/...`, `codex/docs/...`.
- Keep changes slice-based and easy to validate.

### End of week

- Update `docs/releases.md`.
- Move backlog items to their correct state.
- Record any lesson that should become an ADR or a new backlog item.
