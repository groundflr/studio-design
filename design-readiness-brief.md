# Build brief — design readiness system

**For:** Claude Code, executing in `studio-design`
**Requested by:** Lara
**Date:** 10 August 2026

---

## Why

Developers can't tell which designs are finalised. `prototypes/dashboard/index.html` is 680KB and holds eleven `<section class="screen">` blocks at completely different maturities. The devbar currently renders this:

```html
<button class="dev-btn" data-nav="system-admin-summary">SA · Summary</button>
<button class="dev-btn" data-nav="system-admin-summary-v2">SA · Summary v2</button>
```

Two versions of the same screen, adjacent, identically styled, with nothing indicating which is real. `features/` is not a usable fallback — only three of eight features have a populated `design.md`.

The repo already solves this for components: `component-library/registry.json` carries `"status": "built"`, a preview page renders it, and CLAUDE.md enforces *"if a component is listed as built, use it via its `tv-*` tag."* **This brief does the same thing for screens.**

**Design principle for the whole job: one source of truth, everything else generated.** Every place a human has to keep two things in sync is a place this system starts lying. If you find yourself adding a second file someone must hand-edit, stop and flag it.

---

## The model

### Vocabulary — four statuses, no more

| Status | Label | Meaning | Buildable? |
|---|---|---|---|
| `ready` | READY | Design is settled. Build exactly this. | Yes |
| `wip` | WIP | Actively being designed. Will change. | No |
| `explore` | EXPLORING | A deliberate alternative or spike. May never ship. | No |
| `superseded` | SUPERSEDED | Replaced. Kept for reference only. | Never |

Labels are uppercase single words, per the existing house rule in CLAUDE.md (`PUBLISHED`, `DRAFT`, `ARCHIVED`, `COMING`).

**A missing `data-status` means not ready.** Treat absent as `wip` everywhere, and surface it in the index as `wip` with a subtle "unmarked" hint. This is deliberate: the safe failure is a developer asking a question, not a developer building an unfinished design. Do not invent a fifth status for "unmarked".

### Where status lives

**Screens are the unit.** Status goes on the existing section element — no new wrapper, no new file:

```html
<section class="screen" data-screen-name="system-admin-summary-v2" data-status="ready">

<section class="screen" data-screen-name="system-admin-summary"
         data-status="superseded" data-superseded-by="system-admin-summary-v2">
```

`data-superseded-by` is **required** whenever `data-status="superseded"` and must name a `data-screen-name` that exists in the same file.

**Variants are the complication — handle them with inheritance.** The index lists many entries that are query-param variants of one screen (`/dashboard?welcome=1&role=moderator`, `?role=viewer`, and so on — currently ~12 against the single `dashboard` screen). These can legitimately differ in maturity.

Solve it with one JSON block per prototype file, placed immediately after `<body>`, declaring that prototype's index entries:

```html
<script type="application/json" id="prototype-manifest">
{
  "prototype": "dashboard",
  "entries": [
    {
      "label": "Workspace settings",
      "url": "/dashboard?screen=workspace-settings",
      "screen": "workspace-settings",
      "group": "Settings",
      "description": "Workspace summary, settings, users, integrations.",
      "design": "features/workspace-admin/workspace-admin.design.md"
    },
    {
      "label": "Moderator · assigned",
      "url": "/dashboard?welcome=1&role=moderator-assigned",
      "screen": "dashboard",
      "group": "Dashboard — new-user states",
      "description": "Active grading dashboard — grading queue, continue-grading rail.",
      "status": "wip"
    }
  ]
}
</script>
```

**Rule: `status` is omitted by default and inherited from the target screen's `data-status`. Include it only when a variant genuinely differs from its screen.** Every override is a maintenance cost, so the generator must warn on any override that matches the inherited value (it's redundant — delete it).

`design` is optional; omit it when no design.md exists. The generator must verify that any path given actually resolves, and fail if it doesn't.

---

## Phase 0 — Audit and propose (do this first, do not skip)

Before touching markup, produce a proposed status for **every** screen and every index entry, and put it to Lara in a single table for confirmation. Do not guess silently and do not ask her twenty separate questions.

Build the proposal from evidence, and cite the evidence per row:

- `git log` on the section's line range (`git log -L <start>,<end>:<file>`) — when was this screen last meaningfully touched?
- `UI Change Logs/<Page>.md` — the dated entries name what changed and when
- whether a populated `design.md` exists in `features/` that points at this screen
- `-v2` / duplicate naming — a strong superseded signal, but confirm rather than assume; the older one is not automatically dead

Output as a markdown table: screen · prototype · last touched · evidence · proposed status · confidence. Flag low-confidence rows explicitly. Wait for confirmation before Phase 1.

Scope: all four prototypes — `dashboard`, `test-journey`, `user-onboarding`, `page-skeleton` — plus every entry currently listed in `vercel-setup/index.html`.

