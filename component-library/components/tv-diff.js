/* ============================================================
   <tv-diff>  —  Traverse component library
   Before -> after value pair (e.g. 8 -> 6) for grade changes,
   adjustments, and audit entries.

   Usage:
     <tv-diff from="8" to="6"></tv-diff>
     <tv-diff from="8" to="6" unit="/10"></tv-diff>
     <tv-diff to="6"></tv-diff>            <!-- single value, no change -->

   Attributes:
     from  the previous value (optional — omit for a single value)
     to    the new value
     unit  small suffix on each value (optional, e.g. "/10", "%")

   Tokens (with fallbacks): --fg-4, --fg-2, --primary-700
   ============================================================ */
(() => {
  if (customElements.get('tv-diff')) return

  class TvDiff extends HTMLElement {
    static get observedAttributes() {
      return ['from', 'to', 'unit']
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
      const from = this.getAttribute('from')
      const to = this.getAttribute('to')
      const unit = this.getAttribute('unit') || ''
      const u = unit ? `<span class="u">${unit}</span>` : ''
      const changed = from != null && to != null && from !== to

      this.shadowRoot.innerHTML = `
        <style>
          :host{ display:inline-flex; vertical-align:middle; }
          .d{ display:inline-flex; align-items:center; gap:7px;
            font-family:var(--tv-font,'Geist','Inter',system-ui,sans-serif);
            font-weight:600; font-size:.75rem; line-height:1; }
          .was{ color:var(--fg-4,#94a3b8); text-decoration:line-through; }
          .arr{ color:var(--fg-4,#94a3b8); }
          .now{ color:var(--primary-700,#4338ca); }
          .single{ color:var(--fg-2,#334155); }
          .u{ font-weight:500; opacity:.7; margin-left:1px; }
        </style>
        ${
          changed
            ? `<span class="d"><span class="was">${from}${u}</span><span class="arr">&rarr;</span><span class="now">${to}${u}</span></span>`
            : `<span class="d"><span class="single">${to ?? from ?? ''}${u}</span></span>`
        }
      `
    }
  }
  customElements.define('tv-diff', TvDiff)
})()
