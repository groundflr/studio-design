---
description: "Absorb this session's prototype changes into the matching features/<name>/<name>.design.md file(s). Manual trigger — never auto-runs."
argument-hint: "[feature-name]  (optional; omit to auto-detect from change log + session context)"
---

Launch the `design-doc-syncer` subagent to absorb recent prototype changes into the relevant feature design.md file(s). The user is explicitly invoking this — they have decided that the changes are ready to be committed to the design doc.

**Arguments:** `$ARGUMENTS`

If a feature name was supplied, scope the sync to that single feature's design.md at `features/<feature-name>/<feature-name>.design.md`. If no argument was given, the agent should auto-detect affected features by reading recent UI Change Log entries (`UI Change Logs/<Page>.md`) newer than each candidate design.md's `Last updated` field, plus this session's conversation context.

The agent must:
1. Propose section-by-section edits with current text, proposed text, and a one-line rationale citing the source change-log entry or conversation moment.
2. Wait for explicit per-section approval before writing.
3. On approve, write the edit, bump `Last updated`, and append an "Absorbed from" note under a `<!-- Sync log -->` HTML comment at the bottom of the file.
4. Never modify §10 Open questions or §9 Decisions without explicit user framing.
5. Skip features whose changes weren't logged (still in riff stage).
6. End with a summary of what was written and what was deferred.

Do not auto-commit anything. The user controls every write.
