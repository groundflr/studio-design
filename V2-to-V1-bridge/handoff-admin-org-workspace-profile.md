# Handoff — context for changes to System Admin / Organisation / Workspace / Profile screens

This is a session-context briefing for Claude Code. It summarises decisions and work from a design/prototyping session so you can suggest changes to the **system-admin**, **organisation**, **workspace-settings**, and **profile** screens in `prototypes/dashboard/index.html` that are consistent with everything already built. Read the linked files for detail; this doc is the orientation.

## Read these first
- `CLAUDE.md` — conventions. Note the **"Reuse components — never rebuild them"** rule and **"Tokens, not values."**
- `component-library/registry.json` — canonical list of `tv-*` components (read before building any UI). Human guide: `component-library/COMPONENTS.md`. Live gallery: `component-library/index.html`.
- `V2-to-V1-bridge/v2-principles-applied.md` — the V2→V1 principles and the per-surface recommendations (incl. org & workspace settings). Contains the full **shared modal card** implementation.
- `V2-to-V1-bridge/shared-modal-card-rulebook.md` — when/how to use the modal card and the information-split rules.
- `UI Change Logs/Dashboard.md` and `UI Change Logs/Organisation Page.md` — what's already been changed on these screens.

## The component library (reuse first — and extend it when needed)
The library is expected to **keep growing**. Reuse an existing `tv-*` component where one fits; but when a surface genuinely needs something new (e.g. a peek rail, a settings row, a metric tile, a tab strip, an avatar, a data table), **propose and build it as a new `tv-*` component** rather than hand-rolling a one-off inline. New components are the right outcome, not a workaround — the rule is only "don't silently re-implement something that already exists, and don't build a throwaway inline copy." See **"Extending the library"** below for the exact steps.


All are web components, loaded via `<script src="../../component-library/tv-components.js"></script>` (already in the dashboard `<head>`). They render on `colors_and_type.css` tokens and the font token `--tv-font` (currently **Inter**).

- `tv-status-tag` — status/role/state/marker chip. Kinds: `ai, adjusted, flag, auto` (moderation) · `active, pending, deactivated, cancelled, expired, removed, live` (member states/indicators) · `admin, owner, moderator, candidate, neutral` (roles) · `draft, published, archived, coming` (publication) · `created, promoted, revoked` (audit events). Usage: `<tv-status-tag kind="admin" label="Org Admin"></tv-status-tag>`.
- `tv-modal-card` — the interaction atom. A focused action on one object → opens a card (header + body slot + footer with destructive-left / primary-right). Attrs: `heading, subtitle, icon, marker-kind/marker-label, primary-label, danger-label, size(sm|md|lg), confirm-disabled, guard`. Events: `tv-confirm, tv-cancel, tv-danger, tv-close`. Methods: `open()`, `close({force})`.
- `tv-button` (variant primary|secondary|danger|text), `tv-field` (labelled input wrapper), `tv-toggle` (switch, emits `tv-change`), `tv-diff` (before→after), `tv-excerpt` (cited quote), `tv-audit-row` (flat audit entry → opens a card).

## Principles to apply (from the V2 bridge)
1. **Modal card is the atom.** Row actions, role change, invite, deactivate, "view detail" → open a `tv-modal-card`, not new navigation or inline sprawl. No stacking.
2. **Recognise on the screen, act in the card.** List rows carry identity + a status marker (`tv-status-tag`); the depth lives in the card.
3. **State follows mode** (view vs edit; reviewing vs adjusting), not record state.
4. **Reuse over invent**; **tokens not raw hex**; **Lucide icons, never emoji**; **sentence case**; menu trigger is the **vertical** ellipsis (`icon-ellipsis-vertical`).