---

## Phase 1 — Markup

Add `data-status` (and `data-superseded-by` where applicable) to every `<section class="screen">` across all four prototypes, using the confirmed Phase 0 statuses.

Add the `#prototype-manifest` JSON block to each prototype file, seeded from the current entries in `vercel-setup/index.html` so nothing is lost. Preserve the existing group names and descriptions verbatim — they're good, and rewriting them is not in scope.

**Do not change any visual content, layout, copy, or behaviour of the prototypes in this phase.** Attributes and the manifest block only.

---

## Phase 2 — In-prototype rendering

A developer opens the prototype in a browser, not an editor. Status must be visible there.

Write this once into `prototypes/page-skeleton/index.html` as the canonical pattern, then include it in the other three.

**Status ribbon.** Fixed to the top-right of the viewport, showing the active screen's status. Reads `data-status` off the active `.screen` section and updates on screen change.

- `ready` → `--success-500` on `--success-100`
- `wip` → `--warn-600` on `--warn-100`
- `explore` → `--info-500` on `--info-100`
- `superseded` → `--fg-3` on `--surface-100`

Never colour alone — always the uppercase text label too. For `superseded`, the ribbon also renders "Replaced by <name>" as a link that navigates to the replacement screen.

**Devbar colouring.** Each `.dev-btn` with a `data-nav` gets a small status dot matching its target screen, and `superseded` targets render with `text-decoration: line-through` and reduced opacity. This is the specific fix for the SA · Summary / SA · Summary v2 ambiguity.

**Suppression.** The ribbon and dots must be hideable for clean screenshots — support `?chrome=0` in the URL and a "Hide status" toggle at the end of the devbar. Persist the choice in `sessionStorage` only; never `localStorage`.

Constraints: tokens from `design-system/colors_and_type.css`, never raw hex. 4-point spacing scale. Lucide icons if any are used, never emoji. No gradients, glassmorphism, coloured or inner shadows. The ribbon must not shift layout or overlap the devbar.

---

## Phase 3 — Generator

Create `scripts/build-status.mjs` (plain Node, no dependencies):

1. Glob `prototypes/**/index.html` and `prototypes/**/*.html`
2. Parse out every `<section class="screen">` with its `data-screen-name`, `data-status`, `data-superseded-by` — regex is acceptable here, do not add a DOM library
3. Parse each `#prototype-manifest` block
4. Resolve entry statuses via the inheritance rule
5. For each screen, get last-commit date and short SHA via `git log -1 --format=%aI|%h -- <file>`; where practical use `git log -L` for the section's line range so the date reflects the screen, not the file
6. Cross-reference `features/**/*.design.md` — record which screens have one, and read its `**Status:**` line
7. Write `status.json` to the repo root

Schema:

```json
{
  "generated": "2026-08-10T00:00:00Z",
  "counts": { "ready": 0, "wip": 0, "explore": 0, "superseded": 0 },
  "entries": [
    {
      "label": "Workspace settings",
      "url": "/dashboard?screen=workspace-settings",
      "prototype": "dashboard",
      "screen": "workspace-settings",
      "group": "Settings",
      "description": "…",
      "status": "ready",
      "statusSource": "screen",
      "supersededBy": null,
      "design": "features/workspace-admin/workspace-admin.design.md",
      "designStatus": "Ready for shaping",
      "lastTouched": "2026-07-14T09:12:00Z",
      "sha": "a1b2c3d"
    }
  ]
}
```

`statusSource` is `"screen"` or `"override"` so the index can show where a status came from.

**Wiring.** `vercel.json` currently has `"buildCommand": ""`. Set it to `node scripts/build-status.mjs` so every deploy regenerates. Also commit `status.json` so local preview (`python3 -m http.server 4711`) and `file://` opening work without a build step. Add an npm script `"status": "node scripts/build-status.mjs"`.

---

## Phase 4 — The index page

Rewrite `vercel-setup/index.html` to render from `status.json` instead of a hand-maintained list. Keep the existing visual language — it's good. Add capability, not decoration.

**Keep:** the shell width and padding, brand header, group labels, card rows with title/description/arrow, the footer link to the design system.

**Add:**

