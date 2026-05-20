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

### Workspace & organisation admin
- [workspace-dashboard](workspace-dashboard/workspace-dashboard.design.md)
- [workspace-settings](workspace-settings/workspace-settings.design.md)
- [organisation-admin](organisation-admin/organisation-admin.design.md)
- [all-users](all-users/all-users.design.md)
- [all-workspaces](all-workspaces/all-workspaces.design.md)
- [user-profile](user-profile/user-profile.design.md)
- [user-invites](user-invites/user-invites.design.md)
- [roles-and-permissions](roles-and-permissions/roles-and-permissions.design.md)
- [org-owner-transfer](org-owner-transfer/org-owner-transfer.design.md)

### Onboarding
- [user-onboarding](user-onboarding/user-onboarding.design.md)

### Test journey
- [test-list](test-list/test-list.design.md)
- [new-test](new-test/new-test.design.md)
- [test-summary](test-summary/test-summary.design.md)
- [submissions-list](submissions-list/submissions-list.design.md)
- [submission-results](submission-results/submission-results.design.md)

### Feedback
- [feedback-generation](feedback-generation/feedback-generation.design.md)
- [feedback-review](feedback-review/feedback-review.design.md)
- [candidate-feedback-view](candidate-feedback-view/candidate-feedback-view.design.md)
