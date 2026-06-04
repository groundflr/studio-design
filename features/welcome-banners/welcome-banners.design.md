# Welcome banners

**Status:** Draft
**Last updated:** 2026-06-04
**Author:** handover-documenter
**Reviewed by:** —
**Linear project:** Users & Permissions
**Linear issue:** — *(link added once the ticketing agent runs — see §12)*
**Linear sub-issues:** — *(links added once created — see §12)*

---

## Where this lives in the repo

- **Prototype:** `prototypes/dashboard/index.html` → `data-screen-name="dashboard"` (lines ~4134–4159 for HTML; CSS lines ~3648–3847; JS IIFE lines ~9537–9750)
- **PRD:** `product-requirement-documents/Users and Permissions V2.md` §6.2 (Onboarding UX / welcome screen)
- **UI change log:** `ui-change-logs/Dashboard.md` entries 2026-05-18 (P5 Step 2 initial build), 2026-06-04 (five entries: restyling, refinements, admin state + layout, fluid type + animation, all-primary chip decision)
- **Design system refs:** `design-system/traverse-design-system.md` §7.12 (RoleChip), §8.13 (PlaceholderPanel); `design-system/colors_and_type.css`
- **Related features:** `features/user-onboarding/user-onboarding.design.md` §6 (URL contract — emits `?welcome=1&role=<variant>` to this feature); `features/dashboard/dashboard.design.md` (host shell the banner renders inside)

---

## How to navigate through prototypes

**The point of the prototype is to click through it as a real user would** — open the dashboard with `?welcome=1&role=<variant>` in the URL (the real entry path from user-onboarding), experience the banner, then dismiss it. The sticky `.devbar` at the bottom of `prototypes/dashboard/index.html` is a **shortcut for reviewers**: use it to jump straight to any welcome state or reset the dismiss flag without having to walk the full onboarding journey each time.

Welcome controls are grouped under the **"Welcome state"** label in the devbar. They are standalone buttons — each sets the active role state immediately and clears the sessionStorage dismiss flag for that role so the hero always shows on switch.

### Devbar controls — Welcome state group

| Control | Type | Effect | State / variant surfaced | Screen |
|---|---|---|---|---|
| Off | Button | Removes `?welcome` and `?role` params; hides hero and placeholder; restores full dashboard | No banner — normal dashboard | `data-screen-name="dashboard"` |
| Workspace admin | Button | Sets `?welcome=1&role=admin`; renders hero with "Workspace admin" chip and admin copy | Hero visible above dashboard cards; cards remain visible (non-takeover) | `data-screen-name="dashboard"` |
| Member | Button | Sets `?welcome=1&role=standard`; renders hero with "Member" chip and member copy | Hero visible above dashboard cards; cards remain visible (non-takeover) | `data-screen-name="dashboard"` |
| Moderator · unassigned | Button | Sets `?welcome=1&role=moderator`; renders hero with "Moderator" chip and unassigned copy; hides dashboard cards | Hero with takeover: `.ws-header`, `.action-card`, `.dashboard-grid` hidden | `data-screen-name="dashboard"` |
| Moderator · assigned | Button | Sets `?welcome=1&role=moderator-assigned`; renders hero with "Moderator" chip and assigned copy | Hero visible above dashboard cards; cards remain visible (non-takeover) | `data-screen-name="dashboard"` |
| Viewer · unassigned | Button | Sets `?welcome=1&role=viewer`; renders hero with "Viewer" chip and unassigned copy; hides dashboard cards | Hero with takeover: dashboard cards hidden | `data-screen-name="dashboard"` |
| Viewer · assigned | Button | Sets `?welcome=1&role=viewer-assigned`; renders hero with "Viewer" chip and assigned copy | Hero visible above dashboard cards; cards remain visible (non-takeover) | `data-screen-name="dashboard"` |
| Empty | Button | Sets `?welcome=1&role=empty`; renders hero with "Member" chip and empty-workspace copy | Hero visible above dashboard cards; cards remain visible (non-takeover) | `data-screen-name="dashboard"` |
| Reset dismiss | Button | Calls `sessionStorage.removeItem(storageKey(currentRole))`; re-renders current role state | Restores dismissed hero for the current role without changing the active role | `data-screen-name="dashboard"` |

