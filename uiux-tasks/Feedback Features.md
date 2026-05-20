# UI/UX Task Checklist — Feedback Features

**Mode:** PRD/Spec Review → Actionable Checklist
**Source PRD:** `product-requirement-documents/Feedback Features.md`
**Prototype cross-referenced:** `test-journey/index.html`
**Date:** 2026-04-24

---

## User Problems This PRD Is Solving

1. **Authors cannot control whether or how AI feedback is generated.** There is no way to configure tone, length, detail level, or provide a custom prompt before generation runs.
2. **AI feedback reaches candidates without any human check.** There is no review, edit, or approval step between generation and delivery — violating the institution's "human-in-the-loop" requirement.
3. **Authors cannot see, edit, or audit the feedback attached to a submission.** The individual submission view shows grades and rationale but not AI-generated feedback as a distinct, editable artefact.
4. **Authors have no way to distribute results and feedback to candidates at scale.** Sharing options are absent from the submissions list; there is no bulk export, email delivery, or PDF export path.
5. **Candidates receive no structured, standalone view of their feedback.** The candidate feedback page exists in prototype but is sparse — no delivery-state handling, no PDF export, no clear progression between feedback types (static → queryable).
6. **There is no audit trail.** Nothing records who generated, edited, or approved feedback and when.

---

## Prototype Screen Inventory

| Screen name | `data-screen` value | Relevant to feedback? |
|---|---|---|
| Test list | `test-list` | Indirectly (entry point) |
| New/edit test (Settings panel) | `new-test` — Settings tab | Yes — feedback config lives here |
| New/edit test (Grading panel) | `new-test` — Grading tab | Partial — grading categories drive feedback |
| Completed test summary | `test-summary` | No current feedback surface |
| Submissions list | `submissions-list` | Yes — sharing/export entry point |
| Submission results (studio) | `submission-results` | Yes — individual feedback view/edit |
| Feedback — candidate view | `feedback-summary` | Yes — candidate-facing page |

---

## Group 1 — Feedback Generation Settings (Author configures before or during test setup)

**Problem addressed:** Authors have no control over what feedback AI generates, in what tone, or at what level of detail.

**Screen(s):** `new-test` — Settings tab (subsection "Results and Feedback", lines 1470–1503 in prototype)

### What currently exists in the prototype
The Settings tab has a "Results and Feedback" subsection with:
- A "Generate report" toggle (on by default)
- Delivery option toggles: "Show feedback on test completion", "Email", "Link"
- Display option toggles: "Show feedback header", "Show category feedback", "Show feedback summary", "Show feedback chat"

These toggles cover delivery and display — but **none of the core generation parameters from the PRD exist**. There is no tone, length, detail level, custom prompt, or feedback event type selector.

### Tasks

- [ ] **Add a "Feedback" collapsible section** (or rename/expand the existing "Results and Feedback" subsection) that makes the generation settings visually distinct from display/delivery settings. The current subsection conflates all three concerns.
  **Screen(s):** `new-test` — Settings tab
  **Priority:** [P1-Core]

- [ ] **Add Tone selector** with options: Supportive/Coaching | Direct | Default (balanced). Use a `<select>` or segmented radio group consistent with existing `.select` component pattern.
  **Screen(s):** `new-test` — Settings tab
  **Priority:** [P1-Core]

- [ ] **Add Length selector** with options: Brief (100–200 words) | Standard (200–400, default) | Detailed (400–600). Surface word-count guidance inline so authors understand the consequence of each choice.
  **Screen(s):** `new-test` — Settings tab
  **Priority:** [P1-Core]

- [ ] **Add Detail Level selector** with options: Guidance-focused | Balanced (default) | Answer-focused. Include a short help text explaining the difference (`.desc` pattern already used throughout the form).
  **Screen(s):** `new-test` — Settings tab
  **Priority:** [P1-Core]

