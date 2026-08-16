/* ============================================================
   <tv-queue-panel>  —  Traverse component library
   The grading-queues card from the System Admin summary rail.
   One row per queue: a test-type icon + the test name, the queue
   total, a single determinate bar where the whole bar IS the
   queue (solid accent = in progress, the same accent at 22% =
   waiting), and a matching two-dot legend.

   Queues are named after the TEST being graded, and typed by that
   test's type — `type` sets the icon from one table whose seven
   entries mirror the test-list vocabulary in the test-journey
   prototype, so a test shows the same icon in both places. Colour
   is NOT type-derived: every bar uses one accent so the card reads
   as one system and the icon alone carries the type.

   Pairs with <tv-live-panel> in the rail. They are deliberately
   two components, not one: each card grows independently — more
   queues here doesn't crowd presence there.

   Scales to a long tail via `max` + `scroll` + an overflow line:
   render the busiest N, scroll within a capped height, and roll
   the remainder into "<n> more queues · <m> submissions →".

   Usage:
     <tv-queue-panel id="gq" live max="5" scroll sort="busiest"></tv-queue-panel>
     customElements.whenDefined('tv-queue-panel').then(() => {
       document.getElementById('gq').queues = [
         { label:'[Musango] UX Design Fundamentals', type:'document', inProgress:2, waiting:5 },
         { label:'Debugging and Enhancing a Web Application', type:'pencil', inProgress:1, waiting:4 },
         { label:'Fundamentals of Web Development', type:'list', inProgress:1, waiting:2 },
       ]
     })
     gq.addEventListener('tv-queue-select',   e => openTest(e.detail.value))
     gq.addEventListener('tv-queue-overflow', () => openGradingQueue())

   Property:
     queues   Array<{ label, type?, icon?, accent?, inProgress, waiting, value? }>
              type   = chat | email | document | pencil | list | people | video
                       (sets the icon)
              icon   = override the type's Lucide icon
              accent = override the colour: primary | any --cat-* family key
              Each row's total and bar fill are DERIVED: total =
              inProgress + waiting, fill = inProgress / total.
              Rows are only clickable when `value` is set.
   Attributes:
     heading         panel title (default "Grading queues")
     total           summary text top-right. Omit to derive "<n> submissions".
     live            boolean — pulsing green presence dot by the heading.
     max             render only the first N rows; the rest roll into the
                     overflow line. Omit to render every queue.
     sort            "busiest" sorts by total desc before capping. Default
                     keeps the given order — set this whenever you set `max`.
     scroll          boolean — cap the list height and scroll inside it.
     scroll-height   height cap for `scroll` (default "308px" — three whole
                     rows plus the name + bar of a fourth. Rows are a uniform
                     92px pitch, so N whole rows = N*92 - 18px).
     empty-text      shown when there are no queues.
   Rows with a `value` are actionable: an up-right arrow fades in beside the
   name on hover and the row emits tv-queue-select — route it to that test's
   summary page.

   Events (bubble, composed):
     tv-queue-select    detail: { value }  — a row with a value was clicked
     tv-queue-overflow  detail: { hidden, submissions } — overflow line clicked

   Type: .tv-eyebrow (heading) · .tv-label-sm (test name) · .tv-body-sm
   (totals + legend) · .tv-caption (summary). No type literals here.

   Tokens: --primary-400, --cat-*, --success-500, --surface-0/100/200/300/400,
     --border-subtle, --fg-1/2/3, --radius-lg/sm, --tv-font.
   ============================================================ */
