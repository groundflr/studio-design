# Shared modal card — rulebook

**Status:** seed component (build to standard; V2 inherits it).
**Owner surface(s):** organisation & workspace settings, test feedback audit trail / moderation — and any future surface with a focused action on a single object.
**Tokens:** every value references `design-system/colors_and_type.css`. No raw hex in the prototypes (raw hex is a regression per `CLAUDE.md`).
**Icons:** Lucide via CDN (the repo's FontAwesome-Pro substitute). Never emoji.

This file is self-contained: it explains *when* to reach for the modal card, *how* to split information between the main screen and the card, and gives the *exact* HTML, CSS, and JS to build it, plus the full interaction and accessibility spec. Hand it to Claude Code as-is.

---

## 1. What it is, and the one rule

The modal card is **the atom of interaction**. A grade adjustment, a flag, a role change, an invite, an audit-entry detail — all open the *same* shell. The header says what the object is; the body is the only part that changes; the footer commits or cancels.

> **The one rule:** a focused action on a single object opens a context-specific modal card, never new navigation and never inline sprawl.

This follows directly from the design principles: *never leave the page* (modals over navigation), *one thing at a time* (the card owns the screen while open), and *progressive disclosure* (the card holds the depth the main screen shouldn't).

---

## 2. When to use it — and when not to

Three disclosure mechanisms exist. Choosing the right one keeps the grammar consistent.

| Mechanism | Use when | Examples | Don't use for |
|---|---|---|---|
| **Modal card** | A focused, discrete action on **one object** that benefits from full attention and a clear commit/cancel. | Adjust a grade, raise a flag, change a role, invite a member, view an audit entry's full before/after, edit an integration. | Persistent context that should stay visible while working; trivially reversible toggles. |
| **Side rail** | **Persistent wiring/context** that accompanies the canvas continuously and has no discrete "commit". | Rubric criteria, evidence/attachments, the running history list, settings groups alongside content. | A one-off action that should command attention. |
| **Inline disclosure** | **Lightweight, reversible** expansion in place that needs no commit. | The "advanced settings" reveal; the tier-2 expand within a card (e.g. SAR narrative); a row's quick peek. | Anything destructive or anything needing a justification + save. |

**Decision flow:** Is it a discrete action with a commit? → modal card. Is it always-on context? → rail. Is it a cheap, reversible reveal? → inline.

**Never:**
- Open a modal card from inside another modal card (no stacking). If a sub-action is needed, it's a step *within* the same card body, or it replaces the body.
- Put a primary destructive action inline on a list row. It opens the card.
- Use the modal card for multi-object bulk actions — that's the bulk-action bar.

---

## 3. Information split — main screen vs. card

This is the part that keeps things reliable across authors. Apply it the same way every time.

**Main screen (list row / canvas object) carries only what's needed to _recognise_ the object and read its _state_:**
- Identity (name, criterion title, customer, member).
- A one-line summary or current value (e.g. "8 / 10", "Admin", "Possible plagiarism").
- A **status/source marker** on the object itself (AI graded / Adjusted / Flagged / Active / Pending). State lives on the object, not in a separate column or only inside the card.
- The affordance to open the card (whole row click, or a `⋮` vertical-ellipsis menu — never the horizontal ellipsis).

**The card carries everything needed to _understand_ and _act on_ the object:**
- The full context the decision rests on (the cited submission excerpt, the case detail, the member's provisioning info).
- The **editable wiring** (score input, role select, justification, narrative).
- Progressive depth — secondary/advanced fields disclosed within the body, not crammed onto the row.
- The actions: destructive on the left, primary on the right, primary gated by validity.

**Rule of thumb:** *recognise on the screen, act in the card.* If a field is only needed at the moment of acting, it belongs in the card. If a value is needed to scan and triage, it belongs on the row (as text + marker).

**Worked examples**

| Object | On the main screen | In the card |
|---|---|---|
| Graded criterion | Title · `8/10` · `✦ AI graded` marker | Cited excerpt · score input · before→after diff · justification (required) · revert / save |
| Flag | Subject · `⚑ Flagged` marker · actor | Flagged span/excerpt · reason field · severity · dismiss / confirm |
| Member | Avatar · name · email · `● Active` status | Role select · job title · sign-in method · provisioning · deactivate / save |
| Audit entry | Type marker · summary (`8 → 6`) · actor · mono timestamp | Full before/after diff · justification text · linked criterion · close (read-only) |
| Invite | (empty-state CTA) | Email · role · message · cancel / send |

---

## 4. Anatomy

```
┌─────────────────────────────────────────────┐
│ [icon] Title                    [marker] [✕] │  ← header: subject + type/source marker
│        SUBTITLE / CONTEXT                     │
├─────────────────────────────────────────────┤
│                                               │
│   BODY — the only part that varies            │  ← scrolls if tall (max-height 88vh)
│   excerpt · fields · justification · diff     │
│                                               │
├─────────────────────────────────────────────┤
│ [revert]                  [cancel] [primary]  │  ← footer: destructive-left, primary-right
└─────────────────────────────────────────────┘
```

- **Header** is fixed: a 28px icon tile, title (sans 14px/600), optional uppercase subtitle (overline), a type/source **marker** chip pinned right, then the close button.
- **Body varies.** This is the contract: header and footer are stable; only the body changes between contexts. Build body content from the recipes in §8.
- **Footer is fixed grammar:** destructive action (ghost/danger, text) pinned left via `margin-right:auto`; secondary "Cancel" then primary on the right. Primary is **disabled until the card is valid** (e.g. justification non-empty).
- **When the confirm action itself is destructive** (cancel an invite, delete, remove, deactivate — i.e. there is no separate "save"), the primary/right button *is* the destructive one: keep the standard formation (secondary left, primary right, nudged together) but render the primary **red**. In `tv-modal-card` set `primary-variant="danger"` (not `danger-label`), and give the dismiss a reassuring `cancel-label` (e.g. "Keep invitation"). Reserve the left-pinned `danger-label` for a **secondary** destructive action sitting *alongside* a non-destructive primary (e.g. "Revert to AI" next to "Save adjustment"). This is a standing convention: any modal whose primary action is cancellation / deletion / removal uses `primary-variant="danger"`.

### Marker grammar (status on the object)

| Marker | Token colours | Meaning |
|---|---|---|
| `✦ AI graded` | `--primary-700` on `--primary-50`, border `--primary-200` | Generated/scored by AI, awaiting human review |
| `✎ Adjusted` | `--warn-500` on `--warn-100` | A human has changed the AI value |
| `⚑ Flagged` | `--error-500` on `--error-100` | Flagged for attention |
| `✓ Auto-marked` | `--success-500` on `--success-100` | Deterministically/auto scored |

(The glyphs above are written as words in the tables for readability; in code they are **Lucide icons** — `sparkles`, `pencil`, `flag`, `circle-check` — never emoji.)

---

## 5. The code

### 5.1 Dependencies

```html
<!-- tokens (repo source of truth) -->
<link rel="stylesheet" href="/design-system/colors_and_type.css" />
<!-- Lucide icon font (repo's FA-Pro substitute) -->
<link rel="stylesheet" href="https://unpkg.com/lucide-static@latest/font/lucide.css" />
```

### 5.2 Root markup (place once, near `</body>`)

A single overlay + card instance is reused for every card; the body is injected on open. This guarantees one grammar and one set of behaviours.

```html
<!-- Shared modal card root — exactly one per document -->
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
    <div class="tv-modal__body" id="tvModalBody"><!-- injected --></div>
    <footer class="tv-modal__footer" id="tvModalFooter"><!-- injected --></footer>
  </div>
</div>
```

### 5.3 CSS

```css
/* ============================================================
   SHARED MODAL CARD — Traverse Studio
   All values reference design-system/colors_and_type.css
   ============================================================ */

/* --- overlay / backdrop --- */
.tv-modal-overlay{
  position:fixed; inset:0; z-index:1000;
  display:flex; align-items:center; justify-content:center; padding:40px;
  background:rgb(15 23 42 / 0.42);                 /* --surface-900 @ 42% */
  -webkit-backdrop-filter:blur(2px); backdrop-filter:blur(2px);
  opacity:0; visibility:hidden;
  transition:opacity var(--dur-base) var(--ease-std),
             visibility 0s linear var(--dur-base);
}
.tv-modal-overlay.is-open{
  opacity:1; visibility:visible;
  transition:opacity var(--dur-base) var(--ease-std);
}

/* --- the card --- */
.tv-modal{
  width:600px; max-width:100%; max-height:88vh;
  display:flex; flex-direction:column; overflow:hidden;
  background:var(--surface-0);
  border:1px solid var(--border-subtle);
  border-radius:var(--radius-xl);
  box-shadow:var(--shadow-lg);
  transform:translateY(8px) scale(.98); opacity:0;
  transition:transform var(--dur-base) var(--ease-std),
             opacity   var(--dur-base) var(--ease-std);
}
.tv-modal-overlay.is-open .tv-modal{ transform:none; opacity:1; }
.tv-modal--sm{ width:440px; }
.tv-modal--lg{ width:760px; }

/* --- header --- */
.tv-modal__header{ display:flex; align-items:center; gap:10px;
  padding:14px 18px; border-bottom:1px solid var(--surface-100); flex:0 0 auto; }
.tv-modal__icon{ width:28px; height:28px; border-radius:var(--radius-md);
  background:var(--primary-600); color:#fff; display:grid; place-items:center; flex:0 0 auto; }
.tv-modal__titles{ min-width:0; display:flex; flex-direction:column; gap:1px; }
.tv-modal__title{ font:600 var(--fs-sm)/1.3 var(--font-sans); color:var(--fg-1); }
.tv-modal__subtitle{ font:600 var(--fs-2xs)/1.3 var(--font-sans);
  text-transform:uppercase; letter-spacing:.05em; color:var(--fg-3); }
.tv-modal__subtitle:empty{ display:none; }
.tv-modal__marker{ margin-left:auto; }
.tv-modal__close{ width:30px; height:30px; border-radius:var(--radius-md);
  display:grid; place-items:center; color:var(--fg-3); border:none; background:none;
  cursor:pointer; flex:0 0 auto; transition:background var(--dur-quick) var(--ease-std); }
.tv-modal__close:hover{ background:var(--surface-100); color:var(--fg-1); }
.tv-modal__close:focus-visible{ outline:none; box-shadow:var(--shadow-ring-primary); }

/* --- body (scrolls) --- */
.tv-modal__body{ padding:18px; overflow:auto; flex:1 1 auto; }
.tv-modal__body > * + *{ margin-top:14px; }

/* --- footer --- */
.tv-modal__footer{ display:flex; align-items:center; gap:10px;
  padding:13px 18px; border-top:1px solid var(--surface-100); flex:0 0 auto;
  justify-content:flex-end; }
.tv-modal__footer:empty{ display:none; }
.tv-modal__footer .tv-btn--danger{ margin-right:auto; }   /* destructive jumps left */

/* --- markers (status on the object) --- */
.tv-marker{ display:inline-flex; align-items:center; gap:5px;
  font:700 var(--fs-3xs)/1 var(--font-sans); border-radius:var(--radius-sm);
  padding:3px 8px; letter-spacing:.02em; }
.tv-marker .lucide,.tv-marker i{ font-size:12px; }
.tv-marker--ai      { color:var(--primary-700); background:var(--primary-50);  border:1px solid var(--primary-200); }
.tv-marker--adjusted{ color:var(--warn-500);    background:var(--warn-100);    border:1px solid #fde68a; }
.tv-marker--flag    { color:var(--error-500);   background:var(--error-100);   border:1px solid #fecaca; }
.tv-marker--auto    { color:var(--success-500); background:var(--success-100); border:1px solid #bbf7d0; }

/* --- buttons --- */
.tv-btn{ display:inline-flex; align-items:center; gap:7px; height:36px; padding:0 16px;
  border-radius:var(--radius-md); font:600 var(--fs-sm)/1 var(--font-sans);
  border:none; cursor:pointer; transition:background var(--dur-quick) var(--ease-std); }
.tv-btn:focus-visible{ outline:none; box-shadow:var(--shadow-ring-primary); }
.tv-btn--primary{ background:var(--accent); color:#fff; box-shadow:var(--shadow-xs); }
.tv-btn--primary:hover{ background:var(--accent-hover); }
.tv-btn--primary:disabled{ background:var(--surface-300); color:var(--surface-500);
  cursor:not-allowed; box-shadow:none; }
.tv-btn--ghost{ background:var(--surface-0); border:1px solid var(--border-subtle); color:var(--fg-2); }
.tv-btn--ghost:hover{ background:var(--bg-subtle); }
.tv-btn--danger{ background:none; color:var(--error-500); padding:0 6px; }
.tv-btn--danger:hover{ background:var(--error-100); }

/* --- body recipe primitives (reusable) --- */
.tv-field-label{ font:600 var(--fs-2xs)/1.3 var(--font-sans);
  text-transform:uppercase; letter-spacing:.05em; color:var(--fg-3);
  display:flex; align-items:center; gap:7px; margin-bottom:7px; }
.tv-input,.tv-textarea,.tv-select{ width:100%; border:1px solid var(--border-subtle);
  border-radius:var(--radius-md); padding:9px 11px; font:400 var(--fs-sm)/1.5 var(--font-sans);
  color:var(--fg-1); background:var(--surface-0); transition:border-color var(--dur-quick),box-shadow var(--dur-quick); }
.tv-textarea{ resize:vertical; min-height:64px; }
.tv-input:focus,.tv-textarea:focus,.tv-select:focus{ outline:none;
  border-color:var(--border-focus); box-shadow:var(--shadow-ring-primary); }
.tv-excerpt{ font:400 var(--fs-xs)/1.55 var(--font-sans); color:var(--fg-2);
  background:var(--bg-subtle); border-left:2px solid var(--primary-300);
  padding:9px 12px; border-radius:0 var(--radius-sm) var(--radius-sm) 0; }
.tv-diff{ display:inline-flex; align-items:center; gap:7px; font:600 var(--fs-xs)/1 var(--font-sans); }
.tv-diff .was{ color:var(--fg-4); text-decoration:line-through; }
.tv-diff .arr{ color:var(--fg-4); }
.tv-diff .now{ color:var(--primary-700); }
.tv-well{ background:var(--bg-subtle); border:1px solid var(--border-subtle);
  border-radius:var(--radius-md); padding:11px 12px; }
.tv-well--required{ border-style:dashed; border-color:var(--primary-300); background:var(--primary-50); }

/* --- reduced motion --- */
@media (prefers-reduced-motion: reduce){
  .tv-modal-overlay, .tv-modal{ transition-duration:1ms !important; }
  .tv-modal{ transform:none; }
}

/* --- scroll lock (added to <body> while open) --- */
body.tv-scroll-lock{ overflow:hidden; }
```

### 5.4 JS controller

A small, dependency-free controller. `TvModal.open(config)` injects the body, wires behaviours, and returns nothing the caller must manage; `TvModal.close()` tears down. One instance, reused.

```js
/* ============================================================
   SHARED MODAL CARD — controller
   Behaviours: appear/close transitions, ESC, overlay-click,
   focus trap, focus restore, scroll lock, validity gating,
   dirty-guard, reduced motion. One instance, reused.
   ============================================================ */
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

  let lastTrigger = null;     // element to restore focus to
  let cfg = null;             // active config
  let isDirty = false;        // set true when the body is edited

  const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),' +
    'select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

  function icon(name){ return `<i class="icon-${name}"></i>`; }

  /* open({
       icon:'pencil', title, subtitle, size:'sm'|'md'|'lg',
       marker:{kind:'ai'|'adjusted'|'flag'|'auto', icon, label},
       bodyHTML, primaryLabel, dangerLabel,
       onMount(api){…}, validate()->bool, onConfirm(), onDanger()
     }) */
  function open(config){
    cfg = config;
    lastTrigger = document.activeElement;
    isDirty = false;

    // size
    dialog.classList.remove('tv-modal--sm','tv-modal--lg');
    if (config.size === 'sm') dialog.classList.add('tv-modal--sm');
    if (config.size === 'lg') dialog.classList.add('tv-modal--lg');

    // header
    elIcon.innerHTML = icon(config.icon || 'pencil');
    elTitle.textContent = config.title || '';
    elSub.textContent   = config.subtitle || '';
    elMark.innerHTML = config.marker
      ? `<span class="tv-marker tv-marker--${config.marker.kind}">${icon(config.marker.icon)}${config.marker.label}</span>`
      : '';

    // body
    elBody.innerHTML = config.bodyHTML || '';

    // footer
    let foot = '';
    if (config.dangerLabel)
      foot += `<button class="tv-btn tv-btn--danger" data-act="danger">${config.dangerLabel}</button>`;
    foot += `<button class="tv-btn tv-btn--ghost" data-act="cancel">Cancel</button>`;
    if (config.primaryLabel)
      foot += `<button class="tv-btn tv-btn--primary" data-act="confirm">${config.primaryLabel}</button>`;
    elFoot.innerHTML = foot;

    // mark dirty on any body edit
    elBody.addEventListener('input', markDirty);

    // mount hook + initial validity
    const api = { refresh, setDirty:(v)=>{isDirty=!!v;}, body:elBody, close };
    if (typeof config.onMount === 'function') config.onMount(api);
    refresh();

    // show (rAF so the transition runs)
    overlay.setAttribute('aria-hidden','false');
    document.body.classList.add('tv-scroll-lock');
    requestAnimationFrame(()=> overlay.classList.add('is-open'));

    // focus first field (or the close button)
    const first = elBody.querySelector(FOCUSABLE) || btnClose;
    setTimeout(()=> first.focus(), 60);

    bind();
  }

  function refresh(){
    const primary = elFoot.querySelector('[data-act="confirm"]');
    if (primary && typeof cfg.validate === 'function')
      primary.disabled = !cfg.validate(elBody);
  }
  function markDirty(){ isDirty = true; }

  function close({force=false} = {}){
    if (!force && isDirty && !confirm('Discard your changes?')) return;
    overlay.classList.remove('is-open');
    unbind();
    const done = () => {
      overlay.setAttribute('aria-hidden','true');
      document.body.classList.remove('tv-scroll-lock');
      elBody.removeEventListener('input', markDirty);
      elBody.innerHTML = ''; elFoot.innerHTML = '';
      if (lastTrigger && lastTrigger.focus) lastTrigger.focus();
      cfg = null; isDirty = false;
    };
    // wait for the transition, with a fallback for reduced-motion
    let ran = false; const once = () => { if (ran) return; ran = true; done(); };
    dialog.addEventListener('transitionend', once, { once:true });
    setTimeout(once, 260);
  }

  function onKeydown(e){
    if (e.key === 'Escape'){ e.preventDefault(); close(); return; }
    if (e.key === 'Tab'){ trapTab(e); }
  }
  function trapTab(e){
    const f = [...dialog.querySelectorAll(FOCUSABLE)].filter(el=>el.offsetParent!==null);
    if (!f.length) return;
    const first = f[0], last = f[f.length-1];
    if (e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
  }
  function onOverlayClick(e){ if (e.target === overlay) close(); }
  function onFootClick(e){
    const act = e.target.closest('[data-act]')?.dataset.act;
    if (act === 'cancel') close();
    else if (act === 'danger'){ cfg.onDanger?.(elBody, {close}); }
    else if (act === 'confirm'){ if (cfg.onConfirm?.(elBody, {close}) !== false) close({force:true}); }
  }

  function bind(){
    document.addEventListener('keydown', onKeydown);
    overlay.addEventListener('mousedown', onOverlayClick);
    elFoot.addEventListener('click', onFootClick);
    btnClose.addEventListener('click', ()=>close());
  }
  function unbind(){
    document.removeEventListener('keydown', onKeydown);
    overlay.removeEventListener('mousedown', onOverlayClick);
    elFoot.removeEventListener('click', onFootClick);
  }

  return { open, close };
})();
```

### 5.5 Calling it

```js
// e.g. clicking a graded criterion row
document.querySelectorAll('[data-open-grade]').forEach(row => {
  row.addEventListener('click', () => {
    TvModal.open({
      icon: 'sliders-horizontal',
      title: 'Criterion 3 · Risk assessment',
      marker: { kind:'ai', icon:'sparkles', label:'AI graded' },
      size: 'md',
      bodyHTML: `
        <div>
          <div class="tv-field-label">Cited from submission</div>
          <p class="tv-excerpt">…the counterparty's jurisdiction was not screened…</p>
        </div>
        <div>
          <div class="tv-field-label">Score</div>
          <input class="tv-input" id="score" type="number" min="0" max="10" value="8" style="width:96px">
          <span class="tv-diff" id="diff" style="margin-left:10px"></span>
        </div>
        <div class="tv-well tv-well--required">
          <div class="tv-field-label">Justification — required to save</div>
          <textarea class="tv-textarea" id="why" placeholder="Why are you changing this?"></textarea>
        </div>`,
      dangerLabel: 'Revert to AI',
      primaryLabel: 'Save adjustment',
      onMount(api){
        const score = api.body.querySelector('#score');
        const diff  = api.body.querySelector('#diff');
        const orig  = 8;
        const sync = () => {
          const v = +score.value;
          diff.innerHTML = v !== orig
            ? `<span class="was">${orig}</span><span class="arr">→</span><span class="now">${v}</span>` : '';
          api.refresh();
        };
        score.addEventListener('input', sync); sync();
      },
      // primary enabled only when the score changed AND a justification exists
      validate(body){
        return +body.querySelector('#score').value !== 8
            && body.querySelector('#why').value.trim().length > 0;
      },
      onConfirm(body){ /* persist… */ },
      onDanger(body, {close}){ /* revert… */ close(); }
    });
  });
});
```

---

## 6. Interaction & motion spec

| Behaviour | Spec |
|---|---|
| **Appear** | Overlay fades `opacity 0→1` over `--dur-base` (200ms) `--ease-std`. Card simultaneously `opacity 0→1` and `transform: translateY(8px) scale(.98) → none`. Triggered by adding `.is-open` on the next animation frame after the root is shown. |
| **Close** | Reverse of appear. `.is-open` removed; after `transitionend` (260ms fallback) the root is hidden (`aria-hidden=true`), scroll unlocked, body/footer cleared. |
| **Call-in** | Triggered from a row click or a `⋮` menu item. One overlay instance is reused; `TvModal.open(config)` injects the body. Never instantiate a second overlay. No stacking. |
| **ESC** | Closes (runs the dirty-guard first). |
| **Overlay click** | Click on the backdrop (not the card) closes (dirty-guard applies). Uses `mousedown` on the overlay with an `e.target === overlay` check so a drag that starts inside the card never closes it. |
| **Close button** | Top-right; closes (dirty-guard applies). |
| **Focus on open** | Moves to the first focusable field in the body, or the close button if none. |
| **Focus trap** | Tab / Shift-Tab cycle within the card only. |
| **Focus restore** | On close, focus returns to the triggering element (`document.activeElement` captured at open). |
| **Scroll lock** | `body.tv-scroll-lock { overflow:hidden }` while open; removed on close. |
| **Validity gating** | Primary button is `disabled` until `validate(body)` returns true. Body edits call `api.refresh()` (auto-wired via the `input` listener + explicit `sync()` in `onMount`). |
| **Dirty guard** | Any body `input` sets `isDirty`. ESC / overlay / cancel / close then `confirm('Discard your changes?')`. A successful `onConfirm` closes with `{force:true}` (no prompt). |
| **Reduced motion** | `prefers-reduced-motion: reduce` collapses transitions to ~1ms and drops the transform. |
| **Tall content** | Header and footer are fixed; only `.tv-modal__body` scrolls. Card capped at `max-height:88vh`. |
| **z-index** | Overlay at `1000`; sits above sidebar (240px) and top bar (56px). |

---

## 7. Accessibility checklist

- `role="dialog"`, `aria-modal="true"` on the card.
- `aria-labelledby` → the title; `aria-describedby` → the body.
- Root toggles `aria-hidden` (`true` closed, `false` open).
- Focus moves in on open, is trapped, and is restored to the trigger on close.
- ESC always closes.
- Close button has `aria-label="Close"`.
- All interactive elements show a visible focus ring (`--shadow-ring-primary`).
- Colour is never the only signal — markers pair an icon + word; the diff uses strike-through + colour.
- Contrast: body text `--fg-1/2` on `--surface-0` clears AA; disabled primary uses `--surface-500` on `--surface-300` (decorative, non-essential).

---

## 8. Body recipes

Each recipe is just the `bodyHTML` (+ footer labels + validate). Header/footer shells are identical.

**Grade adjust** — see §5.5.

**Flag** (`size:'sm'`, marker `flag`):
```html
<div><div class="tv-field-label">Flagged passage</div>
  <p class="tv-excerpt">"…figures appear copied verbatim from the brief…"</p></div>
<div><div class="tv-field-label">Reason</div>
  <select class="tv-select" id="reason">
    <option>Possible plagiarism</option><option>Off-topic</option>
    <option>Inappropriate content</option><option>Other</option></select></div>
<div><div class="tv-field-label">Note</div>
  <textarea class="tv-textarea" id="note" placeholder="Add context for the moderator…"></textarea></div>
```
`dangerLabel:'Dismiss'`, `primaryLabel:'Raise flag'`, `validate: body => body.querySelector('#note').value.trim().length>0`.

**Role change** (`size:'sm'`):
```html
<div><div class="tv-field-label">Member</div>
  <p class="tv-excerpt" style="border-color:var(--surface-300)">Jamie Mills · jamie@…</p></div>
<div><div class="tv-field-label">Role</div>
  <select class="tv-select" id="role"><option>Admin</option><option selected>Member</option><option>Viewer</option></select></div>
```
`primaryLabel:'Save role'`.

**Invite** (`size:'sm'`, no danger):
```html
<div><div class="tv-field-label">Email</div><input class="tv-input" id="email" type="email" placeholder="name@company.com"></div>
<div><div class="tv-field-label">Role</div>
  <select class="tv-select" id="role"><option>Member</option><option>Admin</option><option>Viewer</option></select></div>
<div><div class="tv-field-label">Message <span style="color:var(--fg-4);text-transform:none;letter-spacing:0">— optional</span></div>
  <textarea class="tv-textarea" id="msg" placeholder="Add a short note…"></textarea></div>
```
`primaryLabel:'Send invite'`, `validate: body => /\S+@\S+\.\S+/.test(body.querySelector('#email').value)`.

**Audit entry detail** (read-only — no primary, no danger):
```html
<div><div class="tv-field-label">Change</div>
  <p class="tv-diff"><span class="was">8</span><span class="arr">→</span><span class="now">6</span></p></div>
<div><div class="tv-field-label">Justification</div>
  <p class="tv-excerpt">Missed the screening step; can't credit unevidenced analysis.</p></div>
<div><div class="tv-field-label">Actor &amp; time</div>
  <p class="ds-body">J. Mills · <span class="ds-mono">14:22, 22 Jun 2026</span></p></div>
```
Open with only the close button (omit `primaryLabel`/`dangerLabel`).

---

## 9. Do / Don't

**Do**
- Reuse the one overlay instance for every card.
- Keep header + footer grammar identical; vary only the body.
- Put the status marker on the main-screen object *and* echo it in the card header.
- Gate the primary on `validate()`; require justification before any adjustment saves.
- Return focus to the trigger on close.

**Don't**
- Stack modals, or open a card from inside a card.
- Put deep editing or destructive actions inline on a list row.
- Use the horizontal ellipsis for menu triggers — it's the vertical `ellipsis-vertical`.
- Use emoji for markers/icons — use Lucide.
- Introduce raw hex; map to a token in `colors_and_type.css`.

---

## 10. Repo integration notes

- **Files:** add the CSS to a shared stylesheet (or a `<style>` block in the prototype) and the JS once per prototype page; drop the root markup before `</body>`.
- **Tokens:** all values above already reference `colors_and_type.css`. If a needed shade is missing, add it as a token there first — never inline a hex.
- **Icons:** Lucide via CDN; map names 1:1 to the FA-Pro icon used in production where possible.
- **Voice:** sentence case for titles and buttons; verbs lead CTAs ("Save adjustment", "Send invite"); errors are direct ("Could not save. Please try again."), never "Oops".
- **Change log:** after wiring the modal card into a prototype, append a one-line dated entry to `UI Change Logs/<Page>.md` (hard rule in `CLAUDE.md`).
- **Classification:** this is a **seed** — build it to standard; V2 inherits the same shell and grammar.
```
