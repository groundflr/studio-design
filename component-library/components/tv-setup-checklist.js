/* ============================================================
   <tv-setup-checklist>  —  Traverse component library
   A condensed setup card: a short list of get-started actions, each
   on one line — icon, label, an inline progress/status indicator, and
   an action button. An item can be "in progress" (mini progress bar +
   percent), "todo" (just the button), or "done" (a check, no button).
   Small and dismissible — designed to sit inside a welcome banner.

   Usage:
     <tv-setup-checklist id="setup" heading="Finish setting up"></tv-setup-checklist>
     customElements.whenDefined('tv-setup-checklist').then(() => {
       document.getElementById('setup').items = [
         { icon:'building-2', label:'Set up your organisation', status:'in-progress', progress:33, cta:'Setup organisation', value:'setup-org' },
         { icon:'layout-grid', label:'Add your first workspace', status:'todo', cta:'Add workspace', value:'add-workspace' },
         { icon:'user-plus',   label:'Invite your first user',  status:'todo', cta:'Invite users', value:'invite-users' },
       ]
     })
     setup.addEventListener('tv-action', e => route(e.detail.value))

   Attributes:  heading (optional overline)
   Property:    items Array<{ icon, label, status:'todo'|'in-progress'|'done', progress?, cta?, value }>
   Events (bubble, composed): tv-action  detail: { value }
   Tokens: --cat-indigo, --primary-100/600, --success-500/600, --surface-0/100/200/500/700, --radius-md.
   ============================================================ */
(() => {
  if (customElements.get('tv-setup-checklist')) return

  const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  class TvSetupChecklist extends HTMLElement {
    static get observedAttributes() { return ['heading'] }
    constructor() {
      super()
      this.attachShadow({ mode: 'open' })
      this._items = []
    }
    connectedCallback() {
      this._upgradeProperty('items')
      this.render()
      if (!this._bound) {
        this._bound = true
        this.shadowRoot.addEventListener('click', (e) => {
          const b = e.target.closest && e.target.closest('[data-value]')
          if (!b) return
          this.dispatchEvent(new CustomEvent('tv-action', { bubbles: true, composed: true, detail: { value: b.getAttribute('data-value') } }))
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

    _mid(it) {
      if (it.status === 'done') {
        return `<span class="st done"><i class="${window.__tvIcon ? window.__tvIcon('check') : 'icon-check'}"></i>Done</span>`
      }
      if (it.status === 'in-progress') {
        const p = Math.max(0, Math.min(100, +it.progress || 0))
        return `<span class="st prog"><span class="bar"><span class="fill" style="width:${p}%"></span></span><span class="pct">${p}%</span></span>`
      }
      return ''
    }
    _act(it) {
      if (it.status === 'done' || !it.cta) return ''
      const primary = it.status === 'in-progress'
      return `<tv-button variant="${primary ? 'primary' : 'secondary'}" size="sm" data-value="${esc(it.value)}">${esc(it.cta)}</tv-button>`
    }

    render() {
      const heading = this.getAttribute('heading') || ''
      const items = this._items
      const doneN = items.filter((i) => i.status === 'done').length
      this.shadowRoot.innerHTML = `
        <style>
          :host{ display:block; font-family:var(--tv-font,'Geist','Inter',system-ui,sans-serif); }
          .card{ background:var(--surface-0,#fff); border:1px solid var(--surface-200,#e2e8f0);
            border-radius:var(--radius-md,10px); padding:6px 8px; }
          .hd{ display:flex; align-items:baseline; justify-content:space-between; gap:10px; padding:8px 8px 6px; }
          .hd:empty{ display:none; }
          .count{ color:var(--surface-500,#64748b); } /* .tv-body-sm */
          .item{ display:flex; align-items:center; gap:12px; padding:9px 8px; }
          .item + .item{ border-top:1px solid var(--surface-100,#f1f5f9); }
          .ic{ flex:0 0 auto; width:30px; height:30px; border-radius:var(--radius-md,8px); display:grid; place-items:center;
            font-size:15px; line-height:1; background:color-mix(in srgb, var(--cat-indigo) 12%, #fff); color:var(--cat-indigo); }
          .item.is-done .ic{ background:color-mix(in srgb, var(--success-500,#16a34a) 14%, #fff); color:var(--success-600,#15803d); }
          .label{ flex:1 1 auto; min-width:0; } /* .tv-body-strong */
          .item.is-done .label{ color:var(--surface-500,#64748b); }
          .st{ flex:0 0 auto; display:inline-flex; align-items:center; gap:7px; } /* .tv-body-sm */
          .st.prog .bar{ width:78px; height:6px; border-radius:999px; background:var(--surface-200,#e2e8f0); overflow:hidden; }
          .st.prog .fill{ display:block; height:100%; border-radius:999px; background:var(--primary-600,#4f46e5); }
          .st.prog .pct{ color:var(--surface-500,#64748b); min-width:30px; }
          .st.done{ color:var(--success-600,#15803d); font-weight:600; }
          .st.done i{ font-size:14px; }
          /* Fixed-width action column so every row's button is the same width. */
          .act{ flex:0 0 auto; width:150px; display:flex; justify-content:flex-end; }
          .act tv-button{ display:block; width:100%; }
          .act tv-button::part(button){ width:100%; justify-content:center; }
          @media (max-width:560px){ .st.prog .bar{ display:none; } .act{ width:128px; } }
        </style>
        <div class="card">
          <div class="hd">
            <span class="tv-overline">${esc(heading)}</span>
            <span class="count tv-body-sm">${doneN} of ${items.length} done</span>
          </div>
          ${items.map((it) => `
            <div class="item ${it.status === 'done' ? 'is-done' : ''}">
              <span class="ic" aria-hidden="true"><i class="${window.__tvIcon ? window.__tvIcon(it.icon || 'circle') : 'icon-' + (it.icon || 'circle')}"></i></span>
              <span class="label tv-body-strong">${esc(it.label)}</span>
              ${this._mid(it)}
              <span class="act">${this._act(it)}</span>
            </div>`).join('')}
        </div>
      `
      if (window.__tvType) window.__tvType(this.shadowRoot)
      if (window.__tvIcons) window.__tvIcons(this.shadowRoot)
    }
  }
  customElements.define('tv-setup-checklist', TvSetupChecklist)
})()
