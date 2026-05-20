# UI/UX Task Checklist — Users and Permissions

**Reviewer:** uiux-lead-reviewer
**PRD sources:** `product-requirement-documents/Users and Permissions.md` (V1 · April 2026) and `product-requirement-documents/Users and Permissions V2.md` (V2 · May 2026)
**Date:** 2026-05-14
**Revision:** Re-spec Problem 4 against the product-sandbox patterns; add Problem 8 covering the org-level admin surface (Organisation hub, cross-workspace Users, user profile drilldown). Resolves Clarification 3.

---

## Standing scope notes (user-confirmed, override PRD where they conflict)

1. **Teams are scrapped entirely.** Teams do not appear in V2 at all. All team-level UI — team creation, team management, membership, and team-scoped collection assignment — is excluded from all tasks. If a V2 passage incidentally implies team grouping, ignore it.

2. **Pending-invite collection assignment.** V2 §3.3 retains a partial ACL model for Moderator and Viewer roles (they must be assigned to submission groups and assets respectively). Pending-invite users can therefore be pre-assigned to the relevant groups or assets before they activate, so they see content on first login. This carve-out remains in scope for Moderator and Viewer role onboarding tasks (see Problem 4).

3. **Role chip in workspace.** A visible chip showing the user's current workspace role with a capabilities popover is a required, first-class feature. It is not optional. It must be present for all non-Super-Admin users.

4. **UI signifier on read-only / view-only views.** The lock chip / banner pattern is required. Hidden affordances alone are not sufficient to communicate a restricted state.

5. **Discoverability of permissions a user lacks.** This remains an open design problem with options presented below, unless the product team explicitly resolves it. V2 §6.1 partially resolves it for lower-frequency controls (disabled + tooltip) but leaves the broader discoverability question open.

---

## Changes from V1 to new V2

- **New org-level role: Org Owner.** Distinct from Org Admin. Exactly one per organisation. Exclusive capabilities: billing management, payment, invoices, Org Owner transfer, and account closure. On transfer, the previous Org Owner is demoted to Org Admin automatically.

- **Author renamed Member.** The V1 Author role is now Member throughout V2. Two capability upgrades: Members can now publish environments (previously Admin-only in V1) and publish workspace templates (previously Admin-only in V1). Members can also create collections (not in V1).

- **Moderator gets explicit read-only access to tests and simulations.** V1 Moderators had no content read access. V2 §1.2 gives them read-only access to the tests, simulations, and rubrics they are moderating, so they have grading context. This is a new UI state: test and simulation detail views in read-only mode for Moderators.

- **Access model — partial hybrid, not pure RBAC.** V2 §3.3 is internally contradictory: it opens by saying "Collections do not gate access" and "Pure RBAC", then in the same section introduces partial ACL: Moderators must be assigned to submission groups, Viewers must be assigned to specific assets. Members have open workspace access. This is not pure RBAC — it is a hybrid model scoped to the two lowest roles. This contradiction needs a product decision (see Clarifications).

- **Invite flow simplified to single email, no shareable link.** V2 §2.1 retains only Method A (direct email invitation). No comma-separated bulk entry, no optional personal message, no shareable invite link. One email address per invite flow action. (Note: clarification needed on whether bulk email entry was intentionally removed — V2 wording may be imprecise.)

- **Invitation states simplified to three.** V2 §2.3: Pending, Expired, Cancelled. The V1 "Accepted" state (clicked link, not finished onboarding) is removed. Only these three states appear in the Admin's pending invitations view.

- **Default role changed to Member in §P3 (contradicts §1.3).** V2 §P3 says the default role is Member. V2 §1.3 says the default is Viewer. This is a direct internal contradiction that needs a product decision before building the invite modal (see Clarifications).

- **Disabled vs hidden — context-sensitive rule introduced.** V2 §6.1 replaces V1's blanket "hide everything" rule: high-frequency administrative controls are hidden; lower-frequency controls where discoverability matters remain visible but disabled with a tooltip explaining who can act. This is a new pattern layer that must be implemented alongside the existing hidden-control pattern.

- **Export / Sync results — Moderator permission resolved.** Unlike the prior task doc which flagged this as "??", the new V2 matrix explicitly marks Moderator export as ✗ (not allowed). This is now definitive.

- **Permission principles renumbered and revised.** V2 drops V1's P4 (Teams simplify access) and P5 (most permissive wins). New principles: P1 Pure RBAC, P2 Roles cascade (with Viewer as exception), P3 Default access role, P4 Real-time updates, P5 Auditability, P6 No self-escalation, P7 Separation of billing from administration.

- **Viewer scope clarified.** V2 §1.2: Viewer has "read-only across all submissions linked to a single asset" — implying Viewer access is per-asset, assigned explicitly. This aligns with the hybrid ACL carve-out in §3.3.

- **Org Owner transfer and account closure formalised.** V2 §1.2, §5, §7.5 introduce a formal transfer-of-ownership in-product confirmation flow, with acceptance by the receiving user. V1 mentioned this only in passing.

- **Cascading role model formalised.** V2 §1.1 formally states Workspace Admin contains Member contains Moderator. Viewer is explicitly noted as not on the same cascade — it is a separate read-only track.

- **Workspace settings — Moderator and Viewer correctly excluded.** V2 matrix confirms Moderator = ✗ for all workspace and user management actions. No change in principle but more clearly specified.

- **"Manage workspace environments" — Member granted.** V2 matrix: Member ✓ for "Manage workspace environments". This aligns with the role definition text (no admin approval step).

---

## How to read this document

Each section names a discrete user problem, states who experiences it and what the failure mode is, then lists concrete, verifiable UI tasks. Priority tags: **[P0-Blocker]**, **[P1-Core]**, **[P2-Polish]**. Design system references cite sections of `design-system/traverse-design-system.md` and token names from `design-system/colors_and_type.css`.

---

## Problem 1 — A user cannot tell what they are permitted to do in the current workspace

**Who:** Members, Moderators, Viewers — any non-Admin workspace member.
**Failure mode:** A user attempts an action (inviting someone, publishing a workspace template, editing a workspace setting), finds the control absent or disabled, and has no way to know whether that capability exists, who holds it, or how to request it. They assume the product is broken, or they contact support instead of their admin.

V2 §6.1 introduces a nuanced rule: high-frequency administrative controls are hidden from non-admins; lower-frequency controls where discoverability matters remain visible but disabled with a tooltip. This partially resolves the problem for the second category but the first (hidden controls) still has no discovery path. This remains an open design problem.

### Design option A — Role-aware profile page with capability summary and escalation prompt

A "Your permissions in this workspace" section on the user's own profile page lists what they can do, grouped by area. At the end of each group that has gaps relative to higher roles: "To do more, contact your workspace admin." Show the admin's display name as a mailto or in-app message trigger.

Trade-offs: clean main UI. User must navigate to profile — low chance of accidental discovery. Best for deliberate role exploration.

### Design option B — Searchable capability index

A global search or help shortcut surfaces a "What can I do?" index. Searching for an action the user cannot take returns: "Inviting users requires Workspace Admin access. Contact your workspace admin." Additive — also answers questions about things they can do.

Trade-offs: excellent discoverability at moment of intent. Requires a help/search surface that does not yet exist. Larger scope investment. Index must stay role-aware and in sync with role definitions.

