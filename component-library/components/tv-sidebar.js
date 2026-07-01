/* ============================================================
   <tv-sidebar>  —  Traverse component library
   The main side navigation. Composes the nav atoms into the full
   rail and owns the open ⇆ collapsed behaviour: it animates its
   width (240 ⇆ 64) and propagates the `collapsed` flag down to
   every slotted <tv-nav-*> so labels, headings and the wordmark
   hide together. Lifted from the dashboard `.sidebar`.

   Single source of truth: edit THIS file and every page updates.

   Usage:
     <tv-sidebar>
       <tv-nav-header slot="header"></tv-nav-header>
       <tv-nav-group heading="Settings">
         <tv-nav-item icon="building" label="Organisation" active></tv-nav-item>
         <tv-nav-item icon="layout-grid" label="Workspace"></tv-nav-item>
       </tv-nav-group>
       <tv-nav-user slot="footer" name="Sarah Chen"></tv-nav-user>
     </tv-sidebar>

   Attributes:
     collapsed  reflected — collapsed rail (64px, icons only)
     width      open width in px (default 240)

   Slots: header · (default = nav body) · footer
   Methods: toggle() · collapse() · expand()
   Events: tv-collapse (detail:{ collapsed })
   Tokens: --surface-50, --surface-200, --dur-base, --ease-std, --tv-font
   ============================================================ */
(() => {
  if (customElements.get('tv-sidebar')) return

  const KIDS = 'tv-nav-header,tv-nav-group,tv-nav-heading,tv-nav-item,tv-nav-user,tv-nav-workspace,tv-nav-back'

  class TvSidebar extends HTMLElement {
    static get observedAttributes() {
      return ['collapsed', 'width']
    }
    constructor() {
      super()
      this.attachShadow({ mode: 'open' })
    }
    connectedCallback() {
      this.render()
      this.shadowRoot.addEventListener('tv-toggle-collapse', this._onToggle)
      this._propagate()
    }
    attributeChangedCallback(name) {
      if (this.shadowRoot) this.render()
      if (name === 'collapsed') {
        this._propagate()
        this.dispatchEvent(new CustomEvent('tv-collapse', { bubbles: true, detail: { collapsed: this.hasAttribute('collapsed') } }))
      }
    }
    _onToggle = () => this.toggle()
    toggle() { this.toggleAttribute('collapsed') }
    collapse() { this.setAttribute('collapsed', '') }
    expand() { this.removeAttribute('collapsed') }

    // Mirror the collapsed flag onto every slotted nav atom (they live in
    // light DOM, so a flat querySelectorAll reaches them all).
    _propagate() {
      const on = this.hasAttribute('collapsed')
      this.querySelectorAll(KIDS).forEach((el) => {
        if (on) el.setAttribute('collapsed', '')
        else el.removeAttribute('collapsed')
      })
    }
    render() {
      const width = this.getAttribute('width') || '240'
      this.shadowRoot.innerHTML = `
        <style>
          :host{
            display:flex; flex-direction:column; gap:6px;
            width:${width}px; height:100%; box-sizing:border-box;
            padding:16px 12px;
            background:var(--surface-50,#f8fafc);
            border-right:1px solid var(--surface-200,#e2e8f0);
            font-family:var(--tv-font,'Geist','Inter',system-ui,sans-serif);
            transition:width var(--dur-base,150ms) var(--ease-std,cubic-bezier(.4,0,.2,1)),
                       padding var(--dur-base,150ms) var(--ease-std,cubic-bezier(.4,0,.2,1));
          }
          :host([collapsed]){ width:64px; padding:16px 8px; }
          .nav{ display:flex; flex-direction:column; gap:6px; margin-top:8px;
            flex:1 1 auto; min-height:0; overflow-y:auto; }
          .footer{ margin-top:auto; padding-top:8px; border-top:1px solid var(--surface-200,#e2e8f0); }
          :host([collapsed]) .footer{ padding-top:8px; }
        </style>
        <slot name="header"></slot>
        <div class="nav" part="nav"><slot></slot></div>
        <div class="footer" part="footer"><slot name="footer"></slot></div>
      `
    }
  }
  customElements.define('tv-sidebar', TvSidebar)
})()
