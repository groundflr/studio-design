# Traverse component library — usage & contributor guide

The single source of truth for prototype components in `studio-design`. Each component is a `tv-*` custom element (a "web component") defined **once** in `components/`. Use the tag anywhere and it pulls that one definition — edit the definition and every prototype updates on reload (and on the next Vercel deploy).

This exists to stop the same component being rebuilt slightly differently each time. **Reuse the tag; don't re-author the markup.**

## How to view it

- **Locally:** from the repo root run `python3 -m http.server 4711`, then open `http://localhost:4711/component-library/`.
- **Hosted:** it deploys to Vercel automatically on push — share that URL with developers.

(Opening `index.html` directly with `file://` won't load the registry — use a local server or Vercel.)

## How to use a component in a prototype

Add the loader once per page, then use the tags:

```html
<link rel="stylesheet" href="/design-system/colors_and_type.css" />
<script src="/component-library/tv-components.js"></script>

<tv-status-tag kind="ai"></tv-status-tag>
<tv-button variant="primary">Save</tv-button>
```

The loader finds its own folder, so the same line works locally, on Vercel, and from subfolders. Components read your design tokens from `colors_and_type.css`, so they stay on-brand and themeable from one place.

## What exists right now

| Component | Tag | Status |
|---|---|---|
| Status tag | `<tv-status-tag>` | Built |
| Button | `<tv-button>` | Built |
| Diff chip | `<tv-diff>` | Built |
| Excerpt block | `<tv-excerpt>` | Built |
| Field | `<tv-field>` | Built |
| Toggle switch | `<tv-toggle>` | Built |
| Modal card | `<tv-modal-card>` | Built |
| Audit row | `<tv-audit-row>` | Built |
| Avatar | `<tv-avatar>` | Built |
| Metric tile | `<tv-metric-tile>` | Built |
| Settings section | `<tv-settings-section>` | Built |
| Peek rail | `<tv-peek-rail>` | Built |
| Nav item | `<tv-nav-item>` | Built |
| Nav group heading | `<tv-nav-heading>` | Built |
| Nav group | `<tv-nav-group>` | Built |
| Nav user button | `<tv-nav-user>` | Built |
| Nav header | `<tv-nav-header>` | Built |
| Nav back link | `<tv-nav-back>` | Built |
| Workspace picker | `<tv-nav-workspace>` | Built |
| Sidebar | `<tv-sidebar>` | Built |
| Page header | `<tv-page-header>` | Built |
| Tab | `<tv-tab>` | Built |
| Tab group | `<tv-tab-group>` | Built |

The gallery (`index.html`) is the live, detailed version of this table — full specs, use cases, live previews, do/don't. `registry.json` is the machine-readable version that tools and Claude read first.

## The reuse rule (for you and for Claude)

Before building any UI:

1. **Check `registry.json`.** If a component is listed as `built`, use it via its tag — never paste a re-styled copy.
2. **If it's listed as `planned`,** build it now (see below) rather than a one-off.
3. **If it's not listed at all,** build it as a `tv-*` component, then register it.

This rule also lives in the repo's `CLAUDE.md` so Claude Code follows it automatically.

## How to add a new component

1. Create `components/tv-<name>.js` — copy an existing component as a template. Use Shadow DOM, reference design tokens with fallbacks (`var(--primary-600,#4f46e5)`), and guard with `if (customElements.get('tv-<name>')) return`.
2. Add `'tv-<name>'` to the `COMPONENTS` array in `tv-components.js`.
3. Add an entry to `registry.json` (name, tag, category, status, summary, use cases, attributes, tokens, do/don't, usage).
4. Add a `<template id="preview-<id>">` with a live example to `index.html` and flip its status to `built`.
5. Append a line to `UI Change Logs/Component Library.md` (repo convention).

## Conventions

- **Tags:** `tv-` prefix, kebab-case.
- **Styling:** design tokens from `colors_and_type.css`, always with a hex fallback so components render standalone.
- **Typography:** components use **Geist** via their own token `--tv-font` (default Geist), and the loader pulls the Geist webfont in. This is intentionally *separate* from the global `--font-sans` (Inter) so existing prototypes stay on Inter — the component library is migrating to the V2 look first. Override per-page by setting `--tv-font`. (New indigo to follow later.)
- **Icons:** the **Lucide font**, vendored locally at `fonts/lucide/` (css + woff2/woff/ttf). Components render `<i class="icon-NAME">` and call `window.__tvIcons(this.shadowRoot)` after render — this links the vendored stylesheet *into* each shadow root, because `.icon-*` class rules don't cross the shadow boundary (only the document-global `@font-face` would). **Any Lucide icon name works** as `icon="name"` — no per-component icon map to edit. A few legacy short names are aliased centrally in `tv-components.js` (`rotate→rotate-cw`, `sliders→sliders-horizontal`, `userplus→user-plus`, `chevron→chevron-up`, `arrow→arrow-up-right`, `up→trending-up`). Override the font location with `window.__TV_LUCIDE_HREF__` before the loader runs (default resolves to the vendored copy, so icons render fully offline). Size an icon by setting `font-size` on its wrapper; colour follows `currentColor`.
- **Voice:** sentence case; verbs lead button labels; no emoji.
- **Naming/anatomy** for the modal card follows `V2-to-V1-bridge/shared-modal-card-rulebook.md` — the governance doc for when/how to use it and how to split information between the main screen and the card.

## Type roles (single source — no type literals in components)

Every text style lives once in `design-system/colors_and_type.css` as a `--text-<role>-{weight,size,leading,tracking,color}` token set (sizes alias the `--fs-*` scale). The loader (`tv-components.js`) builds one shared stylesheet of `.tv-<role>` classes from those tokens and adopts it into every component's shadow root via `window.__tvType(this.shadowRoot)` (call once at the end of `render()`).

**Roles:** `display-lg` `display-sm` · `h1`–`h6` · `body-lg` `body` `body-strong` `body-sm` · `label` `label-strong` `label-sm` `button` `button-sm` `tag` · `caption` `overline` `eyebrow` `micro` · `stat` `mono` `link`.

Rules for components:
- **Never write type literals** (`font-size`/`font-weight`/`line-height`/`letter-spacing`) in a component's `<style>`. Apply a role class to the element instead — e.g. `<h1 class="tv-h1">`, `<span class="tv-overline">`, `<button class="tv-label-strong">`.
- The component owns **layout/spacing only** (flex, gap, margins).
- **Colour is the one re-pointable axis.** To change a role's colour for context (inverse on a banner, muted description), set it to another **token** — never a hex. Because the adopted role sheet beats a component `<style>` rule at equal specificity, re-point colour either **inline** (`style="color:var(--fg-3)"`) or with a **state/descendant selector** (`:host([active]) .label{ color:var(--fg-inverse) }`), both of which outrank the flat role class.
- Change a role's look at the **token source**, once — every component follows.
