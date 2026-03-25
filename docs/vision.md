# Vision

## Problem

Content creation work often starts with a useful product idea or PRD, but quickly becomes fragmented across notes, drafts, research tabs, and ad-hoc prompts. The result is inconsistent content quality and very little traceability between product intent and published output.

## Target user

The primary user is a solo builder or very small product/content team that wants a lightweight system to:

- capture product intent in one place,
- generate content artifacts from that intent,
- keep a visible history of what the system produced,
- reduce unsupported claims before content is finalized.

## Value proposition

ContentFlow AI turns a PRD into a traceable content pipeline:

- PRD input lives in the app and database.
- research, draft, and fact-check artifacts are stored as versions,
- final polished content is stored as a post,
- agent logs make the pipeline inspectable when something goes wrong.

The product should help the user answer:

- Why are we creating this content?
- What product context did the system use?
- What evidence or fallback logic supported the output?
- What needs revision before shipping?

## Product promise

The system should be useful even when external services are partially unavailable. Fallback behavior is part of the product, not just an implementation detail.

## What this product is not

For the current v1, ContentFlow AI is not:

- a full CMS,
- a publishing scheduler,
- a collaborative editorial workspace,
- an analytics platform,
- an enterprise workflow engine,
- a generic autonomous agent platform.

## Near-term success signals

- A user can create a PRD and see it listed immediately.
- A user can inspect generated versions for a PRD.
- A pipeline run either produces a final post or fails with enough information to understand why.
- Product and technical decisions live in the repo instead of only in chat or memory.
