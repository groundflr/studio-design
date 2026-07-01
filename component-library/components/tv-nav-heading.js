/* ============================================================
   <tv-nav-heading>  —  Traverse component library
   The side-nav group heading (eyebrow) atom. The small uppercase
   section label above a group of menu links. Lifted from the
   dashboard `.sb-eyebrow`. Hides itself when collapsed.

   Single source of truth: edit THIS file and every page updates.

   Usage:
     <tv-nav-heading label="Settings"></tv-nav-heading>
     <tv-nav-heading collapsed label="Settings"></tv-nav-heading>

   Attributes:
     label      text (otherwise the slotted text is used)
     collapsed  boolean — hidden entirely in the collapsed rail

   Tokens: --surface-400, --tv-font
   ============================================================ */
(() => {
  if (customElements.get('tv-nav-heading')) return

  class TvNavHeading extends HTMLElement {
    static get observedAttributes() {
      return ['label', 'collapsed']
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
      const label = this.getAttribute('label')
      const text = label != null ? label : '<slot></slot>'
      this.shadowRoot.innerHTML = `
        <style>
          :host{ display:block; }
          :host([collapsed]){ display:none; }
          .eyebrow{ padding:14px 8px 6px; } /* layout only — type via .tv-eyebrow */
        </style>
        <div class="eyebrow tv-eyebrow" part="eyebrow">${text}</div>
      `
      if (window.__tvType) window.__tvType(this.shadowRoot)
    }
  }
  customElements.define('tv-nav-heading', TvNavHeading)
})()