### Design option C — Role chip in the top bar with popover capability summary (standing note 3)

A persistent role chip in the top bar. Clicking it opens a lightweight popover listing what the current role can do, with "Contact your admin to change your role." at the end. Serves both discoverability (Problem 1) and role awareness (Problem 2) in one component.

Trade-offs: always visible, passive. Popover content must be authored and maintained per role. Risk of being perceived as decorative and never opened. Best combined with Option A as the deep-dive destination.

### Tasks

- [P1-Core] Define the role-to-capability summary copy for all six workspace-visible roles: Org Owner, Org Admin, Workspace Admin, Member, Moderator, Viewer. This is a content task prerequisite to any UI implementation. Summaries: 3–5 bullets per role, second person, sentence case, verb-led. Use V2 role names throughout — never "Author".
- [P1-Core] If Option A is chosen: design a "Your permissions in this workspace" section on the user profile page. Use `FormSection` (DS §8.8 `FormSection` with `title` and optional `subtitle`). List only what the user can do — do not show a greyed-out capability gap list. Escalation prompt must show the admin's display name and be actionable (mailto or in-app trigger).
- [P1-Core] If Option B is chosen: scope this as a dependency on a separate help/search surface. Flag it as a cross-team dependency. Do not prototype without that surface existing.
- [P1-Core] If Option C is chosen: implement the role chip per Problem 2 tasks and extend the popover to include a capability summary, not just the role name. Popover must be dismissible via Escape and click-outside. Keyboard accessible (if popover contains a link: `role="dialog"` with `aria-label`; if purely informational: `role="tooltip"`).
- [P1-Core] V2 §6.1 specifies that lower-frequency controls where discoverability matters remain visible but disabled, with a tooltip. Identify the full list of controls that fall into this category (the PRD names "publishing a template" as one example but does not enumerate the full list — see Clarification 4). For each such control, implement a Lucide `info` icon trigger or `title` attribute with copy: "Only [Role] can [action]. Ask your workspace admin." Use `var(--surface-400)` for the disabled control state; do not use `var(--error-500)`.
- [P2-Polish] Regardless of option: all copy describing capabilities must use exact V2 role labels — Org Owner, Org Admin, Workspace Admin, Member, Moderator, Viewer. Sentence case. No exclamation marks. Never "Author".

---

## Problem 2 — A user does not know what role they hold in the current workspace, especially when they have different roles in different workspaces

**Who:** Any workspace member, particularly users who belong to multiple workspaces within the same organisation.
**Failure mode:** A user who is Workspace Admin in Workspace A switches to Workspace B (where they are Member) and tries to invite a colleague. The invite control is absent. They do not know if this is a role difference or a product defect. Disorientation compounds with many workspaces.

V2 §7.1 explicitly acknowledges cross-workspace role differences. The user's standing notes make the role chip a mandatory, first-class feature.

### Role chip specification

**What it shows:** The user's current workspace role: Workspace Admin, Member, Moderator, Viewer. If the user is also Org Admin or Org Owner, display the highest applicable label for the workspace context. Never show "Super Admin" to any end user.

**Where it lives:** The top bar (DS §8.4 / top bar pattern). Position between the section label and the right-side icon cluster (search, bell, avatar). Use the `Tag` component (DS §7.3). Present and readable, not competing with the primary CTA.

**Colour convention:** Neutral treatment — role is identity information, not a status alert.
- Non-administrative roles (Member, Moderator, Viewer): `var(--surface-100)` background, `var(--surface-600)` text.
- Administrative roles (Workspace Admin, Org Admin, Org Owner): `var(--primary-50)` background, `var(--primary-700)` text. Gentle distinction, not alarming.
- Do not use `var(--error-500)`, `var(--warn-500)`, or any semantic-state colour for role identity.

**Popover on click or tap:** A small popover (not a modal — no scrim) anchored below the chip.
- Role name at `ds-title-md` weight.
- One-sentence plain-language summary of what this role can do in this workspace (authored per role, see Problem 1 content task).
- If the user belongs to other workspaces: "Your role may differ in other workspaces." Consider a compact cross-workspace role list here, or a link to the user profile where this is shown.
- "Learn more" ghost-primary link to the user's own profile page (or the capability summary from Problem 1).

**Behaviour across workspaces:** The chip reads the role for the currently active workspace. It updates when the user navigates to a different workspace. It never shows a role from a different workspace context.

### Tasks

- [P0-Blocker] Implement a role chip in the top bar for all authenticated, non-Super-Admin users. Chip must show the current workspace role using V2 role names. Chip must update when workspace context changes. Use `Tag` (DS §7.3) with colours from `colors_and_type.css` as specified above.
- [P1-Core] Implement the popover anchored to the chip. Dismissible via Escape and click-outside. ARIA: chip button must carry `aria-haspopup="true"` and `aria-expanded` toggled on open. If the popover contains a link, assign it `role="dialog"` with a descriptive `aria-label`. If purely informational, use `role="tooltip"`.
- [P1-Core] Do not render the role chip for Super Admin users. Super Admin is an internal-only construct and surfacing it in the chip would be misleading to internal Traverse employees doing cross-workspace support work.
- [P1-Core] For Org Admin and Org Owner users operating inside a workspace, show "Workspace Admin" in the chip (their operational capability level). Their org-level role can be surfaced separately in organisation settings. The popover may optionally note "You also have Org Admin / Org Owner access across this organisation."
- [P1-Core] V2 §6.1 specifies that the Admin user list shows each user's role in other workspaces and their Org Owner / Org Admin status. Ensure the popover for multi-workspace users includes a concise cross-workspace role summary or a link to their profile where this is shown.
- [P2-Polish] On mobile viewports (if applicable): the chip may collapse to a Lucide `user` icon with a tooltip showing the role name. Do not hide it entirely — role awareness is essential on mobile.

---

## Problem 3 — A user on a read-only or restricted view has no reliable signal that they cannot edit what they are looking at

**Who:** Moderators viewing test and simulation configurations (new in V2); Viewers on any screen; Members whose permissions have just changed in real time (V2 §7.4).
**Failure mode:** A user opens a test detail or simulation and tries to click an edit control that does not exist. They do not know whether the content is in a non-editable state (published and locked) or whether their role simply does not permit editing. No signal. They feel confused or locked out.

V2 §6.1 co-exists two patterns: the lock chip is for fully read-only surfaces; disabled-with-tooltip is for individual controls left visible but not available. Both patterns must be implemented and must not be confused.

### Lock chip specification (standing note 4)

Place a small chip immediately adjacent to the content title or page primary heading. Shows a Lucide `lock` icon and the text "View only" at `ds-caption` weight. Token: `var(--surface-100)` background, `var(--surface-500)` text. Not a banner — does not interrupt reading flow.

**Where the lock chip appears:**
- Test detail view when opened by a Moderator or Viewer (V2 §1.2 Moderator read-only access is now explicit).
- Simulation detail and builder view when opened in read-only context (Moderator or Viewer).
- Submission detail when the user cannot modify grades (Viewer only).
- Any settings panel the user can read but not write.

**Disabled controls with tooltip (V2 §6.1):** For lower-frequency actions left visible but not available to the current role (distinct from the lock chip): the control is rendered in a disabled state with a Lucide `info` icon or `title` tooltip reading "Only [Role] can [action]." This is for individual controls, not entire read-only surfaces.

