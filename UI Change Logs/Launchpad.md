# Launchpad (vercel-setup) — change log

- 2026-06-22 — Added two rows to the launchpad: **Test journey** (`/prototypes/test-journey/`) under Application, and **Component library** (`/component-library/`) in a new Foundations group. Linked to real directory paths rather than `vercel.json` rewrites so the component library's relative registry/loader fetches keep working.

- 2026-07-01 — Added a **Move workspaces** row (Super user badge) under Settings, linking to `/dashboard?screen=organisation&persona=sysadmin&mvw=1`. It lands on the Acme Org page as the internal super user and auto-opens the move-workspaces journey.

- 2026-07-17 — Added a "Dashboard — new-user states" group linking to each state a newly joined user lands on, via `?welcome=1&role=…`: Workspace admin · new workspace (admin-empty), Member · new workspace (empty), Workspace admin (admin), Member (standard), Moderator, and Viewer. Placed after "Login landing" so the launchpad follows the join → land-on-dashboard order.
