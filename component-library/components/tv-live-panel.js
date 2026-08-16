/* ============================================================
   <tv-live-panel>  —  Traverse component library
   The live-presence card from the System Admin summary rail:
   a pulsing green dot + title, the total session count at the
   top-right, and N divider-separated stat columns — each a
   figure, a label, and a supporting sub-line.

   Pairs with <tv-queue-panel> in the rail. Deliberately two
   components: presence and queues grow independently.

   Where <tv-presence-pill> is ONE inline pill for a page header,
   this is the panel form for a rail — use the pill in a header,
   this in a column.

   Usage:
     <tv-live-panel id="lp" live sessions="204 sessions"></tv-live-panel>
     customElements.whenDefined('tv-live-panel').then(() => {
       document.getElementById('lp').stats = [
         { value:'47',  label:'Users online',      sub:'63 active sessions' },
         { value:'128', label:'Candidates online', sub:'141 active sessions' },
       ]
     })

     <!-- empty / nobody online -->
     <tv-live-panel empty-text="Nobody is online right now."></tv-live-panel>

   Property:
     stats    Array<{ value, label, sub? }> — rendered as equal-width
              columns with a 1px divider between each. Two is the norm;
              the layout is not hardcoded to two.
   Attributes:
     heading     panel title (default "Live now")
     sessions    summary text at top-right, e.g. "204 sessions"
     live        boolean — shows the pulsing green presence dot.
     empty-text  shown instead of the columns when `stats` is empty.

   Type: .tv-eyebrow (heading) · .tv-h4 (figure) · .tv-caption (label)
   · .tv-body-sm (sub-line + summary). No type literals here.

   Tokens: --success-500, --surface-0/100/200/400, --border-subtle,
     --fg-1/2/3, --radius-lg, --tv-font.
   ============================================================ */
(() => {
  if (customElements.get('tv-live-panel')) return

  const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  class TvLivePanel extends HTMLElement {
    static get observedAttributes() { return ['heading', 'sessions', 'live', 'empty-text'] }
    constructor() {
      super()
      this.attachShadow({ mode: 'open' })
      this._stats = []
    }
    connectedCallback() {
      this._upgradeProperty('stats')
      this.render()
    }
    attributeChangedCallback() { if (this.shadowRoot) this.render() }
    _upgradeProperty(prop) {
      if (Object.prototype.hasOwnProperty.call(this, prop)) {
        const v = this[prop]; delete this[prop]; this[prop] = v
      }
    }
    get stats() { return this._stats }
    set stats(v) { this._stats = Array.isArray(v) ? v : []; if (this.shadowRoot) this.render() }

    _stat(s) {
      return `
        <div class="stat">
          <span class="stat-n tv-h4">${esc(s.value)}</span>
          <span class="stat-l tv-caption">${esc(s.label || '')}</span>
          ${s.sub ? `<span class="stat-s tv-body-sm">${esc(s.sub)}</span>` : ''}
        </div>`
    }

    render() {
      const heading = this.getAttribute('heading') || 'Live now'
      const live = this.hasAttribute('live')
      const sessions = this.getAttribute('sessions') || ''
      const emptyText = this.getAttribute('empty-text') || 'Nobody is online right now.'
      const empty = this._stats.length === 0

      const body = empty
        ? `<p class="empty tv-body-sm">${esc(emptyText)}</p>`
        : `<div class="stats">${this._stats.map((s, i) =>
            (i ? '<span class="div" aria-hidden="true"></span>' : '') + this._stat(s)).join('')}</div>`

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
            background:var(--success-500,#039855); animation:tv-live-pulse 1.8s ease-out infinite; }
          @keyframes tv-live-pulse{ 0%{ transform:scale(1); opacity:.5; } 100%{ transform:scale(3.4); opacity:0; } }
          @media (prefers-reduced-motion: reduce){ .dot::after{ animation:none; } }
          /* Empty state: static grey dot, no pulse. */
          :host([data-empty]) .dot{ background:var(--surface-400,#94a3b8); }
          :host([data-empty]) .dot::after{ display:none; }
          .summary{ color:var(--fg-3,#64748b); white-space:nowrap; flex-shrink:0; }
          .summary:empty{ display:none; }

          .stats{ display:flex; align-items:stretch; gap:28px; width:100%; }
          .stat{ display:flex; flex-direction:column; flex:1 1 0; min-width:0; }
          .div{ width:1px; align-self:stretch; background:var(--surface-100,#f1f5f9); flex-shrink:0; }
          .stat-n{ color:var(--fg-1,#0f172a); font-variant-numeric:tabular-nums; }
          .stat-l{ color:var(--fg-2,#334155); margin-top:8px; }
          .stat-s{ color:var(--fg-3,#64748b); margin-top:2px; }
          .empty{ color:var(--fg-3,#64748b); }
        </style>
        <div class="panel">
          <div class="head">
            <span class="head-l">
              ${live ? '<span class="dot" aria-hidden="true"></span>' : ''}
              <span class="tv-eyebrow">${esc(heading)}</span>
            </span>
            <span class="summary tv-body-sm">${esc(sessions)}</span>
          </div>
          ${body}
        </div>
      `
      if (empty) this.setAttribute('data-empty', '')
      else this.removeAttribute('data-empty')
      if (window.__tvType) window.__tvType(this.shadowRoot)
    }
  }
  customElements.define('tv-live-panel', TvLivePanel)
})()
