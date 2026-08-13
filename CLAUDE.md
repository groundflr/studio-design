# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

This is the **Traverse Studio Design System and Prototyping workspace** — a static, build-less companion to the production Vue 3 app at `groundflr/studio-web-app` (frontend `apps/web/`). It exists to:

1. **Document the design system** in markdown + rendered HTML.
2. **Hold interactive HTML/JSX prototypes** for new flows before they land in production code.
3. **Serve as a Claude Code skill** (`SKILL.md`) so Claude can generate well-branded interfaces on demand.

There is **no bundler and no test suite**. Everything is static HTML/CSS/JSX-via-CDN. A minimal `package.json` exists solely for the design-readiness status scripts (`npm run status`, `npm run check:status`) — there are no dependencies and nothing to install.

To preview a file, open it in a browser or run a local server. **Inside Conductor, use the run script** (defined in `.conductor/settings.toml`), which serves on `$CONDUCTOR_PORT` so each workspace gets its own port and multiple prototypes can run side by side. **Do not hard-code a port inside a Conductor workspace** — servers started on a fixed port will collide across workspaces. Outside Conductor, `python3 -m http.server 4711` is the convention (see `.claude/settings.local.json`).

The repo **is a git repository** (main branch; no remote-specific workflow beyond normal commits). Do not commit or push unless asked.

## High-level layout

The repo has four loosely-coupled surfaces. Knowing which one you are touching is essential.

### 1. Design-system source of truth
All under `design-system/`:
- `design-system/colors_and_type.css` — all CSS variables (color ramps, semantic aliases, type scale, radii, shadows, spacing, motion). **Every other file imports this.** Never introduce raw hex or ad-hoc font stacks; map to a token here.
- `design-system/traverse-design-system.md` — the canonical written design system (~1160 lines). Read the relevant section before proposing component, spacing, color, type, or state patterns.
- `design-system/traverse-studio-design-system.html` — rendered companion to the markdown doc.
- `design-system/preview/` — one HTML file per token/component card (`buttons.html`, `cards.html`, `colors-primary.html`, etc.). These populate the Design System tab. `_base.html` is the shared shell.
- `assets/`, `public/`, `static/`, `fonts/` — logos, sim-icons, backgrounds, webfonts (kept at root because they are referenced from many paths).

### 2. Feature index (developer handoff)
- `features/<feature-name>/<feature-name>.design.md` — the single source of truth per feature for developers. Each design.md points to the prototype section, PRD, tasks, change log, and tokens for that feature. Linear hierarchy: one design.md → one Linear **issue** under an overarching **project**. §12 no longer prescribes sub-issues by layer — implementation decomposition (vertical, phased slices) is owned by `/1-shape`'s build plan, not the design doc (see `design-handoff-proposal.md`). See `features/README.md` for the full inventory, and `Templates/feature-design-template.md` for the canonical template.

### 3. Prototype surfaces (the active editing target)
- `prototypes/test-journey/index.html` — **the primary working prototype for the test journey**. A single ~2600-line HTML file that uses `data-screen="..."` to switch between screens: `test-list`, `new-test`, `test-summary`, `submissions-list`, `submission-results`, `feedback-summary`. Most ongoing test-journey UI work happens here.
- `prototypes/dashboard/index.html` — workspace dashboard, settings, org admin, all-users, all-workspaces, profile, invites.
- `prototypes/user-onboarding/index.html` — signup, OAuth, post-signup workspace landing.
- `ui_kits/studio/` — fuller interactive recreation of the production app (workspace picker, dashboard, sim/environment/assessment builders) as JSX-via-CDN with React on the page. `index.html` is the click-through entry. `components.jsx` defines primitives reading from a `TS` token object that mirrors `design-system/colors_and_type.css`.
- `screens/`, `app-screenshots/` — JPGs of prior states for visual reference when evaluating implementations.

### 4. Vue source snippets (reference only — not built here)
- `pages/`, `layouts/`, `components/` (App, Home, NavBar) — small `.vue` files lifted from the upstream production repo for reference. They are not part of any build in this workspace; do not try to run them. Treat them as documentation of how the production app is structured. The actual implementations live in `groundflr/studio-web-app`.

