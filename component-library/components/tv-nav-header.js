/* ============================================================
   <tv-nav-header>  —  Traverse component library
   The side-nav brand header: the Traverse Studio wordmark plus the
   collapse toggle. Lifted from the dashboard `.sb-brand`. In the
   collapsed rail the wordmark is hidden and the toggle centres.

   Single source of truth: edit THIS file and every page updates.

   Usage:
     <tv-nav-header></tv-nav-header>
     <tv-nav-header collapsed></tv-nav-header>

   Attributes:
     logo-src   wordmark image (default /public/logo/studio_full_light.svg)
     collapsed  boolean — hide wordmark, centre + flip the toggle

   Events: tv-toggle-collapse  (fired when the toggle is clicked)
   Tokens: --surface-100/500/700, --radius-md, --tv-font
   ============================================================ */
(() => {
  if (customElements.get('tv-nav-header')) return

  class TvNavHeader extends HTMLElement {
    static get observedAttributes() {
      return ['logo-src', 'collapsed']
    }
    constructor() {
      super()
      this.attachShadow({ mode: 'open' })
    }
    connectedCallback() {
      this.render()
      this.shadowRoot.addEventListener('click', this._onClick)
    }
    attributeChangedCallback() {
      if (this.shadowRoot) this.render()
    }
    _onClick = (e) => {
      if (e.target.closest && e.target.closest('.collapse')) {
        this.dispatchEvent(new CustomEvent('tv-toggle-collapse', { bubbles: true, composed: true }))
      }
    }
    render() {
      const logo = this.getAttribute('logo-src') || '/public/logo/studio_full_light.svg'
      const collapsed = this.hasAttribute('collapsed')
      this.shadowRoot.innerHTML = `
        <style>
          :host{ display:block; }
          .brand{
            display:flex; align-items:center; justify-content:space-between;
            gap:8px; padding:4px 6px 8px;
          }
          .wordmark{ height:28px; display:block; }
          .collapse{
            width:28px; height:28px; flex-shrink:0; border:none; background:transparent;
            border-radius:var(--radius-md,8px); cursor:pointer;
            display:inline-flex; align-items:center; justify-content:center;
            color:var(--surface-500,#64748b);
            transition:background var(--dur-quick,120ms) var(--ease-std,ease),
                       color var(--dur-quick,120ms) var(--ease-std,ease);
          }
          .collapse:hover{ background:var(--surface-100,#f1f5f9); color:var(--surface-700,#334155); }
          .collapse{ font-size:16px; line-height:1; }

          :host([collapsed]) .brand{ justify-content:center; padding:4px 0 8px; }
          :host([collapsed]) .wordmark{ display:none; }
        </style>
        <div class="brand" part="brand">
          <img class="wordmark" src="${logo}" alt="Traverse Studio">
          <button class="collapse" part="collapse" aria-label="${collapsed ? 'Expand sidebar' : 'Collapse sidebar'}" aria-pressed="${collapsed}">
            <i class="icon-panel-left-${collapsed ? 'open' : 'close'}"></i>
          </button>
        </div>
      `
      if (window.__tvIcons) window.__tvIcons(this.shadowRoot)
    }
  }
  customElements.define('tv-nav-header', TvNavHeader)
})()