### Walk-throughs

- **Golden path — Member joining:** Click **Member** in the Welcome state group. Expect the hero to appear above the workspace cards with the greeting, a `is-primary` chip labelled "Member", and the member copy. Click the X close button — hero plays the dip-then-up exit animation (500ms, forwards), then vanishes. Dashboard cards remain visible. Click **Member** again (or **Reset dismiss** first) to restore it.

- **Moderator (unassigned) takeover — dismiss to placeholder:** Click **Moderator · unassigned**. Expect the dashboard cards (workspace header, action cards, grid) to disappear entirely; only the hero remains. Dismiss with the X button. The hero exits; a centred `PlaceholderPanel`-style card replaces it (icon-clipboard-list, "No submission groups assigned yet", body copy, "Contact [admin name]" CTA). This is the post-dismiss placeholder. Click **Reset dismiss** → **Moderator · unassigned** to restore the full hero view.

- **Moderator (assigned):** Click **Moderator · assigned**. Hero appears above the cards with the assigned copy ("…view and grade the submissions assigned to you"). Cards stay visible (non-takeover). Dismissing behaves like Member — no placeholder.

- **Viewer (unassigned) takeover — dismiss to placeholder:** Same as the Moderator unassigned walk-through but use the **Viewer · unassigned** button. Post-dismiss placeholder shows icon-eye, "No content assigned yet", different body copy.

- **Viewer (assigned):** Click **Viewer · assigned**. Hero appears above the cards with the assigned copy ("…view the content and submissions assigned to you"). Cards stay visible (non-takeover). Dismissing behaves like Member — no placeholder.

- **Workspace admin state:** Click **Workspace admin**. Hero appears above the cards. Cards stay visible (non-takeover). Role chip reads "Workspace admin". Dismiss to confirm cards remain after dismissal.

- **Empty workspace:** Click **Empty**. Hero appears with "Member" chip and empty-workspace copy. Cards stay visible. No takeover.

- **Reduced motion:** Set your OS to reduce motion, then click any role button. The dismiss should skip the dip animation and hide the hero immediately.

---

## 1. Intent

The welcome banner is the role-appropriate first-run message shown on the dashboard when a user arrives after completing onboarding. It greets the user by name and workspace, names their role via a chip, and sets expectations for what they can do in the workspace. For restricted roles (Moderator, Viewer) it also functions as a full-page takeover while they wait for admin assignment.

**User goal:** Understand immediately who they are in this workspace and what they should do next.
**Product goal:** Reduce first-day confusion and support requests by surfacing role context and admin contact at the moment of activation. (PRD §6.2)

---

## 2. Scope

### In scope

- Seven welcome states driven by the `role` query param: `admin`, `standard` (Member), `moderator` (unassigned), `moderator-assigned`, `viewer` (unassigned), `viewer-assigned`, `empty` (PRD §6.2; assigned/unassigned split added 2026-06-04)
- Welcome hero component: greeting, role chip, copy line, X dismiss button
- Takeover behaviour for Moderator and Viewer: hides dashboard cards while hero is visible
- Dismiss animation (dip-then-up, 500ms) with `prefers-reduced-motion` fallback
- `sessionStorage` dismiss persistence per role key
- Post-dismiss placeholder panel for Moderator and Viewer (work in progress — see §10 Q1)
- URL contract (`?welcome=1&role=<variant>`) as the trigger mechanism; onboarding emits this URL

### Out of scope

- The onboarding flow that emits the `?welcome=1&role=<variant>` URL — that belongs to `features/user-onboarding/user-onboarding.design.md` §6
- Role chip colour variants in user tables and the user-profile screen — those use per-role colours (`is-admin`, `is-moderator`, `is-viewer`) and are documented in `design-system/traverse-design-system.md` §7.12
- Copy changes tied to future role-view definitions — current copy is provisional (see §10 Q2)
- Post-dismiss state for Workspace admin and Member: those roles simply see the normal dashboard after dismissal (no placeholder)