(() => {
  if (customElements.get('tv-queue-panel')) return

  const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const num = (v) => {
    const n = parseInt(v, 10)
    return Number.isFinite(n) && n > 0 ? n : 0
  }

  // Canonical test-type -> Lucide icon map. The same seven pairs drive the
  // test list in prototypes/test-journey/index.html, so a test carries one
  // icon everywhere it appears. Colour is deliberately not part of this.
  const TYPE_ICON = {
    chat: 'message-circle', email: 'mail', document: 'file', pencil: 'pen-line',
    list: 'list', people: 'users', video: 'video',
  }
  // Accent overrides share the vocabulary used by <tv-quick-actions>.
  const CAT = {
    primary: '--primary-400', indigo: '--cat-indigo', purple: '--cat-purple', sky: '--cat-sky',
    teal: '--cat-teal', green: '--cat-green', orange: '--cat-orange', pink: '--cat-pink',
    red: '--cat-red', yellow: '--cat-yellow', grey: '--cat-grey',
  }
  const DEFAULT_ACCENT = '--primary-400'

  class TvQueuePanel extends HTMLElement {
    static get observedAttributes() {
      return ['heading', 'total', 'live', 'max', 'sort', 'scroll', 'scroll-height', 'empty-text']
    }
    constructor() {
      super()
      this.attachShadow({ mode: 'open' })
      this._queues = []
    }
    connectedCallback() {
      this._upgradeProperty('queues')
      this.render()
      if (!this._bound) {
        this._bound = true
        this.shadowRoot.addEventListener('click', (e) => {
          const more = e.target.closest && e.target.closest('[data-more]')
          if (more) {
            this.dispatchEvent(new CustomEvent('tv-queue-overflow', {
              bubbles: true, composed: true,
              detail: { hidden: this._hidden.length, submissions: this._hiddenSubs },
            }))
            return
          }
          const t = e.target.closest && e.target.closest('[data-value]')
          if (!t) return
          this.dispatchEvent(new CustomEvent('tv-queue-select', {
            bubbles: true, composed: true, detail: { value: t.getAttribute('data-value') },
          }))
        })
      }
    }
    attributeChangedCallback() { if (this.shadowRoot) this.render() }
    _upgradeProperty(prop) {
      if (Object.prototype.hasOwnProperty.call(this, prop)) {
        const v = this[prop]; delete this[prop]; this[prop] = v
      }
    }
    get queues() { return this._queues }
    set queues(v) { this._queues = Array.isArray(v) ? v : []; if (this.shadowRoot) this.render() }

    /** Colour for a row: an explicit per-row accent, else the shared default. */
    _accent(q) {
      return q.accent ? (CAT[q.accent] || DEFAULT_ACCENT) : DEFAULT_ACCENT
    }

    _row(q, last) {
      const accent = `var(${this._accent(q)})`
      const prog = num(q.inProgress)
      const wait = num(q.waiting)
      const total = prog + wait
      // The whole bar is the queue: solid = in progress, faint = waiting.
      const pct = total > 0 ? Math.round((prog / total) * 100) : 0
      const tag = q.value ? 'button' : 'div'
      const attrs = q.value ? ` type="button" data-value="${esc(q.value)}"` : ''
      const name = q.icon || TYPE_ICON[q.type] || 'file'
      const icon = window.__tvIcon ? window.__tvIcon(name) : 'icon-' + name
      const arrow = window.__tvIcon ? window.__tvIcon('arrow-up-right') : 'icon-arrow-up-right'
      return `
        <${tag} class="q${last ? '' : ' q--div'}${q.value ? ' q--act' : ''}"${attrs} style="--accent:${accent}">
          <span class="q-head">
            <span class="q-name">
              <i class="${icon} q-ico" aria-hidden="true"></i>
              <span class="q-label tv-label-sm" title="${esc(q.label || '')}">${esc(q.label || '')}</span>
              ${q.value ? `<i class="${arrow} q-go" aria-hidden="true"></i>` : ''}
            </span>
            <span class="q-total tv-body-sm">${total} total</span>
          </span>
          <span class="q-bar" role="img"
            aria-label="${prog} of ${total} in progress, ${wait} waiting">
            <span class="q-fill" style="width:${pct}%"></span>
            <span class="q-rest"></span>
          </span>
          <span class="q-legend">
            <span class="q-key"><span class="q-dot"></span><span class="tv-body-sm">${prog} in progress</span></span>
            <span class="q-key"><span class="q-dot q-dot--wait"></span><span class="tv-body-sm">${wait} waiting</span></span>
          </span>
        </${tag}>`
    }

    render() {
      const heading = this.getAttribute('heading') || 'Grading queues'
      const live = this.hasAttribute('live')
      const emptyText = this.getAttribute('empty-text') || 'No submissions waiting to be graded.'
      const scroll = this.hasAttribute('scroll')
      // Rows are a uniform 92px pitch (74px + 18px gap) because names truncate
      // to one line. 308px = three whole rows (258px) plus the name and the
      // full bar of the fourth — so the cut reads as "more below" and stops
      // short of slicing through the legend text.
      const scrollH = this.getAttribute('scroll-height') || '308px'

      const subs = (q) => num(q.inProgress) + num(q.waiting)
      let list = this._queues.slice()
      if (this.getAttribute('sort') === 'busiest') list.sort((a, b) => subs(b) - subs(a))

      const maxRaw = this.getAttribute('max')
      const max = maxRaw == null || maxRaw === '' ? 0 : num(maxRaw)
      const shown = max > 0 ? list.slice(0, max) : list
      this._hidden = max > 0 ? list.slice(max) : []
      this._hiddenSubs = this._hidden.reduce((n, q) => n + subs(q), 0)

      const derived = this._queues.reduce((n, q) => n + subs(q), 0)
      const totalRaw = this.getAttribute('total')
      const total = totalRaw != null && totalRaw !== '' ? totalRaw : `${derived} submission${derived === 1 ? '' : 's'}`

      const rows = shown.map((q, i) => this._row(q, i === shown.length - 1)).join('')
      const inner = `<div class="list">${rows}</div>`
      const body = this._queues.length === 0
        ? `<p class="empty tv-body-sm">${esc(emptyText)}</p>`
        : scroll
          ? `<tv-scroll-area max-height="${esc(scrollH)}" always>${inner}</tv-scroll-area>`
          : inner

      const n = this._hidden.length
      const more = n > 0
        ? `<button type="button" class="more tv-body-sm" data-more>
             ${n} more queue${n === 1 ? '' : 's'} &middot; ${this._hiddenSubs} submission${this._hiddenSubs === 1 ? '' : 's'} &rarr;
           </button>`
        : ''

      this.shadowRoot.innerHTML = `
        <style>
          :host{ display:block; font-family:var(--tv-font,'Geist','Inter',system-ui,sans-serif); }
          :host([hidden]){ display:none; }
          .panel{ box-sizing:border-box; display:flex; flex-direction:column; gap:18px;
            background:var(--surface-0,#fff); border:1px solid var(--border-subtle,#e2e8f0);
            border-radius:var(--radius-lg,12px); padding:18px 20px; }
          .head{ display:flex; align-items:center; justify-content:space-between; gap:10px; }
          .head-l{ display:flex; align-items:center; gap:8px; min-width:0; }
          /* Live presence dot — pulses, matching <tv-presence-pill>. */
          .dot{ position:relative; width:7px; height:7px; border-radius:50%; flex-shrink:0;
            background:var(--success-500,#039855); }
          .dot::after{ content:''; position:absolute; inset:0; border-radius:50%;
            background:var(--success-500,#039855); animation:tv-queue-pulse 1.8s ease-out infinite; }
          @keyframes tv-queue-pulse{ 0%{ transform:scale(1); opacity:.5; } 100%{ transform:scale(3.4); opacity:0; } }
          @media (prefers-reduced-motion: reduce){ .dot::after{ animation:none; } }
          .summary{ color:var(--fg-3,#64748b); white-space:nowrap; flex-shrink:0; }
          .empty{ color:var(--fg-3,#64748b); }

          .list{ display:flex; flex-direction:column; gap:18px; }
          /* Long tail: <tv-scroll-area> caps the height and draws a persistent
             tokenised scrollbar, so the rail stays a predictable size however
             many tests are being graded. */

          .q{ display:flex; flex-direction:column; width:100%; box-sizing:border-box; text-align:left;
            background:none; border:0; padding:0; font-family:inherit; color:inherit; }
          .q--div{ padding-bottom:16px; border-bottom:1px solid var(--surface-100,#f1f5f9); }
          .q--act{ cursor:pointer; }
          .q--act:focus-visible{ outline:2px solid var(--primary-600,#4f46e5); outline-offset:3px;
            border-radius:var(--radius-sm,6px); }
          .q-head{ display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:8px; }
          .q-name{ display:flex; align-items:center; gap:7px; min-width:0; color:var(--fg-1,#0f172a); }
          /* Scoped to the type icon only. A bare .q-name i also matched the
             hover arrow and beat its rule on specificity, forcing the arrow
             to the accent colour. */
          .q-name .q-ico{ font-size:14px; line-height:1; color:var(--accent); flex-shrink:0; }
          /* Test names are long and user-authored — never let one wrap the row. */
          .q-label{ overflow:hidden; text-overflow:ellipsis; white-space:nowrap; min-width:0; }
          /* Actionable rows: the Lucide arrow-up-right fades in beside the name
             and drifts right, signalling "this opens the test". It inherits the
             name's colour rather than taking an accent — motion carries the
             affordance, so the row never changes colour on hover. */
          .q-go{ font-size:13px; line-height:1; flex-shrink:0; color:inherit;
            opacity:0; transform:translateX(-3px);
            transition:opacity .12s ease, transform .12s ease; }
          .q--act:hover .q-go,
          .q--act:focus-visible .q-go{ opacity:1; transform:translateX(0); }
          @media (prefers-reduced-motion: reduce){
            .q-go{ transition:none; transform:none; }
          }
          .q-total{ color:var(--fg-3,#64748b); white-space:nowrap; flex-shrink:0; }

          /* One determinate bar per queue. Solid accent = in progress; the
             SAME accent at 22% = waiting. No animation — the pulsing dot in
             the header is the only "live" cue. */
          .q-bar{ display:flex; width:100%; height:6px; border-radius:999px; overflow:hidden; margin-bottom:7px; }
          .q-fill{ height:6px; background:var(--accent); flex-shrink:0; }
          .q-rest{ height:6px; flex:1; background:var(--accent); opacity:.22; }

          .q-legend{ display:flex; align-items:center; gap:14px; flex-wrap:wrap; }
          .q-key{ display:flex; align-items:center; gap:5px; color:var(--fg-2,#334155); }
          .q-dot{ width:6px; height:6px; border-radius:50%; background:var(--accent); flex-shrink:0; }
          /* Waiting swatch mirrors the bar remainder exactly — same accent, same 22%. */
          .q-dot--wait{ opacity:.22; }

          /* Overflow line — the rail is a summary; the long tail lives on the
             full grading surface this links to. */
          .more{ display:block; width:100%; text-align:left; padding:0; cursor:pointer;
            background:none; border:0; font-family:inherit; color:var(--primary-600,#4f46e5); }
          .more:hover{ text-decoration:underline; }
          .more:focus-visible{ outline:2px solid var(--primary-600,#4f46e5); outline-offset:3px;
            border-radius:var(--radius-sm,6px); }
        </style>
        <div class="panel">
          <div class="head">
            <span class="head-l">
              ${live ? '<span class="dot" aria-hidden="true"></span>' : ''}
              <span class="tv-eyebrow">${esc(heading)}</span>
            </span>
            <span class="summary tv-caption">${esc(total)}</span>
          </div>
          ${body}
          ${more}
        </div>
      `
      if (window.__tvType) window.__tvType(this.shadowRoot)
      if (window.__tvIcons) window.__tvIcons(this.shadowRoot)
    }
  }
  customElements.define('tv-queue-panel', TvQueuePanel)
})()