## Workflow: PRD → tasks → execution → log

This repo uses a structured, agent-driven flow for prototype changes. Two custom subagents are configured in `.claude/agents/`:

1. **`uiux-lead-reviewer`** (purple, sonnet) reads PRDs from `product-requirement-documents/` and writes problem-grouped task checklists to `uiux-tasks/<Feature>.md`. It is problem-first, not feature-first.
2. **`ui-designer-executor`** (cyan, sonnet) executes those task documents section-by-section against the HTML prototypes (typically `test-journey/index.html`), pausing for confirmation between sections and flagging missing tokens/components/screens before creating them.

When the user says "review this PRD" or "implement these tasks against the prototype," prefer launching the corresponding subagent over doing the work in the main thread.

Each agent has its own persistent memory under `.claude/agent-memory/<agent-name>/` (project-scoped, shared via the repo).

## Critical conventions

**UI Change Log (mandatory).** After any prototype UI change, append a single one-line dated entry to `UI Change Logs/<Page>.md` (newest at the bottom) and confirm in your response. Example file: `UI Change Logs/New Test Page.md`. This is a hard rule from user memory — do not skip it.

**Design docs and Linear tickets (manual, user-gated).** Three slash commands govern the lifecycle of `features/<feature-name>/<feature-name>.design.md` and its Linear tickets:
- **`/document <feature-name>`** — authors a fresh design.md from scratch via the `handover-documenter` subagent. Reads PRD + tasks + prototype + change log + related docs, invites a user brain-dump, asks clarifying questions, delivers a first draft, then walks through any `⚠️ NEEDS INPUT` sections. Refuses if the target file already has content. Pre-fills §12 with Project + Issue + suggested sub-issues.
- **`/sync-design <feature-name>`** — absorbs in-session prototype changes into an existing populated design.md via the `design-doc-syncer` subagent. Section-by-section approval before any write.
- **`/tickets <feature-name>`** — creates the Linear issue + sub-issues for the feature via the `linear-ticket-creator` subagent, using §12 of the design.md as canonical input. Reviews the proposed names and may suggest deviations (rename / add / split / merge / remove), but requires explicit user approval for any change. Writes Linear IDs back into §12 after creation. Refuses if §12 already has Linear IDs (prevents duplicates). Uses the Linear MCP already connected via the Claude account — no API keys to manage.

When the user has made substantive prototype changes in a session — meaning changes to behaviour, structure, scope, anatomy, states, or decisions, not pixel-tweaks — suggest running `/sync-design` before moving on. **Never run `/sync-design`, `/document`, or `/tickets` automatically.** The user often riffs through options before landing on a final version, so they alone decide when to commit. One suggestion per substantive landing is enough — do not nag.

**Tokens, not values.** All colors, type, spacing, radii, and shadows must reference variables from `design-system/colors_and_type.css` (e.g. `var(--primary-600)`, `var(--surface-200)`, `var(--font-sans)`). Raw hex is a regression.

**Reuse components — never rebuild them (mandatory).** Before building any UI, consult `component-library/registry.json` (human-browsable gallery at `component-library/index.html`, guide in `component-library/COMPONENTS.md`).

- If a component is listed with `"status": "built"`, **use it via its `tv-*` tag** — add `<script src="/component-library/tv-components.js"></script>` to the page and write the tag (e.g. `<tv-status-tag kind="ai">`, `<tv-button variant="primary">`, `<tv-modal-card …>`). Do **not** hand-author a re-styled copy of an existing component inline; that reintroduces the drift this system exists to prevent.
- If a needed component is listed as `"planned"`, build it now as the real component rather than a one-off.
- If it's not listed at all, build it as a `tv-*` web component in `component-library/components/`, add it to the `COMPONENTS` array in `tv-components.js`, register it in `registry.json`, add a `<template id="preview-…">` + flip status in `index.html`, then append to `UI Change Logs/Component Library.md`.