---

## 3. Surface and placement

| Field | Value |
|---|---|
| Route / screen anchor | `prototypes/dashboard/index.html` → `data-screen-name="dashboard"`, activated by `?welcome=1&role=<variant>` |
| Surface type | Inline — rendered at the top of the dashboard content area, above workspace cards |
| Triggered by | `?welcome=1` query param present on page load; `role` param selects the variant |
| Position in layout | First child of `.dashboard-shell` (`#dashboard-shell`), above `.ws-header`, `.action-card`, and `.dashboard-grid` |

---

## 4. Anatomy

```
Dashboard content area (.dashboard-shell)
├── Welcome hero (.welcome-hero) [id="welcome-hero"] — aria-label="Welcome"
│   ├── Close button (.welcome-hero__close) [id="welcome-close"] — absolute top-right 12px; icon-x; 28×28px; border-radius 8px
│   ├── Icon block (.welcome-hero__icon-block) — 52×52px; primary-50 bg; primary-600 icon; icon-party-popper; aria-hidden
│   └── Body (.welcome-hero__body)
│       ├── Greeting h1 (.welcome-hero__greeting) — flex/wrap; gap 10px
│       │   ├── Text span [id="welcome-greeting"] — "Welcome to [Workspace name], [First name]"
│       │   └── Role chip (.role-chip.is-primary) [id="welcome-role-chip"] — always is-primary; label = role display name
│       └── Copy paragraph (.welcome-hero__copy) [id="welcome-copy"] — role-specific orientation text; full-width
│
└── Post-dismiss placeholder (.welcome-placeholder) [id="welcome-placeholder"] — aria-live="polite"
    ├── Icon block (.welcome-placeholder__icon) [id="placeholder-icon"] — 52×52px; surface-100 bg; surface-500 icon; aria-hidden
    ├── Heading h2 (.welcome-placeholder__heading) [id="placeholder-heading"] — role-specific heading
    ├── Body paragraph (.welcome-placeholder__body) [id="placeholder-body"] — role-specific copy; max-width 420px
    └── CTA link (.welcome-hero__cta) [id="placeholder-cta"] — mailto: link; "Contact [admin name]"
```

**Visibility rules (CSS + JS):**
- `.welcome-hero` — base `display: flex`; `.is-hidden` forces `display: none !important`; `.is-leaving` triggers dismiss animation
- `.welcome-placeholder` — base `display: none`; `.is-visible` sets `display: flex`
- `.dashboard-shell.is-takeover` — hides `.ws-header`, `.action-card`, `.dashboard-grid` (Moderator and Viewer only)

**Design-system components used:**
- RoleChip (`.role-chip.is-primary`) — see `design-system/traverse-design-system.md` §7.12; welcome banner always uses `is-primary`, never per-role variants
- PlaceholderPanel — post-dismiss panel follows the DS §8.13 pattern (centred icon + title + body + CTA); implemented as `.welcome-placeholder` with its own CSS rather than a shared class; whether to unify is an open question (see §10 Q1)

---

## 5. States

