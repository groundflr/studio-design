/* ============================================================
   <tv-excerpt>  —  Traverse component library
   Cited submission / evidence quote with a left accent border.
   Used in grade & flag cards, and for justification display.

   Usage:
     <tv-excerpt>…the jurisdiction was not screened…</tv-excerpt>
     <tv-excerpt label="Cited from submission">…quote…</tv-excerpt>
     <tv-excerpt accent="neutral">…member detail…</tv-excerpt>

   Attributes:
     label   optional uppercase overline above the quote
     accent  primary | neutral | teal   (left border colour; default primary)

   Tokens (with fallbacks): --primary-300, --surface-300, --bg-subtle,
     --fg-2, --fg-3, --radius-sm
   ============================================================ */
(() => {
  if (customElements.get('tv-excerpt')) return

  const ACCENT = {
    primary: 'var(--primary-300,#a5b4fc)',
    neutral: 'var(--surface-300,#cbd5e1)',
    teal: 'var(--teal-300,#4EA898)',
  }

  class TvExcerpt extends HTMLElement {
    static get observedAttributes() {
      return ['label', 'accent']
    }
    constructor() {
      super()
      this.attachShadow({ mode: 'open' })
    }
    connectedCallback() {
      this.render()
    }
    attributeChangedCallback() {
      if (this.shadowRoot) this.render()
    }
    render() {
      const label = this.getAttribute('label') || ''
      const accent = ACCENT[this.getAttribute('accent')] || ACCENT.primary
      this.shadowRoot.innerHTML = `
        <style>
          :host{ display:block; font-family:var(--tv-font,'Geist','Inter',system-ui,sans-serif); }
          .lbl{ font-weight:700; font-size:.625rem; text-transform:uppercase; letter-spacing:.05em;
            color:var(--fg-3,#64748b); margin-bottom:6px; }
          .lbl:empty{ display:none; }
          .ex{ font-size:.75rem; line-height:1.55; color:var(--fg-2,#334155);
            background:var(--bg-subtle,#f8fafc); border-left:2px solid ${accent};
            padding:9px 12px; border-radius:0 var(--radius-sm,6px) var(--radius-sm,6px) 0; }
        </style>
        ${label ? `<div class="lbl">${label}</div>` : ''}
        <div class="ex"><slot></slot></div>
      `
    }
  }
  customElements.define('tv-excerpt', TvExcerpt)
})()
