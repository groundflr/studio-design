# V2 → V1: principles to bring across now

**Scope:** organisation & workspace settings, and the test feedback audit trail / moderation.
**Status:** working snapshot off Nic's session + analysis of the V2 HTML files against the current V1 prototypes. Provisional — where newer thinking extends this, the newer thinking wins.

This doc reads each surface twice: first the **UX / functionality principles** (disclosure, state, the modal card), then the **easy UI wins** you can ship against the existing prototypes without waiting on V2. Every colour/space/type reference maps to a real token in `design-system/colors_and_type.css`.

---

## The five V2 ideas, in one line each

1. **Generate-by-default, human-curates** — AI drafts; the person reviews, tweaks, or hand-rolls. Phases: elicit → blueprint/edit → preview.
2. **Separate content from wiring** — the canvas holds the editable *content*; a sidebar holds the *logic* (rubric, context, files), collapsed by default.
3. **State follows the user's mode** — design around what the person is *doing* (building vs. wiring up; reviewing vs. adjusting), not the system's record state.
4. **One interaction grammar, complexity behind disclosure** — the **modal card is the atom**. Every interaction opens a context-specific card. Reuse the pattern; new patterns are future debt.
5. **Don't let unglamorous surfaces rot** — onboarding, email, password reset, error states get built to standard from the first stroke.

**Decision rule for everything below:** is this *disposable* (dies with V1, be pragmatic) or a *seed* (a pattern V2 inherits, build to standard)? The modal card and the neglected surfaces are seeds.

---

## What V2 actually does (observed in the HTML)

These are the concrete mechanics worth stealing, pulled from the canvas files, the AML/ED triage variants, and the test-author screens:

- **A persistent ribbon + a single mode toggle.** Top bar carries title, type tags, and a two-up `Canvas / Preview` toggle. The *whole surface* re-renders to the mode — same content, different payload (author sees the answer key; candidate sees only the surface). This is principle 3 made literal: `body.m-canvas` vs `body.m-preview`.
- **Canvas left, logic rail right.** In `test-author-submission` the content (question cards) lives in a fluid canvas; a 560px right rail holds the wiring — graded categories, context files, settings — behind **spoke-tabs** so only one logic surface shows at a time. A drag divider resizes it.
- **The modal item-card.** Clicking a question opens a single modal (`.modal` / `.mhead` / `.mbody` / `.mfoot`) with a header (number + title), the editable body, and a footer with a destructive action on the left and the primary on the right. Same shell regardless of item type; only the body differs.
- **Collapsible "wiring" panels.** The answer-key / scoring panel is a `max-height` accordion (`.akpanel.open`) that stays out of the way until summoned, with an explicit count badge.
- **In-place progressive disclosure.** The AML triage "File SAR" choice expands a *second tier* inline (`.tier2.open`) — typology + narrative — only when that path is chosen. Lighter calls (Clear/Escalate) never show it. Complexity appears exactly when the decision requires it.
- **Type-and-source markers, not chrome.** Small inline markers carry meaning: `✓ Auto-marked` vs `✦ AI graded`, `AI · review` on AI-proposed items awaiting a human accept. Status lives *on the object*, not in a separate column.

---

## Surface 1 — Organisation & workspace settings

**Where it lives now:** `prototypes/dashboard/index.html` (settings shell, tabs Summary / Users / Integrations / Settings; two-pane Users tab with the 325px peek rail; inline form sections). Feature docs `features/workspace-admin` and `features/organisation-admin` are still placeholders.

### UX / functionality principles