**Mid-session role change (V2 §7.4):** The system blocks the in-progress action. The UI shows a toast (DS `toasts.html`, error variant): "Your permissions have changed. Refresh the page to continue." Include a "Refresh" ghost-primary button in the toast action slot.

### Tasks

- [P1-Core] Define the exhaustive list of screens where the lock chip must appear, mapped to which roles trigger it. Now includes: test detail (Moderator and Viewer), simulation detail and builder (Moderator and Viewer), submission grading view (Viewer only), any settings panel that a non-admin can see but not write.
- [P1-Core] Implement the lock chip. Use `Tag` (DS §7.3) with Lucide `lock` icon and "View only" label. Tokens: `var(--surface-100)` background, `var(--surface-500)` text. Non-interactive unless it opens the role chip popover (see P2 task below).
- [P1-Core] Place the chip in the content header region, adjacent to the page or content title. Not in a separate banner row. Reference the page-within-window header pattern in the DS.
- [P1-Core] Implement the mid-session permission change toast (DS toast error variant). Message: "Your permissions have changed. Refresh the page to continue." Include "Refresh" ghost-primary button in the toast action slot.
- [P1-Core] Implement the disabled-with-tooltip pattern for lower-frequency controls that remain visible but are unavailable to the current role (V2 §6.1). Each such control: Lucide `info` icon trigger or `title` attribute reading "Only [Role] can [action]." The full list of qualifying controls requires a product team decision before implementation — flag as a content prerequisite (see Clarification 4).
- [P2-Polish] Optionally make the lock chip interactive: clicking it opens the role chip popover (Problem 2) so the user immediately understands why they are in read-only mode. This links Problems 2 and 3 into a coherent system.
- [P2-Polish] Screen reader announcement: when a read-only view loads, include a visually hidden `<span role="status">` or `aria-live` region announcing "This content is view only." so screen reader users are not surprised by absent edit controls.

---

## Problem 4 — An Admin cannot efficiently invite users, set roles, and ensure new members see content on day one

**Who:** Workspace Admins, Org Admins, Org Owners onboarding new workspace members.
**Failure mode:** The current prototype has no "Members" screen built — the Members nav item renders a `PlaceholderPanel`. The Admin has no UI surface to perform invitation, role assignment, or user management. Additionally, under the V2 hybrid access model, Moderators and Viewers must be assigned to submission groups and assets respectively before they can see anything on day one — this assignment step has no UI surface.

**V2 §3.3 hybrid model note:** Members get open workspace access upon joining. Moderators must be assigned to submission groups (lists of submissions) to grade. Viewers must be assigned to specific assets (tests, sims) to view them. The user's standing note (note 2) requires that pending-invite Moderators and Viewers can be pre-assigned before they activate, so they see content on first login.

### Layout pattern — Two-pane with peek rail and sub-tabs

The workspace Members screen adopts the same two-pane pattern as the org-level Users tab (Problem 8). This visual consistency is intentional — both surfaces manage users and should feel like a coherent system.

**Two-pane split:** the main column is fluid (`flex: 1`) and holds the data table; the peek rail is a fixed 325px aside that sticks to `flex-start`. On viewports narrower than the breakpoint (approx. 900px), the peek rail stacks below the list.

**Sub-tabs** replace the previous flat section layout. Three tabs, each with a live count in the label:
- Members · [N] — active members in this workspace.
- Invites · [N] — pending invitations only (not expired/cancelled in the count badge; all states visible in this tab).
- Deactivated · [N] — deactivated users who were members of this workspace.

Tab count badges use the same `Tag` component with a count chip as specified in Problem 8 component dependencies.

**Peek rail — empty state (no row selected):** A card (`var(--card)`, `0.5px` border, `border-radius: 12px`) containing a centred helper block: a small icon, heading "Select a member", one-sentence description, and a tips block with keyboard shortcuts:
- `⌘ click` — open the full profile at `/organisation/users/:id`
- `⇧ click` — range-select rows for bulk actions

**Peek rail — detail state (row selected):** The same card shows the selected user's detail:
- Header: Avatar (size lg) + name at `ds-title-md` + email at `ds-meta` + org-role badge if applicable (Org Owner / Org Admin) + `StatusDot` (active/deactivated).
- Meta block (`var(--well)` background, `border-radius: 9px`): job title, department, member since, last active, sign-in method — two-column label/value grid.
- Workspace memberships section (overline "Workspaces · N"): one row per workspace membership showing workspace name + role badge. Scope to the user's org-wide memberships so the Admin can see cross-workspace context without leaving the list.
- Quick actions card: a stacked list of ghost buttons — Open full profile (routes to `/organisation/users/:id`), Edit profile, Add to workspace, Change role, `hr` divider, Deactivate (danger colour). Use Lucide icons in the action icon slot; keep item labels in sentence case.

**Row interaction model:**
- Single click on a row — toggles the peek rail open for that user; clicking the same row again closes the rail.
- `⌘`+click — navigates to the full profile route (`/organisation/users/:id`) without affecting peek state.
- `⇧`+click — range-selects from the last-clicked row to the current row, consistent with standard list selection patterns.
- Checkbox click — individual select/deselect, `click.stop` to prevent row-click triggering simultaneously.

**Filter popover:** Replaces any inline filter selects. A single "Filter" button in the action row (left of the "Invite member" CTA) carries an active-count badge when filters are applied. The popover (240px wide, right-anchored, `var(--card)` background, `border-radius: 10px`) contains:
- Members/Deactivated tab: Role select (all roles / Workspace Admin / Standard / Moderator / Viewer) + Workspace select (if this screen is accessed from the org level — at workspace level this filter may be omitted as the workspace context is already scoped).
- Invites tab: State select (all states / Pending / Expired / Cancelled).
- "Clear filters" ghost link in the popover footer, disabled when no filters are active.

When filters are active, the Filter button border and text shift to `var(--primary-600)` and the badge shows the active filter count.

**Bulk action bar:** A fixed bar that slides in at the bottom of the content area when `selected.size > 0`. Shows "N users selected" count and three actions: Change role / Add to workspace / Deactivate (danger). Collapses with a transition when selection is cleared. This is a new `BulkActionBar` component — see Problem 8 component dependencies.

### Tasks — Screen scaffold and tab structure

- [P0-Blocker] Build the Members screen within the authenticated dashboard shell, reachable via the "Members" nav item in the sidebar. Page header: H2 "Members", subtitle "Manage who has access to this workspace." Primary CTA: "Invite member" (single primary button — no split-dropdown, no invite-by-link option; V2 removes Method B and that decision is preserved here).
- [P0-Blocker] Implement the three sub-tabs (Members · Invites · Deactivated) with live count chips in each tab label. Default active tab is Members. Tab state may be persisted in the URL query (`?tab=members|invites|deactivated`) for shareability. Use the `TabsBar` component pattern.
- [P1-Core] Implement the two-pane layout: fluid main column + 325px sticky peek rail. At narrow viewports (< approx. 900px) the peek rail stacks below the list. The main column contains the data table; the peek rail is a separate `aside` element.

### Tasks — Members tab (active members list)

