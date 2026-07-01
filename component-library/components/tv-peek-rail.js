/* ============================================================
   <tv-peek-rail>  —  Traverse component library
   The 325px right-hand "peek" rail used on the Users tabs.
   Empty by default; show a person (or candidate) without leaving
   the list — identity up top, supporting meta below, quick
   actions at the foot. "Recognise on the screen, act in the card":
   the rail recognises; deep actions open a tv-modal-card.

   Data-driven so screen JS sets one object instead of reaching
   into internals:

     rail.data = {
       name:'Sarah Chen', email:'sarah@acme.co', src:'',
       deactivated:false, status:{ kind:'active', label:'Active' },
       tags:[{ kind:'admin', label:'Org Admin' }],
       meta:[
         { label:'Role in this workspace', value:'Workspace Admin' },
         { label:'Job title', value:'L&D Lead' },
       ],
       actions:[
         { id:'profile', icon:'user', label:'Open full profile' },
         { id:'role', icon:'shield', label:'Change role' },
         { id:'deactivate', icon:'user-minus', label:'Deactivate', danger:true, divider:true },
       ],
     }

   (Or pass the same object as a JSON string `data` attribute.)

   Attributes:  open (reflected), width (px, default 325)
   Properties:  data (object)
   Methods:     show(data), clear()
   Events:      tv-close, tv-action (detail: { id })
   Composes <tv-avatar> + <tv-status-tag>.
   Tokens: --surface-0/50, --border-subtle, --radius-lg/md, --fg-1/2/3,
     --bg-subtle, --error-500/100, --tv-font
   ============================================================ */
