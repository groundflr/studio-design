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

  const ICONS = {
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    'pen-line': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1Z"/></svg>',
    'user-minus': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="22" x2="16" y1="11" y2="11"/></svg>',
    'user-plus': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>',
    history: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
    send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
    users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  }
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
        .map((m) => `<dt>${esc(m.label)}</dt><dd>${esc(m.value)}</dd>`)
        .join('')
      const actions = (d.actions || [])
        .map((a) => {
          const ic = ICONS[a.icon] || ''
          const div = a.divider ? '<div class="adiv"></div>' : ''
          return `${div}<button type="button" class="action${a.danger ? ' danger' : ''}" data-peek-action="${esc(a.id)}">${
            ic ? `<span class="aic" aria-hidden="true">${ic}</span>` : ''
          }${esc(a.label)}</button>`
        })
        .join('')

      return `
        <div class="detail">
          <div class="head">
            <tv-avatar size="lg" name="${esc(d.name)}" ${d.src ? `src="${esc(d.src)}"` : ''} ${
        d.deactivated ? 'deactivated' : ''
      }></tv-avatar>
            <div class="hinfo">
              <div class="name">${esc(d.name)}</div>
              <div class="email">${esc(d.email)}</div>
              <div class="badges">${tags}</div>
            </div>
            <button type="button" class="close" data-peek-close aria-label="Close peek">${ICONS.x}</button>
          </div>
          ${status ? `<div class="statusrow">${status}</div>` : ''}
          ${meta ? `<dl class="meta">${meta}</dl>` : ''}
          ${actions ? `<div class="section"><span class="overline">Quick actions</span><div class="actions">${actions}</div></div>` : ''}
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
          .empty .eic{ width:38px; height:38px; margin:0 auto 12px; color:var(--fg-4,#94a3b8); }
          .empty .eic svg{ width:100%; height:100%; }
          .empty .et{ font-size:14px; font-weight:600; color:var(--fg-2,#334155); }
          .empty .es{ font-size:12.5px; margin-top:5px; line-height:1.5; }
          /* detail */
          .head{ display:flex; align-items:flex-start; gap:12px; }
          .hinfo{ flex:1; min-width:0; }
          .name{ font-size:15px; font-weight:600; color:var(--fg-1,#0f172a); }
          .email{ font-size:12.5px; color:var(--fg-3,#64748b); margin-top:1px; word-break:break-all; }
          .badges{ display:flex; flex-wrap:wrap; gap:5px; margin-top:7px; }
          .badges:empty{ display:none; }
          .close{ flex:0 0 auto; width:30px; height:30px; border-radius:var(--radius-md,8px);
            display:grid; place-items:center; border:none; background:none; cursor:pointer;
            color:var(--fg-3,#64748b); }
          .close svg{ width:16px; height:16px; }
          .close:hover{ background:var(--surface-100,#f1f5f9); color:var(--fg-1,#0f172a); }
          .statusrow{ margin-top:14px; }
          .meta{ margin:16px 0 0; display:grid; grid-template-columns:minmax(0,1fr); gap:0; }
          .meta dt{ font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:.04em;
            color:var(--fg-3,#64748b); margin-top:12px; }
          .meta dd{ margin:2px 0 0; font-size:13px; color:var(--fg-1,#0f172a); }
          .section{ margin-top:18px; padding-top:16px; border-top:1px solid var(--border-subtle,#e2e8f0); }
          .overline{ font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:.04em; color:var(--fg-3,#64748b); }
          .actions{ display:flex; flex-direction:column; gap:2px; margin-top:10px; }
          .action{ display:flex; align-items:center; gap:10px; width:100%; text-align:left;
            font-family:inherit; font-size:13px; color:var(--fg-1,#0f172a); cursor:pointer;
            background:none; border:none; border-radius:var(--radius-md,8px); padding:9px 10px; }
          .action:hover{ background:var(--bg-subtle,#f8fafc); }
          .action .aic{ width:16px; height:16px; color:var(--fg-3,#64748b); display:inline-flex; }
          .action .aic svg{ width:100%; height:100%; }
          .action.danger{ color:var(--error-500,#D92D20); }
          .action.danger .aic{ color:var(--error-500,#D92D20); }
          .action.danger:hover{ background:var(--error-100,#fee2e2); }
          .adiv{ height:1px; background:var(--border-subtle,#e2e8f0); margin:6px 0; }
        </style>
        <aside class="rail" aria-label="User peek panel">${body}</aside>
      `
    }
    _defaultEmpty() {
      return `
        <div class="empty">
          <div class="eic" aria-hidden="true">${ICONS.users}</div>
          <div class="et">Peek at a user</div>
          <div class="es">Click any row to see their details here without leaving the list.</div>
        </div>`
    }
  }
  customElements.define('tv-peek-rail', TvPeekRail)
})()
