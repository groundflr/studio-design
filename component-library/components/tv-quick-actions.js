/* ============================================================
   <tv-quick-actions>  —  Traverse component library
   A persistent right-rail panel of the most-important actions
   for the current role. Sits in the same 325px sticky rail as
   <tv-peek-rail>: a titled panel of full-width action cards,
   each with an accent icon, label, optional description, and an
   up-right (↗) arrow in the top-right corner. Always visible so
   the role's key actions are immediately findable and one click
   to fire.

   Usage:
     <tv-quick-actions id="qa" heading="Quick actions"></tv-quick-actions>
     customElements.whenDefined('tv-quick-actions').then(() => {
       document.getElementById('qa').actions = [
         { icon:'file-text', accent:'indigo', label:'Review feedback',
           desc:'11 candidates waiting for approval.', value:'review-feedback' },
         { icon:'user-plus', accent:'teal', label:'Invite users', value:'invite' },
       ]
     })
     qa.addEventListener('tv-action', e => route(e.detail.value))

   Property:
     actions  Array<{ icon, accent, label, desc?, value }>
              accent = --cat-* family (indigo|purple|sky|teal|green|orange|pink|red|yellow|grey)
   Attribute:
     heading  panel title (default "Quick actions")
   Events (bubble, composed): tv-action  detail: { value }
   Tokens: --cat-*, --primary-100/300/600, --surface-0/50/100/200/400/500/700/900,
     --radius-md/lg, --shadow-sm, --tv-font.
   ============================================================ */
(() => {
  if (customElements.get('tv-quick-actions')) return

  const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const CAT = { indigo: '--cat-indigo', purple: '--cat-purple', sky: '--cat-sky', teal: '--cat-teal', green: '--cat-green', orange: '--cat-orange', pink: '--cat-pink', red: '--cat-red', yellow: '--cat-yellow', grey: '--cat-grey' }

  class TvQuickActions extends HTMLElement {
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

    _card(a) {
      const accentVar = CAT[a.accent] || '--cat-indigo'
      const icoBg = `color-mix(in srgb, var(${accentVar}) 12%, #fff)`
      return `
        <button type="button" class="qa-card" data-value="${esc(a.value)}">
          <span class="qa-ico" aria-hidden="true" style="background:${icoBg};color:var(${accentVar})">
            <i class="${window.__tvIcon ? window.__tvIcon(a.icon || 'circle') : 'icon-' + (a.icon || 'circle')}"></i>
          </span>
          <span class="qa-text">
            <span class="qa-lbl tv-body-strong">${esc(a.label || '')}</span>
            <span class="qa-desc tv-body-sm">${esc(a.desc || '')}</span>
          </span>
          <span class="qa-arrow" aria-hidden="true"><i class="${window.__tvIcon ? window.__tvIcon('arrow-up-right') : 'icon-arrow-up-right'}"></i></span>
        </button>`
    }

    render() {
      const heading = this.getAttribute('heading') || 'Quick actions'
      this.shadowRoot.innerHTML = `
        <style>
          :host{ display:block; font-family:var(--tv-font,'Geist','Inter',system-ui,sans-serif); }
          :host([hidden]){ display:none; }
          .panel{ background:var(--surface-0,#fff); border:1px solid var(--surface-200,#e2e8f0);
            border-radius:var(--radius-lg,12px); box-shadow:var(--shadow-sm,0 1px 2px rgba(15,23,42,.06));
            padding:16px; }
          .head{ font:600 11px/1 var(--tv-font,'Geist','Inter',system-ui,sans-serif);
            letter-spacing:.06em; text-transform:uppercase; color:var(--surface-500,#64748b);
            margin:2px 2px 12px; }
          .list{ display:flex; flex-direction:column; gap:10px; }
          .qa-card{ position:relative; display:grid; grid-template-columns:38px 1fr; align-items:center;
            gap:12px; width:100%; text-align:left; padding:14px 16px; cursor:pointer; font-family:inherit;
            background:var(--surface-0,#fff); border:1px solid var(--surface-200,#e2e8f0);
            border-radius:var(--radius-md,10px); transition:border-color .12s, background .12s, box-shadow .12s; }
          .qa-card:hover{ border-color:var(--primary-300,#a5b4fc); background:var(--surface-50,#f8fafc); }
          .qa-card:focus-visible{ outline:none; border-color:var(--primary-600,#4f46e5);
            box-shadow:0 0 0 3px var(--primary-100,#e0e7ff); }
          .qa-ico{ width:38px; height:38px; border-radius:var(--radius-md,10px); display:grid;
            place-items:center; font-size:18px; line-height:1; }
          .qa-text{ min-width:0; display:flex; flex-direction:column; gap:2px; padding-right:18px; }
          .qa-lbl{ color:var(--surface-900,#0f172a); } /* weight via .tv-body-strong */
          .qa-desc{ color:var(--surface-500,#64748b); } /* size via .tv-body-sm */
          .qa-desc:empty{ display:none; }
          .qa-arrow{ position:absolute; top:12px; right:12px; color:var(--surface-400,#94a3b8);
            font-size:15px; line-height:1; transition:color .12s, transform .12s; }
          .qa-card:hover .qa-arrow{ color:var(--primary-600,#4f46e5); transform:translate(2px,-2px); }
        </style>
        <div class="panel">
          <div class="head">${esc(heading)}</div>
          <div class="list">
            ${this._actions.map((a) => this._card(a)).join('')}
          </div>
        </div>
      `
      if (window.__tvType) window.__tvType(this.shadowRoot)
      if (window.__tvIcons) window.__tvIcons(this.shadowRoot)
    }
  }
  customElements.define('tv-quick-actions', TvQuickActions)
})()
