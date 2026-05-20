---
name: Test Journey Prototype — Screen Inventory
description: Maps all data-screen values in test-journey/index.html to their purpose, so future reviews can anchor tasks to the right screen without re-reading the file.
type: project
---

The single-file prototype at `test-journey/index.html` contains six screens routed via `data-screen` attribute and a JavaScript `showScreen()` function.

| data-screen value | What it is |
|---|---|
| `test-list` | Authored tests list (table, search, filter, row context menu) |
| `new-test` | Test builder — two pill-tabs: "Settings" and "Grading" |
| `test-summary` | Completed test overview (submissions count, grading distribution, category summary) |
| `submissions-list` | All submissions for a test (table with checkboxes, toolbar, row context menu) |
| `submission-results` | Individual submission — two pill-tabs: "Results" and "Moderation" |
| `feedback-summary` | Candidate-facing feedback page — four tabs: Summary, Results, Chat, Submission |

There is also a journey switcher (Studio / Candidate) that controls which app shell is visible.

**Why:** Future PRD reviews must anchor every task to these screen names. The `feedback-summary` screen is the candidate-only view accessed via magic link.

**How to apply:** Use these screen names as the canonical labels in all task checklist items for this prototype.
