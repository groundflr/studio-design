# System admin (super user)

**Status:** Draft
**Last updated:** 2026-06-17
**Author:** Lara Unsworth
**Reviewed by:** —
**Linear project:** Users and Permissions
**Linear issue:** — *(added once the ticketing agent runs — see §12)*
**Linear sub-issues:** — *(added once created — see §12)*

> The internal **super user** surface: a cross-organisation control plane that sits
> above the per-org / per-workspace settings. Only internal Traverse super users
> reach it. This doc covers the System area (summary + lists + organisation
> management) and the super-user variant of the login landing.

---

## Where this lives in the repo

- **Prototype:** `prototypes/dashboard/index.html`
  - `data-screen="system-admin-summary"` — System summary
  - `data-screen="system-admin-organisations"` — All organisations (+ add organisation modal `#org-new-org-modal`)
  - `data-screen="system-admin-workspaces"` — All workspaces (org filter + sort)
  - `data-screen="system-admin-users"` — All users (unchanged tabular list)
  - Login landing super-user variant: `#login-launch` (role-driven by persona)
  - System Admin sidebar variant: `data-sidebar-variant="system-admin"`
- **UI change log:** `ui-change-logs/Dashboard.md` (entries dated 2026-06-17)
- **Design system refs:** `design-system/traverse-design-system.md` (lists, cards, summary metrics, dropdowns); `design-system/colors_and_type.css`
- **Related features:** [organisation-admin](../organisation-admin/organisation-admin.design.md) (per-org admin — the pattern this reuses), [workspace-admin](../workspace-admin/workspace-admin.design.md), [user-onboarding](../user-onboarding/user-onboarding.design.md) (login landing lives alongside the onboarding landing pattern)

---

## How to navigate through prototypes

**Entry points (prototype landing page → `vercel-setup/index.html`):**

| Link | Opens |
|---|---|
| System settings | `/dashboard?screen=system-admin-summary&persona=sysadmin` |
| Login landing — super user | `/dashboard?login=1&persona=sysadmin` |

### Devbar controls

| Control | Type | Effect | State / variant surfaced | Maps to |
|---|---|---|---|---|
| Persona → Internal Admin (Super Admin) | Dropdown | Sets the logged-in user to a super user | Unlocks the System area + super-user variants everywhere | `window._setPersona('sysadmin')` |
| Screen → SA · Summary | Dropdown | Jumps to the System summary | System-level metrics + super-user activity | `data-screen="system-admin-summary"` |
| Screen → SA · Organisations | Dropdown | Jumps to the organisations list | Card-row org list + Add organisation | `data-screen="system-admin-organisations"` |
| Screen → SA · Workspaces | Dropdown | Jumps to the workspaces list | Card-row ws list w/ org filter + sort | `data-screen="system-admin-workspaces"` |
| Modals → SA · Add organisation | Dropdown | Opens the create-organisation modal | Org name + default workspace fields | `#org-new-org-modal` |
| Screen → Login launch | Dropdown | Opens the login landing for the active persona | Super-user → workspaces grouped by org | `#login-launch` |

### Walk-throughs

- **Super user enters the System area:** Set Persona → Internal Admin. The workspace sidebar Settings section now shows **System** above Organisation. Click it → lands on System summary. (Non-super personas never see System.)
- **Create an organisation:** From System summary → Organisations → "Add organisation". Enter an org name; the default workspace is pre-filled "Default Workspace". Click "Create organisation" → the new org prepends to the list, sorted into place, with a success toast.
- **Find a workspace across orgs:** Organisations → Workspaces. Use **Org:** filter to narrow to one organisation, **Sort:** to order by name or creation date.
- **Cross-org login landing:** Set Persona → Internal Admin, click Login launch. Workspaces are grouped under each organisation the super user belongs to; pick any to continue.

---

## 1. Intent

The System area is the internal control plane for Traverse super users — the people
who administer the platform *across* customer organisations rather than inside one.
It answers "what's the state of the platform, and let me create / find / manage any
org or workspace" without granting per-org roles.

**User goal:** As an internal super user, see platform-wide state and create or locate any organisation or workspace.
**Product goal:** A single, role-gated super-user surface that reuses the existing org/workspace admin patterns rather than a separate admin app.

---

## 2. Scope

### In scope
- **System summary** in the org/workspace summary format: organisations count, super-users count, plus total workspaces / members, and a recent **super-user** activity feed.
- **Organisation management:** a card-row list of organisations and an **Add organisation** flow that creates the org + its required default workspace in one action; creator becomes owner.
- **Workspaces list** (system-wide): card-row list showing each workspace's **organisation**, with **filter by organisation** and **sort** (name A–Z / Z–A, newest / oldest).
- **Organisations list** sort (name / creation date).
- **System nav entry** in the workspace sidebar Settings section, super-user only, above Organisation.
- **Login landing — super user variant:** workspaces grouped by organisation across all the super user's orgs.
- Access gating: every System surface is reachable only by the super-user persona.

### Out of scope
- Per-organisation role assignment for the super user (they are all-access, never a per-workspace admin/member — no role is shown for them).
- Billing, audit-log detail screens (the summary links to "View audit log" but the log itself is not built).
- Editing / deleting organisations (row overflow + "Open" are placeholders).
- Real data: counts, dates, activity, and org↔workspace mapping are prototype fixtures.

---

## 3. Surface and placement

| Surface | Where | Who sees it |
|---|---|---|
| System nav item | Workspace sidebar → Settings (above Organisation) | Super users only (`renderSbSettings`, `isSuper = p.isSuperAdmin`) |
| System Admin sidebar | `data-sidebar-variant="system-admin"` | Active while on any `system-admin-*` screen |
| System Admin nav order | Summary / Organisations / Workspaces / Users / Simulations / Characters / Voices | — |
| Add organisation CTA | System Admin → Organisations toolbar (primary button) | Super users |
| Login landing (super variant) | `#login-launch` overlay, persona-driven | Super users |