| State | Visual / behaviour | Notes |
|---|---|---|
| Hidden (off) | `.welcome-hero.is-hidden`, `.welcome-placeholder` hidden, `.dashboard-shell` default | `?welcome` param absent, or `role=off` devbar state |
| Admin welcome | Hero visible; chip "Workspace admin" (`is-primary`); admin copy; dashboard cards visible | Non-takeover |
| Member welcome | Hero visible; chip "Member" (`is-primary`); member copy; dashboard cards visible | Non-takeover |
| Moderator welcome — unassigned (takeover) | Hero visible; chip "Moderator" (`is-primary`); unassigned moderator copy; `.is-takeover` on shell — dashboard cards hidden | User is waiting for admin assignment |
| Moderator welcome — assigned | Hero visible; chip "Moderator" (`is-primary`); assigned moderator copy; dashboard cards visible | Non-takeover — user already has submission groups |
| Viewer welcome — unassigned (takeover) | Hero visible; chip "Viewer" (`is-primary`); unassigned viewer copy; `.is-takeover` on shell — dashboard cards hidden | User is waiting for admin assignment |
| Viewer welcome — assigned | Hero visible; chip "Viewer" (`is-primary`); assigned viewer copy; dashboard cards visible | Non-takeover — user already has assigned content |
| Empty workspace welcome | Hero visible; chip "Member" (`is-primary`); empty-workspace copy; dashboard cards visible | Non-takeover |
| Dismissing | `.is-leaving` class applied; `welcome-hero-out` animation runs (500ms, dip → bounce → exit up + fade); `pointer-events: none` | Plays once; guarded against double-click |
| Dismissed (Admin / Member / Empty / Moderator-assigned / Viewer-assigned) | Hero hidden; `.dashboard-shell` default; cards visible; sessionStorage key set | `sessionStorage.getItem('traverse.welcomeDismissed.<role>') === '1'` |
| Dismissed (Moderator / Viewer — unassigned only) | Hero hidden; `.welcome-placeholder.is-visible`; role-specific icon, heading, body, admin mailto CTA | Post-dismiss placeholder — work in progress (§10 Q1) |
| Reduced motion | Dismiss fires instantly — no animation; JS `matchMedia('prefers-reduced-motion')` guard; CSS `animation: none` fallback | Both guards required |

---

## 6. Behaviour

### Copy — per role (provisional; subject to change when role views are defined)

| Role param | Chip label | Copy |
|---|---|---|
| `admin` | Workspace admin | "You have Workspace admin access — you can manage users, content, and settings across this workspace." |
| `standard` | Member | "You have Member access — you can author, edit, and moderate any content in this workspace." |
| `moderator` | Moderator | "Your workspace admin will assign you to submission groups so you can start grading." |
| `moderator-assigned` | Moderator | "You have Moderator access — you can view and grade the submissions assigned to you." |
| `viewer` | Viewer | "Your workspace admin will assign you to content so you can start reviewing." |
| `viewer-assigned` | Viewer | "You have Viewer access — you can view the content and submissions assigned to you." |
| `empty` | Member | "It looks like there is no content here yet." |

Moderator and Viewer each have two variants: **unassigned** (`moderator`, `viewer`) — the user is waiting for the workspace admin to assign them submission groups / content — and **assigned** (`moderator-assigned`, `viewer-assigned`) — assignments already exist. The assigned copy is deliberately **non-specific about what was assigned**; it only confirms the user can go and view/grade their submissions or content. The earlier "[Admin name] manages access for this workspace." sentence was removed from both unassigned variants (2026-06-04).

In the prototype the variant is selected by the `role` URL param. **In production, assigned vs unassigned must be derived from real assignment data at render time** (does this moderator have ≥1 submission group? does this viewer have ≥1 assigned asset?) — not from the onboarding handoff URL, which cannot know assignment state.

All copy is provisional pending definition of role views. (brain-dump §1; `HERO_COPY` in prototype JS)

`[Admin name]` is populated at runtime from the workspace admin's name. `[Workspace name]` and `[First name]` in the greeting are populated from the workspace record and the user's session. **Production must not hard-code these values.** The prototype uses `WORKSPACE_NAME = 'David Guetta'` and `FIRST_NAME = 'Jane'` as demo stand-ins only — these must never ship. (brain-dump §3)

### Interactions

- **Page loads with `?welcome=1&role=<variant>`** → `init()` reads URL params, calls `renderWelcome(role)`. If `sessionStorage.getItem(storageKey(role)) === '1'` and the role is a takeover role, hero is skipped and placeholder shown immediately. Otherwise hero shown.
- **User clicks X close button** → `is-leaving` added; `welcome-hero-out` animation plays (500ms); on `animationend` (checked by name), `dismiss(role)` sets `sessionStorage`; `renderWelcome(role)` re-evaluates. If `prefers-reduced-motion`, `dismiss()` fires synchronously, no animation.
- **User dismisses Moderator or Viewer hero** → hero exits; `showPlaceholder(role)` populates placeholder panel content and shows `.welcome-placeholder.is-visible`.
- **User dismisses Admin, Member, or Empty hero** → hero exits; dashboard cards remain/become visible; no placeholder.
- **User reloads page with `?welcome=1&role=<variant>`** → sessionStorage persists within the tab session; dismissed hero stays dismissed unless sessionStorage is cleared.

