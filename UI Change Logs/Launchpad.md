# Launchpad (vercel-setup) — change log

- 2026-06-22 — Added two rows to the launchpad: **Test journey** (`/prototypes/test-journey/`) under Application, and **Component library** (`/component-library/`) in a new Foundations group. Linked to real directory paths rather than `vercel.json` rewrites so the component library's relative registry/loader fetches keep working.

- 2026-07-01 — Added a **Move workspaces** row (Super user badge) under Settings, linking to `/dashboard?screen=organisation&persona=sysadmin&mvw=1`. It lands on the Acme Org page as the internal super user and auto-opens the move-workspaces journey.

- 2026-07-17 — Added a "Dashboard — new-user states" group linking to each state a newly joined user lands on, via `?welcome=1&role=…`: Workspace admin · new workspace (admin-empty), Member · new workspace (empty), Workspace admin (admin), Member (standard), Moderator, and Viewer. Placed after "Login landing" so the launchpad follows the join → land-on-dashboard order.

- 2026-07-17 — Added an "Org owner · new organisation" row (top of the Dashboard — new-user states group) linking to `?welcome=1&role=org-owner-new` — the guided org-settings landing.

- 2026-07-17 — Extended the "Dashboard — new-user states" group with the four new active/role states: Org owner · active (`role=org-owner`), Org admin · new (`role=org-admin-new`), Org admin · active (`role=org-admin`), Moderator · assigned and Viewer · assigned rows.

- 2026-08-10 — Rewrote the launchpad to render from generated `status.json` (built by `npm run status` from each prototype's screen `data-status` + `#prototype-manifest`; no hand-maintained rows left except the pinned Foundations link). Kept the shell, brand header, group labels, card rows and footer; added: live status counts under the lede (filter shortcuts), sticky filter bar with multi-select status chips + counts, live search (`/` focuses, `Esc` clears), by-area / by-status grouping, a status pill + mono screen name + last-touched + design-doc link (or muted "No design doc") on every row, superseded row treatment (muted, struck title, "Replaced by →" jump), URL-synced filters (`/?status=ready` shareable), collapsed legend, empty state with reset, and an inline error pointing at `npm run status` if status.json is missing. `aria-pressed` chips, `aria-live` result count, `--border-focus` focus rings.