- [P0-Blocker] The Members tab data table must show columns: checkbox, Name (Avatar + full name + email stacked), Workspaces & roles (role badge + workspace name per membership, stacked vertically if multiple), Status (`StatusDot`), Last active (relative time). V2 §6.1 specifies Admins see which other workspaces each user belongs to and their role in each — the stacked role column satisfies this.
- [P1-Core] Each member row: single click opens the peek rail for that user; `⌘`+click opens `/organisation/users/:id`; `⇧`+click range-selects. Keyboard accessible: `Enter` on a focused row opens the peek rail; `Space` selects/deselects the checkbox.
- [P1-Core] Peeked row carries a distinct background (`color-mix(in srgb, var(--primary-600), transparent 91%)`) so the Admin can see which user the rail is currently showing.
- [P1-Core] Selected rows carry a distinct selected background (`color-mix(in srgb, var(--primary-600), transparent 94%)`). When a row is both selected and peeked, the peeked style takes visual precedence.

### Tasks — Invites tab (pending invitations)

- [P0-Blocker] The Invites tab data table must show columns: Email (monospace, `var(--font-mono)`), Role (role badge), Workspace, Sent (relative time), State (`StatusDot` or badge — PENDING / EXPIRED / CANCELLED). State tokens: PENDING `var(--warn-100)` / `var(--warn-500)`, EXPIRED `var(--error-100)` / `var(--error-500)`, CANCELLED `var(--surface-100)` / `var(--surface-500)`.
- [P1-Core] Each invite row: Resend action (ghost-primary) and Cancel action (danger link) for Pending and Expired invites. Re-invite action for Cancelled invites. Resend is suppressed on Cancelled invites; Cancel is suppressed once already cancelled.
- [P1-Core] Moderator and Viewer invitation carve-out (standing note 2 / V2 §3.3 hybrid model): after an invite is sent (while status is Pending), Admins must be able to pre-assign the invited Moderator to a submission group, or the invited Viewer to a specific asset. Surface as an "Assign to content" action in the pending invite row or as an optional secondary step directly after the invite is sent. The pre-assignment takes effect when the invitation is accepted and the user activates.

### Tasks — Deactivated tab

- [P1-Core] The Deactivated tab shows users whose status is `deactivated`. Same column structure as Members tab minus the "Last active" column (replace with "Deactivated" date). Each row has a "Reactivate" action in an ellipsis menu. Do not show deactivated users inline with active members in the Members tab.

### Tasks — Peek rail

- [P1-Core] Implement the peek rail empty state: icon + "Select a member" heading + helper copy + keyboard shortcut tips (`⌘ click` opens full profile, `⇧ click` range-selects). Use `var(--font-mono)` and a small pill with `var(--raised)` background for the keyboard shortcut keys.
- [P1-Core] Implement the peek rail detail state on row selection. Required sections: header (Avatar lg, name, email, org-role badge, StatusDot), meta block (job title, department, member since, last active, sign-in method), workspace memberships overline + stacked list, Quick actions card. Close button (×) in the header dismisses the rail and deselects the row.
- [P1-Core] Quick actions card items (in order): Open full profile → routes to `/organisation/users/:id`; Edit profile → opens `EditProfileModal`; Add to workspace → opens `AddToWorkspaceModal`; Change role → opens inline role-change confirmation; `hr` divider; Deactivate → opens destructive confirmation. Sentence case throughout. Lucide icon per action.
- [P1-Core] The peek rail must be keyboard navigable: when a row is focused via keyboard, `Enter` opens the rail; `Escape` closes it and returns focus to the row. ARIA: the rail aside must carry `aria-label="User details"` and `role="complementary"`.
- [P2-Polish] Animate the peek rail's appearance (fade + slight translate-x) when switching between users or opening from empty state. Keep the animation under 150ms so it does not feel slow.

### Tasks — Filter popover

- [P1-Core] Implement the Filter button with active-count badge. When no filters are active: neutral border and `var(--surface-500)` text. When active: `var(--primary-600)` border and text, badge showing filter count. Close the popover on click-outside.
- [P1-Core] Members/Deactivated tab popover: Role select + workspace context note (workspace context is already scoped at workspace level — workspace filter may be omitted here unlike the org-level Users tab where it is required). Invites tab popover: State select only.
- [P2-Polish] "Clear filters" in the popover footer is disabled when no filters are active (`color: var(--text-hint)`, `cursor: not-allowed`). When active, it is a ghost-primary link.

### Tasks — Invite flow

- [P1-Core] Implement the "Invite member" modal. Structure: `Modal` component (md size). Fields: email address input (single address — V2 §2.1 Method A only; no comma-separated bulk entry), workspace select (pre-filled to the current workspace but editable — consistent with sandbox pattern which allows workspace selection at invite time), role selector (card-style 2×2 grid with role name + one-line capability description per card; see sandbox `InviteMemberModal` for the pattern). Optional personal note field (textarea). Footer: ghost "Cancel" + primary "Send invitation" (disabled until email is present and role is selected). Do not implement a shareable invite link option.
- [P1-Core] Role selector default: the open clarification on default role (Clarification 2 — §1.3 Viewer vs §P3 Standard) must be resolved before implementing. Task list uses Standard as the working default per the sandbox implementation, pending product decision.
- [P1-Core] Validate email format client-side. Surface errors inline: `var(--error-500)` border on the input, 12px error message below in `var(--error-600)`.
- [P2-Polish] After sending an invitation, show a success toast (DS toast success variant): "Invitation sent to [email]." Do not navigate away — the Admin may want to send another invitation immediately.

### Tasks — Role management (Admin acting on existing members)

- [P1-Core] The role control for an existing member is accessed via the Quick actions card in the peek rail ("Change role") or via the row ellipsis menu. When triggered, show a confirmation prompt (not destructive — role change is not inherently destructive): "Change [Name]'s role from [Old Role] to [New Role]? This takes effect immediately." Confirm: primary "Change role"; cancel: outline "Cancel".
- [P1-Core] Admins must not be able to change their own role (V2 §P6 — no self-escalation). In the user's own row, the role control is read-only. Show the lock chip from Problem 3 adjacent to the role badge in their own row.
- [P1-Core] When changing a user's role from Workspace Admin to a lower role and they are the only Workspace Admin, block the change and show an error toast: "You cannot remove the last Workspace Admin from this workspace."

### Tasks — Bulk operations (V2 §6.3)

- [P1-Core] Implement the `BulkActionBar` (see Problem 8 component dependencies). It appears when `selected.size > 0`, shows "N users selected" and three actions: Change role / Add to workspace / Deactivate. Change role opens a role-select dropdown then a summary confirmation modal: "Change role to [Role] for N users? This takes effect immediately." Deactivate opens a destructive confirmation modal.
- [P1-Core] Bulk deactivation confirmation modal explains impact. Use the `destructive` button variant (DS §7.1) in the confirmation footer.
- [P2-Polish] The bulk action bar slides in and out with a vertical transition when selection state changes. "Select all" / "Deselect all" checkbox in the table header updates in sync.

### Tasks — Deactivation and removal

- [P1-Core] The Quick actions card in the peek rail and the row ellipsis menu both expose: "Deactivate" (reversible, content retained) and, where appropriate, "Remove from workspace" (irreversible at the workspace level). Deactivation confirmation explains impact. Removal confirmation explains content reassignment (V2 §6.4). Both are destructive — use `destructive` button variant in confirmation footers.
- [P1-Core] Deactivated users appear in the Deactivated sub-tab, not the Members tab. Reactivation is available from the Deactivated tab row menu.

---

