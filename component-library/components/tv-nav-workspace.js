/* ============================================================
   <tv-nav-workspace>  —  Traverse component library
   The side-nav workspace picker: a trigger row (avatar + name +
   optional org sub-line) that opens a dropdown. The dropdown holds
   a "Switch workspace" item that reveals a sub-drawer of the user's
   workspaces, plus a slot for persona-conditional actions. The
   sub-drawer renders either a flat list (normal users) or an
   org-grouped, searchable, A–Z-navigable list (super users).
   Lifted from the dashboard `.sb-workspace` / `.ws-dropdown` /
   `.ws-sub-drawer`.

   Single source of truth: edit THIS file and every page updates.

   PRESENTATIONAL: the component owns the markup, the open/close
   UI state, search filtering, the A–Z rail + scroll-spy and row
   rendering. The PAGE owns the data and the policy — it feeds the
   workspace list + the persona-conditional menu items in and reacts
   to tv-workspace-select / tv-menu-action (switch, toast, routing).

   Usage:
     const sw = document.querySelector('tv-nav-workspace')
     sw.setAttribute('ws-name', 'L&D Hub')
     sw.setAttribute('ws-initials', 'LH')
     sw.setAttribute('current', 'ld-hub')
     sw.setAttribute('multi', '')            // show "Switch workspace"
     sw.workspaces = [                        // flat list (normal users)
       { id:'ld-hub', name:'L&D Hub', initials:'LH', meta:'6 members', badge:'Workspace admin' },
       …
     ]
     // persona-conditional actions render below the divider:
     sw.menuItems = [{ id:'workspace-settings', label:'Workspace settings', icon:'settings' }]
     // super user → grouped list + search + A–Z rail:
     sw.setAttribute('grouped', '')
     sw.orgs = [{ org:'Acme Corp', workspaces:[{ id, name, initials, meta, badge }, …] }, …]

     <tv-nav-workspace ws-name="L&D Hub" ws-initials="LH" current="ld-hub" multi></tv-nav-workspace>

   Attributes:
     ws-name      trigger label (current workspace name)
     ws-initials  avatar initials
     ws-org       org sub-line (super users only; hidden when empty)
     current      current workspace id — highlights its row, hides switch
     multi        boolean — user belongs to >1 workspace (shows "Switch workspace")
     grouped      boolean — org-grouped + search + A–Z rail (super users)
     static       boolean — single-workspace member: row is non-interactive
     collapsed    boolean — avatar only (set by tv-sidebar)
     open         reflected — dropdown visibility
     drawer-open  reflected — switch sub-drawer visibility

   Properties:
     .workspaces  flat array: [{ id, name, initials, meta?, badge? }]
     .orgs        grouped array: [{ org, workspaces:[{ id, name, initials, meta?, badge? }] }]
     .menuItems   persona actions below the divider: [{ id, label, icon?, data?:{} }]

   Events: tv-workspace-select (detail:{ id, name, initials, org })
           tv-menu-action      (detail:{ id, data })  — a persona action was clicked
           tv-open · tv-close
   Tokens: --surface-*, --primary-*, --error-*, --border-subtle,
           --shadow-md, --radius-md, --tv-font
   ============================================================ */