### Flow

- **Enters from:** `?welcome=1&role=<variant>` URL, emitted by `features/user-onboarding` on profile-form submit or existing-user welcome handoff (user-onboarding.design.md §6)
- **Exits to:** Normal dashboard (hero dismissed, cards visible); or post-dismiss placeholder (Moderator / Viewer takeover roles)

### Session persistence

Dismiss is stored in `sessionStorage` under the key `traverse.welcomeDismissed.<role>` (e.g. `traverse.welcomeDismissed.standard`). `sessionStorage` is tab-scoped and cleared when the tab or browser is closed. Production implementation should consider whether `localStorage` or a server-side flag better matches the product requirement — the prototype uses `sessionStorage` as a prototyping-appropriate substitute.

---

## 7. Design tokens

### Colours

| Role | Token |
|---|---|
| Banner background | `var(--surface-0)` |
| Banner border | `var(--surface-200)` |
| Left accent rail | `var(--primary-400)` |
| Icon block background | `var(--primary-50)` |
| Icon block icon colour | `var(--primary-600)` |
| Greeting text | `var(--surface-900)` |
| Copy text | `var(--surface-700)` |
| Close button default colour | `var(--surface-500)` |
| Close button hover background | `var(--surface-100)` |
| Close button hover colour | `var(--surface-800)` |
| Role chip (`is-primary`) background | `var(--primary-50)` |
| Role chip (`is-primary`) text | `var(--primary-600)` |
| Placeholder icon block background | `var(--surface-100)` |
| Placeholder icon block colour | `var(--surface-500)` |
| Placeholder heading text | `var(--surface-900)` |
| Placeholder body text | `var(--surface-600)` |
| Placeholder CTA background | `var(--primary-600)` |
| Placeholder CTA background (hover) | `var(--primary-700)` |
| Placeholder CTA text | `var(--surface-0)` |
| Focus ring | `var(--primary-400)` (2px outline, 2px offset) |

### Typography

| Element | Family | Size | Weight | Notes |
|---|---|---|---|---|
| Greeting h1 | Inter (`var(--font-sans)`) | `clamp(var(--fs-lg), 0.9rem + 0.55vw, var(--fs-xl))` — fluid 18→20px | 600 | `letter-spacing: -0.01em`; flex/wrap row with chip |
| Copy paragraph | Inter | 14px | 400 | `line-height: 1.6`; `overflow-wrap: break-word` |
| Role chip | Inter | 11px | 600 | `letter-spacing: 0.04em`; see DS §7.12 for full spec |
| Placeholder heading h2 | Inter | 18px | 600 | `line-height: 1.3` |
| Placeholder body | Inter | 14px | 400 | `line-height: 1.6`; `max-width: 420px` |
| Placeholder CTA | Inter | 14px | 600 | — |

### Spacing

| Location | Value |
|---|---|
| Banner padding (all sides) | 24px |
| Gap between icon block and body | 16px |
| Gap between greeting and copy | 4px |
| Banner margin-bottom | 32px |
| Icon block size (default) | 52×52px |
| Icon block size (≤640px) | 40×40px |
| Close button size | 28×28px |
| Close button inset from corner | 12px top, 12px right |
| Placeholder padding | 64px 40px |
| Placeholder icon block size | 52×52px |
| Placeholder icon-to-heading gap | 20px (margin-bottom on icon block) |
| Placeholder heading-to-body gap | 10px (margin-bottom on heading) |
| Placeholder body-to-CTA gap | 24px (margin-bottom on body) |

### Motion

| Interaction | Duration | Easing / notes |
|---|---|---|
| Dismiss exit (dip phase) | 0→32% of 500ms | `cubic-bezier(0.33, 0, 0.3, 1)` — decelerates into the dip |
| Dismiss exit (micro-bounce) | 32→46% | `cubic-bezier(0.5, 0, 0.7, 0.4)` — slight settle |
| Dismiss exit (exit phase) | 46→100% | `cubic-bezier(0.55, 0, 0.85, 0.55)` — accelerates up and out; translateY 0 → −88px; opacity 1 → 0 |
| Dismiss exit total | 500ms (`var(--dur-panel)`) | `animation-fill-mode: forwards`; `pointer-events: none` while playing |
| Close button hover | 120ms | background and colour shift |
| Reduced motion | Instant | CSS `animation: none` + JS `matchMedia` guard — both required |