- [ ] **Add Feedback Event Type toggle/selector**: Per Assessment vs. Summative. This maps to whether feedback is generated per submission event or at sequence completion.
  **Screen(s):** `new-test` — Settings tab
  **Priority:** [P1-Core]

- [ ] **Add "Custom Prompt" textarea** (optional override). Label it clearly as overriding the standard tone settings; use the word-count pattern (`.word-count`) already present in the form. Include placeholder text explaining the field's purpose.
  **Screen(s):** `new-test` — Settings tab
  **Priority:** [P2-Polish]

- [ ] **Add "Additional Context" textarea** (supplementary input for generation, distinct from a custom prompt override). Make the difference between Custom Prompt and Additional Context legible via label copy and help text.
  **Screen(s):** `new-test` — Settings tab
  **Priority:** [P2-Polish]

- [ ] **Conditionally show all feedback generation settings** behind the "Generate report" master toggle. When the toggle is off, generation fields should collapse/disable with a clear explanation that feedback will not be generated.
  **Screen(s):** `new-test` — Settings tab
  **Priority:** [P1-Core]

- [ ] **Rename "Generate report" to something more precise** — the PRD refers to "feedback generation", not a report. "Generate Feedback" or "Enable Feedback" would be less ambiguous and reduces confusion between feedback and grading reports.
  **Screen(s):** `new-test` — Settings tab
  **Priority:** [P1-Core]

- [ ] **Ensure the subsection heading clearly separates two concerns**: (a) feedback generation configuration and (b) feedback delivery/display. The current prototype runs them together under one unlabelled subsection.
  **Screen(s):** `new-test` — Settings tab
  **Priority:** [P1-Core]

- [ ] **Accessibility:** All new form fields must be associated with `<label>` elements (or `aria-labelledby`). The current prototype uses `.field-label` divs — verify these are wired correctly when real inputs are added. Toggle switches must have an accessible label (the existing `.switch` component has no `role="switch"` or `aria-checked` in the prototype).
  **Screen(s):** `new-test` — Settings tab
  **Priority:** [P0-Blocker]

---

## Group 2 — Feedback Review & Edit (Author reviews and approves generated feedback on a submission)

**Problem addressed:** Authors need to review AI feedback before it reaches candidates, edit it inline, and approve or reject it. No version of this surface exists in the current prototype.

**Screen(s):** `submission-results` (Results tab and/or a new Feedback tab within this screen)

### What currently exists in the prototype
The `submission-results` screen has two pill-tabs: "Results" and "Moderation". The Results tab shows grading categories and scores. The Moderation tab shows a split-screen (rubric + submission document side-by-side). The detail row within Results already has a "Feedback" sub-tab stub, but it only shows a static body text — no editing affordance, no status indicator, no approval action.

There is no dedicated feedback review surface. The Feedback sub-tab inside a category row is the only trace.

### Tasks

- [ ] **Add a "Feedback" pill-tab** alongside "Results" and "Moderation" at the `submission-results` level. This is the primary surface for the author to see, edit, and approve AI-generated feedback for this specific submission.
  **Screen(s):** `submission-results`
  **Priority:** [P0-Blocker]

- [ ] **Within the Feedback tab — show feedback status badge** (Draft | Under Review | Approved | Failed) prominently at the top of the panel so the author knows the current state at a glance without reading content.
  **Screen(s):** `submission-results` — Feedback tab
  **Priority:** [P0-Blocker]

- [ ] **Within the Feedback tab — display AI-generated feedback** as an editable rich-text region. The PRD specifies inline editing with a formatting toolbar and character/word count. The left pane should retain the submission document or rubric scores for reference (mirror the existing split-screen pattern from the Moderation tab).
  **Screen(s):** `submission-results` — Feedback tab
  **Priority:** [P0-Blocker]

- [ ] **Add an "Edit" / "Save Draft" / "Approve" action hierarchy**. Author should be able to:
  1. Enter edit mode (click "Edit" or inline)
  2. Save without approving ("Save Draft")
  3. Approve-and-next (primary CTA)
  Use the existing `.btn.primary` and `.btn.outline` patterns. The "Approve" action should require a confirmation step if approval is irreversible without revert.
  **Screen(s):** `submission-results` — Feedback tab
  **Priority:** [P0-Blocker]