## What's already been done on these screens (don't redo; match the pattern)
In `prototypes/dashboard/index.html`:
- **Organisation → Users tab**: role badges and member-status tags converted to `tv-status-tag` (roles → `admin`/`neutral`/`candidate`; states → `active`/`deactivated`/`pending`/`cancelled`/`expired`). The peek-rail role badge is **JS-rendered** and was left as-is.
- **System Admin (workspace-settings + system-admin screens)**: static role badges, member status cells, the billing **"COMING"** badge, and the **"Live"** system badges all converted to `tv-status-tag`.
- **`system-admin-summary-v2`**: a redesigned System summary, reachable via the dev-bar "Screen" dropdown ("SA · Summary v2"), alongside the original `system-admin-summary`. It's the reference for the redesign direction: a balanced two-column layout — header + standalone presence block; **platform-at-a-glance** metric tiles that are clickable and open a `tv-modal-card` detail, each with a contextual description; a **Live now** rail; **recent activity** with `tv-status-tag` markers; and **quick actions**. Consider extending the same shape to the org and workspace summaries.
- **Deliberately left for careful (JS-coupled) conversion** — flag, don't break: `role-chip` (persona/profile-driven, has ids/`data-` attrs), `org-modal-role-chip` ("Default"), and the `status-cell`s built inside `td.innerHTML` (Online/Offline). Converting these means editing the JS templates + re-pointing the persona code at the tag's attributes, with behaviour testing.

## Screen map (where things live)
`data-screen-name` values in `prototypes/dashboard/index.html`: `dashboard`, `workspace-settings`, `system-admin-summary`, `system-admin-summary-v2`, `system-admin-organisations`, `system-admin-workspaces`, `system-admin-users`, `organisation`, `organisation-user-profile`, `user-profile`. Navigation: `setScreen(name)` toggles `.is-active` on screens and the sidebar via the `sidebarFor` map; the dev bar groups screen buttons into a **"Screen" dropdown**. To add a comparison view, follow the **summary-v2 pattern**: new `<section data-screen-name="…-v2">`, register in `sidebarFor`, add a dev-bar `data-nav` button.

## Conventions for building here
- **Build additively / scoped.** When trialling a redesign, add it as a **second view + dev toggle** (like summary-v2) rather than overwriting, so the original stays for comparison.
- Per-prototype tokens come from `colors_and_type.css`; the component loader is already in the head.
- After any UI change, append a one-line dated entry to `UI Change Logs/<Page>.md` (hard rule).
- Decision rule from the session: classify each change as **seed** (build to V2 standard; it carries forward) or **disposable** (pragmatic, dies with V1). Modal card + neglected surfaces (invites, errors, empty states) are seeds.

## Extending the library (proposing / building new `tv-*` components)
You are expected to suggest new components as the admin/org/workspace/profile work surfaces patterns that don't exist yet. When you do:

1. **Propose first.** In your suggestions, call out which net-new components a screen needs (name, purpose, props/variants, where it'd be reused) so Lara can approve before you build.
2. **Build to the pattern** (see `component-library/COMPONENTS.md` → "How to add a new component"):
   - Create `component-library/components/tv-<name>.js` — copy an existing component as a template; Shadow DOM; reference tokens with fallbacks (`var(--primary-600,#4f46e5)`); guard with `if (customElements.get('tv-<name>')) return`; **inline SVG icons** (an icon font can't reach into shadow DOM); font via `var(--tv-font, …)`.
   - Add `'tv-<name>'` to the `COMPONENTS` array in `component-library/tv-components.js`.
   - Register it in `component-library/registry.json` (name, tag, category, status `built`, summary, use cases, attributes, tokens, do/don't, usage).
   - Add a `<template id="preview-<id>">` with a live example to `component-library/index.html` and a section so it shows in the gallery.
   - Append a line to `UI Change Logs/Component Library.md`.
3. **Additive only when extending an existing component** (e.g. new `tv-status-tag` kinds): add the new variant; never change or remove existing ones — other prototypes depend on them.
4. **Single source of truth holds:** editing a component file updates every prototype using its tag on reload. Likely candidates these screens will want: `tv-peek-rail`, `tv-settings-row`, `tv-metric-tile`, `tv-table`/`tv-data-row`, `tv-avatar`, `tv-tabs`, `tv-empty-state`. Build them as real components when they come up.

## Suggested focus for the upcoming asks
When proposing changes to these screens, lean on: the **modal card** for every row action / role change / invite / deactivate / detail; **`tv-status-tag`** for every role/status on rows; **per-section edit state** in settings; the **summary-v2 layout** as the template for org/workspace summaries; and converting the **JS-coupled chips** (role-chip etc.) to `tv-status-tag` carefully. Keep V1's page architecture; bring V2's patterns *inside* it.
