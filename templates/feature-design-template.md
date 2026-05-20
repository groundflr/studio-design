# [Feature name]

<!--
  TEMPLATE — remove this comment block before saving.

  One design.md per feature, living at features/<feature-name>/design.md.
  This is the single source of truth for developers and the input for the
  Linear-ticket agent. Keep it tight. Tables over prose. Sentence case.

  Sections are fixed — agents and devs rely on the structure.
  If a section can't yet be filled in, write ⚠️ NEEDS INPUT and move on.
-->

**Status:** Draft  
**Last updated:** YYYY-MM-DD  
**Author:** —  
**Reviewed by:** —  
**Linear project:** [Overarching project, e.g. "Users and Permissions"]  
**Linear issue:** — *(link added once the ticketing agent runs — see §12)*  
**Linear sub-issues:** — *(links added once created — see §12)*

---

## Where this lives in the repo

> The developer's entry point. Every link here must resolve.

- **Prototype:** `prototypes/<file>/index.html` → `data-screen="<name>"` *(lines ~X–Y if known)*
- **PRD:** `product-requirement-documents/<file>.md` § *(section)*
- **UI change log:** `UI Change Logs/<Page>.md`
- **Design system refs:** `design-system/traverse-design-system.md` § *(sections used)*, `design-system/colors_and_type.css`
- **Related features:** `features/<other-feature>/design.md` *(if cross-cutting)*

---

## How to navigate through prototypes

> **Mandatory section.** Every design.md must document the prototype's devbar controls so developers can step through every variant the feature supports. Fill in one row per control; if a feature has no devbar controls, write "No devbar controls — prototype renders a single linear flow." and explain how to walk through it.

**The point of the prototype is to click through it as a real user would** — start at the entry point, follow the CTAs, and experience the flow end-to-end. The sticky `.devbar` at the bottom of the prototype is a **shortcut for reviewers**: use it to jump straight to a specific state, scenario, or variant without having to walk the whole journey each time. Controls are grouped into dropdowns at runtime; trailing standalone buttons (e.g. Reset state) remain as buttons outside the dropdowns.

### Devbar controls

| Control | Type | Effect | State / variant surfaced | Screen or `data-step` / `data-screen` it maps to |
|---|---|---|---|---|
| [Control label] | [Dropdown / Toggle / Button] | [What it does on click] | [Which state, role, scenario, or content variant it produces] | [`data-step="…"` or `data-screen="…"`] |

### Walk-throughs

> One bullet per scenario worth seeing end-to-end (golden path + key variants). Each bullet names the devbar controls to set, in order.

- **[Scenario name]:** Set [Control A] → [value], [Control B] → [value], then click [Button]. Expect to see [outcome].

---

## 1. Intent

> 1–3 sentences. What this is and what user problem it solves. No implementation language.