- [ ] **Show version history / revert access**. The PRD requires original AI version to be preserved and the edit history (editor identity + timestamp) to be accessible. Surface this as a "View history" link or a collapsed version log panel — the implementation detail is open, but the affordance must be present.
  **Screen(s):** `submission-results` — Feedback tab
  **Priority:** [P1-Core]

- [ ] **Show a "Revert to original" action** when an edited version exists, so the author can undo edits and return to the AI-generated version.
  **Screen(s):** `submission-results` — Feedback tab
  **Priority:** [P1-Core]

- [ ] **Show quality/confidence indicators** (AI confidence score, variability flag, review priority) adjacent to the feedback panel so authors can prioritize their attention. These should be visible without entering edit mode.
  **Screen(s):** `submission-results` — Feedback tab
  **Priority:** [P2-Polish]

- [ ] **Show feedback generation status** if feedback is still pending or failed (e.g., async generation not yet complete). The UI must handle: pending/generating (skeleton or spinner), complete (show feedback), failed (error state with retry action). Empty state = feedback not yet enabled should also be distinct.
  **Screen(s):** `submission-results` — Feedback tab
  **Priority:** [P0-Blocker]

- [ ] **Integrate grading variability detection**: if variability is flagged on a submission (the submissions list already has a "Variability" column), surface both Run 1 and Run 2 grades in the Feedback tab's left-pane context so the author reviewing feedback can see the grading ambiguity.
  **Screen(s):** `submission-results` — Feedback tab
  **Priority:** [P1-Core]

- [ ] **Keyboard accessibility**: the edit region, toolbar, save/approve buttons must all be reachable by keyboard alone. Ensure focus order is logical (submission context → feedback content → action buttons). Provide `aria-live` region for status changes (e.g., "Draft saved").
  **Screen(s):** `submission-results` — Feedback tab
  **Priority:** [P0-Blocker]

---

## Group 3 — Bulk Review & Sharing from Submissions List

**Problem addressed:** Authors need to act on feedback across many submissions at once — bulk approve, export, or share results and feedback via email, PDF, CSV, or LMS.

**Screen(s):** `submissions-list`

### What currently exists in the prototype
The submissions list has a toolbar with search, filters, Upload, and Download buttons. Each row has a context menu (three-dot) with items including "View Results and Feedback" (navigates to candidate view) and "Request Re-Grade". The Download button is not scoped — it is unclear whether it exports submissions, grades, or feedback.

**There is no feedback status column, no bulk selection with feedback actions, and no sharing/export flow scoped to feedback.**

### Tasks

- [ ] **Add a "Feedback Status" column to the submissions table** showing per-submission feedback state (Draft | Approved | Not Generated | Failed). This lets the author see the feedback pipeline state across the whole cohort without opening each submission.
  **Screen(s):** `submissions-list`
  **Priority:** [P1-Core]

- [ ] **Add bulk selection capability** (the checkbox column exists in the rendered HTML but is non-functional `<span class="checkbox">`). Make checkboxes functional and show a bulk action bar when one or more rows are selected.
  **Screen(s):** `submissions-list`
  **Priority:** [P1-Core]

- [ ] **Add bulk feedback actions to the bulk action bar**: Bulk Approve, Bulk Export PDF, Bulk Export CSV (scoped to selected rows).
  **Screen(s):** `submissions-list`
  **Priority:** [P1-Core]

- [ ] **Clarify the "Download" toolbar button**: scope it explicitly to export options (CSV of all submissions including feedback, PDF of selected submissions). Either replace with a dropdown ("Export...") or split into distinct labelled buttons so authors know what they will receive.
  **Screen(s):** `submissions-list`
  **Priority:** [P1-Core]