(() => {
  if (customElements.get('tv-peek-rail')) return

  const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  class TvPeekRail extends HTMLElement {
    static get observedAttributes() {
      return ['open', 'width', 'data']
    }
    constructor() {
      super()
      this.attachShadow({ mode: 'open' })
      this._data = null
    }
    connectedCallback() {
      if (!this._data && this.hasAttribute('data')) {
        try {
          this._data = JSON.parse(this.getAttribute('data'))
        } catch (e) {
          /* ignore malformed */
        }
      }
      this.render()
      this.shadowRoot.addEventListener('click', this._onClick)
    }
    attributeChangedCallback(name) {
      if (name === 'data' && this.shadowRoot) {
        try {
          this._data = JSON.parse(this.getAttribute('data'))
        } catch (e) {
          /* ignore */
        }
      }
      if (this.shadowRoot && this.shadowRoot.childElementCount) this.render()
    }
    get data() {
      return this._data
    }
    set data(v) {
      this._data = v
      if (v) this.setAttribute('open', '')
      else this.removeAttribute('open')
      if (this.shadowRoot) this.render()
    }
    show(data) {
      this.data = data
    }
    clear() {
      this._data = null
      this.removeAttribute('open')
      if (this.shadowRoot) this.render()
    }
    _onClick = (e) => {
      const closeBtn = e.target.closest && e.target.closest('[data-peek-close]')
      if (closeBtn) {
        this.clear()
        this.dispatchEvent(new CustomEvent('tv-close', { bubbles: true, composed: true }))
        return
      }
      const act = e.target.closest && e.target.closest('[data-peek-action]')
      if (act) {
        this.dispatchEvent(
          new CustomEvent('tv-action', {
            bubbles: true,
            composed: true,
            detail: { id: act.getAttribute('data-peek-action') },
          })
        )
      }
    }
    _detail(d) {
      const tags = (d.tags || [])
        .map((t) => `<tv-status-tag kind="${esc(t.kind)}" label="${esc(t.label)}"></tv-status-tag>`)
        .join('')
      const status = d.status
        ? `<tv-status-tag kind="${esc(d.status.kind)}" label="${esc(d.status.label)}"></tv-status-tag>`
        : ''
      const meta = (d.meta || [])
        .map((m) => `<dt class="tv-eyebrow">${esc(m.label)}</dt><dd class="tv-body-strong">${esc(m.value)}</dd>`)
        .join('')
      const actions = (d.actions || [])
        .map((a) => {
          const div = a.divider ? '<div class="adiv"></div>' : ''
          const ic = a.icon ? `<span class="aic" aria-hidden="true"><i class="${window.__tvIcon ? window.__tvIcon(a.icon) : 'icon-' + a.icon}"></i></span>` : ''
          return `${div}<button type="button" class="action tv-label${a.danger ? ' danger' : ''}" data-peek-action="${esc(a.id)}">${ic}${esc(a.label)}</button>`
        })
        .join('')

      return `
        <div class="detail">
          <div class="head">
            <tv-avatar size="lg" name="${esc(d.name)}" ${d.src ? `src="${esc(d.src)}"` : ''} ${
        d.deactivated ? 'deactivated' : ''
      }></tv-avatar>
            <div class="hinfo">
              <div class="name tv-h5">${esc(d.name)}</div>
              <div class="email tv-caption">${esc(d.email)}</div>
              <div class="badges">${tags}</div>
            </div>
            <button type="button" class="close" data-peek-close aria-label="Close peek"><i class="icon-x"></i></button>
          </div>
          ${status ? `<div class="statusrow">${status}</div>` : ''}
          ${meta ? `<dl class="meta">${meta}</dl>` : ''}
          ${actions ? `<div class="section"><span class="overline tv-eyebrow">Quick actions</span><div class="actions">${actions}</div></div>` : ''}
        </div>`
    }
    render() {
      const width = this.getAttribute('width') || '325'
      const open = this.hasAttribute('open') && this._data
      const body = open ? this._detail(this._data) : `<slot name="empty">${this._defaultEmpty()}</slot>`

      this.shadowRoot.innerHTML = `
        <style>
          :host{ display:block; width:${width}px; flex:0 0 ${width}px;
            font-family:var(--tv-font,'Geist','Inter',system-ui,sans-serif); }
          .rail{ background:var(--surface-0,#fff); border:1px solid var(--border-subtle,#e2e8f0);
            border-radius:var(--radius-lg,12px); padding:18px; }
          /* empty */
          .empty{ text-align:center; padding:26px 14px; color:var(--fg-3,#64748b); }
          .empty .eic{ width:38px; height:38px; margin:0 auto 12px; color:var(--fg-4,#94a3b8); font-size:38px; line-height:1; display:flex; align-items:center; justify-content:center; }
          .empty .et{ } /* type via .tv-h6 */
          .empty .es{ margin-top:5px; } /* type via .tv-caption */
          /* detail */
          .head{ display:flex; align-items:flex-start; gap:12px; }
          .hinfo{ flex:1; min-width:0; }
          .name{ } /* type via .tv-h5 */
          .email{ margin-top:1px; word-break:break-all; } /* type via .tv-caption */
          .badges{ display:flex; flex-wrap:wrap; gap:5px; margin-top:7px; }
          .badges:empty{ display:none; }
          .close{ flex:0 0 auto; width:30px; height:30px; border-radius:var(--radius-md,8px);
            display:grid; place-items:center; border:none; background:none; cursor:pointer;
            color:var(--fg-3,#64748b); font-size:16px; line-height:1; }
          .close:hover{ background:var(--surface-100,#f1f5f9); color:var(--fg-1,#0f172a); }
          .statusrow{ margin-top:14px; }
          .meta{ margin:16px 0 0; display:grid; grid-template-columns:minmax(0,1fr); gap:0; }
          .meta dt{ margin-top:12px; } /* type via .tv-eyebrow */
          .meta dd{ margin:2px 0 0; } /* type via .tv-body-strong */
          .section{ margin-top:18px; padding-top:16px; border-top:1px solid var(--border-subtle,#e2e8f0); }
          .overline{ } /* type via .tv-eyebrow */
          .actions{ display:flex; flex-direction:column; gap:2px; margin-top:10px; }
          .action{ display:flex; align-items:center; gap:10px; width:100%; text-align:left;
            cursor:pointer; background:none; border:none;
            border-radius:var(--radius-md,8px); padding:9px 10px; } /* type via .tv-label; .action.danger colour outranks it */
          .action:hover{ background:var(--bg-subtle,#f8fafc); }
          .action .aic{ width:16px; height:16px; color:var(--fg-3,#64748b); display:inline-flex; align-items:center; justify-content:center; font-size:16px; line-height:1; }
          .action.danger{ color:var(--error-500,#D92D20); }
          .action.danger .aic{ color:var(--error-500,#D92D20); }
          .action.danger:hover{ background:var(--error-100,#fee2e2); }
          .adiv{ height:1px; background:var(--border-subtle,#e2e8f0); margin:6px 0; }
        </style>
        <aside class="rail" aria-label="User peek panel">${body}</aside>
      `
      if (window.__tvType) window.__tvType(this.shadowRoot)
      if (window.__tvIcons) window.__tvIcons(this.shadowRoot)
    }
    _defaultEmpty() {
      return `
        <div class="empty">
          <div class="eic" aria-hidden="true"><i class="icon-users"></i></div>
          <div class="et tv-h6">Peek at a user</div>
          <div class="es tv-caption">Click any row to see their details here without leaving the list.</div>
        </div>`
    }
  }
  customElements.define('tv-peek-rail', TvPeekRail)
})()
