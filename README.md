# Traverse Studio — Design System & Prototyping Workspace

A **static, build-less companion repo** to the production Traverse Studio app at [`groundflr/studio-web-app`](https://github.com/groundflr/studio-web-app) (frontend `apps/web/`, Vue 3 + Tailwind + PrimeVue).

This repo is where the design system lives, where new flows are prototyped before they land in production code, and where each feature's developer-facing handover doc is authored. It is **not the production app** — nothing built here ships directly to users.

> **Traverse Studio** is a workspace-based authoring tool for building **simulated work experiences** (Chat, Email, Voice, AI conversations) for workforce training. Content authored here is delivered to learners in a separate player experience.

---

## For developers pulling this down

### Prerequisites

- **Python 3** (any version) — only used to serve files locally. That's it.
- A modern browser.
- No Node, no npm, no bundler, no test runner. There is no `package.json`.

### Quick start

```bash
git clone <this repo>
cd studio-design
python3 -m http.server 4711
```

Then open:

- `http://localhost:4711/prototypes/test-journey/` — the primary working prototype (test list, new test, summary, submissions, results, feedback).
- `http://localhost:4711/prototypes/dashboard/` — workspace dashboard, settings, org admin, all-users, all-workspaces, profile, invites.
- `http://localhost:4711/prototypes/user-onboarding/` — signup, OAuth, post-signup workspace landing.
- `http://localhost:4711/ui_kits/studio/` — fuller interactive recreation of the production app (JSX-via-CDN, React on the page) covering the workspace picker, dashboard, and the three authoring builders (Simulation, Environment, Assessment).
- `http://localhost:4711/design-system/traverse-studio-design-system.html` — rendered design system reference.

You can also just open any HTML file directly in a browser — there is no build step.

### What you're looking at

| Surface | Tech | Status |
| --- | --- | --- |
| `prototypes/*/index.html` | Hand-written HTML + CSS, vanilla JS, screens switched via `data-screen="…"` | The active editing target |
| `ui_kits/studio/` | React + JSX-via-CDN, no bundler | Fuller click-through recreation |
| `design-system/preview/*.html` | Static HTML token/component cards | Reference |
| `pages/`, `layouts/`, `components/` | `.vue` files lifted from production | **Reference only — not built here** |

The `.vue` files at the root are documentation of how the production app is structured; they are not part of any build in this workspace. Real implementations live in `groundflr/studio-web-app`.

---

## Repo map

```
studio-design/
├── README.md                    ← you are here
├── CLAUDE.md                    ← Claude Code working agreement (conventions, workflows)
├── SKILL.md                     ← agent-skill manifest
│
├── design-system/               ← source of truth for tokens + written DS
│   ├── colors_and_type.css      ← ALL tokens (colors, type, spacing, radii, shadows, motion)
│   ├── traverse-design-system.md
│   ├── traverse-studio-design-system.html
│   └── preview/                 ← one HTML card per token/component
│
├── features/                    ← developer-facing index; one folder per feature
│   ├── README.md                ← feature inventory
│   └── <feature-name>/
│       └── <feature-name>.design.md   ← single source of truth per feature
│
├── prototypes/                  ← active editing target
│   ├── test-journey/index.html  ← ~2600-line file, screens via data-screen
│   ├── dashboard/index.html
│   └── user-onboarding/index.html
│
├── ui_kits/studio/              ← React-on-the-page click-through
│
├── product-requirement-documents/   ← PRDs (input to the UIUX agent)
├── uiux-tasks/                  ← problem-grouped task lists (output of the UIUX agent)
├── ui-change-logs/              ← one-line dated entry per UI change, per page
│
├── assets/                      ← logos, sim-icons, backgrounds
├── fonts/                       ← Inter (primary), Lato, Comic Relief
├── public/, static/             ← additional referenced assets
│
├── app-screenshots/             ← reference shots from production (gitignored)
├── screens/                     ← prior-state JPGs for visual reference (gitignored)
├── product-assets/              ← raw product input material (gitignored)
├── templates/                   ← design.md template (gitignored)
│
├── pages/, layouts/, components/    ← .vue files lifted from production (reference only)
│
└── .claude/                     ← agents, slash commands, local settings
```

**Files that exist on disk but are not tracked in git:** `app-screenshots/`, `screens/`, `product-assets/`, `templates/`, `uiux-tasks/`, plus `*.pre-*-backup` and `*.backup` files generated mid-session. See `.gitignore`.

---

## How work flows through this repo

This is the canonical loop for taking a feature from spec to handoff:

1. **PRD lands** in `product-requirement-documents/`.
2. **UIUX review** translates the PRD into a problem-grouped task list in `uiux-tasks/<Feature>.md`.
3. **Prototype work** happens in `prototypes/<surface>/index.html` (or `ui_kits/studio/` for the React-y version), section by section.
4. **UI Change Log** — every prototype change gets a one-line dated entry appended to `ui-change-logs/<Page>.md`. This is non-negotiable; future-you and the design.md writer both rely on it.
5. **Feature design doc** — `features/<feature-name>/<feature-name>.design.md` is the single source of truth handed to developers. It points to the prototype section, PRD, tasks, change log, and tokens for that feature.
6. **Linear tickets** — each design.md maps to one Linear **issue** under an overarching **project**, broken into **sub-issues** (Frontend, Backend, Component, Copy, etc.) listed in §12 of the design.md.

Picking up dev work? **Start at `features/<feature-name>/<feature-name>.design.md`** — it links out to everything else.

> The PRD → tasks → prototype → design.md → tickets loop is driven by Claude Code agents and slash commands (`/document`, `/sync-design`, `/tickets`, plus the `uiux-lead-reviewer` and `ui-designer-executor` subagents). See **[CLAUDE.md](CLAUDE.md)** for the full working agreement — conventions, agent behaviour, and when each command runs.

---

## Critical conventions

These are hard rules. They show up as regressions if ignored.

- **Tokens, not values.** All colors, type, spacing, radii, shadows reference variables from `design-system/colors_and_type.css` (e.g. `var(--primary-600)`, `var(--surface-200)`, `var(--font-sans)`). Raw hex is a regression. The same token set is mirrored in the `TS` JS object inside `ui_kits/studio/components.jsx`.
- **UI Change Log is mandatory.** After any prototype UI change, append one dated line to `ui-change-logs/<Page>.md` (newest at the bottom).
- **Iconography is Lucide-as-fallback for FontAwesome Pro.** Production uses FA Pro Regular, 1.5px, 24px box. This repo substitutes Lucide via CDN because FA Pro can't be redistributed. Glyph names map 1:1 where possible. Sim-type icons in `assets/sim-icons/` are full-colour PNG illustrations — copy them in, never redraw in SVG. **Never use emoji.**
- **Sentence case, second person, verbs lead CTAs.** "Create workspace", not "Create Workspace". "You have no workspaces yet". Errors are direct ("Could not create workspace. Please try again.") — never "Oops".
- **Status labels are uppercase single words.** `PUBLISHED`, `DRAFT`, `ARCHIVED`, `COMING`.
- **Layout defaults.** Sidebar fixed 240px, top bar fixed 56px, content fluid centred (720–1280px typical max), 4-point spacing scale (4/8/12/16/20/24/32/40/48/64). Card libraries default to 3-up on desktop.

### What the system does **not** do

Rounded-left-border accent cards · emoji decoration · gradients · glassmorphism · neumorphism · hand-drawn SVGs · illustrated empty states with characters · coloured or inner shadows · double borders · bounces or springs · page-transition fades.

If you find yourself reaching for one of these, stop.

---

## Visual foundations

**Palette.** Indigo-600 (`#4f46e5`) as the single brand accent; Slate 0-900 as the neutral ramp; error/success/warn borrowed from Tailwind defaults. Backgrounds almost always `surface-50` (`#f8fafc`); surfaces are pure white with `surface-200` borders. Dark UI is rare — confined to modals and offline toasts. Per-entity colors (workspaces, sim types) add a single saturated hue per card to a mostly-grey page.

**Type.** Inter for all chrome (nav, buttons, body, headings). Lato for long prose inside simulation scripts. Comic Relief is available but reserved for deliberately illustrative moments. No serifs in chrome. Headings tightly tracked (`-0.01em`); body normal tracking. Line-height 1.5 for body, 1.1–1.35 for headings.

**Backgrounds.** Flat colour first. Photographic/illustrated imagery (mountain, rays, waves) appears on authenticated-shell edges and marketing surfaces. No gradients across the UI. No hand-drawn textures. No repeating patterns except a subtle dotted grid on auth screens.

**Corners.** Buttons 6–8px; inputs 8px; cards 10–12px; modals 12px; pills 9999px. Nothing sharp, nothing exaggerated.

**Shadows.** Three tiers — `xs` on buttons, `sm` on workspace cards, `md` on hover + modals/popovers. No coloured shadows, no inner shadows. Focus ring is `primary-400` at 30% alpha, 3px spread — same shape as the element, no offset.

**Borders.** Hairline `surface-200` on cards and dividers; `surface-300` on inputs; brand `primary-500` on the primary button. Error border is `error-500`. No double borders.

**Cards.** White fill, `surface-200` 1px border, `shadow-sm`, 10–12px radius, 14–16px inner padding. Elevated cards drop the border and use `shadow-md`. Hover raises from `sm` to `md` — no translate, no scale.

**Hover / press.**
- **Hover** — primary buttons darken to `primary-700`; outline buttons shift fill to `surface-50`; nav items shift fill to `primary-100` and text to `primary-700`; cards raise shadow.
- **Press / active** — filled buttons deepen one more step; nav items use `primary-400` fill with white text. No scale or shrink.

**Motion.** Single easing curve, `cubic-bezier(.4, 0, .2, 1)`. Duration scale: `100ms` icon tints, `200ms` button colour changes, `300ms` nav/text transitions, `500ms` panel reveals. No bounces, no springs. Page transitions are instant; no fade between routes.

**Transparency & blur.** Used sparingly and only on overlays. Modal scrim is `surface-900 @ 35%` with a 2px `backdrop-filter: blur`. Avatar stacks use `#fff` ring borders, not alpha. Glass effects are not part of the system.

**Imagery.** When photography appears it is muted, cool-leaning, lightly grain-free — horizon/sky-adjacent compositions (`mountain.png`, `waves.png`, `rays.png`). Never warm tungsten. Faces are avoided; abstraction is preferred.

---

## Content fundamentals

Traverse's voice is **confident, plain, and instructive** — closer to a product manager than a marketer. Copy is spare: short sentences, no padding, very few adjectives.

- **Sentence case** for everything: buttons, nav, headings, modal titles.
- **Second person** for prompts and confirmations.
- **Verbs lead** CTAs ("Create workspace", "Publish", "Try again").
- **No emoji, no exclamation marks.** Icons + typography carry tone.
- **Concise landings** — the empty workspaces screen is a single line + a button.
- **Technical nouns capitalised only as product terms:** Workspace, Simulation, Assessment, Rubric, Scene. Everything else lowercase.
- **Errors are direct and actionable.** Never "Oops" or "Something went wrong".

---

## Iconography

- **Style:** outlined, 1.5px stroke weight, 24px box, rounded caps + joins.
- **Size:** 14 (sm chrome), 16 (default), 20 (dialog / empty state).
- **Colour:** `currentColor` — icons inherit text colour in all contexts.
- **Simulation-type icons** are **illustrations, not icons** — full-colour PNGs in `assets/sim-icons/`. Never re-draw these in SVG; copy the file in.
- **Logo:** `assets/logos/studio_full_light.png` (wordmark, light), `assets/logos/studio_square_light.png` (square, light). On dark surfaces, apply `filter: invert(1) brightness(1.2)` until a dark variant is provided.
- **Lucide rename gotchas** (0.453.0): `more-horizontal → ellipsis`, `alert-circle → circle-alert`, `alert-triangle → triangle-alert`, `check-circle → circle-check`. Broken names render as an empty `<i>` silently — verify before shipping a new icon.

---

## Caveats & substitutions

- **FontAwesome Pro → Lucide.** Licensing prevents bundling. Ask for the FA Pro kit if production fidelity matters.
- **Comic Relief + Lato** via Google Fonts. Inter is locally provided in `fonts/`.
- **Simulation canvas** is intentionally out of scope — the player is too specialised to fake convincingly.
- **Dark logo variant** isn't in the repo; CSS invert is a stopgap.
- **The `.vue` files in `pages/`, `layouts/`, `components/`** are lifted from the production repo for reference. They do not run here.

---

## Related docs

- **[CLAUDE.md](CLAUDE.md)** — the working agreement: conventions, agent-driven workflow, slash commands, change-log rule.
- **[features/README.md](features/README.md)** — feature inventory and how each design.md works.
- **[design-system/traverse-design-system.md](design-system/traverse-design-system.md)** — the full canonical written design system (~1160 lines).
- **[SKILL.md](SKILL.md)** — agent-skill manifest if invoking this repo as a Claude Code skill.