[What this is, from the user's perspective.]

**User goal:** [The one thing the user is trying to do.]  
**Product goal:** [What Traverse needs this to enable.]

---

## 2. Scope

### In scope
- [Concrete thing this covers]
- [State / interaction / content this handles]

### Out of scope
- [What this explicitly does NOT do]
- [Adjacent thing that might be assumed but isn't here]

---

## 3. Surface and placement

| Field | Value |
|---|---|
| Route / screen anchor | [e.g. `prototypes/dashboard/index.html` → `data-screen="workspace-settings"`] |
| Surface type | [Page / Card / Modal / Side panel / Inline / Overlay / Devbar control] |
| Triggered by | [What action or condition causes this to appear] |
| Position in layout | [Where on the page] |

**Traverse navigation reference** *(for placement within builders)*  
- Simulation builder: Setup → Content → Review  
- Test builder: Setup → Questions → Categories → Review  
- Sequence builder: Design  
- Assessment builder: Setup → Categories  
- Environment builder: World → Characters → Styling → Prompts/Content/Settings  
- Locked mode (Simulations & Tests, once live): Summary | Results  
- Workspace shell: 240px sidebar (Dashboard, Simulations, Assessments, Sequences) + 56px top bar  
- Workspace switcher dropdown: Workspace settings | Switch workspace | System Admin | Sign out

---

## 4. Anatomy

> Visual breakdown. Every element a developer would need to identify.

```
[Feature name]
├── [Region]
│   ├── [Element]: [what it shows or does]
│   └── [Element]: [what it shows or does]
└── [Region]
    └── [Element]: [what it shows or does]
```

**Design-system components used:**
- [Component] — [how it's used here]
- [Component] — [how it's used here]

---

## 5. States

| State | Visual / behaviour | Notes |
|---|---|---|
| Default | | |
| Hover | | |
| Focus | | |
| Active / selected | | |
| Disabled | | |
| Loading (initial) | | |
| Loading (action) | | |
| Empty | | Never blank — always copy + CTA |
| Partial | | |
| Error (load) | | |
| Error (action) | | |
| Success | | |
| Locked / read-only | | Applies to Simulations & Tests once live |

Remove rows that don't apply. Add feature-specific rows as needed.

---

## 6. Behaviour

### Interactions
- **[User action]** → [what happens — be specific about animation, state change, data update]
- **[User action]** → [what happens]

### Flow
- **Enters from:** [previous screen or trigger]
- **Exits to:** [next screen or in-place change]

### Progressive disclosure
- **Always visible:** [shown by default]
- **Revealed on [action]:** [what appears]
- **Collapsed by default:** [collapsible regions and why]

---

## 7. Design tokens

> Cite tokens from `design-system/colors_and_type.css`. Never raw hex.

### Colours
| Role | Token |
|---|---|
| [Role in this component] | `var(--primary-600)` |

### Typography
| Element | Family | Size | Weight |
|---|---|---|---|
| [Element] | Inter | [px] | [weight] |

Type families in use: **Inter** (UI default), **Lato** (display secondary), **Comic Relief** (accent only). Never introduce another family.

### Spacing
4-point scale only: 4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64.

| Location | Value |
|---|---|
| [Padding / gap location] | [px from scale] |

### Motion
| Interaction | Duration | Easing |
|---|---|---|
| Expand / collapse | 200ms | ease-out |
| Page transition | 150ms | fade |
| Modal entry | 200ms | backdrop fade + 98%→100% scale |
| Hover | 100ms | background shift |
| [Feature-specific] | | |

### Component references
- [Card / Button / Tag / etc.] — see `design-system/traverse-design-system.md` § *(section)*

---

## 8. Edge cases

| # | Edge case | Expected behaviour |
|---|---|---|
| 1 | Content empty / no items exist | |
| 2 | Name or text field very long | |
| 3 | Action fails / API error | |
| 4 | User has read-only or locked access | |
| 5 | At maximum capacity / many items | |
| 6 | Slow network (>3s load) | |
| 7 | User navigates away mid-action | |
| 8 | Narrow viewport / mobile | |

---

## 9. Decision rationale

> Only non-obvious decisions. Max 3 entries.

| Decision | Choice | Why | Alternatives rejected |
|---|---|---|---|
| [What was decided] | | | |

---

## 10. Open questions

| # | Question | Owner | Status |
|---|---|---|---|
| 1 | | Lara / Dave / Dev | Open |

Mark resolved with ✅ and the resolution.

---

## 11. Accessibility notes

- **Keyboard:** [Tab order, shortcuts, focus trap if modal]
- **Screen reader:** [ARIA labels, roles, live regions]
- **Contrast:** [Anything to verify — particularly status badges]
- **Motion:** Respect `prefers-reduced-motion`

---

## 12. Dev notes & Linear ticket breakdown

### House rules (assumed; flag exceptions only)
Lucide icons (no emoji). Sentence case. Second person. Verbs lead CTAs. Uppercase single-word status labels (PUBLISHED, DRAFT, ARCHIVED, COMING). No gradients, glassmorphism, rounded-left accent cards, coloured/inner shadows. Demo or scenario controls live exclusively in the bottom `.devbar`, never on the prototype surface.

### Files likely affected
- [Production file in `groundflr/studio-web-app` if known]
- [Component, view, or composable]

### Dependencies
- [Other features / components / services this relies on]

### Known constraints
- [Technical constraint that shaped the design]

### Do not
- [Intentional design decisions that might look like mistakes]

### Linear breakdown

Linear hierarchy for this work:
**Project** → **Issue** → **Sub-issues**

- **Project:** [Overarching project, e.g. "Users and Permissions"]
- **Issue:** [This feature, becomes one Linear issue — e.g. "Workspace settings"]
- **Sub-issues:** broken down by layer or discrete concern (see table below)

> One row per sub-issue the ticketing agent should create. Keep each sub-issue small enough that one engineer can ship it in a single PR.

| # | Sub-issue title | Scope (one line) | Layer |
|---|---|---|---|
| 1 | [e.g. `Workspace settings — frontend`] | [What's in this sub-issue] | Frontend |
| 2 | [e.g. `Workspace settings — backend`] | [API / data / persistence work] | Backend |
| 3 | [e.g. `WorkspaceSettingsTabs component`] | [Shared component spec] | Component |
| 4 | | | Copy / Design QA / QA |

Layer values: **Frontend** · **Backend** · **Component** *(shared / reusable)* · **Data / API** · **Copy** · **Design QA** · **QA**
