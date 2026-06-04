# Traverse Studio — Design System

Comprehensive reference for **Traverse Studio**, a workspace-based authoring tool for building **simulated work experiences** (Chat, Email, Voice call, AI conversation) for workforce training. Content authored here is delivered to learners in a separate player experience.

Sources: [`groundflr/studio-web-app`](https://github.com/groundflr/studio-web-app) — Vue 3 + Nuxt 3 + Tailwind + PrimeVue. Tokens are expressed both as Tailwind classes in the app and as CSS custom properties in `colors_and_type.css` so external HTML matches the app exactly.

---

## Table of contents

1. [Project layout](#1-project-layout)
2. [Brand voice &amp; content rules](#2-brand-voice--content-rules)
3. [Visual foundations](#3-visual-foundations)
4. [Design tokens](#4-design-tokens)
5. [Typography](#5-typography)
6. [Iconography](#6-iconography)
7. [Core components](#7-core-components)
8. [Composite components](#8-composite-components)
9. [Layout patterns](#9-layout-patterns)
10. [Application screens](#10-application-screens)
11. [The three builders](#11-the-three-builders)
12. [Brand assets](#12-brand-assets)
13. [Domain enums &amp; data](#13-domain-enums--data)
14. [Implementation guide](#14-implementation-guide)
15. [Caveats &amp; substitutions](#15-caveats--substitutions)

---

## 1. Project layout

```
.
├── index.html                     # Root landing hub (UI kit + design preview cards)
├── colors_and_type.css            # All tokens as :root custom properties + semantic type classes
├── README.md                      # High-level design-system brief
├── SKILL.md                       # Agent-skill manifest (Claude Code)
│
├── ui_kits/studio/                # Full interactive recreation of the app (React via Babel standalone)
│   ├── index.html                 # Click-through app (picker → dashboard → builders)
│   ├── components.jsx             # Icon, Button, IconButton, Tag, Avatar, Input, Card, Eyebrow
│   ├── WorkspacePicker.jsx        # Unauthed shell + workspace list + create modal
│   ├── Dashboard.jsx              # Sidebar, top bar, libraries, nav
│   ├── Stepper.jsx                # PageTitle, StepperHeader, StepperShell, Form primitives
│   ├── SimulationBuilder.jsx      # 3-step stepper (Basic / Design / Content)
│   ├── EnvironmentBuilder.jsx     # Single-page form
│   └── AssessmentBuilder.jsx      # 4-step stepper (Basic / Tests / Grading / Confirm)
│
├── preview/                       # One self-contained HTML card per token/component
│   ├── _base.html                 # Shared preview shell
│   ├── _screens/                  # PNG captures (dashboard, picker)
│   ├── colors-*.html              # primary, surface, semantic, categorical
│   ├── type-*.html                # families, display, body
│   ├── buttons*.html, inputs.html, cards.html, tags-badges.html, avatars.html
│   ├── nav-item.html, toasts.html, icons.html
│   ├── radius.html, shadows.html, spacing.html
│   └── logo.html, sim-icons.html, backgrounds.html
│
├── assets/                        # Production assets
│   ├── logos/                     # studio_full_light (SVG+PNG), studio_square_light, mimicly_light
│   ├── sim-icons/                 # chat, email, call, ai-conversation — full-colour PNGs
│   ├── sim-previews/              # 16:9 preview JPGs for each sim type
│   ├── backgrounds/               # mountain, rays, waves, gradients
│   └── css/main.css               # Original app's compiled utility CSS (reference)
│
├── public/                        # Mirrors production public/ layout
│   ├── logo/, images/simulations/, images/interaction-backgrounds/
│
├── components/                    # Vue source from studio-web-app
│   ├── App/AppAvatar, AppIcon, AppTag, Button/AppButton*
│   ├── Home/Home*                 # Auth-gate landing components
│   └── NavBar/NavBar*             # Sidebar primitives
│
├── layouts/default.vue            # Default authenticated shell (sidebar + content window)
├── pages/index.vue                # Authed landing (workspace picker)
├── pages/signup.vue               # Complete-sign-up card
│
├── screens/                       # Static JPG captures of the app (hero imagery)
│   ├── 01…05-assess-*.jpg, sim-builder.jpg
│
└── static/data/                   # Option maps used by the product
    ├── color/colorOptionHexes.ts  # Categorical hex map
    ├── status.ts                  # Attempt + grading status labels
    └── simulations/               # simulationTypeOptions, backgroundOptions, chatSkinOptions, emailSkinOptions
```

Anything in `ui_kits/studio/` is *runnable* (open `index.html` in a browser). Anything in `preview/` is a focused card suitable for embedding in design-system sites via `<iframe>`. Anything in `components/`, `layouts/`, `pages/` is *source-of-truth Vue* and should be read to disambiguate behaviour questions.

---

## 2. Brand voice &amp; content rules

Traverse's voice is **confident, plain, and instructive** — closer to a product manager than a marketer. Copy is spare: short sentences, no padding, very few adjectives.

| Rule | Example |
| --- | --- |
| **Sentence case** everywhere (buttons, nav, headings, modal titles) | "Create workspace" — not "Create Workspace" |
| **Second person** for prompts &amp; confirmations | "You have no workspaces yet" |
| **Verbs lead** CTAs | "Create workspace", "Publish", "Try again" |
| **No emoji**, no Unicode pictographs | icons + typography carry tone |
| **No exclamation marks** | tone is calm, not cheerful |
| **Concise landings** — one short phrase + one explanatory sentence | "Continue building." + "Select the workspace…" |
| **Product nouns capitalised** as terms | Workspace, Simulation, Assessment, Rubric, Scene |
| **Errors are direct &amp; actionable** | "Could not create workspace. Please try again." — never "Oops" or "Something went wrong" |
| **Status labels uppercase + short** | `PUBLISHED`, `DRAFT`, `ARCHIVED`, `COMING` — always single word |

### Copy patterns

- **Section subtitles**: one sentence, starts with a verb or descriptor noun. "Build simulated work experiences for your learners." "Group tests and rubrics into scored experiences."
- **Field descriptions**: single sentence, ≤ 80 chars, no trailing period needed when used under a label with a colon-like tone ("Give your simulation a title").
- **Placeholder text** is grey, muted, illustrative only ("e.g. Sales Enablement", "Enter title").
- **Character limits** are rendered inline as "N / LIMIT characters" in `surface-400`, turning red (`error-500`) on overflow.
- **Empty-state copy** is one short phrase plus one actionable CTA — never an illustration with a mascot.

---

## 3. Visual foundations

### Palette philosophy

- **Single brand accent**: Indigo-600 (`#4f46e5`). Used for primary buttons, active nav fill, and the thin loading bar.
- **Slate ramp** is the neutral foundation (surface-0 through surface-900). Everything not accented is slate.
- **Error / success / warn** mirror Tailwind defaults (rose/green/amber).
- **Per-entity colour** — workspaces and simulation types each carry one saturated hue (from the categorical set) to add a single colour accent to an otherwise grey page.

### Backgrounds

- **Flat colour first**. `surface-50` (`#f8fafc`) is the default page background; pure white is reserved for surfaces/cards. `surface-100` is the sidebar fill.
- **Photographic imagery** (mountain, rays, waves) appears on auth shells and marketing surfaces — muted, cool-leaning, horizon compositions. Never warm tungsten, never faces.
- **Dotted grid** (`radial-gradient(circle, #cbd5e1 1px, #f8fafc 1px) 16px 16px`) is the signature auth-screen background. Available as `.ds-dotted-bg`.
- **No gradients across the UI**, no hand-drawn textures, no repeating patterns other than the dotted grid.

### Corners

Small-to-medium radii throughout:

| Token | Value | Use |
| --- | --- | --- |
| `--radius-xs` | 4px | hot-key hint chips |
| `--radius-sm` | 6px | sm / xs buttons, small inputs |
| `--radius-md` | 8px | default md buttons, menu items, inputs |
| `--radius-lg` | 12px | content windows, cards, workspace cards, modals |
| `--radius-xl` | 16px | workspace list panel |
| `--radius-full` | 9999px | pills, avatars, toggles |

### Shadows

Three elevation tiers. No coloured shadows, no inner shadows.

| Token | Value | Use |
| --- | --- | --- |
| `--shadow-xs` | `0 1px 2px rgb(0 0 0/.05)` | buttons / primary resting state |
| `--shadow-sm` | `0 1px 3px/.1, 0 1px 2px -1px/.1` | small cards (workspace card resting) |
| `--shadow-md` | `0 4px 6px -1px/.1, 0 2px 4px -2px/.1` | hover + modals + workspace list panel |
| `--shadow-lg` | `0 10px 15px -3px/.1, 0 4px 6px -4px/.1` | detached overlays (rare) |
| `--shadow-ring-primary` | `0 0 0 3px rgb(99 102 241/.3)` | focus ring — same shape as element, no offset |

Hover always raises one step. Cards never translate or scale on hover; they simply swap `sm` → `md`.

### Borders

- `surface-200` — hairline borders on cards and dividers (the default).
- `surface-300` — input borders; form field separators when stronger emphasis is needed.
- `primary-500` — primary button border.
- `error-500` — error input border, destructive button border.
- **No double borders.** **No coloured borders** except primary/error.

### Hover &amp; press

| Element | Hover | Press / Active |
| --- | --- | --- |
| Primary button | bg `primary-600` → `primary-700` | deepen one more step |
| Outline button | fill shifts to `surface-50` | fill `surface-100` |
| Nav item | bg `primary-100`, text `primary-700` | bg `primary-400`, text `#fff` |
| Card | shadow `sm` → `md` | n/a (open on click) |
| Icon button | bg transparent → `rgba(30,41,59,.05)` | n/a |

No scale, no shrink, no translate anywhere.

### Motion

Single easing curve, `cubic-bezier(0.4, 0, 0.2, 1)` — exposed as `--ease-std`.

| Token | Duration | Use |
| --- | --- | --- |
| `--dur-quick` | 100ms | icon tints, hover fills |
| `--dur-base` | 200ms | button colour transitions |
| `--dur-slow` | 300ms | nav item colour / text fade |
| `--dur-panel` | 500ms | sidebar layout transitions |

Page transitions are instant — no fade between routes. No bounces, no springs.

### Transparency &amp; blur

Used sparingly, only on overlays.

- **Modal scrim**: `rgba(15,23,42,0.35)` with `backdrop-filter: blur(2px)`.
- **Avatar stacks**: use `#fff` ring borders, *not* alpha.
- **Glass effects are not part of the system.**

### Layout

- **Sidebar**: fixed 240px.
- **Top bar**: fixed 56px.
- **Content window**: fluid, centred; typical max-width 720px–1280px depending on page.
- **Page gutters**: 24/32px.
- **4-point spacing scale**: `4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64`.
- **Card libraries**: default 3-up grid on desktop.
- **Dense components**: 8/12px inner padding.
- **Cards**: 14–16px inner padding.

### What the system does NOT do

Rounded-left-border accent cards · emoji decoration · bluish-purple gradients · glassmorphism · neumorphism · hand-drawn SVGs · illustrated empty states with characters.

---

## 4. Design tokens

All tokens live in `colors_and_type.css` under `:root`. Tailwind classes in the app map one-to-one to these custom properties, so either surface can be used interchangeably.

### 4.1 Primary — Indigo

| Token | Hex | Role |
| --- | --- | --- |
| `--primary-50` | `#eef2ff` | Backgrounds for indigo chips, empty-state icon wells |
| `--primary-100` | `#e0e7ff` | Hover fill on nav items, tag backgrounds |
| `--primary-200` | `#c7d2fe` | Hover arrow-chip inside nav items |
| `--primary-300` | `#a5b4fc` | Input focus border |
| `--primary-400` | `#818cf8` | **Active** nav item fill; stepper inactive dot (legacy `#9ca3af` elsewhere) |
| `--primary-500` | `#6366f1` | Primary button *border* |
| `--primary-600` | `#4f46e5` | **Brand ink** — primary button fill, loading bar, categorical Indigo |
| `--primary-700` | `#4338ca` | Primary button hover; ghost-primary text |
| `--primary-800` | `#3730a3` | Rare; heavy-emphasis primary text |
| `--primary-900` | `#312e81` | Rare; headings on tinted primary backgrounds |

### 4.2 Surface — Slate

| Token | Hex | Role |
| --- | --- | --- |
| `--surface-0` | `#ffffff` | Cards, content windows, buttons fill (outline) |
| `--surface-50` | `#f8fafc` | **Default page background** (`.ds-dotted-bg` lights) |
| `--surface-100` | `#f1f5f9` | Sidebar fill, hover panels, chip backgrounds, `bg-muted` |
| `--surface-200` | `#e2e8f0` | Hairline borders on cards and dividers |
| `--surface-300` | `#cbd5e1` | Input borders, `border-default` |
| `--surface-400` | `#94a3b8` | Placeholder text, icon arrows, meta dots, `border-strong` |
| `--surface-500` | `#64748b` | Tertiary text (`fg-3`), meta ("12 members") |
| `--surface-600` | `#475569` | Eyebrows, section labels |
| `--surface-700` | `#334155` | Body default (`fg-2`) — outline button text, nav item text |
| `--surface-800` | `#1e293b` | Card titles, icon-button colour |
| `--surface-900` | `#0f172a` | Primary text (`fg-1`), modal scrim base |

### 4.3 Semantic

| Token | Hex | Role |
| --- | --- | --- |
| `--success-500` | `#039855` | Success icon + text on light pill |
| `--success-600` | `#16a34a` | Tag colour, saved-indicator dot |
| `--success-100` | `#dcfce7` | `PUBLISHED` badge background |
| `--error-400` | `#f87171` | Destructive ghost hover |
| `--error-500` | `#D92D20` | Destructive button fill, error border, error icon |
| `--error-600` | `#dc2626` | Destructive hover |
| `--error-100` | `#fee2e2` | `ARCHIVED` badge background |
| `--warn-500` | `#cc8925` | Draft status, warning icon |
| `--warn-600` | `#ca8a04` | Warn hover |
| `--warn-100` | `#fef3c7` | `DRAFT` badge background |
| `--info-500` | `#0284c7` | Info callouts, Email sim hue |
| `--info-100` | `#e0f2fe` | Info bg |

### 4.4 Categorical (character / tag colours)

From `static/data/color/colorOptionHexes.ts`. Used for per-entity accents on workspace cards, characters, tags, and rubric categories. Always display as a solid chip with `0D` (5% alpha) background tint.

| Token | Hex | Name |
| --- | --- | --- |
| `--cat-pink` | `#db2777` | Pink |
| `--cat-red` | `#dc2626` | Red |
| `--cat-orange` | `#ea580c` | Orange |
| `--cat-yellow` | `#ca8a04` | Yellow |
| `--cat-green` | `#16a34a` | Green |
| `--cat-teal` | `#0d9488` | Teal |
| `--cat-sky` | `#0284c7` | Sky |
| `--cat-indigo` | `#4f46e5` | Indigo (= primary) |
| `--cat-purple` | `#9333ea` | Purple |
| `--cat-grey` | `#374151` | Grey |

### 4.5 Semantic aliases

These decouple roles from raw ramps so a theme swap is mechanical.

| Alias | Maps to | Use |
| --- | --- | --- |
| `--fg-1` | `--surface-900` | Primary text |
| `--fg-2` | `--surface-700` | Body / secondary |
| `--fg-3` | `--surface-500` | Supporting / meta |
| `--fg-4` | `--surface-400` | Placeholder / disabled |
| `--fg-inverse` | `--surface-0` | Text on dark |
| `--bg-page` | `--surface-100` | App shell |
| `--bg-canvas` | `--surface-0` | Cards, content windows |
| `--bg-subtle` | `--surface-50` | Hover, subtle panels |
| `--bg-muted` | `--surface-100` | Chip / input background |
| `--border-subtle` | `--surface-200` | Card borders |
| `--border-default` | `--surface-300` | Input borders |
| `--border-strong` | `--surface-400` | Emphasis |
| `--border-focus` | `--primary-400` | Focus outline |
| `--accent` | `--primary-600` | Brand action |
| `--accent-hover` | `--primary-700` | Brand hover |
| `--accent-tint` | `--primary-100` | Brand background |

### 4.6 Radius, shadow, motion — see §3.

### 4.7 Type-size scale

Rendered into CSS custom properties so external HTML matches Tailwind exactly.

| Token | rem | px | Use |
| --- | --- | --- | --- |
| `--fs-4xs` | 0.5rem | 8 | Tiny hotkey chip |
| `--fs-3xs` | 0.625rem | 10 | Micro meta |
| `--fs-2xs` | 0.6875rem | 11 | Caption subheadings, eyebrows |
| `--fs-xs` | 0.75rem | 12 | xs button, sub-labels |
| `--fs-sm` | 0.875rem | 14 | **Body default** |
| `--fs-md` | 1rem | 16 | Rare |
| `--fs-lg` | 1.125rem | 18 | Workspace card title |
| `--fs-xl` | 1.25rem | 20 | Form section titles |
| `--fs-2xl` | 1.5rem | 24 | H3 |
| `--fs-3xl` | 1.875rem | 30 | H2 ("Workspaces") |
| `--fs-4xl` | 2.25rem | 36 | |
| `--fs-5xl` | 3rem | 48 | Hero page titles ("Continue building.") |

---

## 5. Typography

### 5.1 Families

| Family | Token | Use |
| --- | --- | --- |
| **Inter** | `--font-sans` | All chrome: nav, buttons, body, headings — *primary face* |
| **Lato** | `--font-body` | Long prose inside simulation scripts, scene text, character backstory |
| **Comic Relief** | `--font-display-playful` | Reserved for illustrative moments only; *use sparingly* |
| **Monospace** | `--font-mono` | System UI monospace — code/hex values in the DS |

Imports come from Google Fonts at the top of `colors_and_type.css`. No serifs appear in chrome.

### 5.2 Heading and body classes

Ready-made classes on the body element replace ad-hoc font rules.

| Class | Spec | Use |
| --- | --- | --- |
| `.ds-h1` | `500 48px/1.1 Inter, -0.01em`, colour `surface-700` | Hero page titles ("Continue building.") |
| `.ds-h2` | `600 30px/1.2 Inter, -0.01em`, colour `fg-1` | Library titles ("Simulations") |
| `.ds-h3` | `600 24px/1.25 Inter` | Modal titles, sub-pages |
| `.ds-h4` | `600 20px/1.3 Inter` | Form section titles |
| `.ds-title-lg` | `600 18px/1.35 Inter` | Workspace-card title |
| `.ds-title-md` | `600 14px/1.35 Inter` | Sim-card / list-row title |
| `.ds-body` | `400 14px/1.55 Inter`, colour `fg-2` | Paragraphs |
| `.ds-body-strong` | `500 14px/1.55 Inter`, colour `fg-1` | First-read sentences |
| `.ds-meta` | `500 14px/1.4 Inter`, colour `fg-3` | "12 members", "Edited 3 days ago" |
| `.ds-caption` | `500 12px/1.4 Inter`, colour `fg-3` | Small supporting copy |
| `.ds-eyebrow` | `600 11px Inter, uppercase, .05em`, `surface-600` | Section labels above groups (`Summary`, `Workspaces`) |
| `.ds-nav-back` | `600 11px Inter, uppercase, .1em`, `surface-700` | Back-link in sub-nav |
| `.ds-mono` | system mono, `fs-xs`, `fg-2` | Hex/keycode chips |

Headings are tightly tracked (`-0.01em`). Body uses normal tracking. Body line-height is 1.5; headings range 1.1–1.35.

### 5.3 Utilities

- `.ds-dotted-bg` — the auth-screen radial-dot pattern.
- `.ds-focus-ring` — on `:focus`, adds `--shadow-ring-primary`.
- `.ds-scrollbar` — thin 8px slate scrollbar thumb, transparent track.

---

## 6. Iconography

### 6.1 Icon system

Production ships **FontAwesome Pro (Regular)** — licensed, referenced by FA names (`fa-regular fa-tree-map`, `fa-regular fa-film`, `fa-regular fa-flask-vial`, `fa-regular fa-diagram-venn`, `fa-regular fa-film-slash`, `fa-regular fa-person-dots-from-line`, `fa-regular fa-envelope`, `fa-regular fa-phone`, `fa-regular fa-comment-dots`, `fa-regular fa-cube`, `fa-regular fa-layer-group`, `fa-regular fa-vial`, `fa-regular fa-table-list`, etc.).

The design-system package **falls back to [Lucide](https://lucide.dev)** (outlined, 1.5px stroke, 24px viewbox, rounded caps + joins) — glyph names in this DS map 1:1 to FontAwesome Pro Regular. Swap Lucide for the FA Pro kit at runtime for production.

### 6.2 Rules

- **Style**: outlined, 1.5px stroke, 24px box, rounded caps &amp; joins.
- **Sizes**: 14 (sm chrome), 16 (default), 20 (dialog / empty state), 40 (placeholder-panel icon).
- **Colour**: `currentColor` — icons inherit text colour in every context.
- **Simulation-type icons** are **illustrations, not icons** — full-colour PNGs from `assets/sim-icons/`. Never re-draw these in SVG; copy the file in.
- **Logo**: `assets/logos/studio_full_light.{svg,png}` (wordmark), `assets/logos/studio_square_light.{svg,png}` (square). On dark surfaces, apply `filter: invert(1) brightness(1.2)` until a dark variant ships.
- **No emoji. No Unicode pictographs.** If you need a symbol, use an icon from the set.

### 6.3 Inventory (UI-kit subset)

`tree-map` · `film` · `flask-vial` · `vial` · `person` · `venn` · `layers` · `cube` · `search` · `plus` · `arrow-right` · `arrow-left` · `x` · `chevron-down` · `ellipsis` · `gear` · `user` · `sign-out` · `envelope` · `phone` · `chat` · `send` · `paperclip` · `sparkles` · `bell` · `check` · `filter` · `mic` · `video` · `pin` · `table-list`

All are inlined as React SVG fragments in `ui_kits/studio/components.jsx` under the `Icon` primitive.

---

## 7. Core components

All runtime primitives live in **`ui_kits/studio/components.jsx`** and attach themselves to `window` so the other files can consume them as globals. A matching CSS-only rendition exists in `preview/*.html` for static use.

All components read tokens from a `TS` object that mirrors `colors_and_type.css` — this keeps the React components dependency-free.

### 7.1 Button

```jsx
<Button
  label="Create workspace"      // string
  icon="plus"                   // optional icon name
  variant="primary"             // primary | outline | destructive | ghost | ghost-primary
  size="md"                     // xs | sm | md
  hotKey="⌘↵"                  // optional right-side hotkey chip
  disabled={false}
  onClick={...}
/>
```

**Variants**

| Variant | Fill | Border | Text | Hover | Use |
| --- | --- | --- | --- | --- | --- |
| `primary` | `primary-600` | `primary-500` | `#fff` | `primary-700` | Single dominant CTA per screen |
| `outline` | `#fff` | `surface-300` | `surface-700` | `surface-50` | Secondary, cancel, filter |
| `destructive` | `error-500` | `error-500` | `#fff` | `error-600` | Delete, archive |
| `ghost` | transparent | transparent | `surface-700` | `surface-700/5%` | Close buttons, low-noise actions |
| `ghost-primary` | transparent | transparent | `primary-700` | `primary-700/5%` | Inline-link CTAs |

**Sizes**

| Size | Height | Padding-x | Font | Radius |
| --- | --- | --- | --- | --- |
| `xs` | 24 | 8 | 12 / 500 | 6 |
| `sm` | 28 | 10 | 12 / 500 | 6 |
| `md` | 36 | 12 | 14 / 500 | 8 |

**Hotkey chip**

- `8px` uppercase font (`--fs-4xs`), padded 2×3px, 4px radius, border `rgba(255,255,255,.4)` inside primary or `rgba(51,65,85,.25)` elsewhere.
- Shown right of the label. Kept to 1–2 characters (`⌘↵`, `⎋`).

**Focus** — 3px `primary-400/50` ring.

**Loading** — optional loading scrim (primary variant) with centred spinner; disables pointer.

### 7.2 IconButton

Round, 9999-radius, borderless, transparent resting state.

```jsx
<IconButton icon="bell" size="md" tooltip="Notifications" onClick={...}/>
```

| Size | Box | Icon |
| --- | --- | --- |
| `sm` | 24 | 14 |
| `md` | 32 | 16 |
| `lg` | 40 | 20 |

Hover bg `rgba(30,41,59,0.05)`. Icon uses `surface-800`.

### 7.3 Tag

Rounded-full pill; background is the chosen colour at 5% opacity (`+ '0D'`) with solid foreground colour.

```jsx
<Tag color={TS.primary600}>Primary</Tag>
<Tag color="#16a34a">Active</Tag>
```

- Font: `500 11px/1 Inter`.
- Padding: `5px 10px`.
- Gap: 6 (icon + text).

### 7.4 Badge (status)

Small uppercase chip, single word.

```html
<span class="badge" style="background:#dcfce7;color:#039855">PUBLISHED</span>
```

| Status | BG | FG |
| --- | --- | --- |
| `PUBLISHED` | `success-100` `#dcfce7` | `success-500` `#039855` |
| `DRAFT` | `warn-100` `#fef3c7` | `warn-500` `#cc8925` |
| `ARCHIVED` | `error-100` `#fee2e2` | `error-500` `#D92D20` |
| `COMING` / `DEMO` | `surface-100` `#f1f5f9` | `surface-300` `#cbd5e1` |

Spec: `600 10px/1 Inter, letter-spacing .05em, uppercase, padding 2×6, radius 6`.

There is also a **status-with-dot** variant used in list rows: `8px` coloured dot + label text at `500 12px`.

### 7.5 Avatar

Circular, initials-first.

```jsx
<Avatar initials="JD" size={32} color={TS.primary600}/>
<Avatar size={32}/>  {/* empty → muted grey with user-icon */}
```

| Size | Font |
| --- | --- |
| 24 (xs) | 10 |
| 32 (md) | 12 — default |
| 40 (lg) | 14 |
| 48 (xl) | 18 |

**Stack**: overlap `-8px` with 2px `#fff` ring. Overflow indicator is a muted "+N" chip (`surface-100` bg, `surface-600` text).

### 7.6 Input

Rounded-md white field with icon-left support.

```jsx
<Input value={v} onChange={...} placeholder="Search" icon="search"/>
```

- Height 38, padding `0 12px` (or `0 12px 0 36px` with icon).
- Border `surface-300` → focus `primary-300` + 3px `primary-400/30%` ring.
- Font `400 14px Inter`, colour `surface-900`, placeholder `surface-400`.
- Search variant in libraries uses `background: surface-100, border: transparent` (chip-like).
- Error state: border `error-500`, message `500 12px error-500` 6px below.

### 7.7 Textarea

Same visual language as Input, resizable vertically. `padding: 12`, `lineHeight: 1.5`. Same focus styles.

### 7.8 Dropdown (display)

```jsx
<Dropdown value={v} options={[{value,label}]} placeholder="Select…"/>
```

38px-tall pill with right-side chevron-down, `surface-400` placeholder, `surface-900` selected. Native select replacement — state management is implicit.

### 7.9 Switch

iOS-style toggle. 36×20 track, 16×16 thumb with a `0 1px 2px rgba(0,0,0,.2)` shadow.

- Off: `surface-300` track, thumb at left.
- On: `primary-600` track, thumb at right.
- Optional right label (`500 13px surface-700`).

### 7.10 Card

```jsx
<Card shadow="sm" bordered={true} style={{padding:16}}>…</Card>
```

- Fill `#fff`, border `1px surface-200` (droppable), radius 12.
- Shadows: `none | sm | md`. `sm` is default; elevated cards often drop the border and use `md`.
- Hover cards should lift shadow `sm` → `md`.
- Inner padding 14–16px for content cards.

### 7.11 Eyebrow

Label above section groups.

```jsx
<Eyebrow>Workspaces</Eyebrow>
```

`600 11px Inter, uppercase, .05em, surface-600`. Usually paired with `display:block` and 10–14px bottom margin.

### 7.12 RoleChip

Rounded-full pill that names a user's role. A core component: any surface that displays a role (welcome banner, user tables, profile) renders it as a RoleChip — never as plain text.

```html
<span class="role-chip is-primary">Member</span>
<span class="role-chip is-admin">Workspace admin</span>
```

Base spec: `600 11px Inter, letter-spacing .04em, padding 3×10, radius 999, inline-flex, white-space nowrap`. Label is the role's display name in sentence case (see §2 — "Member", not "MEMBER" or "Standard User").

**`is-primary` is the default state chip.** It pulls from the indigo (primary) palette and is the variant to reach for when the chip marks a state or identity rather than differentiating between roles in a list:

| Variant | BG | FG | Use |
| --- | --- | --- | --- |
| `is-primary` | `primary-50` | `primary-600` | Default state chip. Welcome banner uses this for **every** role. Also the Member role colour in tables. |
| `is-admin` | `primary-100` | `primary-700` | Workspace admin in tables/profile (one step darker than `is-primary` so the two stay distinguishable side-by-side). |
| `is-org-owner` | `success-100` | `success-600` | Org owner in tables/profile. |
| `is-org-admin` | `primary-200` | `primary-800` | Org admin in tables/profile. |
| `is-moderator` | `warn-100` | `warn-600` | Moderator in tables/profile. |
| `is-viewer` | `surface-100` | `surface-600` | Viewer in tables/profile. |

Rules:

- Welcome banner role chips are **always `is-primary`**, regardless of role — the banner states identity, it doesn't compare roles.
- Per-role colour variants are reserved for surfaces where multiple roles appear together (user tables, profile) and colour aids scanning.
- Do not introduce new colour variants per feature; map to one of the above or extend this table first.

Reference implementation: `prototypes/dashboard/index.html` (`.role-chip` CSS).

---

## 8. Composite components

### 8.1 AppHeader (auth shell top bar)

Fixed 56px bar with optional back button, left-aligned wordmark, and a right slot (avatar by default).

```jsx
<AppHeader right={<Avatar initials="JD"/>}/>
<AppHeader showBack onBack={...} right={<Avatar initials="JD"/>}/>
```

Back button uses `.ds-nav-back` styling: `600 11px uppercase .1em surface-700`, prefixed with `arrow-left` icon.

### 8.2 Sidebar

240px wide, `surface-100` fill, `surface-200` right border. Top workspace chooser is 28×28 square mark (in workspace colour) + wordmark + chevron.

Structure:

```
[workspace selector]
Summary eyebrow
NavItem[]
… spacer …
NavItem (Settings)
NavItem (Sign out)
```

Sections can drill-down with a "← BACK" header when entering a sub-area (Simulations → Characters / Environments / Experiences; Assessments → Tests / Rubrics).

### 8.3 NavItem

3-column grid: `28px icon · label · right chip`.

- Default: transparent bg, text `surface-700`.
- Hover: bg `primary-100`, text `primary-700`; a tiny 22×22 square chip with `arrow-right` appears at the right edge.
- Active: bg `primary-400`, text `#fff`, icon `#fff`.
- Optional right badge (`COMING`, `DEMO`): `surface-100` bg, `surface-300` text, `600 10px`.

Transition: 300ms.

### 8.4 TopBar (dashboard)

Fixed 56px white bar with bottom border `surface-200`. Structure:

```
[section label]  [members tag]   ……spacer……   [search]  [IconButton bell]  [Avatar]
```

- Section label: `600 14px surface-800`.
- Members count rendered as a `Tag` with colour `surface-500`.
- Search input: 240px wide with icon-left and `surface-100` fill.

### 8.5 Modal scrim / Overlay

```jsx
<div style={{
  position: 'fixed', inset: 0,
  background: 'rgba(15,23,42,.35)',
  backdropFilter: 'blur(2px)',
  zIndex: 50,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
}} onClick={close}>
  <Card shadow="md" bordered={false} style={{width: 480, padding: 28}}>…</Card>
</div>
```

Click the scrim to close; `stopPropagation` inside the card.

### 8.6 BuilderOverlay

Full-screen scrim with a 1120px-max centred white panel (12px radius, `padding: 32`) that fills the viewport vertically. Used for all three builders. Tall drop-shadow (`0 25px 50px -12px rgb(0 0 0/.25)`) separates it from the scrim.

### 8.7 Toast

Four variants; all 10px radius, `shadow-md`, 12×14 padding, 20×20 leading icon.

| Variant | BG | Border | Icon colour |
| --- | --- | --- | --- |
| **Default** | `#fff` | `surface-200` | `primary-600` |
| **Success** | `#fff` | `#bbf7d0` (green-200) | `success-500` |
| **Error** | `#fff` | `#fecaca` (red-200) | `error-500` |
| **Offline (dark)** | `surface-900` | none | `#fff` |

Heading `600 14px`; body `400 13px/1.45 surface-600` (or `surface-300` on dark).

### 8.8 Form primitives (`Stepper.jsx`)

These are the building blocks of every builder.

#### FormSection

```jsx
<FormSection title="Basic simulation information" subtitle="Overview of the simulation" headerRight={<…>}>
  {children}
</FormSection>
```

- Gap 24 between header and body, 32 between children.
- Title `600 18px/1.3 surface-900`; subtitle `400 12px/1.4 #4b5563`.
- Optional right-aligned action slot.

#### FormField

Two-column: **35% label column** (+ optional description + optional bottom-left accessory like `WordCount`) | **1fr input column**.

```jsx
<FormField
  label="Simulation Purpose"
  description="What is the goal of the simulation?"
  leftBottom={<WordCount text={text} limit={250}/>}>
  <Textarea …/>
</FormField>
```

- Label `600 14px surface-800`. Description `400 12px/1.4 surface-500`.
- Optional tooltip gear icon right of the label.
- Gap 32 between columns; gap 12 inside columns.

#### FormDivider

Thin `surface-200` horizontal rule spanning 100%. Used between grouped FormFields within the same section.

#### WordCount

`500 11px surface-400` → `error-500` on overflow. Format `N / LIMIT characters`.

### 8.9 Stepper

#### StepperHeader

Inline horizontal pill row: `[n ● Label] ─── [n ● Label]` etc.

- Number badge: 24px circle, `primary-600` active / `#9ca3af` inactive.
- Label: `500 14px` matching the badge colour.
- Connector: 1px `#f3f4f6` horizontal rule.

#### StepperShell

Full-height panel split into scroll area + 72px sticky footer.

```
┌─────────────────────────┐
│ children.header (PageTitle) │
│ StepperHeader               │
│ children.body (forms)       │
│  …scrolls…                  │
├─────────────────────────┤
│ [Close] [leftActions] ⋯⋯ [●Saved]  [Previous] [Next / Finish] │
└─────────────────────────┘
```

Footer:
- Left: a `ghost` **Close** + optional ghost actions (e.g. `Delete`).
- Right: a **Saved** indicator (`6×6` green dot + "Saved" in `500 12px surface-400`) and paginate buttons.
- Pagination: **Previous** (`outline`) visible when `active > 0`; **Next** (`primary`) until the last step, where it becomes **Finish**.

#### PageTitle

```jsx
<PageTitle title="Simulation" subtitle="Create and configure…" end={<…>}/>
```

- H1: `700 30px/1.2 surface-900, -0.01em`.
- Subtitle: `400 14px/1.5 surface-500`, max-width 720.
- Padding `20px 24px 12px`.

### 8.10 List patterns

These look nearly identical on the surface and vary only in the internal layout of each row.

#### Generic card-list row

```
[icon|number|dot] [title + meta] [spacer] [IconButton ellipsis]
```

Row container: `padding 10–14px, border 1px surface-200, radius 10, background #fff`. Followed by an **"+ Add …"** CTA row with `1px dashed surface-300` border and `500 13px surface-500` text.

Specialisations:

| Pattern | Leading element | Title | Meta |
| --- | --- | --- | --- |
| **Stock chat** | 32px circle avatar (character colour) | `600 13px surface-800` | `400 12px surface-500` + `500 11px surface-400` time |
| **Outcome** | 10×10 coloured dot (success/partial/failure) | `600 14px surface-800` | `400 12px/1.4 surface-500` |
| **Agenda** | 20×20 primary-100 numbered circle | `400 13px surface-700` | — |
| **Rubric category** | 8×8 coloured dot | `500 13px surface-800` | — |
| **Test block** | 28×28 primary-50 numbered square | `600 14px surface-800` | `400 12px surface-500` |
| **Relationship** | 40px coloured avatar | `600 14px surface-800` | `400 12px surface-500` |
| **Text list** (values / terms) | none | `400 13px surface-800`, `surface-50` bg row | removable via `x` IconButton |

### 8.11 RubricMatrix

Grid with `160px` first column + N (default 4) level columns.

- Header row: `surface-50` bg, eyebrow-style `600 11px .05em uppercase surface-500`.
- Row header: coloured dot + `600 13px surface-800`.
- Cells: `400 12px/1.45 surface-600`, 12px padding, left-border `surface-100`.
- Container: 10px radius, `1px surface-200` border, `#fff` bg.

### 8.12 Upload dropzone

```
[Icon plus] Upload logo
PNG or SVG · Up to 2MB
```

`1px dashed surface-300`, radius 10, `surface-50` bg, 24×16 padding.

### 8.13 PlaceholderPanel (empty-state)

Centred vertical stack: a 40px muted icon (`surface-300`) + a `600 18px surface-700` title + a `400 13px` body ("Coming soon." / "This area is empty in the kit."). No illustrations, no characters.

---

## 9. Layout patterns

### 9.1 Auth shells (unauthenticated or sign-up)

```
<div class="h-screen w-screen ds-dotted-bg">
  … centered white card or workspace picker …
</div>
```

- Full-bleed dotted background.
- Single centred card (signup) — white, rounded-md, `shadow-sm`, ≈384px wide.
- Or split-centre layout (workspace picker) — left copy + right list, gap 24 → 96px.

### 9.2 Default authed shell

```
┌─────────────────────────────────────────────────────┐
│ 240px Sidebar │  TopBar (56px)                       │
│               ├──────────────────────────────────────┤
│               │                                      │
│               │  Main content window                 │
│               │  bg #fff · border surface-200        │
│               │  radius-xl · padding 24/32           │
│               │                                      │
└───────────────┴──────────────────────────────────────┘
```

`layouts/default.vue` renders the sidebar, then a flexible main containing a bordered white card (`rounded-xl · border surface-200 · overflow-auto · studio-scrollbar`). A float layout hides the sidebar off-canvas with a hover handle.

### 9.3 Page-within-window

Inside the content window, a typical page has:

```
Section header row
  ┌─────────────────────────────────────┐
  │ H2 · H2 subtitle                    │  [Filter (sm outline)] [Primary CTA]
  └─────────────────────────────────────┘
Grid / List
  (3-up card grid for libraries, list rows for row-based data)
```

- H2: `600 30px/1.2 surface-800, -0.01em`.
- Subtitle: `400 14px/1.55 surface-500`, 4px below, max-width 60ch.
- Right-aligned primary action; preceded optionally by an outline filter.

### 9.4 Builder overlay

Full-screen scrim + 1120px-max panel. Internal layout matches `StepperShell` (for simulations/assessments) or a single-page form (environments).

### 9.5 Grid defaults

- **3-up grid** for card libraries on desktop: `grid-template-columns: repeat(3, 1fr); gap: 16`.
- **2-up grid** for 2-column forms and hero app cards.
- **List rows** inside a bordered white card for ordered/reviewable items (assessments, rubric matrix).

---

## 10. Application screens

These are the specific screens reproduced 1:1 in `ui_kits/studio/index.html`.

### 10.1 Complete sign-up (`pages/signup.vue`)

- **Shell**: centred over `ds-dotted-bg`.
- **Card**: `384px × auto`, white, `rounded-md`, `shadow-sm`, 16/20 padding, gap 24.
- **Logo**: square `studio_full_light.png` 64px tall, centred.
- **Divider label**: `text-sm uppercase surface-700` "Complete Sign Up" flanked by hairlines.
- **Fields**: Email (readonly), First name, Last name — each in `AppInputLabel` + `AppInputText`.
- **Footer**: right-aligned `Continue` primary button, disabled until all fields present.
- **Error state**: same card replaced by a compact white card with an `fa-regular fa-circle-exclamation` icon and a single-sentence error.

### 10.2 Workspace picker (authed landing — `pages/index.vue`)

- **Shell**: `ds-dotted-bg`, fixed-top logo + icon actions (SystemAdmin for super-users, SignOut).
- **Center split**: left hero copy + right workspace list + add-workspace button.
- **Hero copy**:
  - H1 (`ds-h1`): "Continue building in your workspace." / "Continue building." (UI kit variant)
  - Body (`.ds-body`): "Select the workspace where you would like to continue building simulated work experiences or create a new workspace below."
  - Optional `HomeArrowGraphic` illustration above the copy.
- **Workspace list** (`HomeWorkspaceList` / `HomeWorkspaceListItem`): `shadow-md, bordered:false, padding 8` card containing rows.
  - Row: 44×44 coloured rounded square (workspace initials, workspace colour, `700 16px #fff`) + name (`600 16px surface-800`) + meta "N members" (`500 13px surface-500`) + trailing `arrow-right` icon.
  - Hover row background: `surface-50`.
  - Separator: `1px surface-100` between rows.
- **Create CTA**: right-aligned primary `plus + Create workspace` button.
- **Create modal** (`CreateWorkspaceModal`):
  - 480px card, 28px padding.
  - Title `600 18px surface-800` + body `400 13px surface-500`.
  - Single `Workspace name` text input with an `e.g. …` placeholder.
  - Footer: outline `Cancel` + primary `Create workspace` with `⌘↵` hotkey, disabled until name present.

### 10.3 Dashboard shell

- **Sidebar** items: `Dashboard` (active) → `Simulations` → `Environments` → `Assessments` → `Rubrics [COMING]` → `Members`. Bottom: `Settings`, `Sign out`.
- **Top bar**: section label + members tag + search + bell + avatar.
- **Content**: default 32px padding.

### 10.4 Simulation library

- Header row: `H2 "Simulations"` + subtitle "Build simulated work experiences for your learners." + outline `Filter` (sm) + primary `New simulation` (md, plus icon).
- **3-up card grid** (`gap: 16`).
- **Card** (16px padding, shadow-sm, hover-md):
  - Top row: 36×36 tinted icon well (`type.color + 14%` bg) with type icon + right-aligned status badge (`PUBLISHED`/`DRAFT`/`ARCHIVED`).
  - Title: `600 15px/1.35 surface-800`, `min-height: 40` for consistent row alignment.
  - Meta row (`500 12px surface-500`): type · 3×3 `surface-300` dot · N scenes · spacer · `ellipsis` IconButton.

Sample entries span chat, email, call, and AI conversations. Each entity colour matches its simulation type: `Chat → primary-600`, `Email → info-500 (#0284c7)`, `Call → cat-pink (#db2777)`, `AI → success-600 (#16a34a)`.

### 10.5 Environment library

- Header: `H2 "Environments"` + subtitle "Workplaces, characters, and candidate relationships reused across simulations." + primary `New environment`.
- **3-up card grid**. Card layout:
  - Top row: 40×40 coloured rounded square (initials, workspace colour) + name + industry meta.
  - Divider (`1px surface-100, pt-12`).
  - Meta row: `person` icon + "N characters" + ellipsis.

### 10.6 Assessment library

- Header: `H2 "Assessments"` + subtitle "Group tests and rubrics into scored experiences." + primary `New assessment`.
- **Stacked list** inside a bordered white card (no grid):
  - Row: 36×36 `primary-50` icon well with `flask-vial` + title + meta "N tests · N categories" + status badge + ellipsis.
  - 1px `surface-100` bottom border between rows.

### 10.7 Placeholder (Dashboard / Members / Rubrics)

Centred empty state using `PlaceholderPanel`. Rubrics carries `coming` prop → subtitle "Coming soon."

---

## 11. The three builders

All builders render inside a `BuilderOverlay` (1120px-max, 12px radius, `shadow-xl`). Two of them use `StepperShell`; one is a single scrollable form.

### 11.1 Simulation builder (3-step stepper)

Source: `components/Simulation/Stepper/SimulationStepper.vue` → `ui_kits/studio/SimulationBuilder.jsx`.

Steps: **Basic · Design · Content**.

- **Close** button (ghost, footer-left) + **Delete** (ghost, `x` icon).
- State (defaults shown):
  - `title` (text)
  - `type` (enum: `chat | voice | emailReceive | emailCreate | aiConversation`)
  - `usePrimaryCharacter` (bool)
  - `characterId`, `environmentId` (IDs)
  - `candidateInitiates`, `canBeRetried` (switches)
  - `purpose` (textarea, 250 limit)
  - `candidateObjective` (textarea, 250 limit)
  - `conversationTone` (enum: `empathetic | assertive | neutral`)
  - `tags` (multi-select pills)
  - `background`, `chatSkin` (enums)
  - `stockChats`, `outcomes`, `agenda` (counts — rendered as list widgets)

**Step 1 — Basic**: long `FormSection` of `FormField` rows: Title (Input) → Primary Character (Dropdown) → Environment (Dropdown) → Candidate Initiates (Switch) → Can Be Retried (Switch) → Simulation Purpose (Textarea + WordCount) → Candidate Objective (Textarea + WordCount) → Conversation Tone (Dropdown) → Tags (custom pill-input box).

**Step 2 — Design**: Background (Dropdown) → Skin (Dropdown) → `FormDivider` → Stock Chats (`StockChats` widget — list of sample chat rows with avatars, preview, time, ellipsis; `+ Add Stock Chat` dashed CTA).

**Step 3 — Content**: Two sections separated by `FormDivider`.
- **Simulation Outcomes** — `OutcomeList` (three possible resolutions: success / partial / failure, dot colours `success-600 / warn-500 / error-500`). `+ Add Outcome`.
- **Simulation Agenda** — `AgendaList` (numbered primary-100 bullets on `surface-50` bg). `+ Add Agenda Action`.

### 11.2 Environment builder (single-page form)

Source: `pages/[workspaceId]/environments/[environmentId].vue` → `ui_kits/studio/EnvironmentBuilder.jsx`.

**Not a stepper**. Single scroll; four stacked `FormSection`s separated by `FormDivider`:

1. **Environment settings** — `Environment Name`.
2. **Workplace settings** — `Workplace Name`, `Workplace Logo` (UploadDropzone), `Industry description`, `Working atmosphere` (Textarea, 250 limit), `Frequently used terms` (TextList), `Values` (TextList), `Exclusions` (TextList).
3. **Candidate** — `Candidate Role`, `Additional Candidate Context` (Textarea).
4. **Candidate-Character relationships** — `RelationshipList` of avatar-led rows: character name · role · relation.

**Footer**: ghost `Delete environment` (left) + ghost `Cancel` + primary `Save & Close`.

### 11.3 Assessment builder (4-step stepper)

Source: `components/Assessment/Stepper/AssessmentStepper.vue` → `ui_kits/studio/AssessmentBuilder.jsx`.

Steps: **Basic · Tests · Grading · Confirm**.

**Step 1 — Basic**: Title → `FormDivider` → Miscellaneous (two switches: Email confirmation, Integrity pledge) → Objective (Textarea, 500 limit) → Assessment trigger (Dropdown: On submit / On timeout / Manual) → What is being graded? (Dropdown: Rubric / Pass-fail / Numerical) → Grading categories (`CategoryList` with coloured dot + ellipsis, `+ Add Category`, `N / 10 categories` meta).

**Step 2 — Tests**: `Test Blocks` list — numbered `primary-50` squares, each block shows title + `type · N scenes`. `+ Add Test`.

**Step 3 — Grading**: Two sections.
- **Grading settings** — `Numerical scoring` (Switch), `Category score allocation` (Dropdown: Equal / Weighted), `Category score weighting` (Dropdown: Average / Sum).
- **Grading rubric** — `RubricMatrix` (4 default levels: **Emerging · Developing · Proficient · Excellent**).

**Step 4 — Confirm**: Summary card.
- **Tests** — two tags: `N tests linked` (success-600) + `All reachable` (surface-500).
- **Grading categories** — one tag per category, coloured.
- `FormDivider`.
- **Publish** — two segmented buttons (`Draft` / `Published`), whichever is selected is `primary`.
- Centered disabled primary **Preview Assessment** (feature-gated).

---

## 12. Brand assets

### 12.1 Logos (`assets/logos/`)

| File | Use |
| --- | --- |
| `studio_full_light.svg` / `.png` | Wordmark on light surfaces — 22px tall in nav, 42px tall in previews |
| `studio_square_light.svg` / `.png` | Square mark; use for workspace chooser (28px) or app icon |
| `mimicly_light.png` | Predecessor mark; kept for public asset compatibility |

On dark surfaces, apply `filter: invert(1) brightness(1.2)` until a dark-variant is provided.

### 12.2 Simulation icons (`assets/sim-icons/`)

Full-colour PNG **illustrations**, not line icons. Used on sim-type cards and pickers.

| File | Label |
| --- | --- |
| `chat.png` | Chat conversation (Slack / Teams / iMessage) |
| `email.png` | Email (receive · reply · compose) |
| `call.png` | Voice call (ElevenLabs-driven in prod) |
| `ai-conversation.png` | AI conversation (scripted dialogue) |

Matching widescreen previews live in `assets/sim-previews/*.jpg` and `public/images/simulations/simulation-preview-*.jpg`. Small (48px) versions under `public/images/simulations/small/`.

### 12.3 Backgrounds (`assets/backgrounds/`)

Cool, muted horizon imagery. 16:9 PNGs sized for full-bleed use.

| File | Role |
| --- | --- |
| `mountain.png` | Default auth-shell backdrop, "calm" decks |
| `rays.png` | Reveal / celebratory moments (post-publish) |
| `waves.png` | Simulation player shell |
| `gradients.png` | Soft secondary backdrop |

Matching `public/images/interaction-backgrounds/interaction-background-*.png` are the filenames the production app expects.

### 12.4 Screens (`screens/`)

Raw JPG captures of representative screens — suitable as hero imagery in the design-system landing page and as reference during implementation.

---

## 13. Domain enums &amp; data

### 13.1 Simulation type

From `static/data/simulations/simulationTypeOptions.ts`.

| Enum | Label | FontAwesome icon |
| --- | --- | --- |
| `aiConversation` | AI conversation | `fa-regular fa-cube` |
| `chatConversation` | Chat conversation | `fa-regular fa-comment-dots` |
| `emailCreate` | Email create and send | `fa-regular fa-envelope` |
| `emailReceive` | Email receive and reply | `fa-regular fa-envelope` |
| `voiceCall` | Voice call | `fa-regular fa-phone` |

### 13.2 Simulation backgrounds

`backgroundOptions`: `None · Flower · Galaxy · Gradients · Mountain · Rays · Waves` — mapped to the PNGs in `assets/backgrounds/`.

### 13.3 Chat &amp; email skins

- `chatSkinOptions`: **Google**, **Slack** — in UI-kit dropdowns the Slack variant splits into `Slack — Light` / `Slack — Dark`, plus `Microsoft Teams` and `iMessage` are shown as sample options.
- `emailSkinOptions`: **Google**, **Microsoft**.

### 13.4 Colour options

From `static/data/color/colorOptionHexes.ts` — the `ColorOption` enum maps to the categorical hex set above, plus `Primary (#4f46e5)`, `Error (#D92D20)`, `Success (#039855)`, and `Grey (#374151)`.

### 13.5 Attempt &amp; grading status

From `static/data/status.ts`.

- `AttemptStatus`: `Complete · In Progress · Incomplete · Not Started · Processing · Error`.
- `GradingStatus`: `Complete · Error · In Progress · Not Started · Queued · Timeout · Processing · Out of Date · Regrade Required`.

These labels are the authoritative strings displayed in the UI.

### 13.6 Conversation tone (simulation)

Builder-side enum: `empathetic · assertive · neutral`.

### 13.7 Assessment enums

- **Grading type**: `rubric · pass-fail · numerical`.
- **Completion trigger**: `onSubmit · onTimeout · manual`.
- **Category score allocation**: `equal · weighted`.
- **Category score weighting**: `average · sum`.
- **Rubric levels** (default): `Emerging · Developing · Proficient · Excellent`.

---

## 14. Implementation guide

### 14.1 For static HTML / prototypes

1. Import the token sheet first:
   ```html
   <link rel="stylesheet" href="./colors_and_type.css"/>
   ```
2. Use CSS custom properties directly:
   ```css
   .my-btn {
     height: 36px; padding: 0 12px;
     background: var(--primary-600);
     color: var(--surface-0);
     border: 1px solid var(--primary-500);
     border-radius: var(--radius-md);
     box-shadow: var(--shadow-xs);
     transition: background var(--dur-base) var(--ease-std);
   }
   .my-btn:hover { background: var(--primary-700); }
   ```
3. Use semantic type classes (`ds-h1`, `ds-body`, `ds-eyebrow`) instead of rewriting font shorthand.
4. Grab pre-built primitives from `preview/*.html` — each is self-contained and pasteable.

### 14.2 For React or a JS runtime

1. `ui_kits/studio/components.jsx` exports (via `window`) a `TS` token object and primitives `Icon · Button · IconButton · Tag · Avatar · Input · Card · Eyebrow`.
2. `Stepper.jsx` adds form primitives: `PageTitle · StepperHeader · StepperShell · FormSection · FormField · FormDivider · Switch · Textarea · Dropdown · WordCount`.
3. Each builder is a single default React component that composes the primitives. Lift any of them out by copying the file and the one dependency file it imports from.
4. The whole UI kit runs from a static HTML page — `index.html` loads React + ReactDOM + Babel-standalone via unpkg, then renders `<WorkspaceApp/>` into `#root`. No build step.

### 14.3 For the production Vue app

1. `components/App/*` contains `AppButton`, `AppAvatar`, `AppIcon`, `AppTag`, plus button sugar wrappers `AppButtonPrimary`, `AppButtonSecondary`, `AppButtonDanger`, `AppButtonIcon`, `AppButtonText`.
2. Tailwind classes match the tokens above. Stick to `primary-*`, `surface-*`, `error-*`, `success-*`, `warn-*`, `info-*` scale names.
3. `NavBar/NavBar*` provides the sidebar shell; `NavBarSection` handles the drill-down-with-back animation (200ms translate/fade).
4. Layouts: `layouts/default.vue` is the sidebar-plus-content-window shell; pages using `definePageMeta({ layout: false })` are full-bleed (signup, authed picker).
5. PrimeVue is available for heavier widgets (toast, menu, dialog); styling is already themed to match the tokens.

### 14.4 Copy-and-compose recipes

| Need | Reach for |
| --- | --- |
| Brand CTA | `Button` variant=`primary` size=`md`, add `icon` and optional `hotKey` |
| Secondary action | `Button` variant=`outline` or `ghost` |
| Destructive action | `Button` variant=`destructive` or a ghost `x Delete` in footer-left |
| Status on a card | `StatusBadge` with `Published` / `Draft` / `Archived` / `Coming` |
| Colour-coded pill | `Tag` with one of the categorical hexes |
| Sidebar link | `NavItem` — active styling handled by prop |
| Top-bar search | `Input` with `icon="search"`, width 240 |
| A form row | `FormField` (35%/65% split) + optional `WordCount` as `leftBottom` |
| A grouped form | `FormSection` title + subtitle; dividers between sub-groups |
| A modal | `Card` inside a 35% scrim with `backdrop-filter: blur(2px)` |
| A builder | `BuilderOverlay` + `StepperShell` (or a plain scrollable form) |
| An empty area | `PlaceholderPanel` — never a mascot illustration |

### 14.5 Page-structure checklist

When building a new page inside the authenticated shell:

1. Start with `layouts/default.vue` (content window inside a bordered white rounded-xl card).
2. Render a **section header row** at 32px page padding: H2 + subtitle on the left, primary CTA (optionally preceded by an outline filter) on the right.
3. Choose your body:
   - **Card grid** (3-up) for libraries.
   - **Card list** (stacked rows in one bordered card) for reviewable records.
   - **Form sections** (`FormSection` + `FormField`) for settings / builders.
4. Empty states use `PlaceholderPanel`.
5. Destructive/finalising actions live in a sticky footer if the page is a builder; otherwise in a right-aligned action group at the top.

---

## 15. Caveats &amp; substitutions

- **FontAwesome Pro → Lucide.** Licensing prevents bundling FA Pro. Replace the Lucide CDN with your FA Pro kit for production fidelity. Glyph names in this DS map 1:1 to FA Pro Regular.
- **Comic Relief + Lato** come from Google Fonts. Inter is expected as the webfont (Google Fonts or self-hosted).
- **Simulation player canvas** (live chat feed, voice waveform, email pane) is intentionally out of scope — too specialised to fake convincingly. Only the authoring chrome is documented here.
- **Rubric authoring** is marked `COMING` in the live app; the rubric shown in the assessment builder is static sample data intended to convey shape and typography.
- **Admin settings** (super-user / system-admin screens) are deliberately excluded.
- **Dark logo variant** isn't yet in the repo; `filter: invert(1) brightness(1.2)` is the current stopgap.
- **Tokens &amp; Tailwind scale.** The token sheet and Tailwind use the same numeric scale names — swap one source for the other without regressions.

---

*Sourced from `groundflr/studio-web-app` frontend (`apps/web/`, Vue 3 + Nuxt 3 + Tailwind + PrimeVue). This document is the comprehensive reference for every token, primitive, composite component, page, and flow represented in the Traverse Studio design-system package.*
