/* ============================================================
   <tv-launch-tile>  —  Traverse component library
   A launchpad tile: an accent icon, a title, a supporting line, and
   a trailing arrow — the whole tile is the action. Used to build the
   dashboard "launchpad" grids: core actions for a role and entry
   points into core platform areas. Elevation + optional accent tint
   give the grid layers and colour (rather than flat white cards).

   Usage:
     <tv-launch-tile icon="layout-grid" accent="sky" tint meta="1 workspace"
       title="Workspaces" desc="Spaces for teams to work in." value="workspaces"></tv-launch-tile>
     <tv-launch-tile featured icon="settings" accent="indigo"
       title="Set up your organisation" desc="Branding, authentication and billing."
       value="setup"></tv-launch-tile>
     el.addEventListener('tv-action', e => route(e.detail.value))

   Attributes:
     icon      leading Lucide icon
     accent    --cat-* family (indigo|purple|sky|teal|green|orange|pink|red|yellow|grey)
     title     tile title
     desc      one-line supporting text
     meta      small trailing/footer label (e.g. a count or "Coming soon")
     value     identifier returned in tv-action
     featured  larger, more elevated (for primary core actions)
     tint      accent-washed background + accent border (for colourful area tiles)
     disabled  non-interactive
   Events (bubble, composed): tv-action  detail: { value }
   Tokens: --cat-*, --primary-300/600, --surface-0/100/200/500/700/900,
           --radius-md/lg, --shadow-xs/sm/md.
   ============================================================ */
(() => {
  if (customElements.get('tv-launch-tile')) return

  const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const CAT = { indigo:'--cat-indigo', purple:'--cat-purple', sky:'--cat-sky', teal:'--cat-teal', green:'--cat-green', orange:'--cat-orange', pink:'--cat-pink', red:'--cat-red', yellow:'--cat-yellow', grey:'--cat-grey' }

  class TvLaunchTile extends HTMLElement {
    static get observedAttributes() {
      return ['icon', 'accent', 'title', 'desc', 'meta', 'value', 'featured', 'tint', 'disabled']
    }
    constructor() {
      super()
      this.attachShadow({ mode: 'open' })
    }
    connectedCallback() {
      this.render()
      if (!this._bound) {
        this._bound = true
        this.shadowRoot.addEventListener('click', () => {
          if (this.hasAttribute('disabled')) return
          this.dispatchEvent(new CustomEvent('tv-action', { bubbles: true, composed: true, detail: { value: this.getAttribute('value') || '' } }))
        })
      }
    }
    attributeChangedCallback() { if (this.shadowRoot) this.render() }

    render() {
      const icon = this.getAttribute('icon') || 'circle'
      const accentVar = CAT[this.getAttribute('accent')] || '--cat-indigo'
      const title = this.getAttribute('title') || ''
      const desc = this.getAttribute('desc') || ''
      const meta = this.getAttribute('meta') || ''
      const featured = this.hasAttribute('featured')
      const disabled = this.hasAttribute('disabled')

      this.shadowRoot.innerHTML = `
        <style>
          :host{ display:block; height:100%; font-family:var(--tv-font,'Geist','Inter',system-ui,sans-serif); }
          button{ position:relative; display:flex; flex-direction:column; align-items:flex-start;
            gap:10px; width:100%; height:100%; box-sizing:border-box; text-align:left; cursor:pointer;
            font-family:inherit; padding:18px;
            background:var(--surface-0,#fff); border:1px solid var(--surface-200,#e2e8f0);
            border-radius:var(--radius-lg,12px); box-shadow:var(--shadow-xs,0 1px 2px rgb(0 0 0/.05));
            transition:box-shadow .14s ease, transform .14s ease, border-color .14s ease; }
          button:hover{ box-shadow:var(--shadow-md,0 4px 6px -1px rgb(0 0 0/.1)); transform:translateY(-2px);
            border-color:var(--primary-300,#a5b4fc); }
          button:focus-visible{ outline:none; border-color:var(--primary-600,#4f46e5);
            box-shadow:0 0 0 3px var(--primary-100,#e0e7ff); }
          button:disabled{ cursor:not-allowed; opacity:.6; }
          button:disabled:hover{ box-shadow:var(--shadow-xs,0 1px 2px rgb(0 0 0/.05)); transform:none; border-color:var(--surface-200,#e2e8f0); }
          /* accent tint variant — a wash of the family colour for a colourful area tile */
          :host([tint]) button{ background:color-mix(in srgb, var(${accentVar}) 7%, #fff);
            border-color:color-mix(in srgb, var(${accentVar}) 22%, #fff); }
          /* featured — larger + more elevated for primary core actions */
          :host([featured]) button{ padding:20px; box-shadow:var(--shadow-sm,0 1px 3px rgb(0 0 0/.1)); }
          .ico{ width:38px; height:38px; border-radius:var(--radius-md,10px); display:grid; place-items:center;
            font-size:19px; line-height:1; margin-bottom:2px;
            background:color-mix(in srgb, var(${accentVar}) 16%, #fff); color:var(${accentVar}); }
          :host([featured]) .ico{ width:44px; height:44px; font-size:22px; }
          .title{ padding-right:22px; } /* room for the arrow; type via .tv-body-strong / .tv-h5 */
          .desc{ color:var(--surface-500,#64748b); } /* .tv-body-sm */
          .desc:empty{ display:none; }
          .meta{ margin-top:auto; padding-top:4px; color:var(${accentVar});
            font-weight:600; } /* .tv-body-sm; accent-coloured footer label */
          .meta:empty{ display:none; }
          .arrow{ position:absolute; top:18px; right:16px; color:var(--surface-400,#94a3b8);
            font-size:16px; line-height:1; transition:color .14s, transform .14s; }
          button:hover .arrow{ color:var(${accentVar}); transform:translateX(2px); }
        </style>
        <button type="button" ${disabled ? 'disabled' : ''} aria-label="${esc(title)}">
          <span class="ico" aria-hidden="true"><i class="${window.__tvIcon ? window.__tvIcon(icon) : 'icon-' + icon}"></i></span>
          <span class="title ${featured ? 'tv-h5' : 'tv-body-strong'}">${esc(title)}</span>
          <span class="desc tv-body-sm">${esc(desc)}</span>
          <span class="meta tv-body-sm">${esc(meta)}</span>
          <span class="arrow" aria-hidden="true"><i class="${window.__tvIcon ? window.__tvIcon('arrow-right') : 'icon-arrow-right'}"></i></span>
        </button>
      `
      if (window.__tvType) window.__tvType(this.shadowRoot)
      if (window.__tvIcons) window.__tvIcons(this.shadowRoot)
    }
  }
  customElements.define('tv-launch-tile', TvLaunchTile)
})()