## Problem 5 — A user completing onboarding lands in a disorienting workspace with no context about their role or next step

**Who:** Newly activated workspace members across all roles.
**Failure mode:** Under V2 §2.2, Members immediately have access to all workspace content at their role level — so the blank "waiting for collection assignment" state from V1 no longer applies to them. But Moderators and Viewers who have not yet been assigned to submission groups or assets may still land in an empty experience with no explanation. And all new users may not understand their role or what they can do.

### Tasks

- [P1-Core] Design the post-onboarding welcome screen. Must confirm: (1) the user's name and workspace, (2) their role using the role chip treatment from Problem 2 (V2 role names), (3) a brief summary of what they can do in this workspace. Use the page-within-window pattern. This is not a modal — it is a dedicated screen state.
- [P1-Core] For Members: the welcome screen orients them to the workspace and confirms they have immediate access to all workspace content at their role level. Copy: "Welcome to [Workspace Name]. You have Member access — you can author, edit, and moderate any content in this workspace." Do not show a "wait for assignment" message.
- [P1-Core] For Moderators not yet assigned to any submission group: the welcome screen shows a context-appropriate empty state. Copy: "Welcome to [Workspace Name]. Your workspace admin will assign you to submission groups so you can start grading." Include the admin's display name and a contact action. Use the `PlaceholderPanel` pattern (DS §8.13).
- [P1-Core] For Viewers not yet assigned to any asset: same empty state pattern. Copy: "Welcome to [Workspace Name]. Your workspace admin will assign you to content so you can start reviewing." Include the admin's display name.
- [P1-Core] For all roles: if the workspace has no content yet (newly created workspace), show: "Welcome to [Workspace Name]. It looks like there is no content here yet. [Admin Name] can create content to get started." No mascots, no exclamation marks, second person.
- [P2-Polish] After the welcome screen, the user transitions to their workspace home. The role chip (Problem 2) must be visible on first render. Consider a one-time tooltip pointing to the role chip on first login: "Your role in this workspace is [Role]." Dismiss on click. Store dismissal state client-side (localStorage). Never show again after dismissed.

---

## Problem 6 — Admins have no audit trail visible in the UI, limiting accountability and troubleshooting

**Who:** Workspace Admins auditing who changed what and when.
**Failure mode:** V2 §P5 specifies that all role and access changes — invitations, role assignments, deactivations, ownership transfers — are logged with a timestamp and the actor. The audit trail is accessible to Workspace Admins and above. But there is no UI surface for it in the prototype.

V2 adds ownership transfers to the audit scope (not in V1).

### Tasks

- [P2-Polish] On the user detail view (accessible from a member row), include a collapsible "Permission history" section showing a chronological list: role changes, invitation events, deactivation and reactivation events. Each entry: timestamp + action ("Role changed from Member to Viewer") + actor ("by [Admin Name]"). Use the list-row pattern (DS §8.10 `ListRow`). Read-only — no actions from this list. Use V2 role names in all audit copy. Default collapsed; expand via a "Show history" ghost-primary link.
- [P2-Polish] If the Org Owner transfer event appears in a user's history, surface it distinctly: "Org Owner role transferred from [Old Owner] to [New Owner]" with timestamp and actor. This is a new audit event type introduced in V2.

---

## Problem 7 — The Org Owner transfer flow has no UI specification

**Who:** Org Owners who need to transfer account ownership to another user in the organisation.
**Failure mode:** V2 §1.2 and §7.5 introduce a formal Org Owner transfer process. The receiving user must actively accept. This flow does not exist anywhere in the prototype. Without a specified UI, the transfer cannot be initiated in-product. Users who need to transfer ownership (departure of a key person, change in billing authority) have no self-service path.

This problem is new in V2 — no V1 equivalent.

### Tasks

- [P1-Core] Specify and implement the Org Owner transfer initiation surface. This is an org-level action — it lives in organisation settings, not in the workspace Members screen. Flow: Org Owner navigates to organisation settings, selects "Transfer ownership", searches for and selects a user already in the organisation, and confirms. The final confirmation step is destructive-tier (the current Org Owner loses billing authority). Use the `destructive` button variant only at the final confirmation step, not at initiation.
- [P1-Core] Implement the receiving-user acceptance flow. The nominated user receives an in-product notification (and or email) prompting them to accept or decline. The notification must state: the current Org Owner's name, the organisation name, and a clear explanation that accepting makes them the sole billing authority and account owner. Two actions: "Accept transfer" (primary) + "Decline" (outline). On acceptance, the previous Org Owner is automatically demoted to Org Admin.
- [P1-Core] Confirmation states: after acceptance, the new Org Owner sees: "You are now the Org Owner of [Org Name]. You have billing authority and full administrative access." The previous Org Owner sees a parallel notification: "Your ownership of [Org Name] has been transferred to [New Owner Name]. You are now an Org Admin."
- [P2-Polish] The Org Owner role chip (Problem 2) must update for both users immediately on acceptance — no manual page reload required. If re-authentication is required mid-session, handle the re-auth modal gracefully without losing the user's current context.

---

## Problem 8 — Org Owners and Org Admins have no UI surface to manage the organisation as a whole

**Who:** Org Owners and Org Admins (and any Workspace Admin who is also an Org Admin or Org Owner, since their org-level access is cumulative).
**Failure mode:** The product gives Org Owners and Org Admins explicit org-level capabilities — creating and archiving workspaces, managing the cross-workspace user pool, viewing org-wide activity, and exercising billing authority (Org Owner only) — but there is no screen in the prototype where these capabilities can be exercised. Today they fall back to per-workspace Members screens with no consolidated view. An Org Admin trying to audit who is in the organisation, add a user across multiple workspaces, or understand org-level health has no single surface for it.

This problem was deferred in the original task list (Clarification 3 of that doc). The decision has now been made: an org-level admin surface is in scope.

**Access rule:** The `/organisation` hub and all its tabs are visible only to Org Owner and Org Admin. Workspace Admins who are not also Org Admins or Org Owners cannot see this surface. The role chip (Problem 2) shows "Org Owner" or "Org Admin" for these users when they are on the `/organisation` surface, rather than a workspace-scoped role.

### Layout — Organisation hub at `/organisation`

The hub is a full-page surface within the authenticated dashboard shell. It uses a tab bar persisted to the URL query (`?tab=summary|workspaces|users`) so that sidebar links and breadcrumbs can deep-link to any tab. Default tab on first visit is Summary.

Page header: H1 "Organisation", subtitle describing the org name + "billing, workspaces, and the shared user pool that spans them." Tab bar immediately below the header, flush left.

Tab transitions use a short opacity fade (approx. 140ms) to avoid disorienting jumps.

### Tasks — Hub scaffold

- [P0-Blocker] Create the `/organisation` hub page with `?tab=` routing. Restrict access to Org Owner and Org Admin only — Workspace Admins without an org role must see an "Access restricted" state if they navigate to this route directly, with copy: "You do not have org-level access. Contact your Org Admin." and a button back to their workspace.
- [P0-Blocker] Implement the tab bar (Summary · Workspaces · Users) with URL-query persistence. The active tab is derived from `?tab=` and defaults to `summary` if the param is absent or invalid.
- [P1-Core] The role chip (Problem 2) must show "Org Owner" or "Org Admin" (not a workspace role) when the authenticated user is on the `/organisation` surface. This is the only surface where an org role is surfaced in the chip. The chip still updates when the user navigates back into a workspace context.