- [ ] **Add "Send Feedback" / "Share Results" action** — the primary sharing flow for emailing a unique magic-link URL to individual or multiple candidates. This could live in the row context menu (currently only "View Results and Feedback" appears there) and in the bulk action bar. The existing row context menu already has a "View Results and Feedback" item — extend it with "Share with Candidate".
  **Screen(s):** `submissions-list` — row context menu and bulk action bar
  **Priority:** [P1-Core]

- [ ] **Add filter for feedback status** to the existing filter control (currently shows "Select filters" with no options) so authors can filter to only Draft, only Approved, or only Failed feedback.
  **Screen(s):** `submissions-list`
  **Priority:** [P1-Core]

- [ ] **Accessibility**: bulk action bar must be announced to screen readers when it appears (use `aria-live="polite"` or a visually announced region). Checkbox column must use `<input type="checkbox">` with visible labels (even if label is visually hidden), not `<span>` elements.
  **Screen(s):** `submissions-list`
  **Priority:** [P0-Blocker]

---

## Group 4 — Candidate Feedback View (Read-only, magic-link access)

**Problem addressed:** Candidates need a structured, clearly scoped view of their results and feedback — one that reflects exactly what the author has chosen to expose, with no more and no less.

**Screen(s):** `feedback-summary`

### What currently exists in the prototype
The candidate feedback page (`feedback-summary`) has:
- A score header (test title, candidate score)
- Four tabs: Summary, Results, Chat, Submission
- Summary tab: full AI feedback text with strengths, areas for improvement, next steps
- Results tab: grading table with category scores and a rationale expansion on one row
- Chat tab: pre-populated conversation with suggested questions and an input field
- Submission tab: inline submission document viewer with download

This is a good structural foundation. Key gaps against the PRD:

### Tasks

- [ ] **Ensure tab visibility is controlled by admin display settings**. The PRD specifies that the admin chooses which elements the candidate sees (show category feedback, show summary, show chat). The four tabs in the prototype must only appear if the corresponding admin toggle is enabled. A candidate accessing a link where chat is disabled must see no Chat tab — not an empty one.
  **Screen(s):** `feedback-summary`
  **Priority:** [P0-Blocker]

- [ ] **Add a PDF export / download action** accessible to the candidate from this page. The PRD states candidates can download a PDF. The existing "Download Original" button is scoped to the submission document, not the feedback. Add a distinct "Download Feedback (PDF)" action — positioned near the score header or as a page-level action, not buried in a tab.
  **Screen(s):** `feedback-summary`
  **Priority:** [P1-Core]

- [ ] **Handle the case where feedback has not been approved yet** (candidate arrives via a stale or premature link). Show a clear, helpful state: "Your feedback is being prepared and will be available soon." Do not show an empty feedback body with no explanation.
  **Screen(s):** `feedback-summary`
  **Priority:** [P0-Blocker]

- [ ] **Handle the "feedback not enabled" state** (admin disabled feedback for this test). The page must degrade gracefully — e.g., show score-only or a message that feedback is not available for this submission — rather than rendering empty tab content.
  **Screen(s):** `feedback-summary`
  **Priority:** [P0-Blocker]

- [ ] **Secure the magic-link URL**. The page has a "Submission Details" modal (shared with the studio view) — verify that this modal does not expose admin-only information (editor identity, audit timestamps, internal status flags) to the candidate. The modal currently shows submission status, grading status, score, and percentile — confirm these are all acceptable to surface to candidates.
  **Screen(s):** `feedback-summary` — Submission Details modal
  **Priority:** [P1-Core]

- [ ] **Chat tab — enforce guardrails copy**. The PRD specifies the queryable chat must be scoped to the submission/feedback, with pre-built questions, no general chatbot behaviour, and a conversation thread limit. The current chat tab shows a static message and an open input. Add copy that sets expectations ("Ask me about your submission and feedback — I can't answer general questions"). Pre-built question chips (the PRD calls these out) should appear before the input field.
  **Screen(s):** `feedback-summary` — Chat tab
  **Priority:** [P1-Core]

