---
description: "Create the Linear issue + sub-issues for a feature using its design.md §12 as input. Reviews and may suggest deviations; requires user approval before any write."
argument-hint: "<feature-name>  (required — must match a folder under features/)"
---

Launch the `linear-ticket-creator` subagent to create the Linear issue + sub-issues for `features/<feature-name>/<feature-name>.design.md`.

**Argument:** `$ARGUMENTS`

If the argument is empty, the agent should ask which feature to create tickets for. If the argument doesn't match an existing folder under `features/`, the agent should stop.

If §12 of the target design.md already has Linear IDs (issue or sub-issue links), the agent must stop and surface those existing IDs — this prevents duplicate ticket creation.

The agent runs six phases in order:
1. **Verify connection + scope** — `list_teams` read-only, confirm Linear account, read §12.
2. **Locate the Linear project** — fuzzy match by the name in §12; confirm if ambiguous; stop if no match (do not create projects).
3. **Review pass** — read the broader design.md and surface any deviations the agent would recommend (rename / add / split / merge / remove sub-issues).
4. **Approval gate** — present §12 as-is + suggestions in one batch; user accepts §12 verbatim, accepts some suggestions, or edits further. No Linear writes until the user explicitly confirms the final list.
5. **Create tickets** — issue first, sub-issues parented to it. Minimal metadata: project + parent only. No labels, priority, assignee, or estimate.
6. **Write back** — populate `Linear project`, `Linear issue`, and `Linear sub-issues` fields in the design.md header; update §12 sub-issue rows with their new Linear IDs; bump `Last updated`; append a sync-log note.

The agent never silently deviates from §12. Every rename, addition, split, or removal needs explicit user approval. It does not author from scratch — it builds what the handover-documenter proposed, with expert review.