Each component is defined once and is the single source of truth: edit the file in `component-library/components/` and every prototype using that tag updates. Components read tokens from `colors_and_type.css`, so the "Tokens, not values" rule still applies inside them. The modal card's when/how + information-split rules live in `V2-to-V1-bridge/shared-modal-card-rulebook.md`.

**Design readiness (mandatory).** Every `<section class="screen">` carries `data-status`: `ready` · `wip` · `explore` · `superseded`. **Absent means not ready** (treated as `wip`). Only `ready` screens may be handed to `/1-shape` or built. `wip` and `explore` are not buildable. `superseded` must never be built — follow `data-superseded-by` to the replacement. Single-status prototypes without screen sections (user-onboarding, page-skeleton) carry `data-status` on `<body>`. Each prototype declares its index entries in a `#prototype-manifest` JSON block after `<body>`; an entry's status is inherited from its target screen — add an entry-level `status` override only when a variant genuinely differs. After changing a screen's maturity, update `data-status` in the same edit as the UI Change Log entry, then run `npm run status` to regenerate `status.json` (which `vercel-setup/index.html` renders from — never hand-edit its list). `npm run check:status` validates the whole system. The in-page status UI is `<tv-status-ribbon>`; hide it for screenshots with `?chrome=0`, never by removing the tag.

**Iconography fallback.** Production uses FontAwesome Pro (Regular, 1.5px, 24px box). This repo substitutes **Lucide** via CDN (`https://unpkg.com/lucide-static@.../font/lucide.css`) because FA Pro can't be redistributed. Keep names mapped 1:1 to FA Pro where possible. Sim-type icons in `assets/sim-icons/` are full-color illustrations — copy the PNG, never redraw in SVG. Never use emoji.

**Overflow / drawer-menu trigger icon.** The trigger for any overflow or drawer ("kebab") menu is the **vertical** ellipsis — `icon-ellipsis-vertical` (Lucide `ellipsis-vertical`, the rename of `more-vertical`). Do **not** use the horizontal `icon-ellipsis` for menu triggers. This applies everywhere going forward (row actions, card actions, table-row menus, profile menus).

**Voice and copy.** Sentence case everywhere (buttons, nav, headings, modal titles). Second person for prompts ("You have no workspaces yet"). Verbs lead CTAs ("Create workspace"). No emoji. No exclamation marks. Status labels are uppercase single words: `PUBLISHED`, `DRAFT`, `ARCHIVED`, `COMING`. Errors are direct ("Could not create workspace. Please try again."), never "Oops".

**Layout defaults.** Sidebar fixed 240px, top bar fixed 56px, content fluid centered (typical max 720–1280px), 4-point spacing scale (4/8/12/16/20/24/32/40/48/64). Card libraries default to 3-up on desktop.

**What the system does NOT do.** No gradients, glassmorphism, neumorphism, hand-drawn SVGs, illustrated empty states with characters, rounded-left-border accent cards, or coloured/inner shadows. If you find yourself reaching for one of these, stop.

## Common tasks

- **Preview a prototype:** open the HTML file directly. In Conductor, press the Run button (or `⌘R`) and then `⌘⇧B` to open the workspace's localhost URL — the server binds to `$CONDUCTOR_PORT`, not a fixed port. Outside Conductor, run `python3 -m http.server 4711` from the repo root and visit `http://localhost:4711/prototypes/test-journey/`.
- **Add a token:** edit `design-system/colors_and_type.css`, then add a preview card in `design-system/preview/` if it's a visible primitive.
- **Edit a screen:** find its `data-screen="..."` block in `prototypes/test-journey/index.html` (or the relevant file in `prototypes/dashboard/`, `prototypes/user-onboarding/`, `ui_kits/studio/`), make the change, then append to `UI Change Logs/<Page>.md`. If the screen maps to a feature in `features/`, also update that feature's `<feature-name>.design.md` so the developer handoff stays current.
- **Drop in a new PRD:** put the markdown file in `product-requirement-documents/` and ask the `uiux-lead-reviewer` agent to translate it. Output lands in `uiux-tasks/`.
