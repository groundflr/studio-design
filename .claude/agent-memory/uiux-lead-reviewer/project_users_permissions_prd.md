---
name: Users & Permissions PRD — key decisions and scope constraints (V2, 2026-05-13)
description: Scope rules, open design problems, access model, and surface gaps from the V2 PRD review on 2026-05-13. Previous V2 file was incorrect and discarded — this reflects the replacement V2.
type: project
---

Teams feature is scrapped entirely per user standing note. All team UI excluded.

**V2 access model — partial hybrid, not pure RBAC:** Standard Users get open workspace access. Moderators must be assigned to submission groups (lists of submissions) to grade. Viewers must be assigned to specific assets (tests, sims) to view them. V2 §3.3 is internally contradictory (opens with "pure RBAC" then introduces ACL for Moderators and Viewers) — this contradiction needs a product decision. Pending-invite Moderators and Viewers can be pre-assigned before they activate (user standing note 2 retained).

**New role: Org Owner.** Distinct from Org Admin. Exactly one per org. Exclusive: billing, payment, invoices, ownership transfer, account closure. Transfer requires acceptance by receiving user; previous Org Owner demoted to Org Admin automatically.

**Author renamed Standard User throughout V2.** Two new capabilities vs V1: publish environments (no admin approval), publish workspace templates. Standard Users can also create collections.

**Moderator read-only access to tests and sims is now explicit in V2.** This generates a new UI state: test and simulation detail views rendered in read-only mode for Moderators, with the lock chip.

**Default invite role — V2 internal contradiction:** §1.3 says Viewer; §P3 says Standard User. Must be resolved by product team before building the invite modal.

**No shareable invite link in V2.** Method B (shareable link) fully removed. Single email address per invite action.

**Invitation states simplified:** Pending, Expired, Cancelled. "Accepted" state is gone from Admin-facing UI.

**Disabled-vs-hidden rule is new in V2 §6.1:** High-frequency admin controls = hidden. Lower-frequency controls where discoverability matters = disabled with tooltip ("Only [Role] can [action]"). The exhaustive list of "lower-frequency" controls is not specified in V2 — needs product team decision.

**Moderator export / sync results = ✗.** Resolved in V2 matrix. Not an open item.

Key problem groups in `uiux-tasks/Users and Permissions.md` (rewritten 2026-05-13):
- Problem 1: Discoverability of capabilities — three options, team decision pending.
- Problem 2: Role chip in top bar — Tag component, neutral palette for non-admin, primary tint for admin roles.
- Problem 3: Lock chip for read-only surfaces + disabled-with-tooltip for individual controls + mid-session role change toast.
- Problem 4: Members screen (P0-Blocker PlaceholderPanel), invite flow (single email), role management, bulk operations, deactivation, Moderator/Viewer pre-assignment carve-out.
- Problem 5: Post-onboarding welcome screen — differentiated by role (Standard User open access; Moderator/Viewer empty state pending assignment).
- Problem 6: Audit trail in user detail view (P2-Polish), including Org Owner transfer event.
- Problem 7: Org Owner transfer flow — new in V2, lives in org settings, acceptance by receiving user, parallel notifications to both parties.

**Why:** User replaced the V2 PRD with a corrected version. All prior conclusions from the incorrect V2 were discarded and re-derived from V1 + new V2 + user's four standing notes.

**How to apply:** When implementing or reviewing Users & Permissions screens, exclude Teams entirely. The hybrid access model means Moderator and Viewer assignment UI is still needed (to submission groups and assets respectively) — do not treat access as fully open for all roles. The role chip (Problem 2) is the most cross-cutting component; implement first. The default invite role contradiction must be resolved before building the invite modal.