### Tasks — Summary tab

**Design intent:** The Summary tab gives Org Owners and Org Admins a quick pulse on org health — how many workspaces, how many active members, how many pending invites, who holds org-level roles, and what has happened recently — without requiring them to drill into each workspace individually.

- [P1-Core] Implement four metric cards in a responsive grid (`repeat(auto-fit, minmax(160px, 1fr))`). Each card: `var(--card)` background, `0.5px` border, `border-radius: 12px`, `box-shadow: var(--shadow-card)`. Metric number at `ds-display-sm` (large, `var(--font-display)`, ~28px, `-0.4px` letter-spacing). Label below in `ds-caption`. The four metrics are: Workspaces (total count), Active members (active-status users across all workspaces; optional sub-line showing deactivated count if > 0), Pending invites (pending-state invites across all workspaces; optional sub-line for expired count), Org admins incl. owner (count of users with `orgRole: 'owner' | 'admin'`). Plain numbers only — no spark-charts, no trend arrows, no percentages.
- [P1-Core] Implement the "Organisation leaders" card below the metric row. A standard `var(--card)` card with `card-head` (title "Organisation leaders" + org name meta text) and one row per leader: Avatar (md size) + name + org-role badge (Org Owner / Org Admin, using the role badge variant from Problem 8 component dependencies) + email + "View" ghost link that routes to `/organisation/users/:id`. Org Owner appears first, separated from Org Admins by a `0.5px` hairline `var(--border)` divider. Org Admins are listed below in alphabetical order.
- [P1-Core] Implement the "Recent admin activity" card alongside the leaders card (two-column grid at ≥ 900px, stacked at < 900px). Shows the last approx. 4–6 org-level events (invitations sent, role changes, deactivations, ownership transfer events — see Problem 6 for audit entry types). Each entry: small dot indicator (`var(--indigo-300)` fill, 8px circle), event description text (13px, `var(--text-primary)`), relative timestamp below (11.5px, `var(--text-tertiary)`). "View audit log →" ghost link in the card header routes to the full audit surface (out of scope for this sprint — see Problems we are NOT solving). Read-only, no actions from this feed.
- [P2-Polish] Empty state for Recent admin activity if no events yet: "No admin activity recorded yet." in `var(--text-tertiary)` centred in the card body.

### Tasks — Workspaces tab

**Design intent:** The Workspaces tab is the Org Admin's workspace management surface. They can see all workspaces at a glance, understand each workspace's scale and recency, create a new workspace, and reach per-workspace management without navigating into each workspace individually.

