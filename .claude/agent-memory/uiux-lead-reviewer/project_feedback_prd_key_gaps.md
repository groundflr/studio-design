---
name: Feedback PRD — Key gaps vs. prototype
description: Notable mismatches and net-new surfaces identified during the Feedback Features PRD review, for context in follow-up sessions.
type: project
---

Reviewed 2026-04-24. PRD at `product-requirement-documents/Feedback Features.md`, prototype at `test-journey/index.html`.

**Core gaps:**
- No feedback generation config on the Settings screen (tone, length, detail level, custom prompt, feedback event type)
- No feedback review/edit/approve surface on the individual submission screen (`submission-results`) — only a static "Feedback" sub-tab stub inside category detail rows
- No feedback status column or bulk feedback actions on the submissions list
- No sharing/export modal for emailing candidates or exporting PDFs
- Candidate chat tab is fully open-input — PRD requires guardrails, pre-built questions, thread limits

**Net-new screens with no prototype equivalent:**
- Feedback Review Dashboard (cohort-level workflow view)
- Feedback Calibration Workbench
- Email / share modal
- Audit log panel
- Scheduled / conditional release config

**Open questions blocking design:**
- Is feedback per-submission or per-category, or both?
- Is "Generate report" the same toggle as feedback generation?
- Where do workspace-level controls (mandatory review, auto-approve threshold) live?

**Why:** Shapes scope for any follow-up sprint tickets or implementation assessment.

**How to apply:** When asked to assess implementation progress or review a follow-up spec, check these gaps first.
