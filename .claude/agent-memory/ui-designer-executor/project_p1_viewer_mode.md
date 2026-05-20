---
name: project-p1-viewer-mode
description: P1 capability discoverability — viewer-mode attribute on org-user-profile screen, cross-IIFE window exposures, and capability section architecture.
metadata:
  type: project
---

P1 implemented 2026-05-18 as Option A (self-view profile section) on `prototypes/dashboard/index.html`.

**Architecture:**
- `data-viewer-mode="other"|"self"` on `<section data-screen-name="organisation-user-profile">` drives CSS attribute selectors.
- `[data-other-only]` / `[data-self-only]` on HTML elements — CSS `display: none !important` via scoped selectors.
- P1 IIFE is the third `(function(){})()` in the single `<script>` block (first = main/outer, second = P5 welcome hero, third = P1).

**Cross-IIFE window exposures** (added at end of outer IIFE before it closes):
- `window._navTo` — navTo function
- `window._renderUserProfile` — renderUserProfile
- `window._openOrgModal` / `window._closeOrgModal`
- `window._currentWorkspaceId` — getter returning live `currentWorkspaceId` from outer IIFE

**Capability bullets:** resolved in P1 IIFE from `P1_WORKSPACES` (local copy of SARAH_WORKSPACES) + `window._currentWorkspaceId` getter + `window._orgUserById` for orgRole. Org Admin/Owner addendum appended when applicable.

**Workspace switch re-render:** MutationObserver on `#ws-switch-toast` triggers `renderCapabilities()` when `currentViewerMode === 'self'`.

**Deferred:** disabled-with-tooltip pattern blocked on Clarification 4 — no product enumeration of which controls fall into this bucket.

**Why:** User picked Option A over Option B (searchable index) and the reverted Option C (chip in top bar). Clean reuse of existing profile screen structure.

**How to apply:** When adding new viewer-mode-conditional content in future, use `data-self-only` / `data-other-only` attributes — CSS handles visibility automatically. Call `setViewerMode(mode)` (via `window._setViewerMode`) to switch modes programmatically.
