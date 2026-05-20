---
description: "Author a feature's handover design.md from scratch using PRD + tasks + prototype + change log + user context. Five-phase flow: read sources, user brain-dump, clarifying questions, draft, walk through ⚠️ NEEDS INPUT."
argument-hint: "<feature-name>  (required — must match a folder under features/)"
---

Launch the `handover-documenter` subagent to author `features/<feature-name>/<feature-name>.design.md` from scratch.

**Argument:** `$ARGUMENTS`

If the argument is empty, the agent should ask which feature to document before doing anything else. If the argument doesn't match an existing folder under `features/`, the agent should stop and tell the user (do not create new feature folders).

If the target design.md already has substantive content beyond the placeholder, the agent should stop and redirect the user to `/sync-design <feature-name>`. This command is for fresh authoring only.

The agent runs five phases in order, with explicit waits between each:
1. **Map and read sources** — PRD, task list, prototype, change log, related design docs.
2. **Summarise findings and invite a user brain-dump** — wait for the user's context dump before proceeding.
3. **Ask clarifying questions** on genuine ambiguity (3–6 max, plain numbered list) — wait for answers.
4. **Draft and deliver** a full populated design.md saved to the target path, with citations and ⚠️ NEEDS INPUT markers where needed.
5. **Walk through ⚠️ NEEDS INPUT sections** one at a time until resolved or the user defers.

The agent is documentation-only. It does not create Linear tickets (a separate agent handles that), and it does not modify prototypes, PRDs, task docs, the change log, or the template.
