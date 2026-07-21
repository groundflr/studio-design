/* ============================================================
   <tv-resource-rail>  —  Traverse component library
   A slim right-hand rail that lists resources or helpful tips as
   tappable rows (icon · title · optional one-liner · chevron).
   Sits beside a working area to offer guidance without taking the
   reader out of the flow. Optionally shows a heading and a footer
   call-to-action (e.g. "Book a call").

   Usage:
     <tv-resource-rail id="rail" heading="Resources & tips"></tv-resource-rail>
     customElements.whenDefined('tv-resource-rail').then(() => {
       document.getElementById('rail').items = [
         { icon:'book-open', title:'How organisations work', desc:'The org → workspace model.', value:'orgs' },
         { icon:'palette',   title:'Branding guide',         value:'branding' },
       ]
       document.getElementById('rail').footer = { icon:'phone', title:'Book a setup call', desc:'15 min with our team.', value:'book-call' }
     })
     rail.addEventListener('tv-action', e => open(e.detail.value))

   Attributes:  heading (optional overline)
   Properties:  items  Array<{ icon, title, desc?, value }>
                footer optional { icon, title, desc?, value } — emphasised row at the foot
   Events (bubble, composed): tv-action  detail: { value }
   Tokens: --surface-0/50/100/200/500/700, --primary-50/600, --border-subtle, --radius-md/lg.
   ============================================================ */
(() => {
  if (customElements.get('tv-resource-rail')) return

  const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  class TvResourceRail extends HTMLElement {
    static get observedAttributes() { return ['heading'] }
    constructor() {
      super()
      this.attachShadow({ mode: 'open' })
      this._items = []
      this._footer = null
    }
    connectedCallback() {
      this._upgradeProperty('items')
      this._upgradeProperty('footer')
      this.render()
      if (!this._bound) {
        this._bound = true
        this.shadowRoot.addEventListener('click', (e) => {
          const row = e.target.closest && e.target.closest('[data-value]')
          if (!row) return
          this.dispatchEvent(new CustomEvent('tv-action', { bubbles: true, composed: true, detail: { value: row.getAttribute('data-value') } }))
        })
      }
    }
    attributeChangedCallback() { if (this.shadowRoot) this.render() }
    _upgradeProperty(prop) {
      if (Object.prototype.hasOwnProperty.call(this, prop)) {
        const v = this[prop]; delete this[prop]; this[prop] = v
      }
    }
    get items() { return this._items }
    set items(v) { this._items = Array.isArray(v) ? v : []; if (this.shadowRoot) this.render() }
    get footer() { return this._footer }
    set footer(v) { this._footer = v || null; if (this.shadowRoot) this.render() }

    _row(it, cls) {
      const ic = it.icon ? `<span class="ric" aria-hidden="true"><i class="${window.__tvIcon ? window.__tvIcon(it.icon) : 'icon-' + it.icon}"></i></span>` : ''
      const desc = it.desc ? `<span class="rdesc tv-body-sm">${esc(it.desc)}</span>` : ''
      return `
        <button type="button" class="row ${cls || ''}" data-value="${esc(it.value)}">
          ${ic}
          <span class="rtext">
            <span class="rtitle tv-body-strong">${esc(it.title)}</span>
            ${desc}
          </span>
          <span class="rchev" aria-hidden="true"><i class="${window.__tvIcon ? window.__tvIcon('chevron-right') : 'icon-chevron-right'}"></i></span>
        </button>`
    }

    render() {
      const heading = this.getAttribute('heading') || ''
      const items = this._items
      const footer = this._footer
      this.shadowRoot.innerHTML = `
        <style>
          :host{ display:block; font-family:var(--tv-font,'Geist','Inter',system-ui,sans-serif); }
          .rail{ background:var(--surface-0,#fff); border:1px solid var(--border-subtle,#e2e8f0);
            border-radius:var(--radius-lg,12px); padding:14px; }
          .head{ margin:2px 2px 8px; } /* .tv-overline */
          .head:empty{ display:none; }
          .row{ display:flex; align-items:flex-start; gap:10px; width:100%; text-align:left;
            padding:10px; background:none; border:0; cursor:pointer; font-family:inherit;
            border-radius:var(--radius-md,8px); transition:background .12s; }
          .row:hover{ background:var(--surface-50,#f8fafc); }
          .row:focus-visible{ outline:none; box-shadow:0 0 0 2px var(--primary-600,#4f46e5) inset; }
          .ric{ flex:0 0 auto; width:26px; height:26px; border-radius:var(--radius-md,7px);
            display:grid; place-items:center; font-size:15px; line-height:1;
            background:var(--surface-100,#f1f5f9); color:var(--surface-700,#334155); }
          .rtext{ flex:1 1 auto; min-width:0; display:flex; flex-direction:column; gap:1px; }
          .rtitle{ } /* .tv-body-strong */
          .rdesc{ color:var(--surface-500,#64748b); }
          .rchev{ flex:0 0 auto; color:var(--surface-400,#94a3b8); font-size:15px; line-height:1; margin-top:3px;
            transition:color .12s, transform .12s; }
          .row:hover .rchev{ color:var(--primary-600,#4f46e5); transform:translateX(1px); }
          .foot{ margin-top:8px; padding-top:10px; border-top:1px solid var(--border-subtle,#e2e8f0); }
          .row.is-footer .ric{ background:var(--primary-50,#eef2ff); color:var(--primary-600,#4f46e5); }
        </style>
        <aside class="rail" aria-label="${esc(heading || 'Resources')}">
          <span class="head tv-overline">${esc(heading)}</span>
          <div class="list">${items.map((it) => this._row(it)).join('')}</div>
          ${footer ? `<div class="foot">${this._row(footer, 'is-footer')}</div>` : ''}
        </aside>
      `
      if (window.__tvType) window.__tvType(this.shadowRoot)
      if (window.__tvIcons) window.__tvIcons(this.shadowRoot)
    }
  }
  customElements.define('tv-resource-rail', TvResourceRail)
})()
