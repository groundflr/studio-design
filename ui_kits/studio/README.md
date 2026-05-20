# Traverse Studio — UI Kit

Interactive recreation of the Traverse Studio web app based on `groundflr/studio-web-app`.

**Files**
- `components.jsx` — primitives: Icon, Button, IconButton, Tag, Avatar, Input, Card, Eyebrow. All components read tokens from the `TS` object which mirrors `design-system/colors_and_type.css`.
- `WorkspacePicker.jsx` — unauthenticated shell, workspace list, "Create workspace" modal. Source: `apps/web/src/features/workspaces/views/WorkspacesView.vue`.
- `Dashboard.jsx` — authenticated workspace shell: sidebar nav, top bar, simulation library grid. Source: `apps/web/src/features/workspaces/layouts` + `simulations/`.
- `index.html` — click-through: lands on picker → select workspace → dashboard → sim library. Sign-out returns to picker.

**What this does NOT include** (intentionally — these areas were sparse / gated in the source):
- Rubric authoring — marked `COMING` in the app
- Live simulation player canvas (video/audio/chat feed) — too complex to fake well
- Admin settings

**Tokens**
All colors and sizes come from `TS` in `components.jsx`. Kept intentionally thin so components can be lifted out.
