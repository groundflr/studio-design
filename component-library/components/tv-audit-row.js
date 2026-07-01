/* ============================================================
   <tv-audit-row>  —  Traverse component library  (composed)
   A flat audit-trail entry: type marker · summary (+ optional diff)
   · actor · mono timestamp. Clickable — emits `tv-open` so the row
   opens the modal card for the full before/after. The flat list is
   the default audit view; the timeline graph is an opt-in density view.

   Composes <tv-status-tag> (marker) + <tv-diff> (inline change).

   Usage:
     <tv-audit-row kind="adjusted" summary="Criterion 3 · Risk assessment"
        from="8" to="6" actor="J. Mills" time="14:22"></tv-audit-row>

     row.addEventListener('tv-open', (e) => detailCard.open())

   Attributes:
     kind      ai | adjusted | flag | auto | neutral   (marker; default neutral)
     label     marker text (optional — defaults per kind)
     summary   what changed, e.g. "Criterion 3 · Risk assessment"
     from/to/unit   optional inline diff (renders <tv-diff>)
     actor     who made the change
     time      timestamp (rendered in mono)
     selected  highlighted / active state

   Events (bubble, composed): tv-open  (detail: { kind, summary, actor, time })
   Tokens (with fallbacks): --surface-0, --border-subtle, --surface-300,
     --bg-subtle, --accent-tint, --border-focus, --fg-1, --fg-3,
     --font-mono, --tv-font, --shadow-ring-primary
   ============================================================ */
(() => {
  if (customElements.get('tv-audit-row')) return

  const escText = (s) => (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const escAttr = (s) => escText(s).replace(/"/g, '&quot;')

  class TvAuditRow extends HTMLElement {
    static get observedAttributes() {
      return ['kind', 'label', 'summary', 'from', 'to', 'unit', 'actor', 'time', 'selected']
    }
    constructor() {
      super()
      this.attachShadow({ mode: 'open' })
      this._activate = this._activate.bind(this)
    }
    connectedCallback() {
      this.render()
    }
    attributeChangedCallback() {
      if (this.shadowRoot) this.render()
    }
    _activate() {
      this.dispatchEvent(
        new CustomEvent('tv-open', {
          bubbles: true,
          composed: true,
          detail: {
            kind: this.getAttribute('kind'),
            summary: this.getAttribute('summary'),
            actor: this.getAttribute('actor'),
            time: this.getAttribute('time'),
          },
        }),
      )
    }
    render() {
      const kind = this.getAttribute('kind') || 'neutral'
      const label = this.getAttribute('label')
      const summary = this.getAttribute('summary') || ''
      const from = this.getAttribute('from')
      const to = this.getAttribute('to')
      const unit = this.getAttribute('unit') || ''
      const actor = this.getAttribute('actor') || ''
      const time = this.getAttribute('time') || ''
      const selected = this.hasAttribute('selected')

      const marker = `<tv-status-tag kind="${escAttr(kind)}"${label != null ? ` label="${escAttr(label)}"` : ''}></tv-status-tag>`
      const diff =
        from != null || to != null
          ? `<tv-diff${from != null ? ` from="${escAttr(from)}"` : ''}${to != null ? ` to="${escAttr(to)}"` : ''}${unit ? ` unit="${escAttr(unit)}"` : ''}></tv-diff>`
          : ''
      const aria = escAttr([label || kind, summary, actor, time].filter(Boolean).join(' · '))

      this.shadowRoot.innerHTML = `
        <style>
          :host{ display:block; font-family:var(--tv-font,'Geist','Inter',system-ui,sans-serif); }
          .row{ display:flex; align-items:center; gap:11px; width:100%; text-align:left;
            font-family:inherit; background:var(--surface-0,#fff);
            border:1px solid var(--border-subtle,#e2e8f0); border-radius:var(--radius-md,8px);
            padding:10px 13px; cursor:pointer;
            transition:background .1s, border-color .1s, box-shadow .1s; }
          .row:hover{ background:var(--bg-subtle,#f8fafc); border-color:var(--surface-300,#cbd5e1); }
          .row:focus-visible{ outline:none; box-shadow:var(--shadow-ring-primary,0 0 0 3px rgba(99,102,241,.3)); }
          .row.is-selected{ background:var(--accent-tint,#e0e7ff); border-color:var(--border-focus,#818cf8); }
          .marker{ flex:0 0 auto; display:inline-flex; }
          .body{ flex:1 1 auto; min-width:0; display:flex; align-items:center; gap:9px; }
          .summary{ white-space:nowrap; overflow:hidden; text-overflow:ellipsis; } /* type via .tv-body-strong */
          .meta{ flex:0 0 auto; display:inline-flex; align-items:center; gap:6px; } /* type via .tv-caption */
          .sep{ opacity:.5; }
          .time{ font-family:var(--font-mono,ui-monospace,Menlo,monospace); font-variant-numeric:tabular-nums; }
        </style>
        <button class="row ${selected ? 'is-selected' : ''}" part="row" aria-label="${aria}">
          <span class="marker">${marker}</span>
          <span class="body"><span class="summary tv-body-strong">${escText(summary)}</span>${diff}</span>
          <span class="meta tv-caption">${actor ? `<span class="actor">${escText(actor)}</span><span class="sep">·</span>` : ''}<span class="time">${escText(time)}</span></span>
        </button>
      `
      if (window.__tvType) window.__tvType(this.shadowRoot)
      this.shadowRoot.querySelector('.row').addEventListener('click', this._activate)
    }
  }
  customElements.define('tv-audit-row', TvAuditRow)
})()
