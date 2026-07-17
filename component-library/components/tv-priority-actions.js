/* ============================================================
   <tv-priority-actions>  —  Traverse component library
   A role-adaptive strip of the most-important actions, ordered
   by importance. The first action is rendered with primary
   emphasis (the single most-important thing this role does);
   the rest follow as supporting actions. Used at the top of a
   dashboard so each role leads with the right next step.

   Usage:
     <tv-priority-actions id="pa" heading="Your priorities"></tv-priority-actions>
     customElements.whenDefined('tv-priority-actions').then(() => {
       document.getElementById('pa').actions = [
         { icon:'settings', accent:'indigo', label:'Configure workspace',
           desc:'Grading model, branding and integrations.', value:'configure' },
         { icon:'users', accent:'teal', label:'Manage users',
           desc:'Invite people and assign roles.', value:'users' },
         …
       ]
     })
     pa.addEventListener('tv-action', e => route(e.detail.value))

   Property:
     actions  Array<{ icon, accent, label, desc?, value }>
              accent = --cat-* family (indigo|purple|sky|teal|green|orange|pink|red|yellow|grey)
   Attribute:
     heading  optional overline shown above the actions
   Events (bubble, composed): tv-action  detail: { value }
   Tokens: --cat-*, --primary-50/100/300/600, --surface-0/100/200/500/700, --radius-md/lg.
   ============================================================ */
(() => {
  if (customElements.get('tv-priority-actions')) return

  const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const CAT = { indigo:'--cat-indigo', purple:'--cat-purple', sky:'--cat-sky', teal:'--cat-teal', green:'--cat-green', orange:'--cat-orange', pink:'--cat-pink', red:'--cat-red', yellow:'--cat-yellow', grey:'--cat-grey' }

  class TvPriorityActions extends HTMLElement {
    static get observedAttributes() { return ['heading'] }
    constructor() {
      super()
      this.attachShadow({ mode: 'open' })
      this._actions = []
    }
    connectedCallback() {
      this._upgradeProperty('actions')
      this.render()
      if (!this._bound) {
        this._bound = true
        this.shadowRoot.addEventListener('click', (e) => {
          const t = e.target.closest && e.target.closest('[data-value]')
          if (!t) return
          this.dispatchEvent(new CustomEvent('tv-action', { bubbles: true, composed: true, detail: { value: t.getAttribute('data-value') } }))
        })
      }
    }
    attributeChangedCallback() { if (this.shadowRoot) this.render() }
    _upgradeProperty(prop) {
      if (Object.prototype.hasOwnProperty.call(this, prop)) {
        const v = this[prop]; delete this[prop]; this[prop] = v
      }
    }
    get actions() { return this._actions }
    set actions(v) { this._actions = Array.isArray(v) ? v : []; if (this.shadowRoot) this.render() }

    _card(a, primary) {
      const accentVar = CAT[a.accent] || '--cat-indigo'
      const icoBg = primary
        ? 'var(--primary-100,#e0e7ff)'
        : `color-mix(in srgb, var(${accentVar}) 12%, #fff)`
      const icoFg = primary ? 'var(--primary-600,#4f46e5)' : `var(${accentVar})`
      return `
        <button type="button" class="pa-card${primary ? ' is-primary' : ''}" data-value="${esc(a.value)}">
          <span class="ico" aria-hidden="true" style="background:${icoBg};color:${icoFg}">
            <i class="${window.__tvIcon ? window.__tvIcon(a.icon || 'circle') : 'icon-' + (a.icon || 'circle')}"></i>
          </span>
          <span class="lbl tv-body-strong">${esc(a.label || '')}</span>
          <span class="desc tv-body-sm">${esc(a.desc || '')}</span>
          <span class="go" aria-hidden="true"><i class="${window.__tvIcon ? window.__tvIcon('arrow-right') : 'icon-arrow-right'}"></i></span>
        </button>`
    }

    render() {
      const actions = this._actions
      const heading = this.getAttribute('heading') || ''
      this.shadowRoot.innerHTML = `
        <style>
          :host{ display:block; font-family:var(--tv-font,'Geist','Inter',system-ui,sans-serif); }
          :host([hidden]){ display:none; }
          .head{ margin-bottom:12px; } /* .tv-overline */
          .head:empty{ display:none; }
          .grid{ display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:12px; }
          .pa-card{ position:relative; display:flex; flex-direction:column; align-items:flex-start;
            gap:4px; text-align:left; padding:16px; cursor:pointer; font-family:inherit;
            background:var(--surface-0,#fff); border:1px solid var(--surface-200,#e2e8f0);
            border-radius:var(--radius-lg,12px); transition:border-color .12s, background .12s, box-shadow .12s; }
          .pa-card:hover{ border-color:var(--primary-300,#a5b4fc); }
          .pa-card:focus-visible{ outline:none; border-color:var(--primary-600,#4f46e5);
            box-shadow:0 0 0 3px var(--primary-100,#e0e7ff); }
          .pa-card.is-primary{ border-color:var(--primary-600,#4f46e5);
            box-shadow:inset 0 0 0 1px var(--primary-600,#4f46e5); }
          .ico{ width:38px; height:38px; border-radius:var(--radius-md,10px); display:grid;
            place-items:center; font-size:19px; line-height:1; margin-bottom:6px; }
          .lbl{ padding-right:20px; } /* room for the corner arrow */
          .desc{ color:var(--surface-500,#64748b); } /* size via .tv-body-sm */
          .desc:empty{ display:none; }
          .go{ position:absolute; top:16px; right:14px; color:var(--surface-400,#94a3b8);
            font-size:15px; line-height:1; transition:color .12s, transform .12s; }
          .pa-card:hover .go{ color:var(--primary-600,#4f46e5); transform:translateX(2px); }
        </style>
        <span class="head tv-overline">${esc(heading)}</span>
        <div class="grid">
          ${actions.map((a, i) => this._card(a, i === 0)).join('')}
        </div>
      `
      if (window.__tvType) window.__tvType(this.shadowRoot)
      if (window.__tvIcons) window.__tvIcons(this.shadowRoot)
    }
  }
  customElements.define('tv-priority-actions', TvPriorityActions)
})()