### Component references

- RoleChip — see `design-system/traverse-design-system.md` §7.12. Banner always uses `.role-chip.is-primary`; do not apply per-role variants here.
- PlaceholderPanel — see `design-system/traverse-design-system.md` §8.13. Post-dismiss placeholder follows this pattern; implementation unification is open (§10 Q1).

---

## 8. Edge cases

| # | Edge case | Expected behaviour |
|---|---|---|
| 1 | `?welcome=1` present but no `role` param | Defaults to `role=standard` (Member). Prototype default: `params.get('role') \|\| 'standard'`. Production should apply the same fallback. |
| 2 | User reloads the page after dismissing | Banner stays dismissed within the session — `sessionStorage` key is set. If production uses a server-side flag instead, the flag must persist at minimum for the session. |
| 3 | Workspace name is very long (>40 chars) | Greeting span has `overflow-wrap: break-word` and `min-width: 0` — text wraps inside the flex container. Role chip drops to a new line via `flex-wrap`. Verify at 40–60 char workspace names. |
| 4 | User first name is very long | Same `overflow-wrap: break-word` protection. Role chip falls to next line; greeting remains readable. |
| 5 | `ADMIN_NAME` / admin email not yet set for new workspace | Placeholder CTA ("Contact [admin name]") would render empty or broken. Production must handle missing admin gracefully — fall back to a generic "Contact your workspace admin" label with no mailto. |
| 6 | Takeover role (Moderator / Viewer) — user dismisses then navigates away and returns within the session | `sessionStorage` persists within the tab session. On return with `?welcome=1&role=moderator`, the post-dismiss placeholder is shown immediately (hero skipped). |
| 7 | User opens dashboard in a second tab (same session) | `sessionStorage` is per-tab; dismissed state does not carry to the new tab. Banner re-appears if the second tab loads with `?welcome=1`. Production decision: use a server-side seen flag to avoid re-surfacing the banner across tabs. (See §10 Q3.) |
| 8 | Narrow viewport (≤640px) | Icon block scales to 40×40px, font-size 20px icon. Greeting uses fluid `clamp` type scaling down to 18px. All text wraps with `overflow-wrap`. CTA in placeholder remains inline-flex with `white-space: nowrap` — verify at 320px that it does not overflow its container. |
| 9 | `prefers-reduced-motion` active | Close button fires `dismiss()` synchronously — no animation frame. CSS guard `animation: none` also in place. Both must be present. |
| 10 | Banner renders without `?welcome` param (normal dashboard visit) | `renderWelcome('off')` — hero hidden, placeholder hidden, `.is-takeover` removed. Dashboard renders normally. |

---

## 9. Decision rationale

| Decision | Choice | Why | Alternatives rejected |
|---|---|---|---|
| All welcome banner chips use `is-primary` regardless of role | Single `.role-chip.is-primary` (indigo) for every banner state | The banner states identity — "you are X" — not comparison between roles. Using per-role colours in the banner would introduce visual noise without adding information, and would incorrectly imply that the chip style carries the same scanning function as it does in tables. Per-role colours (`is-admin`, `is-moderator`, etc.) are reserved for surfaces where multiple roles appear side-by-side. (brain-dump §5; ui-change-logs/Dashboard.md 2026-06-04 entry 5; DS §7.12) | Per-role chip colours on the banner (shipped briefly then reversed — see change log entries); plain text role label (no chip) |
| Role chip placed inline in the greeting h1, not on a separate line | Greeting h1 is flex/wrap; chip is a sibling of the text span | Eliminates redundancy — the "Joined as" prefix line that preceded the chip added a step without adding meaning. Greeting row states name + role as a single connected thought. (ui-change-logs/Dashboard.md 2026-06-04 entry 3 — "Joined as" role line removed) | Separate `.welcome-hero__role-line` paragraph below the greeting (shipped, then removed) |
| Dismiss is sessionStorage, not localStorage | `sessionStorage.setItem('traverse.welcomeDismissed.<role>', '1')` | Prototype-appropriate scope: the banner is a first-run experience; persisting dismissal across all future sessions in a prototype would obscure the banner from reviewers. Production should replace this with a server-side seen flag or localStorage depending on the requirement (see §10 Q3). | localStorage (would persist across browser sessions, masking the banner for reviewers); no persistence (banner would re-appear on every reload) |