**1.1 — State follows mode: frame settings as "viewing" vs "editing", not as a wall of fields.**
The Settings tab currently renders every `.form-row` at once. That is the system's record laid out flat. Re-frame around what the admin is doing: a calm **read state** (labelled values, the way the peek rail already shows a user) that flips to an **edit state** per section on demand. V2's canvas/preview toggle is the same move at field granularity. This kills the "dense page" weakness and makes the save scope obvious (you're editing *this* section).

**1.2 — Separate content from wiring: the user's identity is content; their permissions are wiring.**
The Users peek rail is already the right shape — it just mixes levels. Keep the **person** (avatar, name, status, role) as the clean face; push the **wiring** (sign-in method, provisioning, role-change history, deactivation) into clearly secondary groups or a disclosure within the rail. Mirrors V2's "criteria stay the clean editable face; scope/context/guidelines go to the sidebar."

**1.3 — One grammar: every row action opens the same modal card.**
"Change role", "Edit profile", invite a member, edit an integration — all of these should open *one* modal shell (V2's `.modal` anatomy: header with subject, body that varies, footer with destructive-left / primary-right). Today these are a mix of inline links and implied full-page navigation. Standardising on the modal card is the single highest-leverage seed here: it's the exact atom V2 is built on, so the work carries forward verbatim.

**1.4 — Progressive disclosure on the rail and on advanced settings.**
The peek rail sits open-but-empty by default and shows everything when filled. Give it (a) a collapsed/empty affordance that doesn't hold dead space, and (b) a split between **common** settings (name, visibility, default role) shown immediately and **advanced** (retention, SSO, danger zone) behind a disclosure. Don't make the admin parse the rare alongside the routine.

**1.5 — Don't let it rot: invites, empty states, and integration connect/error are first-class.**
Integrations is a placeholder; the invite flow isn't shown; deactivation has no confirmation pattern. These are exactly Nic's "unglamorous surfaces." Build them now with the modal card and proper empty/error states ("Could not send invite. Check the address and try again.") so they're V2-grade from the first stroke.

### Easy UI wins (ship against the current prototype)

- **Add a per-section `Edit` affordance** to each `.settings-section` and render values read-only until clicked. Reuse the existing `.toggle` and input styles; no new components.
- **Give the peek rail a real empty state and a close control.** You already have the empty/detail swap markup — add a dismiss `✕` and let the list reclaim the width (`flex-basis` transition, `--dur-panel`).
- **Make the Users table headers sortable** to match the System Admin tables (`.sort i` already exists) — Name, Role, Last active. Pure reuse.
- **Promote status onto the row** with a coloured dot + label (`--success-500` active, `--surface-400` deactivated, `--warn-500` invited-pending) so state reads without opening the rail. This is V2's "status on the object."
- **Pin the bulk-actions bar to the list, not the viewport**, or add a count chip in the action row, so a selection made above the fold isn't lost on scroll.
- **Token tidy:** ensure section dividers use `--border-subtle`, hovers use `--bg-subtle`, active tab underline uses `--accent`, focus uses `--shadow-ring-primary`. Radii: cards `--radius-lg`, inputs `--radius-md`, chips `--radius-full`.

---

## Surface 2 — Test feedback audit trail & moderation

**Where it lives now:** `prototypes/test-journey/index.html`, `data-screen="submission-results"`. Pill tabs Results / Feedback / Moderation / History. Moderation = 2-col grid (420px grading panels + submission viewer). History = GitHub-style vertical timeline + 340px peek rail, with an alternate flat "settings style" view.

This surface is where the V2 mapping is richest, because moderation *is* a generate-by-default-then-curate loop: the AI grades, the moderator reviews or adjusts. Every concept in the AML triage file has a near-direct analogue.

### UX / functionality principles

**2.1 — State follows mode: design for "reviewing" vs "adjusting", not for record states.**
Right now Moderation and History are separate tabs describing system states (the grade, the log). Re-frame around the moderator's two modes. In **review** mode they're reading the AI's grade against the submission (the current side-by-side is good). The moment they change something they're in **adjust** mode — which should demand a justification and produce an audit entry as a *consequence of the mode*, not as a separate destination. This is the direct read of Nic's "moderation framing."

**2.2 — The modal card is the atom: a grade, a flag, a discrepancy, an audit entry all open one card.**
This is the headline recommendation. Today a grade edit, a flag, and an audit-entry detail are three different disclosures (inline panel, inline expand, peek rail). Collapse them onto V2's modal item-card:
- Header: what this is (e.g. "Criterion 3 · Risk assessment" + `✦ AI graded`).
- Body: the AI's score and rationale, the submission excerpt it cites, and the moderator's adjustment field.
- Footer: justification required to save; destructive ("revert to AI") on the left, "Save adjustment" on the right.
Clicking *anything* — a grade cell, a flagged span, a discrepancy, a timeline entry — opens the context-specific version of this one card. No new navigation, no inline sprawl. This is a pure seed: build it to standard and V2 inherits it.

**2.3 — Separate content from wiring: submission is content; rubric, justification, files are wiring.**
Adopt the canvas/rail split outright. The candidate's **submission stays the clean reading face** in the canvas (the `.submission-panel .doc` you already have). The **wiring** — rubric criteria, AI rationale, attached evidence files, prior justifications — goes to a right rail with spoke-tabs (`Rubric / Evidence / History`), collapsed by default. This replaces the current 420/1fr two-column grid where grading panels compete with the submission for attention.

**2.4 — Progressive disclosure: justification and diff appear when adjusting, the SAR-tier way.**
Borrow the AML `tier2` mechanic exactly. A moderator viewing a grade sees the score and rationale. Only when they move the score does the **justification field + before/after diff** expand inline (`max-height` transition). Unchanged criteria never show it. The audit entry writes itself from that expansion. One interaction produces both the change and its record.

**2.5 — One grammar for the timeline; let the visual be a toggle, not the default.**
The GitHub-style branch graph is cognitive overhead for most moderators and you already built the flat "settings style" alternate. Make the **flat, scannable list the default**, with the timeline graph as an opt-in density view. Each entry is a row that opens the modal card (2.2) for its full before/after — drop the redundant inline-expand *and* peek-rail double disclosure down to the single card.

**2.6 — Type-and-source markers carry the audit meaning.**
Reuse V2's marker grammar so an audit row reads at a glance: `✦ AI graded`, `✎ Moderator adjusted`, `⚑ Flagged`, `↺ Reverted`, plus the actor and timestamp. Colour the node/dot by type using semantic tokens (`--primary-500` grading, `--info-500` feedback, `--surface-400` system) — which is already close to what the prototype does; just make it the load-bearing signal rather than decoration.

### Easy UI wins (ship against the current prototype)

- **Flip History's default to the flat `.audit-wrap.is-settings` view.** The markup exists; change the default class. Instant reduction in visual noise, and it's the V2 direction.
- **Collapse the double disclosure.** Pick one: have the timeline row open the peek rail *or* expand inline, not both. Recommend: row → modal card (2.2); retire the inline `.tl-change-detail`.
- **Add the justification-on-adjust micro-interaction** in Moderation: when a grade input changes, reveal the justification textarea + a `Before → After` chip pair (`.tl-diff` styling already exists). Block save until justification is non-empty.
- **Standardise the audit row** to: type marker · summary · actor · `--font-mono` timestamp (`.tnum` tabular). Hover `--bg-subtle`, selected `--accent-tint` with a `--border-focus` ring.
- **Make "Show full log / my changes" a real segmented control** rather than a text link, matching the `Canvas/Preview` toggle styling — consistent control grammar.
- **Add filter chips for change type and actor** (you have `.audit-filter__chip`); wire them to the markers above so the log is filterable by "moderator adjustments" vs "AI grades."
- **Token tidy:** audit cards `--radius-lg` on `--bg-canvas` with `--border-subtle`; node colours from semantic tokens above; the modal card uses `--shadow-lg`, `--radius-xl`, focus `--shadow-ring-primary`.

---

## Build order (suggested)

The modal card is the seed that unlocks the most reuse across *both* surfaces, so build it first as a shared shell, then apply.

1. **Shared modal item-card** (header / body / footer; destructive-left, primary-right). One component, used by user-row actions, invites, grade edits, flags, and audit-entry detail.
2. **Audit trail: flat-list default + justification-on-adjust + row-opens-card.** Highest UX payoff, and it's mostly re-defaulting and pruning existing markup.
3. **Settings: per-section edit state + sortable users + row status + peek-rail empty/close.** Mostly token and state-toggle work.
4. **Neglected surfaces** (invites, integration connect/error, deactivation confirm, settings empty states) built to standard on the modal card.

Classify as you go: the modal card and the neglected surfaces are **seeds** — build them properly. The GitHub timeline graph is **disposable** — keep it behind a toggle, don't invest.

---

## Mapping table (quick reference)

| V2 principle | Settings application | Audit trail application |
|---|---|---|
| Modal card = the atom | Row actions, invites, role change → one modal | Grade / flag / discrepancy / audit entry → one modal |
| Content vs wiring | Person = face; permissions/provisioning = secondary | Submission = canvas; rubric/evidence/justification = rail |
| State follows mode | View vs edit per section | Review vs adjust; audit is a consequence of adjust |
| One grammar, disclosure | Common vs advanced settings; collapsible rail | Flat list default; justification + diff expand on change |
| Don't let it rot | Invites, integrations, deactivation, empty states | Empty audit state, AI-grade error/pending states |

---

## Shared modal card — implementation

This is the highest-return build, so the exact code is here in full. Governance — *when* to use it, the *information-split* rules (main screen vs. card), body recipes, do/don't — lives in the companion **`shared-modal-card-rulebook.md`**. The two are consistent; the rulebook is the source of truth if they ever diverge.

**The contract:** one overlay instance, reused for every card. Header (subject + type/source marker) and footer (destructive-left, primary-right) are fixed; only the body varies. A focused action on a single object opens a card — never new navigation, never inline sprawl.

### Dependencies

```html
<link rel="stylesheet" href="/design-system/colors_and_type.css" />
<link rel="stylesheet" href="https://unpkg.com/lucide-static@latest/font/lucide.css" />
```

### Root markup (place once, before `</body>`)

```html
<div class="tv-modal-overlay" id="tvModalOverlay" aria-hidden="true">
  <div class="tv-modal" role="dialog" aria-modal="true"
       aria-labelledby="tvModalTitle" aria-describedby="tvModalBody" tabindex="-1">
    <header class="tv-modal__header">
      <span class="tv-modal__icon" id="tvModalIcon"><i class="icon-pencil"></i></span>
      <span class="tv-modal__titles">
        <span class="tv-modal__title" id="tvModalTitle">Title</span>
        <span class="tv-modal__subtitle" id="tvModalSubtitle"></span>
      </span>
      <span class="tv-modal__marker" id="tvModalMarker"></span>
      <button class="tv-modal__close" id="tvModalClose" type="button" aria-label="Close">
        <i class="icon-x"></i>
      </button>
    </header>
    <div class="tv-modal__body" id="tvModalBody"></div>
    <footer class="tv-modal__footer" id="tvModalFooter"></footer>
  </div>
</div>
```

### CSS

```css
/* SHARED MODAL CARD — all values reference design-system/colors_and_type.css */

/* overlay / backdrop */
.tv-modal-overlay{ position:fixed; inset:0; z-index:1000; display:flex; align-items:center;
  justify-content:center; padding:40px; background:rgb(15 23 42 / 0.42);
  -webkit-backdrop-filter:blur(2px); backdrop-filter:blur(2px);
  opacity:0; visibility:hidden;
  transition:opacity var(--dur-base) var(--ease-std), visibility 0s linear var(--dur-base); }
.tv-modal-overlay.is-open{ opacity:1; visibility:visible;
  transition:opacity var(--dur-base) var(--ease-std); }

/* the card */
.tv-modal{ width:600px; max-width:100%; max-height:88vh; display:flex; flex-direction:column;
  overflow:hidden; background:var(--surface-0); border:1px solid var(--border-subtle);
  border-radius:var(--radius-xl); box-shadow:var(--shadow-lg);
  transform:translateY(8px) scale(.98); opacity:0;
  transition:transform var(--dur-base) var(--ease-std), opacity var(--dur-base) var(--ease-std); }
.tv-modal-overlay.is-open .tv-modal{ transform:none; opacity:1; }
.tv-modal--sm{ width:440px; } .tv-modal--lg{ width:760px; }

/* header */
.tv-modal__header{ display:flex; align-items:center; gap:10px; padding:14px 18px;
  border-bottom:1px solid var(--surface-100); flex:0 0 auto; }
.tv-modal__icon{ width:28px; height:28px; border-radius:var(--radius-md); background:var(--primary-600);
  color:#fff; display:grid; place-items:center; flex:0 0 auto; }
.tv-modal__titles{ min-width:0; display:flex; flex-direction:column; gap:1px; }
.tv-modal__title{ font:600 var(--fs-sm)/1.3 var(--font-sans); color:var(--fg-1); }
.tv-modal__subtitle{ font:600 var(--fs-2xs)/1.3 var(--font-sans); text-transform:uppercase;
  letter-spacing:.05em; color:var(--fg-3); }
.tv-modal__subtitle:empty{ display:none; }
.tv-modal__marker{ margin-left:auto; }
.tv-modal__close{ width:30px; height:30px; border-radius:var(--radius-md); display:grid;
  place-items:center; color:var(--fg-3); border:none; background:none; cursor:pointer; flex:0 0 auto;
  transition:background var(--dur-quick) var(--ease-std); }
.tv-modal__close:hover{ background:var(--surface-100); color:var(--fg-1); }
.tv-modal__close:focus-visible{ outline:none; box-shadow:var(--shadow-ring-primary); }

/* body + footer */
.tv-modal__body{ padding:18px; overflow:auto; flex:1 1 auto; }
.tv-modal__body > * + *{ margin-top:14px; }
.tv-modal__footer{ display:flex; align-items:center; gap:10px; padding:13px 18px;
  border-top:1px solid var(--surface-100); flex:0 0 auto; justify-content:flex-end; }
.tv-modal__footer:empty{ display:none; }
.tv-modal__footer .tv-btn--danger{ margin-right:auto; }

/* markers */
.tv-marker{ display:inline-flex; align-items:center; gap:5px; font:700 var(--fs-3xs)/1 var(--font-sans);
  border-radius:var(--radius-sm); padding:3px 8px; letter-spacing:.02em; }
.tv-marker i{ font-size:12px; }
.tv-marker--ai      { color:var(--primary-700); background:var(--primary-50);  border:1px solid var(--primary-200); }
.tv-marker--adjusted{ color:var(--warn-500);    background:var(--warn-100);    border:1px solid #fde68a; }
.tv-marker--flag    { color:var(--error-500);   background:var(--error-100);   border:1px solid #fecaca; }
.tv-marker--auto    { color:var(--success-500); background:var(--success-100); border:1px solid #bbf7d0; }

/* buttons */
.tv-btn{ display:inline-flex; align-items:center; gap:7px; height:36px; padding:0 16px;
  border-radius:var(--radius-md); font:600 var(--fs-sm)/1 var(--font-sans); border:none; cursor:pointer;
  transition:background var(--dur-quick) var(--ease-std); }
.tv-btn:focus-visible{ outline:none; box-shadow:var(--shadow-ring-primary); }
.tv-btn--primary{ background:var(--accent); color:#fff; box-shadow:var(--shadow-xs); }
.tv-btn--primary:hover{ background:var(--accent-hover); }
.tv-btn--primary:disabled{ background:var(--surface-300); color:var(--surface-500); cursor:not-allowed; box-shadow:none; }
.tv-btn--ghost{ background:var(--surface-0); border:1px solid var(--border-subtle); color:var(--fg-2); }
.tv-btn--ghost:hover{ background:var(--bg-subtle); }
.tv-btn--danger{ background:none; color:var(--error-500); padding:0 6px; }
.tv-btn--danger:hover{ background:var(--error-100); }

/* body recipe primitives */
.tv-field-label{ font:600 var(--fs-2xs)/1.3 var(--font-sans); text-transform:uppercase;
  letter-spacing:.05em; color:var(--fg-3); display:flex; align-items:center; gap:7px; margin-bottom:7px; }
.tv-input,.tv-textarea,.tv-select{ width:100%; border:1px solid var(--border-subtle);
  border-radius:var(--radius-md); padding:9px 11px; font:400 var(--fs-sm)/1.5 var(--font-sans);
  color:var(--fg-1); background:var(--surface-0);
  transition:border-color var(--dur-quick), box-shadow var(--dur-quick); }
.tv-textarea{ resize:vertical; min-height:64px; }
.tv-input:focus,.tv-textarea:focus,.tv-select:focus{ outline:none; border-color:var(--border-focus);
  box-shadow:var(--shadow-ring-primary); }
.tv-excerpt{ font:400 var(--fs-xs)/1.55 var(--font-sans); color:var(--fg-2); background:var(--bg-subtle);
  border-left:2px solid var(--primary-300); padding:9px 12px; border-radius:0 var(--radius-sm) var(--radius-sm) 0; }
.tv-diff{ display:inline-flex; align-items:center; gap:7px; font:600 var(--fs-xs)/1 var(--font-sans); }
.tv-diff .was{ color:var(--fg-4); text-decoration:line-through; }
.tv-diff .arr{ color:var(--fg-4); } .tv-diff .now{ color:var(--primary-700); }
.tv-well{ background:var(--bg-subtle); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:11px 12px; }
.tv-well--required{ border-style:dashed; border-color:var(--primary-300); background:var(--primary-50); }

/* reduced motion + scroll lock */
@media (prefers-reduced-motion: reduce){
  .tv-modal-overlay,.tv-modal{ transition-duration:1ms !important; } .tv-modal{ transform:none; } }
body.tv-scroll-lock{ overflow:hidden; }
```

### JS controller

```js
/* SHARED MODAL CARD — controller. One instance, reused.
   Appear/close transitions, ESC, overlay-click, focus trap + restore,
   scroll lock, validity gating, dirty-guard, reduced motion. */
const TvModal = (() => {
  const overlay = document.getElementById('tvModalOverlay');
  const dialog  = overlay.querySelector('.tv-modal');
  const elIcon  = document.getElementById('tvModalIcon');
  const elTitle = document.getElementById('tvModalTitle');
  const elSub   = document.getElementById('tvModalSubtitle');
  const elMark  = document.getElementById('tvModalMarker');
  const elBody  = document.getElementById('tvModalBody');
  const elFoot  = document.getElementById('tvModalFooter');
  const btnClose= document.getElementById('tvModalClose');
  let lastTrigger = null, cfg = null, isDirty = false;
  const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),'+
    'select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
  const icon = n => `<i class="icon-${n}"></i>`;

  function open(config){
    cfg = config; lastTrigger = document.activeElement; isDirty = false;
    dialog.classList.remove('tv-modal--sm','tv-modal--lg');
    if (config.size==='sm') dialog.classList.add('tv-modal--sm');
    if (config.size==='lg') dialog.classList.add('tv-modal--lg');
    elIcon.innerHTML = icon(config.icon || 'pencil');
    elTitle.textContent = config.title || '';
    elSub.textContent   = config.subtitle || '';
    elMark.innerHTML = config.marker
      ? `<span class="tv-marker tv-marker--${config.marker.kind}">${icon(config.marker.icon)}${config.marker.label}</span>` : '';
    elBody.innerHTML = config.bodyHTML || '';
    let foot = '';
    if (config.dangerLabel)  foot += `<button class="tv-btn tv-btn--danger" data-act="danger">${config.dangerLabel}</button>`;
    foot += `<button class="tv-btn tv-btn--ghost" data-act="cancel">Cancel</button>`;
    if (config.primaryLabel) foot += `<button class="tv-btn tv-btn--primary" data-act="confirm">${config.primaryLabel}</button>`;
    elFoot.innerHTML = foot;
    elBody.addEventListener('input', markDirty);
    if (typeof config.onMount==='function') config.onMount({ refresh, setDirty:v=>{isDirty=!!v;}, body:elBody, close });
    refresh();
    overlay.setAttribute('aria-hidden','false');
    document.body.classList.add('tv-scroll-lock');
    requestAnimationFrame(()=> overlay.classList.add('is-open'));
    setTimeout(()=> (elBody.querySelector(FOCUSABLE) || btnClose).focus(), 60);
    bind();
  }
  function refresh(){ const p = elFoot.querySelector('[data-act="confirm"]');
    if (p && typeof cfg.validate==='function') p.disabled = !cfg.validate(elBody); }
  function markDirty(){ isDirty = true; }
  function close({force=false}={}){
    if (!force && isDirty && !confirm('Discard your changes?')) return;
    overlay.classList.remove('is-open'); unbind();
    let ran=false; const done=()=>{ if(ran)return; ran=true;
      overlay.setAttribute('aria-hidden','true'); document.body.classList.remove('tv-scroll-lock');
      elBody.removeEventListener('input', markDirty); elBody.innerHTML=''; elFoot.innerHTML='';
      if (lastTrigger && lastTrigger.focus) lastTrigger.focus(); cfg=null; isDirty=false; };
    dialog.addEventListener('transitionend', done, { once:true }); setTimeout(done, 260);
  }
  function onKeydown(e){ if(e.key==='Escape'){ e.preventDefault(); close(); } else if(e.key==='Tab'){ trapTab(e); } }
  function trapTab(e){ const f=[...dialog.querySelectorAll(FOCUSABLE)].filter(el=>el.offsetParent!==null);
    if(!f.length) return; const first=f[0], last=f[f.length-1];
    if(e.shiftKey && document.activeElement===first){ e.preventDefault(); last.focus(); }
    else if(!e.shiftKey && document.activeElement===last){ e.preventDefault(); first.focus(); } }
  function onOverlayClick(e){ if(e.target===overlay) close(); }
  function onFootClick(e){ const act=e.target.closest('[data-act]')?.dataset.act;
    if(act==='cancel') close();
    else if(act==='danger') cfg.onDanger?.(elBody,{close});
    else if(act==='confirm'){ if(cfg.onConfirm?.(elBody,{close})!==false) close({force:true}); } }
  function bind(){ document.addEventListener('keydown', onKeydown);
    overlay.addEventListener('mousedown', onOverlayClick); elFoot.addEventListener('click', onFootClick);
    btnClose.addEventListener('click', ()=>close()); }
  function unbind(){ document.removeEventListener('keydown', onKeydown);
    overlay.removeEventListener('mousedown', onOverlayClick); elFoot.removeEventListener('click', onFootClick); }
  return { open, close };
})();
```

(For a worked call — the grade-adjust card with live diff + justification gating — and the flag / role / invite / audit-detail recipes, see `shared-modal-card-rulebook.md` §5.5 and §8.)

### Interaction & motion (the specifics)

| Behaviour | Spec |
|---|---|
| Appear | Overlay fades `0→1` (`--dur-base` 200ms `--ease-std`); card fades + `translateY(8px) scale(.98) → none`. `.is-open` added on the next animation frame. |
| Close | Reverse; root hidden + scroll unlocked + body/footer cleared after `transitionend` (260ms fallback timer). |
| Call-in | Row click or `⋮` menu item → `TvModal.open(config)`. One reused overlay; no stacking; never open a card from a card. |
| ESC | Closes (dirty-guard first). |
| Overlay click | Backdrop only (not the card) closes; `mousedown` + `e.target===overlay` so a drag starting in the card never closes it. |
| Focus | Moves to first body field (or close button) on open; trapped while open; restored to the trigger on close. |
| Scroll lock | `body.tv-scroll-lock` while open. |
| Validity gating | Primary `disabled` until `validate(body)` is true; body edits call `api.refresh()`. |
| Dirty guard | Any body edit arms a `confirm('Discard your changes?')` on ESC/overlay/cancel/close. Successful `onConfirm` closes with `{force:true}`. |
| Reduced motion | `prefers-reduced-motion: reduce` → ~1ms transitions, no transform. |
| Tall content | Header/footer fixed; only `.tv-modal__body` scrolls; card capped at `88vh`. z-index `1000` (above sidebar + top bar). |