- [P1-Core] Implement the Workspaces tab as a single consolidated `var(--card)` with one row per workspace (`border-top: 0.5px solid var(--border)` between rows, none on the first row). Each row shows: workspace name (`ds-title-md`, `var(--font-display)`), and a meta line with: member count · admin count · sim count · "Last active [relative time]". Right side: "Open" ghost link (routes into the workspace), "Manage admins" ghost link (routes to the workspace's Members screen filtered to Workspace Admins), and an ellipsis overflow button (overflow menu — at minimum: "Archive workspace" as a destructive item).
- [P1-Core] Search input (left-aligned in the action row) filters the workspace list by name in real time. Placeholder: "Search workspaces…". Empty state if no match: "No workspaces match your search." in `var(--text-tertiary)`.
- [P1-Core] Sort dropdown (right of search, left of "+ New workspace" CTA): options — Last active (default), Name, Members. Updates the list order in real time without pagination reload.
- [P1-Core] Primary CTA "+ New workspace" (primary button, DS §7.1). Clicking it opens a create-workspace modal or routes to a workspace creation flow. The precise flow is out of scope for this task list — flag as a dependency on the workspace creation feature.
- [P1-Core] Row hover state: `var(--card-warm)` background with 100ms transition. Row is not a `<a>` tag — it is a `<li>` with inline action buttons. Do not make the entire row a click target (the two explicit action links serve navigation).
- [P2-Polish] Workspace rows with no activity in the last 90 days may show a subtle "Inactive" `StatusDot` in the meta line. Confirm threshold with product team before implementing.

### Tasks — Users tab (cross-workspace user pool)

**Design intent:** The Users tab is the org-wide counterpart to the workspace Members screen (Problem 4). It uses the same two-pane peek-rail pattern so the two surfaces feel coherent. The key difference: this surface shows every user in the organisation across all workspaces, and each row stacks the user's role badges across all their workspaces rather than showing a single workspace-scoped role.

- [P0-Blocker] Implement the Users tab with the same two-pane layout (fluid main column + 325px peek rail) and the same sub-tab structure (Members · Invites · Deactivated with live counts) as specified in Problem 4. The tab and layout patterns are shared — reuse the same components.
- [P0-Blocker] The Members tab data table columns: checkbox, Name (Avatar + full name + email), Workspaces & roles (stacked role lines — one per workspace the user belongs to, showing role badge + workspace name, e.g. "Workspace Admin · L&D Hub", "Standard · Sales Training"), Status (`StatusDot`), Last active. If a user has no workspace memberships (e.g. invited but not yet placed), show "No workspace memberships yet." in the roles cell.
- [P1-Core] The Invites tab and Deactivated tab column structures and behaviour are identical to Problem 4, with the addition that the Workspace column in the Invites tab reflects which workspace the invitation was for.
- [P1-Core] Filter popover for the Users tab: Members/Deactivated — Role select + Workspace select (required here, unlike the workspace-scoped Members screen, because users can belong to multiple workspaces). Invites tab: State select only. Active filter count badge and "Clear filters" behaviour identical to Problem 4.
- [P1-Core] Peek rail (empty and detail states) is identical in structure to Problem 4. The workspace memberships section in the detail state shows all the user's workspace memberships across the org (not scoped to one workspace).
- [P1-Core] Invite CTA: single primary button "Invite member" — no split-dropdown, no invite-by-link option. Opens the same `InviteMemberModal` as Problem 4.
- [P1-Core] Bulk actions: identical to Problem 4 — Change role / Add to workspace / Deactivate via the `BulkActionBar`.
- [P2-Polish] Org-role badges (Org Owner / Org Admin) appear in the Name cell alongside the user's name, exactly as they appear in the workspace Members screen. These are identity badges, not workspace-role badges.

### Tasks — User profile drilldown at `/organisation/users/:id`

**Design intent:** When an Admin needs to go deeper than the peek rail allows — editing a user's profile, reviewing their full workspace membership history, inspecting their activity trail, or performing account-level actions — they navigate to the full profile. This is the only surface where account-level destructive actions (deactivate, delete) are available with appropriate context and confirmation.

- [P0-Blocker] Create the `/organisation/users/:id` route. If no user matches `:id`, show a not-found state: title "User not found", copy "The user you are looking for does not exist or has been removed.", primary button "Back to users" (routes to `/organisation?tab=users`).
- [P0-Blocker] Breadcrumb: "Users › [User name]", where "Users" is a link back to `/organisation?tab=users`. Font: 12px, `var(--text-tertiary)`. Current page segment is `var(--text-primary)`, weight 500. Separator: `›` with `var(--text-hint)`.
- [P0-Blocker] Implement the two-column grid layout: main card (fluid, ~2fr) on the left, side card (~1fr, minimum 280px) on the right. Below ~900px: stack to a single column, side card below main card.
- [P1-Core] **Main card — Identity section** (no top hairline — this is the first section): Avatar (lg) + name (H1, `ds-title-lg`, `var(--font-display)`, ~24px) + org-role badge (if applicable) + `StatusDot`. Below name: email address (13px, `var(--text-secondary)`), org membership line (12px, `var(--text-tertiary)`): "[Org Name] · Member since [date]". Identity section actions (inline, right side of the identity row): "Edit profile" (secondary button), "Add to workspace" (secondary button), overflow button (ellipsis) expanding a menu with: Reset password, Resend verification, Copy user ID, `hr` divider, Deactivate account (danger colour). Overflow menu items in sentence case. Deactivate in the overflow is the entry point to the deactivation flow; the Danger zone card (below) is the more prominent surface for account-level destructive actions.
- [P1-Core] **Main card — Bio section** (hairline separator above): `dl` with three rows — Department, Job title, Bio. Label (11.5px, `var(--text-tertiary)`, uppercase, `0.04em` letter-spacing) above value (13.5px, `var(--text-primary)`, `line-height: 1.55`). Empty value displays as `—`. Editing bio fields opens `EditProfileModal`.
- [P1-Core] **EditProfileModal**: md-size `Modal` component. Fields: photo upload (Avatar preview + "Change photo" ghost link + format/size note), Full name, Job title (col span half), Department (col span half), Bio (textarea). Footer: ghost "Cancel" + primary "Save changes". The modal prefills from the user's existing data. Minimal over-spec — keep it a thin form modal as noted in the brief.
- [P1-Core] **Main card — Workspace memberships section** (hairline separator above): Section header "Workspace memberships" + "+ Add" ghost-primary link (opens `AddToWorkspaceModal`). A table with columns: Workspace (name, weight 500), Role (role badge), Added (date formatted `DD Mon YYYY`), Added by (display name), and an actions column (right-aligned) with "Change role" link and "Remove" danger link per row. Empty state if no memberships: "Not a member of any workspace yet." centred across all columns. Per-row "Change role" opens the inline confirmation from Problem 4 role management tasks. Per-row "Remove" opens a destructive confirmation.
- [P1-Core] **AddToWorkspaceModal**: md-size `Modal` component (distinct from `InviteMemberModal` — this is for adding an *existing* user to an additional workspace, with no email/invitation involved). Title: "Add [Name] to workspace". Fields: Workspace select (auto-filtered to exclude workspaces the user is already in; if no workspaces remain, show: "This user is already a member of every workspace in the organisation." and disable the confirm button) + Role in this workspace select. An info block below the fields: "Users can hold different roles in different workspaces. Changes take effect immediately." (`var(--well)` background, `var(--well-border)` border). Footer: ghost "Cancel" + primary "Add to workspace" (disabled when no available workspaces).
- [P1-Core] **Main card — Activity section** (hairline separator above): Section header "Activity" + "View full audit log →" ghost link (scoped to future audit surface). Renders the user's permission-change history using the `AuditList` component (see Problem 8 component dependencies; same underlying data as the Problem 6 "Permission history" section on the user detail view — these are the same surface, just scoped to a specific user). Entry format: `[timestamp] · [action text]`. Action text uses V2 role names throughout. Ownership transfer events are surfaced distinctly per Problem 6 tasks. Empty state if no recorded activity: "No recorded activity yet." in `var(--text-tertiary)`.
- [P1-Core] **Side card — At a glance section** (no top hairline — first section): A `dl` with five rows — Org role, Member since, Invited by, Last active, Sign-in method. Two-column layout: label left (11.5px, `var(--text-tertiary)`), value right (13px, `var(--text-primary)`, text-align: right). Hairline separators between rows, none on the last. Values that are not applicable display as `—`.
- [P1-Core] **Side card — Danger zone section** (hairline separator above, title "Danger zone" in `var(--error-600)` or `var(--danger-strong)`): Two rows, each with label + description + action button:
  - "Deactivate account" — "Prevents sign-in. Content retained. Reversible." — secondary "Deactivate" button. Confirmation modal on click: destructive confirmation explaining impact, with "Deactivate account" as the destructive action.
  - "Delete account permanently" — "Reassigns content. Submission history anonymised. Cannot be undone." — `destructive` "Delete" button. Confirmation modal requires the Admin to type the user's name to confirm (prevents accidental deletion). This is the only place permanent deletion is accessible.
- [P2-Polish] After deactivation, the `StatusDot` and any status indicators on the profile update immediately without a full page reload. The Deactivate button in the Danger zone changes to "Reactivate" for deactivated users.
- [P2-Polish] After "Add to workspace" succeeds, the Workspace memberships table updates in place (optimistic update) without navigating away.

### Component dependencies

New atoms this surface introduces that the design system likely does not have yet. Several overlap with Problem 4 — listed once here for single-sourcing, cross-referenced where needed:

- **`Modal` (sm / md / lg sizes)** — the sandbox uses a `Modal` wrapper component throughout. Check whether `components/Modal.vue` (or equivalent in `components/`) exists in the prototype already. If not, create a reusable modal shell: scrim, centred card, `aria-modal="true"`, `role="dialog"`, `aria-labelledby` pointing to the modal title, `Escape` to close, focus trap. Three size variants controlling max-width (sm ≈ 400px, md ≈ 480px, lg ≈ 640px).
- **`StatusDot`** — an inline dot indicator with a status prop (`active | pending | deactivated | expired | cancelled`). Active: `var(--success-500)`; pending: `var(--warn-500)`; deactivated: `var(--surface-400)`; expired: `var(--error-500)`; cancelled: `var(--surface-400)`. 8px circle. Replaces the previous badge-only approach for status signalling in tables.
- **`BulkActionBar`** — a fixed bottom bar (`position: sticky`, bottom of the scroll container or `position: fixed` at the viewport bottom) with a dark background (`var(--surface-800)` or equivalent), count slot, and named action slot for ghost/danger buttons. Appears with a slide-up transition when `count > 0`, collapses when `count === 0`. Used in both the workspace Members screen (Problem 4) and the org Users tab.
- **Peek-rail layout** — the `aside.peek-rail` (325px, `flex-shrink: 0`, `align-self: flex-start`) with its two states (empty helper card / detail card). Used in both Problem 4 and Problem 8 Users tab — this should be a shared layout pattern, not duplicated.
- **Filter popover** — the Filter button + dropdown popover pattern (single button with active-count badge, 240px popover, role/workspace/state select fields, "Clear filters" footer link). Used in both Problem 4 and Problem 8 Users tab. Implement as a shared component.
- **`AuditList`** — a read-only list of `AuditEntry` items. Each entry: timestamp, event text (may contain `<strong>` for entity names), optional actor, optional tone variant (`default | warn | danger`) that shifts the dot colour. Used in the Activity section of the user profile drilldown and in the Recent admin activity card on the Summary tab. Cross-references Problem 6's "Permission history" section — same underlying component.
- **Tabs with count chip** — tab labels that display a live count alongside the tab name (e.g. "Members · 14"). The count appears as a small numeric chip to the right of the label text, using `var(--surface-200)` background and `var(--surface-600)` text at rest, `var(--primary-50)` background and `var(--primary-700)` text when the tab is active. Cross-reference the `TabsBar` component to see whether count chips are already supported as a prop; if not, extend rather than fork.
- **Role badge variants (6)** — the sandbox `roleBadgeVariant` map defines: `role-owner`, `role-org-admin`, `role-ws-admin`, `role-std`, `role-mod`, `role-viewer`. These must be reflected in the DS `Tag` / `Badge` component variants. **Colour convention resolved (2026-05-14): 2-tier neutral, matches Problem 2 chip spec** — admin tier (`role-owner`, `role-org-admin`, `role-ws-admin`) uses `var(--primary-50)` background / `var(--primary-700)` text; non-admin tier (`role-std`, `role-mod`, `role-viewer`) uses `var(--surface-100)` background / `var(--surface-600)` text. The 6-colour warm-desaturated per-role palette originally sketched in this subsection is discarded. These should be added as named variants, not inline styles.

---

## Clarifications needed

1. **V2 §3.3 access model contradiction.** The section opens with "Collections do not gate access" and "Pure RBAC", then immediately introduces a hybrid model: Moderators are assigned to submission groups, Viewers are assigned to specific assets. These are incompatible statements. The actual model appears to be: Members = open workspace access; Moderators = assigned to submission groups; Viewers = assigned to assets. Confirm the intended model before implementing any access assignment UI. This affects Problem 4 (invite flow carve-out) and Problem 5 (welcome screen empty states).

2. **Default invite role — §1.3 says Viewer, §P3 says Member.** These are directly contradictory. One must be definitive. The task list cannot specify the invite modal default until this is resolved. This is a product decision, not a UI decision.

3. ~~**Organisation Admin UI surface.**~~ **Resolved — see Problem 8.** An org-level admin surface at `/organisation` (hub with Summary · Workspaces · Users tabs, plus user profile drilldown at `/organisation/users/:id`) is confirmed in scope. Problem 8 fully specifies this surface.

4. **Disabled-with-tooltip — which controls exactly?** V2 §6.1 says lower-frequency controls "where discoverability matters" remain visible but disabled. The PRD gives "publishing a template" as one example but does not enumerate the full list. The product team must produce this list before the Problem 1 and Problem 3 tooltip tasks can be implemented. Flag as a prerequisite.

5. **Real-time role change experience (V2 §7.4).** V2 says the system blocks the action and "displays a message". The task list specifies a toast. If the preference is a modal interrupt instead of a toast, the toast task changes. Needs a product decision.

6. **Org Owner visibility in workspace member lists.** Should the Org Owner appear in each workspace's member list with a distinct "Org Owner" tag? They have implicit Workspace Admin access in all workspaces. V2 §6.1 says Admins see "Org Owner / Org Admin status, where applicable" — implying they should appear. Confirm tag treatment: a second chip alongside the workspace role chip, or a single combined label?

7. **Moderator and Viewer pre-assignment UI — where does it live?** The task list proposes an optional secondary step in the invite flow or an action in the pending invite row. Confirm the preferred surface and when it should be available (before or after invite is sent).

8. **Bulk invite — intentionally removed or wording imprecision?** V2 §2.1 Method A describes entering "one email address" — singular. V1 allowed comma-separated bulk entry. Has bulk email invite been deliberately removed, or is the V2 wording imprecise? The task list implements single-email based on V2's literal wording but this should be confirmed before building.

---

## Problems we are NOT solving in this sprint

- **Teams.** Fully out of scope per user standing note 1. Teams do not appear in V2. Team creation, management, membership, and team-based assignment are excluded entirely.
- **Shareable invite links.** Removed from V2. Not in scope.
- **Super Admin UI.** Internal Traverse employee role. No customer-facing screens in scope.
- **Organisation-level settings (full surface).** Billing, SSO configuration, org branding, and workspace creation flows (beyond the "+ New workspace" CTA stub in the Workspaces tab) are Org Admin and Org Owner capabilities not fully specced in this sprint. The org admin hub (Problem 8) covers user management, workspace overview, and the Summary view. Full billing, SSO, and branding settings are deferred.
- **Role customisation.** Mentioned in V1 §9 as a future consideration. Not present in V2. Out of scope.
- **Advanced audit and compliance reporting.** The task list includes a minimal permission history view (Problem 6, P2-Polish). Full exportable audit reports are out of scope.
- **LMS integrations and external system connections.** Admin capabilities not detailed in this PRD. Out of scope.
- **Onboarding form UI.** The registration page, email verification step, and sign-up card are covered by existing `pages/signup.vue` and `screens/signup` surfaces. This task list focuses on post-signup access management.
- **Account closure flow.** V2 §7.5 notes the Org Owner can close or cancel the organisation account, requiring re-authentication and a confirmation step. Destructive, low-frequency action warranting its own design treatment — deferred from this sprint.
- **Global workspaces and global templates.** Super Admin-only capability. Out of scope for customer-facing UI.

---

## Removed from V1

The following problems and tasks from the V1 scope are retired. Because the prior task doc is treated as discarded, this section describes what V1 specified and why it no longer applies under V2.

- **V1 Problem: Pending-invite collection assignment (pure ACL model).** V1 assumed all roles required explicit collection assignment before they could see any content. V2 §3.3 changes this: Members get open workspace access immediately, and the collection-level ACL applies only to Moderators (submission groups) and Viewers (specific assets). The original "assign a pending user to collections before they activate" problem is now scoped only to Moderators and Viewers — and is retained in Problem 4 of this doc (standing note 2). The broader "everyone needs collection assignment" pattern is retired.

- **V1 teams section (entire).** Teams are absent from V2 and scrapped per user standing note 1. Retired: team creation UI, team member management UI, team-based collection assignment UI, team deletion confirmation, "Add to Team" bulk operation, and all team-related permission matrix rows.

- **V1 collection Access tab (full surface).** V1 §4.3 specified a detailed collection-level Access or Permissions tab with "Add User", "Add Team" pickers, inherited access views, and "Remove Access" flows. Under V2 §3.3's hybrid model, Members need no such surface (open access). Moderators and Viewers still require assignment, but to submission groups and assets respectively — not to collections as an ACL gate. The V1 collection Access tab as specified is retired. Any Moderator and Viewer assignment UI is a new design problem to be specified (flagged under Problem 4 and Clarification 7).

- **V1 shareable invite link (Method B).** The invite link option (create link, set expiry, set usage limit, copy link button, generated link readonly input) is removed. V2 §2.1 drops Method B entirely. Retired.

- **V1 "Add to Collection" bulk operation.** Bulk "Assign to Collection" (select multiple users and add them to a collection) is retired. Collections no longer gate access for Members. Moderator and Viewer group/asset assignment is a separate, scoped flow (Problem 4 carve-out).

- **V1 invitation "Accepted" state UI.** The "Accepted" state (user clicked link, has not finished onboarding) does not appear in V2 §2.3's invitation states table. The visible states are Pending, Expired, Cancelled. The Accepted state is retired from the Admin-facing pending invitations UI. (See Clarification 6 in the prior pass — now retired as V2 is definitive on this.)

- **V1 "Most Permissive Access Wins" principle (P5).** V1 §P5 resolved conflicts between individual and team-based access grants in favour of the most permissive grant. With teams removed and the access model simplified, this principle has no application surface and is retired.

- **V1 "Teams Simplify Access, Not Permissions" principle (P4).** Same reason. Retired with teams.

- **V1 Admin capability: "Assign teams to collections".** Removed from permission matrix — teams are gone.