- **Summary line** under the lede: live counts — `7 READY · 12 WIP · 3 EXPLORING · 2 SUPERSEDED`. Each count is a filter shortcut.
- **Sticky filter bar.** Status chips (All · Ready · WIP · Exploring · Superseded) as multi-select toggles with counts. Sticks below the header on scroll.
- **Search field.** Live filter across label, description, screen name and group. `/` focuses it; `Esc` clears it and blurs.
- **Group-by toggle.** By area (the existing groups) or by status. Default: by area.
- **Status pill on every row**, same colour mapping and uppercase labels as the ribbon. Include the screen name in `--font-mono` at `--fs-2xs` — developers need it to find the section.
- **Design doc link** on rows that have one, showing the design.md's own status. Rows without one show a muted "No design doc" — this is useful signal, not an error.
- **Last touched**, relative ("14 days ago"), with the ISO date on `title`.
- **Superseded treatment:** muted row, struck-through title, and a "Replaced by →" link that jumps to the replacement's row and highlights it.
- **URL-synced filter state** — `/?status=ready` must be a shareable, bookmarkable link. This is the one URL that gets pasted into Slack when someone asks what's ready, so it has to work standalone on a cold load.
- **Legend**, collapsed by default, giving the one-line meaning of each status. Devs should never have to ask what EXPLORING means.
- **Empty state** when filters match nothing: explain what's filtered and offer a reset. Never render a blank list.

**Behaviour:** all filtering client-side against the loaded `status.json`, no framework, vanilla JS in the single file, consistent with how the rest of the repo is written. Fetch `status.json` with a relative path that works both under the Vercel rewrite (`/`) and when opened directly.

**Failure handling:** if `status.json` is missing or fails to parse, render a clear inline error telling the reader to run `npm run status` — do not silently fall back to an empty list.

**Accessibility:** filter chips are real buttons with `aria-pressed`. The result list is an `aria-live="polite"` region announcing the count on filter change. Status is never conveyed by colour alone. Full keyboard operation, visible focus rings using `--border-focus`.

---

## Phase 5 — Rules and enforcement

**`CLAUDE.md`** — add a "Design readiness" section, modelled on the existing component-library rule:

> Every `<section class="screen">` carries `data-status`: `ready` · `wip` · `explore` · `superseded`. Absent means not ready.
> Only `ready` screens may be handed to `/1-shape` or built. `wip` and `explore` are not buildable. `superseded` must never be built — follow `data-superseded-by` to the replacement.
> After changing a screen's maturity, update `data-status` in the same edit as the UI Change Log entry.
> Run `npm run status` after any status change.

While in there, fix two stale things: CLAUDE.md states the repo is "not a git repository" but `.git` exists; and §12 of the design template no longer prescribes sub-issues by layer (see `design-handoff-proposal.md`), so the line describing that hierarchy needs updating.

**Validation** — add `scripts/check-status.mjs`, exiting non-zero on:

- a screen with `data-status="superseded"` and no `data-superseded-by`, or pointing at a screen that doesn't exist
- a manifest entry whose `screen` doesn't resolve
- a manifest `design` path that doesn't exist on disk
- a redundant status override (matches the inherited value)
- `status.json` being stale relative to the prototype files

Wire it as `npm run check:status`. Do not add a git hook without asking — propose it and let Lara decide.

**`/1-shape` amendment** — the design-loading clause going to Dylan gains: *refuse to shape a screen whose `data-status` is not `ready`; report the current status and stop.* Output the final wording as a snippet at the end of the run for Lara to forward; don't attempt to edit the skill file from this repo.

---

## Acceptance criteria

1. Every screen across all four prototypes has a confirmed `data-status`.
2. Opening any prototype shows the active screen's status without touching source, and `?chrome=0` hides it cleanly.
3. The devbar visually distinguishes SA · Summary from SA · Summary v2 without the reader knowing anything in advance.
4. `npm run status` regenerates `status.json`; `npm run check:status` passes.
5. `/?status=ready` cold-loads to a correct filtered list.
6. The index is generated — no screen title, URL or description is hand-maintained in `vercel-setup/index.html`.
7. Adding a new screen requires exactly two things: `data-status` on the section and an entry in that prototype's manifest.
8. No prototype's visual output changed, aside from the ribbon and devbar dots.

---

## Out of scope — do not do these

- **Don't add fields to the status model.** No owner, no last-reviewed-by, no percent-complete, no `needs-review`. Every extra field goes stale and takes the system's credibility with it. Four statuses, one attribute.
- **Don't add region-level status inside a screen.** Screen-level only for now; we'll add it if we actually hit the need.
- **Don't delete the superseded screens yet.** The hygiene rule is that a superseded screen is removed once its replacement ships and the decision is recorded in the relevant design.md decision log — that's a separate pass with Lara.
- **Don't restyle the prototypes**, refactor the 680KB file, or split it up. Tempting, unrelated, and it would bury this change in noise.
- **Don't write design.md files** for features that lack them. Surfacing the gap in the index is the deliverable here.
- **Don't auto-commit or push.** Leave changes staged and summarise them.

---

## Suggested order

Phase 0 is a hard gate — get the statuses confirmed first. After that, Phases 3 and 4 (generator and index) can run ahead of Phase 2 (in-prototype ribbon) if that's easier, since the index only depends on the Phase 1 attributes. Phase 5 last.

Work in `page-skeleton` first for anything visual — it's small, it's the canonical pattern, and mistakes there are cheap.
