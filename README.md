# Traverse Studio Design System

Design system for **Traverse Studio** — a workspace-based authoring tool for building **simulated work experiences** (Chat, Email, Voice, AI conversations) for workforce training. Content authored here is delivered to learners in a separate player experience.

Source: [`groundflr/studio-web-app`](https://github.com/groundflr/studio-web-app), frontend `apps/web/` (Vue 3 + Tailwind + PrimeVue).

---

## Index

- **features/** — developer-facing index. One folder per feature, each with a `design.md` that points to the prototype, PRD, tasks, and change log for that feature. Start here if you're picking up dev work.
- **design-system/** — source of truth for tokens and the written design system.
  - `colors_and_type.css` — all tokens: color ramps, semantic colors, type families, font-size/weight scale, radii, shadows, spacing, motion. Import this first.
  - `traverse-design-system.md` — the canonical written design system.
  - `traverse-studio-design-system.html` — rendered companion to the markdown doc.
  - `preview/` — individual token / component cards populating the Design System tab.
- **fonts/** — Inter, Lato, Comic Relief (webfonts). Inter is the primary UI face.
- **assets/**
  - `logos/` — Traverse Studio wordmark + square mark (light variants; invert for dark).
  - `sim-icons/` — the four simulation-type illustrations (chat, email, call, ai-conversation).
  - `backgrounds/` — illustrative imagery used in auth shells and empty states.
- **ui_kits/studio/** — full interactive recreation of the app: workspace picker, dashboard, simulation library, environment library, assessment library — plus the three authoring builders:
  - **Simulation builder** (3-step stepper: Basic / Design / Content) — characters, skin, stock chats, outcomes, agenda.
  - **Environment builder** (single-page form) — workplace, values/terms/exclusions, candidate, character relationships.
  - **Assessment builder** (4-step stepper: Basic / Tests / Grading / Confirm) — objective, tests, rubric matrix, publish.
  See its `README.md`.
- **SKILL.md** — agent-skill manifest so this system can be used as a Claude Code skill.

---

## Content fundamentals

Traverse's voice is **confident, plain, and instructive** — closer to a product manager than a marketer. Copy is spare: short sentences, no padding, very few adjectives.

- **Sentence case** for everything: buttons, nav, headings, modal titles. ("Create workspace", not "Create Workspace".)
- **Second person** for prompts and confirmations ("You have no workspaces yet").
- **Verbs lead** CTAs ("Create workspace", "Publish", "Try again").
- **No emoji** anywhere. Icons + typography carry tone.
- **No exclamation marks.** Tone is calm, not cheerful.
- **Concise landings** — the empty workspaces screen is a single line + a button. The landing header is one short phrase ("Continue building.") followed by one explanatory sentence.
- **Technical nouns are capitalised only as product terms:** Workspace, Simulation, Assessment, Rubric, Scene. Everything else stays lowercase.
- **Errors are direct and actionable:** "Could not create workspace. Please try again." Never "Oops" or "Something went wrong".
- **Status labels are uppercase + short:** `PUBLISHED`, `DRAFT`, `ARCHIVED`, `COMING`. Always single word.

---

## Visual foundations

**Palette.** Indigo-600 (`#4f46e5`) as the single brand accent; Slate 0-900 as the neutral ramp; error/success/warn borrowed from Tailwind defaults. Backgrounds almost always `surface-50` (`#f8fafc`); surfaces are pure white with `surface-200` borders. Dark UI is rare — confined to modals and offline toasts. Per-entity colors (workspaces, sim types) add a single saturated hue per card to a mostly-grey page.

**Type.** Inter for all chrome (nav, buttons, body, headings). Lato for long prose inside simulation scripts. Comic Relief is available but reserved for deliberately illustrative moments. No serifs in chrome. Headings are tightly tracked (`-0.01em`); body is normal tracking. Line-height 1.5 for body, 1.1–1.35 for headings.

**Backgrounds.** Flat colour first. Photographic/illustrated imagery (mountain, rays, waves) appears on authenticated-shell edges and marketing surfaces. No gradients across the UI. No hand-drawn textures. No repeating patterns except a subtle dotted grid on auth screens.

**Corners.** Small-medium radii. Buttons 6–8px; inputs 8px; cards 10–12px; modals 12px; pills 9999px. Nothing in the UI has sharp corners; nothing has exaggerated ones either.

**Shadows.** Three tiers — `xs` on buttons, `sm` on workspace cards, `md` on hover + modals/popovers. No coloured shadows, no inner shadows. Focus ring is `primary-400` at 30% alpha, 3px spread — same shape as the element, no offset.

**Borders.** Hairline `surface-200` on cards and dividers; `surface-300` on inputs; brand `primary-500` on the primary button. Error border is `error-500`. No double borders.

**Cards.** White fill, `surface-200` 1px border, `shadow-sm`, 10–12px radius, 14–16px inner padding. Elevated cards drop the border and use `shadow-md`. Hover raises from `sm` to `md` — no translate, no scale.

**Hover / press.**
- **Hover** — primary buttons darken to `primary-700`; outline buttons shift fill to `surface-50`; nav items shift fill to `primary-100` and text to `primary-700`; cards raise shadow.
- **Press / active** — filled buttons deepen one more step; nav items use `primary-400` fill with white text. No scale or shrink.

**Motion.** Single easing curve, `cubic-bezier(.4, 0, .2, 1)`. Duration scale: `100ms` icon tints, `200ms` button colour changes, `300ms` nav/text transitions, `500ms` panel reveals. No bounces, no springs. Page transitions are instant; no fade between routes.

**Transparency & blur.** Used sparingly and only on overlays. Modal scrim is `surface-900 @ 35%` with a 2px `backdrop-filter: blur`. Avatar stacks use `#fff` ring borders, not alpha. Glass effects are not part of the system.

**Layout.** Sidebar is **fixed 240px**; top bar is **fixed 56px**; content is fluid centred with a typical 720px–1280px max width. Spacing is the 4-point scale (4/8/12/16/20/24/32/40/48/64px). Dense components use 8/12; cards use 14/16; page gutters are 24/32. Grids default to 3-up on desktop for card libraries.

**Imagery.** When photography appears it is muted, cool-leaning, lightly grain-free — horizon/sky-adjacent compositions (`mountain.png`, `waves.png`, `rays.png`). Never warm tungsten. Faces are avoided; abstraction is preferred.

**What the system does NOT do:** rounded-left-border accent cards, emoji decoration, bluish-purple gradients, glassmorphism, neumorphism, hand-drawn SVGs, or illustrated empty states with characters.

---

## Iconography

The product uses **FontAwesome Pro** (Regular weight) in source, referenced by name (`tree-map`, `film`, `flask-vial`, `venn`, `film-slash`, `person-dots`). FontAwesome Pro requires a licensed kit and cannot be redistributed, so this skill **falls back to [Lucide](https://lucide.dev)** (CDN-available, similar stroke weight) — this is a **flagged substitution**. Glyph names in this DS map 1:1 to FontAwesome Pro. If the user needs production fidelity, swap Lucide for the FA Pro kit at runtime.

- **Style:** outlined, 1.5px stroke weight, 24px box, rounded caps + joins.
- **Size:** 14 (sm chrome), 16 (default), 20 (dialog / empty state).
- **Colour:** `currentColor` — icons inherit text colour in all contexts.
- **Simulation-type icons** are **illustrations, not icons** — full-colour PNGs in `assets/sim-icons/`. Never re-draw these in SVG; copy the file in.
- **Logo:** `assets/logos/studio_full_light.png` (wordmark, light), `assets/logos/studio_square_light.png` (square, light). On dark surfaces, apply `filter: invert(1) brightness(1.2)` until a dark variant is provided.
- **No emoji.** No Unicode pictographs. If you need a symbol, use an icon from the set.

---

## Caveats & substitutions

- **FontAwesome Pro → Lucide.** Licensing prevents bundling. Ask the user for their FA Pro kit if production fidelity matters.
- **Comic Relief + Lato** are included via Google Fonts. Inter is locally provided in `fonts/`.
- **Simulation canvas** is intentionally out of scope — the player is too specialised to fake convincingly.
- **Dark logo variant** isn't in the repo; CSS invert is a stopgap.
