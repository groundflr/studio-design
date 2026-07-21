/* ============================================================
   <tv-tab>  —  Traverse component library
   A single page tab. The underline-style tab used across the
   org / workspace / system-admin pages. Icon (optional) + label +
   optional count, with default / hover / active / disabled states.
   Lifted from the dashboard `.tab`.

   Usually composed inside <tv-tab-group>, which owns the active
   state — but works standalone too.

   Single source of truth: edit THIS file and every page updates.

   Usage:
     <tv-tab value="summary" icon="layout-dashboard" label="Summary" active></tv-tab>
     <tv-tab value="users" icon="users" label="Users" count="6"></tv-tab>

   Attributes:
     value      id echoed in the group's tv-change event
     label      text (or slotted text)
     icon       optional leading icon — any Lucide name (e.g. layout-dashboard, users, settings)
     count      optional trailing number
     active     boolean — current tab
     disabled   boolean

   Clicks bubble out natively.
   Icons: Lucide font via window.__tvIcons (any icon name works).
   Tokens: --primary-600, --surface-500/800, --surface-100/200, --tv-font
   ============================================================ */
(() => {
  if (customElements.get('tv-tab')) return

  class TvTab extends HTMLElement {
    static get observedAttributes() {
      return ['label', 'icon', 'count', 'active', 'disabled']
    }
    constructor() {
      super()
      this.attachShadow({ mode: 'open' })
    }
    connectedCallback() {
      this.render()
    }
    attributeChangedCallback(name) {
      if (!this.shadowRoot) return
      // `active` / `disabled` are purely visual (driven by :host([active]) /
      // :host([disabled]) CSS). Update them IN PLACE rather than rebuilding the
      // shadow tree — rebuilding destroyed the <button> the user was clicking
      // mid-gesture, which dropped the click and forced a second one to activate
      // the tab. Structural attributes (label/icon/count) still do a full render.
      if (name === 'active' || name === 'disabled') { this._syncState(); return }
      this.render()
    }
    _syncState() {
      const btn = this.shadowRoot.querySelector('button')
      if (!btn) { this.render(); return }
      const active = this.hasAttribute('active')
      btn.setAttribute('aria-selected', active ? 'true' : 'false')
      if (this.hasAttribute('disabled')) btn.setAttribute('disabled', '')
      else btn.removeAttribute('disabled')
      const label = this.shadowRoot.querySelector('.label')
      if (label) {
        label.classList.toggle('tv-label-strong', active)
        label.classList.toggle('tv-label', !active)
      }
    }
    render() {
      const label = this.getAttribute('label')
      const iconName = this.getAttribute('icon')
      const count = this.getAttribute('count')
      const disabled = this.hasAttribute('disabled')
      const icon = iconName ? `<span class="ic"><i class="${window.__tvIcon ? window.__tvIcon(iconName) : 'icon-' + iconName}"></i></span>` : ''
      const text = label != null ? label : '<slot></slot>'
      const chip = count != null && count !== '' ? `<span class="count tv-tag">${count}</span>` : ''
      const labelClass = this.hasAttribute('active') ? 'tv-label-strong' : 'tv-label'

      this.shadowRoot.innerHTML = `
        <style>
          :host{ display:inline-flex; }
          button{
            position:relative; display:inline-flex; align-items:center; gap:8px;
            padding:10px 2px 14px; border:none; background:none; cursor:pointer;
            font-family:var(--tv-font,'Geist','Inter',system-ui,sans-serif);
            color:var(--surface-500,#64748b); /* default colour — label/count inherit; type via roles */
            transition:color var(--dur-quick,120ms) var(--ease-std,ease);
          }
          button:hover{ color:var(--surface-800,#1e293b); }
          .ic{ display:inline-flex; align-items:center; font-size:15px; line-height:1; }
          :host .label{ color:inherit; } /* follow button colour: default / hover / active / disabled */
          .count{ min-width:18px; height:18px; padding:0 6px; display:inline-flex;
            align-items:center; justify-content:center; border-radius:var(--radius-full,9999px);
            background:var(--surface-100,#f1f5f9); } /* layout only — type via .tv-tag */
          :host .count{ color:var(--surface-500,#64748b); }

          :host([active]) button{ color:var(--primary-600,#4f46e5); } /* active weight via .tv-label-strong */
          :host([active]) button::after{
            content:""; position:absolute; left:0; right:0; bottom:-1px; height:2px;
            background:var(--primary-600,#4f46e5); border-radius:2px 2px 0 0;
          }
          :host([active]) .count{ background:var(--primary-100,#e0e7ff); color:var(--primary-700,#4338ca); }

          :host([disabled]) button{ color:var(--surface-300,#cbd5e1); cursor:not-allowed; }
          :host([disabled]) button:hover{ color:var(--surface-300,#cbd5e1); }
        </style>
        <button part="tab" role="tab" aria-selected="${this.hasAttribute('active')}"${disabled ? ' disabled' : ''}>
          ${icon}<span class="label ${labelClass}">${text}</span>${chip}
        </button>
      `
      if (window.__tvType) window.__tvType(this.shadowRoot)
      if (window.__tvIcons) window.__tvIcons(this.shadowRoot)
    }
  }
  customElements.define('tv-tab', TvTab)
})()