---

## 10. Open questions

| # | Question | Owner | Status |
|---|---|---|---|
| 1 | Post-dismiss placeholder panel (`#welcome-placeholder`) — design is in progress. Current implementation shows role-specific icon, heading, body, and a "Contact [admin name]" mailto CTA. What is the final intended content and behaviour? Should it unify with the `PlaceholderPanel` DS §8.13 component class, or remain a distinct implementation? | Lara | Open — user confirmed still being worked on (brain-dump §2) |
| 2 | Welcome banner copy is currently provisional. When will role views be defined, and who owns the copy update at that point? | Lara / Dave | Open — copy should be reviewed once role-view definitions land (brain-dump §1) |
| 3 | Production dismiss persistence: should the "seen" flag live in `sessionStorage` (tab-scoped, current prototype), `localStorage` (cross-session), or a server-side field on the user record? sessionStorage means the banner re-appears in new tabs and after browser close. | Dev / Lara | Open |
| 4 | Production data sources: `WORKSPACE_NAME`, `FIRST_NAME`, and `ADMIN_NAME`/`ADMIN_EMAIL` are currently hardcoded demo values in the prototype. These must come from the workspace record, the authenticated user's session, and the workspace's admin record respectively. Confirm the API / data shape for all three. | Dev | Open — confirmed production must use real data (brain-dump §3) |
| 5 | Empty workspace state — chip shows "Member" because `ROLE_LABELS.empty = 'Member'`. Is "Member" the correct label, or should this be no chip / a different label? | Lara / Dave | Open |

---

## 11. Accessibility notes

- **Keyboard:** Close button (`#welcome-close`) is a `<button>` — receives focus in natural tab order. Focus ring: `outline: 2px solid var(--primary-400); outline-offset: 2px`. Placeholder CTA is an `<a>` — same focus ring applied. Tab order: close button → body content → placeholder CTA (when visible).
- **Screen reader:** Banner section carries `aria-label="Welcome"`. Placeholder `div` carries `aria-live="polite"` — screen readers announce content when the placeholder becomes visible after dismiss. Close button has `aria-label="Close welcome banner"`. Icon blocks carry `aria-hidden="true"` on both hero and placeholder.
- **Contrast:** Role chip `is-primary` — `var(--primary-600)` on `var(--primary-50)`. Verify ratio meets WCAG AA (4.5:1) for 11px bold text. Greeting text `surface-900` on `surface-0` — passes. Copy `surface-700` on `surface-0` — verify. Placeholder body `surface-600` on `surface-0` — verify.
- **Motion:** Two guards required — CSS `@media (prefers-reduced-motion: reduce) { .welcome-hero.is-leaving { animation: none; } }` and JS `window.matchMedia('(prefers-reduced-motion: reduce)').matches` check in the close-button handler (fires `dismiss()` directly, skipping the animation class).

---

## 12. Dev notes & Linear ticket breakdown

### House rules (assumed; flag exceptions only)

Lucide icons (no emoji). Sentence case. Second person. Verbs lead CTAs. Uppercase single-word status labels. No gradients, glassmorphism, rounded-left accent cards, coloured/inner shadows. Demo or scenario controls live exclusively in the bottom `.devbar`, never on the prototype surface.

### Files likely affected

