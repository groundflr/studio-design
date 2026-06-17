# Features

This folder is the **developer-facing index** for everything in this repo.
Each subfolder is a single product feature and contains a `<feature-name>.design.md`
that describes the feature's scope, behaviour, and — crucially — points to exactly
where the design lives in the rest of the repo (prototype HTML, PRD, tasks,
change log, tokens).

**This folder does not own the design assets.** Prototypes still live in
`prototypes/`, PRDs in `product-requirement-documents/`, change logs in
`UI Change Logs/`, and tokens in `design-system/`. Feature folders point at
those files, they don't duplicate them.

## How to use this folder

- **Picking up a feature?** Open `features/<feature-name>/<feature-name>.design.md`
  first. It's the single source of truth and links out to everything else.
- **Adding a new feature?** Create a folder, copy
  `Templates/feature-design-template.md` into it, rename to
  `<feature-name>.design.md`, and fill it in.
- **Linear hierarchy.** Each design.md maps to one Linear **issue** under an
  overarching **project**. Sub-issues (Frontend, Backend, Component, Copy, etc.)
  are listed in §12 of the design.md and created by the ticketing agent.

## Feature inventory

Scope is currently limited to **users and permissions**. Test, submission, and feedback features will be added back as folders when work resumes on them.

### Onboarding
- [user-onboarding](user-onboarding/user-onboarding.design.md) — signup, OAuth, post-signup workspace landing
- [welcome-banners](welcome-banners/welcome-banners.design.md) — post-onboarding dashboard welcome hero: role variants, dismissal, animation

### Workspace & organisation admin
- [dashboard](dashboard/dashboard.design.md) — workspace dashboard (formerly `workspace-dashboard`)
- [workspace-admin](workspace-admin/workspace-admin.design.md) — workspace-level settings, members, roles (formerly `workspace-settings`)
- [organisation-admin](organisation-admin/organisation-admin.design.md) — org-wide admin including the all-users member list and all-workspaces list
- [system-admin](system-admin/system-admin.design.md) — internal super-user control plane: system summary, organisation management + add organisation, system-wide workspace/org lists, super-user login landing
- [adding-user](adding-user/adding-user.design.md) — invite + add-user flows (formerly `user-invites`)
- [user-profile](user-profile/user-profile.design.md) — personal profile, role chip, account settings