- [ ] **Chat tab — show conversation thread limit**. If there is a cap on exchanges, surface it so the candidate knows before they start (e.g., "5 questions remaining").
  **Screen(s):** `feedback-summary` — Chat tab
  **Priority:** [P2-Polish]

- [ ] **Results tab — make category rationale expandable per row** (not just the first row). Currently only one rationale row is expanded in the prototype; others show `<i class="icon-chevron-right">` suggesting they are collapsed but non-interactive. Ensure all rows expand/collapse consistently.
  **Screen(s):** `feedback-summary` — Results tab
  **Priority:** [P1-Core]

- [ ] **Accessibility — candidate view**: this page is accessed by candidates who may use assistive technology. Ensure the tab interface uses proper `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`, and `aria-controls` attributes. The current implementation uses `data-feedback-tab` attributes and JavaScript toggling — verify ARIA roles are present. Tab focus must be trapped within the active panel.
  **Screen(s):** `feedback-summary`
  **Priority:** [P0-Blocker]

- [ ] **No authentication on the candidate page** — verify the page renders correctly without a Studio sidebar or workspace context. The prototype wraps this in the same `data-shell="candidate"` div and the sidebar is hidden via JS. In production, this page must be entirely standalone (no Studio chrome, no cookies required).
  **Screen(s):** `feedback-summary`
  **Priority:** [P1-Core]

---

## Group 5 — State Coverage Across All Feedback Surfaces

**Problem addressed:** Async AI generation means feedback can be in many intermediate states. Missing state handling will leave authors and candidates confused.

**Screen(s):** `new-test` (Settings), `submission-results` (Feedback tab), `submissions-list`, `feedback-summary`

- [ ] **Map and design all feedback status states**: pending → generating → complete → failed → approved → released. Each state must have a visual treatment (badge/chip using existing `.pill-filled` or `.status-dot` patterns), a label, and where applicable, an action the user can take (retry, approve, revert).
  **Screen(s):** All feedback surfaces
  **Priority:** [P0-Blocker]

- [ ] **"Generating" in-progress state**: when feedback is being generated (async queue), show a non-blocking indicator. The page must remain usable. Do not block the moderation/results view while waiting.
  **Screen(s):** `submission-results`, `submissions-list`
  **Priority:** [P1-Core]

- [ ] **"Failed" state with retry**: if generation fails, the author must be able to trigger a retry from the submission view without navigating away. Show the failure reason if available (e.g., "Generation failed — no rubric criteria found").
  **Screen(s):** `submission-results` — Feedback tab
  **Priority:** [P1-Core]

- [ ] **"Not configured" empty state on Test Settings**: if the author navigates to a test where feedback was never enabled, the Results and Feedback subsection should not show empty controls — it should show the master toggle in the off state with a brief explanation.
  **Screen(s):** `new-test` — Settings tab
  **Priority:** [P2-Polish]

---

## Net-New Screens (No Corresponding Prototype Surface)

The following surfaces described in the PRD have **no matching screen** in `test-journey/index.html`. These need to be designed from scratch.

| Net-new surface | PRD section | Notes |
|---|---|---|
| **Feedback Review Dashboard** (cohort-level filter/sort by status, variability, priority, bulk actions) | Feedback Review — Dashboard | This is a distinct view from the submissions table, focused on feedback workflow. May integrate into `submissions-list` as a filter preset rather than a separate screen — needs design decision. |
| **Feedback Calibration Workbench** | Feedback Calibration (Workbench) | Preview + refine feedback before going live; upload sample submissions; compare generation configs. Entirely absent from prototype. Likely a new top-level screen or modal flow. |
| **Feedback Sharing / Email Modal** | Feedback Sharing or Export | No email-send UI exists anywhere. Needs a dialog/modal for composing and sending candidate emails with unique URLs or PDF attachments. |
| **LMS / External System Integration screen** | Feedback Delivery Methods — Grade Book Integration | No surface for Moodle or LTI sync configuration. May partially overlap with existing "Sync Grade to LTI Platform" (currently disabled in row context menu). |
| **Scheduled / Conditional Release configuration** | Approval and Release — scheduled/conditional | No UI for setting a release schedule or condition (e.g., release after a date, release when all approved). |
| **Audit Log / History panel** | Audit | No surface for viewing who generated, reviewed, edited, or approved feedback with timestamps. Could be a drawer or modal within the submission view. |
| **Teaching Assistant / role-aware feedback suggestions** | Permissions — Teaching Assistant: view + suggest | The current prototype has no role-based permission model visible in the UI. Needs at least a design decision about how suggest-only mode differs from full edit. |