(() => {
  if (customElements.get('tv-nav-workspace')) return

  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
  const orgLetter = (name) => {
    const c = (name || '').trim().charAt(0).toUpperCase()
    return /[A-Z]/.test(c) ? c : '#'
  }

  class TvNavWorkspace extends HTMLElement {
    static get observedAttributes() {
      return ['ws-name', 'ws-initials', 'ws-org', 'current', 'multi', 'grouped', 'static', 'collapsed']
    }
    constructor() {
      super()
      this.attachShadow({ mode: 'open' })
      this._workspaces = []
      this._orgs = []
      this._menuItems = []
      this._query = ''
      this._built = false
      this._hoverOpen = null
      this._hoverClose = null
    }
    connectedCallback() {
      this._build()
      document.addEventListener('click', this._onDocClick)
    }
    disconnectedCallback() {
      document.removeEventListener('click', this._onDocClick)
      this._clearHoverTimers()
    }
    attributeChangedCallback(name) {
      if (!this._built) return
      if (name === 'ws-name' || name === 'ws-initials' || name === 'ws-org' || name === 'static' || name === 'collapsed') {
        this._syncTrigger()
      }
      if (name === 'current' || name === 'grouped') this._renderList()
      if (name === 'multi') this._syncMenuVisibility()
    }

    // ---- public data setters ----
    set workspaces(v) { this._workspaces = Array.isArray(v) ? v : []; if (this._built) this._renderList() }
    get workspaces() { return this._workspaces }
    set orgs(v) { this._orgs = Array.isArray(v) ? v : []; if (this._built) this._renderList() }
    get orgs() { return this._orgs }
    // Persona-conditional actions below the divider: [{ id, label, icon?, data?:{} }].
    // Rendered as real menu rows so they match "Switch workspace" exactly; a click
    // emits tv-menu-action and closes the menu — the page does the routing.
    set menuItems(v) { this._menuItems = Array.isArray(v) ? v : []; if (this._built) { this._renderMenuItems(); this._syncMenuVisibility() } }
    get menuItems() { return this._menuItems }

    // ---- public UI methods ----
    open() {
      if (this.hasAttribute('static')) return
      this.setAttribute('open', '')
      this.dispatchEvent(new CustomEvent('tv-open', { bubbles: true }))
    }
    close() {
      this.closeDrawer()
      this.removeAttribute('open')
      this.dispatchEvent(new CustomEvent('tv-close', { bubbles: true }))
    }
    toggle() { this.hasAttribute('open') ? this.close() : this.open() }
    openDrawer() {
      this.setAttribute('drawer-open', '')
      this._clearSearch()
      this._renderList()
    }
    closeDrawer() {
      this.removeAttribute('drawer-open')
      this._clearSearch()
    }

    // ---- build the static shell once ----
    _build() {
      this.shadowRoot.innerHTML = `
        <style>
          :host{ display:block; position:relative;
            font-family:var(--tv-font,'Geist','Inter',system-ui,sans-serif); }

          /* ---- trigger row ---- */
          .trigger{
            display:grid; grid-template-columns:28px 1fr 16px; gap:10px; align-items:center;
            width:100%; box-sizing:border-box; padding:6px 8px; border:none; background:transparent;
            border-radius:var(--radius-md,8px); cursor:pointer; text-align:left;
            transition:background var(--dur-quick,120ms) var(--ease-std,ease);
          }
          .trigger:hover{ background:var(--surface-100,#f1f5f9); }
          .avatar{
            width:28px; height:28px; border-radius:999px; overflow:hidden;
            background:var(--surface-200,#e2e8f0); color:var(--surface-700,#334155);
            font-weight:600; font-size:11px; letter-spacing:.02em;
            display:inline-flex; align-items:center; justify-content:center;
          }
          .ws-id{ min-width:0; display:flex; flex-direction:column; line-height:1.15; }
          .name{ font-weight:500; font-size:13px; color:var(--surface-900,#0f172a);
            overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
          .org{ font-weight:400; font-size:11px; color:var(--surface-500,#64748b); margin-top:1px;
            overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
          .org[hidden]{ display:none; }
          .chev{ color:var(--surface-400,#94a3b8); font-size:14px; display:inline-flex;
            align-items:center; justify-content:center; line-height:1;
            transition:transform var(--dur-quick,120ms) var(--ease-std,ease); }
          :host([open]) .chev{ transform:rotate(180deg); }

          /* static (single-workspace member) — no chevron, not clickable */
          :host([static]) .trigger{ cursor:default; }
          :host([static]) .trigger:hover{ background:transparent; }
          :host([static]) .chev{ display:none; }

          /* collapsed — avatar only */
          :host([collapsed]) .trigger{ grid-template-columns:28px; justify-content:center; gap:0; padding:6px 0; }
          :host([collapsed]) .ws-id, :host([collapsed]) .chev{ display:none; }

          /* ---- dropdown ---- */
          .dropdown{
            position:absolute; top:calc(100% + 4px); left:0; width:264px; min-width:100%;
            background:var(--surface-0,#fff); border:1px solid var(--surface-200,#e2e8f0);
            border-radius:10px; padding:6px; z-index:20; display:none;
            box-shadow:0 10px 24px -8px rgba(15,23,42,.18), 0 2px 4px 0 rgba(15,23,42,.06);
          }
          :host([open]) .dropdown{ display:block; }
          :host([collapsed]) .dropdown{ left:0; width:220px; }

          .menu-item{
            display:grid; grid-template-columns:24px 1fr 12px; gap:10px; align-items:center;
            width:100%; box-sizing:border-box; padding:8px 10px; border:none; background:transparent;
            border-radius:8px; cursor:pointer; text-align:left; color:var(--surface-800,#1e293b);
            font-family:inherit; transition:background var(--dur-quick,120ms) var(--ease-std,ease);
          }
          .menu-item:hover{ background:var(--surface-100,#f1f5f9); }
          .menu-item i.lead{ width:24px; font-size:16px; color:var(--surface-600,#475569); text-align:center; }
          .menu-item .mi-label{ font-weight:500; font-size:13px; color:var(--surface-900,#0f172a); }
          .menu-item i.trail{ width:14px; font-size:14px; color:var(--surface-400,#94a3b8);
            transition:transform var(--dur-quick,120ms) var(--ease-std,ease); }

          .switch-item[hidden]{ display:none; }
          :host([drawer-open]) .switch-item{
            background:color-mix(in srgb, var(--primary-600,#4f46e5), transparent 92%);
            color:var(--primary-700,#4338ca);
          }
          :host([drawer-open]) .switch-item i.lead{ color:var(--primary-600,#4f46e5); }
          :host([drawer-open]) .switch-item i.trail{ color:var(--primary-500,#6366f1); }

          .divider{ height:0; border:none; border-top:.5px solid var(--border-subtle,#e2e8f0); margin:4px 6px; }
          .divider[hidden]{ display:none; }
          .menu-extra{ display:flex; flex-direction:column; gap:2px; }

          /* ---- sub-drawer ---- */
          .drawer{
            position:absolute; top:0; left:calc(100% + 6px); width:280px;
            background:var(--surface-0,#fff); border:.5px solid var(--surface-200,#e2e8f0);
            border-radius:10px; box-shadow:var(--shadow-md,0 4px 6px -1px rgba(0,0,0,.1));
            z-index:30; overflow:hidden; opacity:0; transform:translateX(-6px); pointer-events:none;
            transition:opacity 130ms ease, transform 130ms ease, width 130ms ease;
          }
          .drawer.is-super{ width:340px; }
          :host([drawer-open]) .drawer{ opacity:1; transform:translateX(0); pointer-events:auto; }

          .drawer-tools{ padding:8px 10px 6px; border-bottom:.5px solid var(--surface-100,#f1f5f9); }
          .drawer-tools[hidden]{ display:none; }
          .search{ display:flex; align-items:center; gap:8px; width:100%; box-sizing:border-box;
            padding:7px 10px; border:1px solid var(--surface-200,#e2e8f0); border-radius:8px;
            background:var(--surface-0,#fff); }
          .search i{ font-size:14px; color:var(--surface-400,#94a3b8); }
          .search input{ flex:1; min-width:0; border:none; outline:none; background:transparent;
            font:400 13px var(--tv-font,'Geist','Inter',system-ui,sans-serif); color:var(--surface-900,#0f172a); }

          .drawer-main{ display:flex; align-items:stretch; }
          .alpha{ display:flex; flex-direction:column; align-items:center; gap:0; padding:6px 4px;
            flex-shrink:0; border-right:.5px solid var(--surface-100,#f1f5f9); }
          .alpha[hidden]{ display:none; }
          .alpha-chip{ width:16px; height:12px; border-radius:3px; font-weight:600; font-size:9px;
            color:var(--surface-500,#64748b); display:inline-flex; align-items:center; justify-content:center;
            border:none; background:transparent; cursor:pointer; transition:background 100ms, color 100ms; }
          .alpha-chip:hover{ color:var(--primary-600,#4f46e5);
            background:color-mix(in srgb, var(--primary-500,#6366f1), transparent 88%); }
          .alpha-chip.is-active{ color:#fff; background:var(--primary-600,#4f46e5); }
          .alpha-chip.is-empty{ color:var(--surface-300,#cbd5e1); cursor:default; }
          .alpha-chip.is-empty:hover{ background:transparent; color:var(--surface-300,#cbd5e1); }

          .body{ position:relative; flex:1 1 auto; min-width:0; padding:6px;
            max-height:360px; overflow-y:auto; scroll-behavior:smooth; }

          .ws-row{ position:relative; display:flex; align-items:center; gap:8px;
            width:100%; box-sizing:border-box; padding:8px 10px 8px 14px; border:none; background:transparent;
            border-radius:8px; cursor:pointer; text-align:left; overflow:hidden;
            font-family:inherit; transition:background var(--dur-quick,120ms) var(--ease-std,ease); }
          .ws-row:hover{ background:var(--surface-100,#f1f5f9); }
          .ws-row.is-current{ background:color-mix(in srgb, var(--primary-600,#4f46e5), transparent 92%); cursor:default; }
          .ws-row.is-current::before{ content:''; position:absolute; left:0; top:6px; bottom:6px;
            width:3px; border-radius:0 2px 2px 0; background:var(--primary-500,#6366f1); }
          .ws-row-body{ flex:1; min-width:0; }
          .ws-row-name{ font-weight:500; font-size:13px; color:var(--surface-900,#0f172a);
            white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
          .ws-row-meta{ font-weight:400; font-size:11px; color:var(--surface-500,#64748b); margin-top:1px; }
          .ws-row-right{ display:flex; align-items:center; gap:6px; flex-shrink:0; }
          .badge{ display:inline-flex; align-items:center; padding:1px 6px; border-radius:9999px;
            font-weight:500; font-size:10px; line-height:16px; white-space:nowrap;
            background:var(--surface-100,#f1f5f9); color:var(--surface-600,#475569); }
          .badge.is-admin-tier{ background:var(--primary-50,#eef2ff); color:var(--primary-700,#4338ca); }
          .pill{ font-weight:600; font-size:10px; letter-spacing:.03em; white-space:nowrap;
            color:var(--primary-600,#4f46e5); border-radius:9999px; padding:1px 7px;
            background:color-mix(in srgb, var(--primary-500,#6366f1), transparent 85%); }

          .org-group + .org-group{ margin-top:14px; border-top:.5px solid var(--border-subtle,#e2e8f0); padding-top:12px; }
          .org-head{ display:flex; align-items:center; justify-content:space-between; gap:8px; padding:4px 10px 6px 14px; }
          .org-name{ font-weight:600; font-size:11px; letter-spacing:.04em; text-transform:uppercase;
            color:var(--text-tertiary,#94a3b8); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
          .org-count{ font-weight:500; font-size:10px; color:var(--surface-400,#94a3b8); flex-shrink:0; white-space:nowrap; }
          .empty{ padding:18px 14px; text-align:center; font:400 12px var(--tv-font,'Geist','Inter',system-ui,sans-serif);
            color:var(--surface-500,#64748b); }
        </style>

        <button class="trigger" part="trigger" aria-haspopup="true" aria-expanded="false">
          <span class="avatar" part="avatar"></span>
          <span class="ws-id">
            <span class="name"></span>
            <span class="org" hidden></span>
          </span>
          <i class="chev ${window.__tvIcon ? window.__tvIcon('chevron-down') : 'icon-chevron-down'}"></i>
        </button>

        <div class="dropdown" role="menu">
          <button class="menu-item switch-item" role="menuitem" aria-haspopup="menu" aria-expanded="false">
            <i class="lead ${window.__tvIcon ? window.__tvIcon('arrow-left-right') : 'icon-arrow-left-right'}"></i>
            <span class="mi-label">Switch workspace</span>
            <i class="trail ${window.__tvIcon ? window.__tvIcon('chevron-right') : 'icon-chevron-right'}"></i>
          </button>
          <hr class="divider" aria-hidden="true">
          <div class="menu-extra" part="menu"></div>

          <div class="drawer" role="menu" aria-label="Switch workspace">
            <div class="drawer-tools" hidden>
              <div class="search">
                <i class="${window.__tvIcon ? window.__tvIcon('search') : 'icon-search'}"></i>
                <input type="text" placeholder="Search organisations or workspaces" autocomplete="off" aria-label="Search organisations or workspaces">
              </div>
            </div>
            <div class="drawer-main">
              <div class="alpha" hidden role="group" aria-label="Jump to organisation by letter"></div>
              <div class="body" part="list"></div>
            </div>
          </div>
        </div>
      `
      // element handles
      this._trigger = this.shadowRoot.querySelector('.trigger')
      this._avatar = this.shadowRoot.querySelector('.avatar')
      this._name = this.shadowRoot.querySelector('.name')
      this._orgLine = this.shadowRoot.querySelector('.org')
      this._dropdown = this.shadowRoot.querySelector('.dropdown')
      this._switch = this.shadowRoot.querySelector('.switch-item')
      this._divider = this.shadowRoot.querySelector('.divider')
      this._menuExtra = this.shadowRoot.querySelector('.menu-extra')
      this._drawer = this.shadowRoot.querySelector('.drawer')
      this._tools = this.shadowRoot.querySelector('.drawer-tools')
      this._search = this.shadowRoot.querySelector('.search input')
      this._alpha = this.shadowRoot.querySelector('.alpha')
      this._listEl = this.shadowRoot.querySelector('.body')
      this._built = true

      this._wire()
      this._syncTrigger()
      this._renderMenuItems()
      this._syncMenuVisibility()
      this._renderList()
      if (window.__tvType) window.__tvType(this.shadowRoot)
      if (window.__tvIcons) window.__tvIcons(this.shadowRoot)
    }

    _wire() {
      // trigger toggles dropdown
      this._trigger.addEventListener('click', (e) => { e.stopPropagation(); this.toggle() })

      // "Switch workspace" — hover-intent open, keyboard open
      this._switch.addEventListener('mouseenter', () => this._scheduleDrawerOpen())
      this._switch.addEventListener('mouseleave', () => this._scheduleDrawerClose())
      this._switch.addEventListener('click', (e) => { e.stopPropagation(); this.hasAttribute('drawer-open') ? this.closeDrawer() : this.openDrawer() })
      this._switch.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'Enter') {
          e.preventDefault(); this._clearHoverTimers(); this.openDrawer()
          const first = this._drawer.querySelector('button, [tabindex="0"]'); if (first) first.focus()
        }
      })
      this._drawer.addEventListener('mouseenter', () => this._clearHoverTimers())
      this._drawer.addEventListener('mouseleave', () => this._scheduleDrawerClose())
      this._drawer.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' || e.key === 'ArrowLeft') { e.stopPropagation(); this.closeDrawer(); this._switch.focus() }
      })

      // clicking any non-switch dropdown item closes the drawer first
      this._dropdown.addEventListener('click', (e) => {
        if (this.hasAttribute('drawer-open') && !e.target.closest('.switch-item') && !e.target.closest('.drawer')) {
          this.closeDrawer()
        }
      })

      // search
      this._search.addEventListener('input', () => { this._query = this._search.value; this._renderList() })
      this._search.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          if (this._search.value) { e.stopPropagation(); this._query = ''; this._search.value = ''; this._renderList() }
          return
        }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') e.stopPropagation()
      })

      // A–Z rail: jump on click
      this._alpha.addEventListener('click', (e) => {
        const chip = e.target.closest('[data-jump-letter]'); if (!chip) return
        const letter = chip.getAttribute('data-jump-letter')
        const target = this._listEl.querySelector('[data-letter-anchor="' + letter + '"]')
        if (target) { this._listEl.scrollTop = Math.max(0, target.offsetTop - 6); this._updateActiveLetter() }
      })
      // scroll-spy (wired once — the list element persists across re-renders)
      this._listEl.addEventListener('scroll', () => this._updateActiveLetter(), { passive: true })
    }

    _onDocClick = (e) => {
      if (!this.hasAttribute('open')) return
      if (!this.contains(e.target)) this.close()
    }

    // ---- hover-intent timers ----
    _clearHoverTimers() {
      if (this._hoverOpen) { clearTimeout(this._hoverOpen); this._hoverOpen = null }
      if (this._hoverClose) { clearTimeout(this._hoverClose); this._hoverClose = null }
    }
    _scheduleDrawerOpen() { this._clearHoverTimers(); this._hoverOpen = setTimeout(() => this.openDrawer(), 80) }
    _scheduleDrawerClose() { this._clearHoverTimers(); this._hoverClose = setTimeout(() => this.closeDrawer(), 200) }

    _clearSearch() {
      this._query = ''
      if (this._search) this._search.value = ''
    }

    // ---- trigger identity ----
    _syncTrigger() {
      this._avatar.textContent = this.getAttribute('ws-initials') || ''
      this._name.textContent = this.getAttribute('ws-name') || ''
      const org = this.getAttribute('ws-org')
      if (org) { this._orgLine.textContent = org; this._orgLine.hidden = false }
      else { this._orgLine.textContent = ''; this._orgLine.hidden = true }
      const isStatic = this.hasAttribute('static')
      this._trigger.setAttribute('aria-expanded', this.hasAttribute('open') ? 'true' : 'false')
      if (isStatic) { this._trigger.setAttribute('aria-disabled', 'true'); this._trigger.removeAttribute('aria-haspopup') }
      else { this._trigger.removeAttribute('aria-disabled'); this._trigger.setAttribute('aria-haspopup', 'true') }
    }

    // ---- persona-conditional menu rows (below the divider) ----
    _renderMenuItems() {
      if (!this._menuExtra) return
      this._menuExtra.innerHTML = ''
      this._menuItems.forEach((item) => {
        const btn = document.createElement('button')
        btn.type = 'button'
        btn.className = 'menu-item'
        btn.setAttribute('role', 'menuitem')
        if (item.id != null) btn.setAttribute('data-id', item.id)
        const icon = item.icon
          ? '<i class="lead ' + (window.__tvIcon ? window.__tvIcon(item.icon) : 'icon-' + item.icon) + '"></i>'
          : '<i class="lead"></i>'
        btn.innerHTML = icon + '<span class="mi-label"></span><i class="trail"></i>'
        btn.querySelector('.mi-label').textContent = item.label || ''
        btn.addEventListener('click', (e) => {
          e.stopPropagation()
          this.dispatchEvent(new CustomEvent('tv-menu-action', {
            bubbles: true, composed: true, detail: { id: item.id, data: item.data || {} }
          }))
          this.close()
        })
        this._menuExtra.appendChild(btn)
      })
      if (window.__tvIcons) window.__tvIcons(this.shadowRoot)
    }

    // ---- switch-item + divider visibility ----
    _syncMenuVisibility() {
      const multi = this.hasAttribute('multi')
      this._switch.hidden = !multi
      this._divider.hidden = !(multi && this._menuItems.length > 0)
    }

    // ---- list rendering ----
    _select(ws, orgName) {
      if (ws.id === this.getAttribute('current')) return
      // reflect the selection within our own data, then announce it
      this.setAttribute('current', ws.id)
      this.setAttribute('ws-name', ws.name)
      if (ws.initials != null) this.setAttribute('ws-initials', ws.initials)
      if (orgName) this.setAttribute('ws-org', orgName); else this.removeAttribute('ws-org')
      this.dispatchEvent(new CustomEvent('tv-workspace-select', {
        bubbles: true, composed: true,
        detail: { id: ws.id, name: ws.name, initials: ws.initials, org: orgName || null }
      }))
      this.close()
    }

    _buildRow(ws, orgName) {
      const isCurrent = ws.id === this.getAttribute('current')
      const btn = document.createElement('button')
      btn.type = 'button'
      btn.className = 'ws-row' + (isCurrent ? ' is-current' : '')
      btn.setAttribute('role', 'menuitem')
      if (isCurrent) { btn.setAttribute('aria-current', 'true'); btn.setAttribute('aria-disabled', 'true') }
      btn.setAttribute('data-ws-id', ws.id)
      const badgeCls = /admin|owner/i.test(ws.badge || '') ? ' is-admin-tier' : ''
      btn.innerHTML =
        '<div class="ws-row-body">' +
          '<div class="ws-row-name"></div>' +
          (ws.meta ? '<div class="ws-row-meta"></div>' : '') +
        '</div>' +
        '<div class="ws-row-right">' +
          (ws.badge ? '<span class="badge' + badgeCls + '"></span>' : '') +
          (isCurrent ? '<span class="pill">Current</span>' : '') +
        '</div>'
      btn.querySelector('.ws-row-name').textContent = ws.name || ''
      if (ws.meta) btn.querySelector('.ws-row-meta').textContent = ws.meta
      if (ws.badge) btn.querySelector('.badge').textContent = ws.badge
      if (!isCurrent) btn.addEventListener('click', () => this._select(ws, orgName))
      return btn
    }

    _renderList() {
      if (!this._listEl) return
      this._listEl.innerHTML = ''
      const grouped = this.hasAttribute('grouped')

      if (!grouped) {
        this._tools.hidden = true
        this._alpha.hidden = true
        this._drawer.classList.remove('is-super')
        this._workspaces.forEach((ws) => this._listEl.appendChild(this._buildRow(ws, null)))
        return
      }

      // super user → org-grouped, alphabetical, searchable, A–Z navigable
      this._tools.hidden = false
      this._alpha.hidden = false
      this._drawer.classList.add('is-super')
      const q = this._query.trim().toLowerCase()

      const groups = this._orgs
        .slice()
        .sort((a, b) => a.org.localeCompare(b.org))
        .map((g) => {
          const orgMatch = !q || g.org.toLowerCase().indexOf(q) !== -1
          const workspaces = orgMatch ? g.workspaces : g.workspaces.filter((w) => (w.name || '').toLowerCase().indexOf(q) !== -1)
          return { org: g.org, workspaces }
        })
        .filter((g) => g.workspaces.length > 0)

      if (groups.length === 0) {
        this._renderAlpha([])
        this._alpha.hidden = true
        const empty = document.createElement('div')
        empty.className = 'empty'
        empty.textContent = 'No organisations or workspaces match "' + this._query.trim() + '".'
        this._listEl.appendChild(empty)
        return
      }

      const seen = []
      groups.forEach((g) => { const l = orgLetter(g.org); if (seen.indexOf(l) === -1) seen.push(l) })
      this._renderAlpha(seen)

      let lastLetter = null
      groups.forEach((g) => {
        const letter = orgLetter(g.org)
        const isNew = letter !== lastLetter
        lastLetter = letter
        const wrap = document.createElement('div')
        wrap.className = 'org-group'
        if (isNew) wrap.setAttribute('data-letter-anchor', letter)
        const head = document.createElement('div')
        head.className = 'org-head'
        const count = g.workspaces.length
        head.innerHTML = '<span class="org-name"></span><span class="org-count"></span>'
        head.querySelector('.org-name').textContent = g.org
        head.querySelector('.org-count').textContent = count + (count === 1 ? ' workspace' : ' workspaces')
        wrap.appendChild(head)
        g.workspaces.forEach((ws) => wrap.appendChild(this._buildRow(ws, g.org)))
        this._listEl.appendChild(wrap)
      })
      this._updateActiveLetter()
    }

    _renderAlpha(present) {
      this._alpha.innerHTML = ''
      const letters = ALPHABET.slice()
      if (present.indexOf('#') !== -1) letters.push('#')
      letters.forEach((letter) => {
        const has = present.indexOf(letter) !== -1
        const chip = document.createElement('button')
        chip.type = 'button'
        chip.className = 'alpha-chip' + (has ? '' : ' is-empty')
        chip.textContent = letter
        if (has) { chip.setAttribute('data-jump-letter', letter); chip.setAttribute('aria-label', 'Jump to ' + letter) }
        else { chip.disabled = true; chip.setAttribute('aria-hidden', 'true') }
        this._alpha.appendChild(chip)
      })
    }

    _updateActiveLetter() {
      if (!this._alpha || this._alpha.hidden) return
      const anchors = this._listEl.querySelectorAll('[data-letter-anchor]')
      let current = null
      const top = this._listEl.scrollTop
      anchors.forEach((a) => { if (a.offsetTop - 10 <= top) current = a.getAttribute('data-letter-anchor') })
      if (!current && anchors.length) current = anchors[0].getAttribute('data-letter-anchor')
      this._alpha.querySelectorAll('.alpha-chip').forEach((chip) => {
        chip.classList.toggle('is-active', chip.getAttribute('data-jump-letter') === current)
      })
    }
  }
  customElements.define('tv-nav-workspace', TvNavWorkspace)
})()