- `apps/web/src/views/DashboardView.vue` (or equivalent) — render welcome hero on mount if `?welcome=1&role=<variant>`
- `apps/web/src/components/WelcomeBanner.vue` (new component) — encapsulates hero markup, role chip, dismiss logic
- `apps/web/src/components/WelcomePlaceholder.vue` (new component, pending §10 Q1 resolution) — post-dismiss state for Moderator / Viewer
- `apps/web/src/composables/useWelcomeDismiss.ts` (or equivalent) — persist and read dismiss state (storage strategy per §10 Q3)

### Dependencies

- User session context: `user.firstName` for greeting
- Workspace record: `workspace.name` for greeting; workspace admin name + email for placeholder CTA
- `features/user-onboarding` — emits the `?welcome=1&role=<variant>` URL that triggers this feature (user-onboarding.design.md §6)
- RoleChip component (DS §7.12) — the welcome banner's chip is a RoleChip; build from the DS spec, not from ad-hoc styles

### Known constraints

- **Left accent rail** — the banner has a 5px `var(--primary-400)` left rail rendered via `::before`. This is an intentional structural element of this component, distinct from the "rounded-left-border accent card" anti-pattern (which is decorative and applies to card components). Do not remove it.
- **Post-dismiss placeholder** — currently uses `.welcome-hero__cta` class for its CTA (reuse from the hero). If WelcomeBanner and WelcomePlaceholder are split into separate components, extract `.welcome-hero__cta` to a shared button style or replace with the DS Button component.
- **sessionStorage key format** — `traverse.welcomeDismissed.<role>`. All seven role keys: `traverse.welcomeDismissed.admin`, `.standard`, `.moderator`, `.moderator-assigned`, `.viewer`, `.viewer-assigned`, `.empty`. Production implementation should use the same namespace or migrate cleanly.

### Do not

- Do not apply per-role chip colours (`is-admin`, `is-moderator`, `is-viewer`) to the welcome banner chip. Always `is-primary`.
- Do not hard-code workspace name, user first name, or admin name/email. These must come from runtime data.
- Do not add CTAs to the welcome hero itself — the only interactive element on the hero is the X close button. (CTAs were removed 2026-06-04; see change log.)
- Do not show the post-dismiss placeholder for Admin, Member, or Empty roles — they see the normal dashboard after dismissal.

### Linear breakdown

Linear hierarchy for this work:
**Project** → **Issue** → **Sub-issues**

- **Project:** Users & Permissions
- **Issue:** Welcome banners
- **Sub-issues:** Suggested — for ticket agent to refine.

| # | Sub-issue title | Scope (one line) | Layer |
|---|---|---|---|
| 1 | Welcome banners — frontend | Render hero, takeover state, and dismiss animation from `?welcome=1&role=<variant>`; wire to session data | Frontend |
| 2 | Welcome banners — dismiss persistence | Decide and implement storage strategy (sessionStorage / localStorage / server flag) for "banner seen" state | Backend / Data |
| 3 | Welcome banners — data API | Confirm and wire workspace name, user first name, and admin contact from workspace + user records; derive Moderator/Viewer assigned vs unassigned variant from real assignment data at render time | Data / API |
| 4 | WelcomeBanner component | Encapsulate hero markup, role chip, dismiss animation as a reusable component per DS §7.12 + this spec | Component |
| 5 | WelcomePlaceholder component | Post-dismiss panel for Moderator / Viewer — pending §10 Q1 design resolution | Component |
| 6 | Welcome banners — copy review | Review all seven role copy strings once role views are defined (§10 Q2) | Copy |
| 7 | Welcome banners — QA | Verify all seven states, dismiss animation, reduced-motion, responsive behaviour, and aria-live at ≤640px | QA |

<!-- Sync log -->
- 2026-06-04 (sync run 1): Absorbed from ui-change-logs/Dashboard.md 2026-06-04 + in-session user edit — removed "[Admin name] manages access for this workspace." from both unassigned Moderator/Viewer copy rows; added `moderator-assigned` / `viewer-assigned` variants (non-takeover, non-specific assigned copy) across §2 Scope, §5 States, §6 Copy/Behaviour, devbar table, walk-throughs, sessionStorage keys, and §12 sub-issues 3/6/7. Production note added: assigned vs unassigned derived from real assignment data at render time, not the onboarding URL.
