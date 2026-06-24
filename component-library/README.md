# component-library

Browsable, reusable component library for the Traverse Studio prototypes. Plain HTML/CSS + native web components — no build step.

**View it:** `python3 -m http.server 4711` from the repo root → `http://localhost:4711/component-library/` (or the Vercel URL).

**Use a component:**

```html
<script src="/component-library/tv-components.js"></script>
<tv-status-tag kind="ai"></tv-status-tag>
<tv-button variant="primary">Save</tv-button>
<tv-modal-card heading="…" primary-label="Save">…body…</tv-modal-card>
```

```
component-library/
├── index.html          ← the gallery (open this)
├── registry.json       ← canonical list of components + status (read first)
├── tv-components.js     ← one-line loader; registers every component
├── components/          ← one file per component (single source of truth)
│   ├── tv-status-tag.js
│   ├── tv-button.js
│   └── tv-modal-card.js
├── COMPONENTS.md        ← usage + contributor guide + the reuse rule
└── README.md
```

Edit a file in `components/` and every page that uses that tag updates on reload. See `COMPONENTS.md` for how to add a component and the reuse rule.