Two entry points into the System area both land on **Summary**: the sidebar Settings → System item, and the workspace-dropdown "System admin" entry.

---

## 4. Super user flows

> Plotted as step flows. `[screen]`, `{modal}`, `(action)`.

### Flow A — Sign in and choose a workspace across organisations
```
(super user authenticates)
  → [Login landing]  role = super user
      • copy: "Choose a workspace to continue." / "…across multiple organisations."
      • list grouped under each ORG the user belongs to (Traverse, Northwind Group, Helix Labs…)
      • search filters across all groups; "New workspace" available (super can create)
  → (click a workspace row)
      → enters that workspace's [Dashboard]   (sidebar identity shows workspace + org sub-line)
```

### Flow B — Enter the System area
```
[Dashboard]  (persona = super user)
  → sidebar → Settings → (click "System")        ← visible to super users only
      → [System summary]
          • metrics: Organisations · Super users · Workspaces · Members
          • Recent super-user activity feed (+ View audit log →)
  → sidebar (System Admin variant): Summary · Organisations · Workspaces · Users · …
```

### Flow C — Create an organisation (+ default workspace) in one action
```
[System summary] → (Organisations) → [All organisations]
  → (Add organisation)  → {Add organisation modal}
        fields:  Organisation name (required)
                 Default workspace name (required, pre-filled "Default Workspace")
        helper:  "Every organisation needs a workspace to land in. You can rename it
                  later. You'll be added as the organisation owner."
        validation: Create disabled until org name present
                    footer hint: "Add organisation name" → "Add a default workspace name" → ''
  → (Create organisation)
        • org + its default workspace created together
        • new row prepended to the list, re-sorted into position
        • owner = current super user
        • toast: "Organisation created"
        • form resets (name cleared, workspace → "Default Workspace")
```

### Flow D — Locate / triage a workspace across orgs
```
[All workspaces]   (each row shows its ORGANISATION as the lead meta item)
  → (Org: filter)  → choose one organisation → list narrows to that org's workspaces
  → (Sort:)        → Name (A–Z / Z–A) | Newest first | Oldest first
  → (filter + sort compose)
  → (Open / ⋯)     → placeholder row actions
```

### Flow E — Browse organisations
```
[All organisations]   (rows: N workspaces · Owner · Created date)
  → (Sort:)  → Name (A–Z / Z–A) | Newest first | Oldest first
```

### Access matrix (who reaches what)

| Persona (tier) | Login landing | Settings: System | Settings: Organisation | Settings: Workspace |
|---|---|---|---|---|
| Internal Admin (super) | grouped by org | ✅ | ✅ | ✅ |
| Org owner / Org admin | flat list | — | ✅ | ✅ |
| Workspace admin | flat list | — | — | ✅ |
| Member | flat list | — | — | — |
| Single-workspace (member/WS-admin) | "Continue" into the one workspace | — | per tier | per tier |

---

## 5. States and variants

| Surface | States |
|---|---|
| Login landing | super (grouped by org) · multi-ws (flat) · single-ws ("Continue") · create vs no-create by tier · search empty-state |
| Organisations list | default (A–Z) · sorted (Z–A / newest / oldest) · after-create (new row, re-sorted) |
| Workspaces list | unfiltered · filtered to one org · sorted · filter+sort composed |
| Add organisation modal | invalid (create disabled, footer hint) · valid · submitted (toast + row + reset) |
| System nav | shown (super) · hidden (everyone else) |

---

## 6. Copy

| Element | Copy |
|---|---|
| System summary title | System summary |
| Summary metrics | Organisations · Super users · Workspaces · Members |
| Activity card | Recent super-user activity · View audit log → |
| Organisations list title | All organisations |
| Add organisation button | Add organisation |
| Add org modal title | Add organisation |
| Add org fields | Organisation name · Default workspace name |
| Add org helper | Every organisation needs a workspace to land in. You can rename it later. You'll be added as the organisation owner. |
| Add org submit | Create organisation |
| Add org success | Organisation created |
| Workspaces list title | All workspaces |
| Filter control | Org: <organisation> |
| Sort control | Sort: Name (A–Z) / Name (Z–A) / Newest first / Oldest first |
| Login landing (super) | Choose a workspace to continue. / You have access to workspaces across multiple organisations. Select one to continue. |

Voice: sentence case, second person, no emoji, verbs lead CTAs. "Organisation" (en-GB) throughout.

---

## 12. Linear

> Canonical input for the ticketing agent. No IDs yet — run `/tickets system-admin`.

**Project:** Users and Permissions
**Issue:** System admin (super user) — cross-org control plane

**Suggested sub-issues:**
| Layer | Sub-issue |
|---|---|
| Frontend | System Admin shell: sidebar variant + Summary/Organisations/Workspaces routing, super-user gating |
| Frontend | System summary page (metrics + super-user activity feed) |
| Frontend | Organisation management list (reuse org workspaces card-row pattern) + filter/sort |
| Frontend | Workspaces system list: organisation column, filter-by-org, sort |
| Component | Sort + filter dropdown control (shared `.sort-control`) |
| Component | Add organisation modal (reuse new-workspace modal) |
| Backend | Create organisation + default workspace in one transaction; set creator as owner |
| Backend | System summary aggregates (org count, super-user count, workspace/member totals, activity) |
| Frontend | Login landing — super-user grouped-by-org variant |
| Copy | System area copy + helper text review |
