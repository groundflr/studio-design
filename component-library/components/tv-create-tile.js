/* ============================================================
   <tv-create-tile>  —  Traverse component library
   A compact "create X" tile: entity icon, label, and a plus
   affordance. Used in empty-state / get-started hubs where an
   author launches a create flow. Clicking emits tv-action.

   Usage:
     <tv-create-tile icon="film" label="Simulation"></tv-create-tile>
     <tv-create-tile icon="flask-conical" label="Assessment" desc="Rubric"></tv-create-tile>
     <tv-create-tile featured accent="sky" icon="film" label="Simulation"
       desc="An interactive scenario …"></tv-create-tile>
     el.addEventListener('tv-action', () => openCreate('simulation'))

   Attributes:
     icon      leading Lucide icon name (the entity's icon)
     label     the entity name (the tile reads "Create <label>")
     desc      optional one-line hint under the label
     accent    family colour for the icon box: indigo|purple|sky|teal|green|orange|pink|red|yellow|grey
               (tinted box, mirrors tv-metric-tile). Omit for the neutral grey box.
     featured  flagship treatment: larger padding, bigger icon box, title at tv-h5,
               description always shown. For the hero create tile in a hub.
     disabled  non-interactive
   Events (bubble, composed): tv-action  detail: { label }
   Tokens: --cat-*, --surface-0/50/100/200/400/700/900, --primary-300/600, --radius-md/lg.
   ============================================================ */
(() => {
  if (customElements.get('tv-create-tile')) return

  const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const CAT = { indigo:'--cat-indigo', purple:'--cat-purple', sky:'--cat-sky', teal:'--cat-teal', green:'--cat-green', orange:'--cat-orange', pink:'--cat-pink', red:'--cat-red', yellow:'--cat-yellow', grey:'--cat-grey' }

  class TvCreateTile extends HTMLElement {
    static get observedAttributes() {
      return ['icon', 'label', 'desc', 'accent', 'featured', 'disabled']
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
      const icon = this.getAttribute('icon') || 'plus'
      const label = this.getAttribute('label') || ''
      const desc = this.getAttribute('desc') || ''
      const disabled = this.hasAttribute('disabled')
      const featured = this.hasAttribute('featured')
      const accentVar = CAT[this.getAttribute('accent')] || null
      const icoBg = accentVar ? `color-mix(in srgb, var(${accentVar}) 12%, #fff)` : 'var(--surface-100,#f1f5f9)'
      const icoFg = accentVar ? `var(${accentVar})` : 'var(--surface-700,#334155)'
      const lblClass = featured ? 'tv-h5' : 'tv-body-strong'

      this.shadowRoot.innerHTML = `
        <style>
          /* Compact tiles are vertical cards — the same pattern as tv-priority-actions
             (icon tile on top, label, description, corner affordance). They fill their
             grid cell so rows stretch full width. The featured/flagship variant is a
             wider horizontal hero. Corner affordance is a plus, since this creates. */
          :host{ display:block; height:100%; font-family:var(--tv-font,'Geist','Inter',system-ui,sans-serif); }
          button{ position:relative; display:flex; flex-direction:column; align-items:flex-start;
            gap:10px; width:100%; height:100%; text-align:left; box-sizing:border-box;
            padding:16px; background:var(--surface-0,#fff);
            border:1px solid var(--surface-200,#e2e8f0); border-radius:var(--radius-lg,12px);
            cursor:pointer; font-family:inherit;
            transition:border-color .12s, background .12s, box-shadow .12s; }
          button:hover{ border-color:var(--primary-300,#a5b4fc); background:var(--surface-50,#f8fafc); }
          button:focus-visible{ outline:none; border-color:var(--primary-600,#4f46e5);
            box-shadow:0 0 0 3px var(--primary-100,#e0e7ff); }
          button:disabled{ cursor:not-allowed; opacity:.55; }
          button:disabled:hover{ border-color:var(--surface-200,#e2e8f0); background:var(--surface-0,#fff); }
          .ico{ flex:0 0 auto; width:38px; height:38px; border-radius:var(--radius-md,10px);
            display:grid; place-items:center; font-size:19px; line-height:1;
            background:${icoBg}; color:${icoFg}; }
          .txt{ display:flex; flex-direction:column; gap:2px; min-width:0; }
          .lbl{ padding-right:20px; } /* room for the corner plus; type via .tv-body-strong / .tv-h5 */
          .desc{ color:var(--surface-500,#64748b); } /* size via .tv-body-sm */
          .desc:empty{ display:none; }
          .plus{ position:absolute; top:14px; right:14px; color:var(--surface-400,#94a3b8);
            font-size:16px; line-height:1; transition:color .12s, transform .12s; }
          button:hover .plus{ color:var(--primary-600,#4f46e5); transform:translateX(1px); }
          /* Featured / flagship — a wider horizontal hero, description always shown. */
          :host([featured]) button{ flex-direction:row; align-items:center; gap:16px; padding:18px 20px; }
          :host([featured]) .ico{ width:48px; height:48px; border-radius:var(--radius-lg,12px); font-size:24px; }
          :host([featured]) .txt{ flex:1 1 auto; }
        </style>
        <button type="button" ${disabled ? 'disabled' : ''} aria-label="Create ${esc(label)}">
          <span class="ico" aria-hidden="true"><i class="${window.__tvIcon ? window.__tvIcon(icon) : 'icon-' + icon}"></i></span>
          <span class="txt">
            <span class="lbl ${lblClass}">${esc(label)}</span>
            <span class="desc tv-body-sm">${esc(desc)}</span>
          </span>
          <span class="plus" aria-hidden="true"><i class="${window.__tvIcon ? window.__tvIcon('plus') : 'icon-plus'}"></i></span>
        </button>
      `
      if (window.__tvType) window.__tvType(this.shadowRoot)
      if (window.__tvIcons) window.__tvIcons(this.shadowRoot)

      const btn = this.shadowRoot.querySelector('button')
      if (btn) {
        btn.addEventListener('click', () => {
          if (this.hasAttribute('disabled')) return
          this.dispatchEvent(new CustomEvent('tv-action', { bubbles: true, composed: true, detail: { label: label } }))
        })
      }
    }
  }
  customElements.define('tv-create-tile', TvCreateTile)
})()