---

## Prototype / PRD Mismatches

- **"Generate report" label vs. feedback**: The prototype toggle says "Generate report" but the PRD calls this "feedback generation". These may be intentionally separate concepts (a report vs. AI feedback text) — but if they are the same concept, the label should be corrected to avoid author confusion. **Needs clarification.**

- **"Feedback" sub-tab inside grading category detail row**: The prototype shows a "Feedback" tab within the per-category grading detail at the `submission-results` level (line 1856). The PRD's feedback model generates feedback at the submission level (whole submission), not per-category row. If feedback is rubric-criterion-level (one of the PRD's "open questions"), these sub-tabs may be correct. If feedback is submission-level only, these per-row tabs are a mismatch. **Needs clarification.**

- **"Sync Grade to LTI Platform" is disabled**: The row context menu on the submissions list shows this item as `disabled`. The PRD explicitly includes Grade Book Integration (Moodle/LTI) as a delivery method. This suggests a known gap acknowledged at the UI level — but no configuration path exists yet. Flag for roadmap alignment.

- **Candidate chat — open input vs. guardrailed interface**: The prototype shows a completely open text input in the chat tab. The PRD explicitly requires guardrails (pre-built questions, topic restriction, thread limits). The current prototype overstates the freedom candidates will have and should not be treated as final.

---

## Clarifications Needed

1. **Feedback granularity**: Is AI feedback generated per submission (holistic) or per grading category, or both? The PRD mentions "criterion-by-criterion or summary" as output options. The prototype has both a per-category "Feedback" sub-tab and a submission-level summary panel — which is the primary model?

2. **"Generate report" vs. "feedback"**: Are these the same toggle or different concepts? A "report" might imply a grading summary PDF, while "feedback" is the AI narrative. Clarify before renaming or extending.

3. **Mandatory review toggle**: The PRD describes a workspace-level "mandatory review toggle" (all feedback must be reviewed before release). Where does this setting live — in the test settings, in workspace/org settings, or both? The prototype has no workspace-level settings screen.

4. **Auto-approve threshold**: Similarly, auto-approval based on AI confidence is described as a workspace control. Same question about where it is configured.

5. **Teaching Assistant role**: The prototype has no visible role-based UI differentiation. Is role-based feedback permission in scope for this design sprint, or deferred?

6. **Summative feedback in sequences**: The PRD mentions feedback at sequence completion. The prototype shows only single-test flows. Is sequence-level feedback in scope here?

---

## Problems We Are NOT Solving (Per PRD)

These items are explicitly marked as future or excluded:

- **Multi-language feedback** — deferred, not in current scope.
- **Learner-requested feedback regeneration** — future consideration.
- **Analytics for feedback engagement** — future.
- **Feedback calibration (Workbench)** — described in the PRD but marked as a future refinement tool; design it only if explicitly pulled into the current sprint.
- **Partial sequence feedback** — future.
- **Personalised academic advising** (career advice, major recommendations) — explicitly excluded by Eduvos.
- **Automated student interventions** (auto-flagging, auto-emails, auto-support without human approval) — explicitly excluded by Eduvos.
- **Grading query from candidate** (candidate logs a formal dispute) — noted as a future requirement within feedback sharing.
