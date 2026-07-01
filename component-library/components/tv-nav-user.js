/* ============================================================
   <tv-nav-user>  —  Traverse component library
   The bottom-pinned user profile button in the side nav. Avatar +
   name + chevron; clicking opens a small menu (View profile /
   Sign out). Composes <tv-avatar>. Lifted from the dashboard
   `.sb-user` / `.sb-user-menu`.

   Single source of truth: edit THIS file and every page updates.

   Usage:
     <tv-nav-user name="Sarah Chen"></tv-nav-user>
     <tv-nav-user name="Sarah Chen" src="/img/sarah.jpg" collapsed></tv-nav-user>

   Attributes:
     name       person's name (avatar initials + label)
     src        optional avatar image URL
     collapsed  boolean — avatar only; menu opens to the right
     open       reflected — menu visibility (toggled on click)

   Events: tv-action (detail:{ id:'view-profile' | 'sign-out' })
   Tokens: --surface-100/200/400/900, --error-500/100, --radius-md, --tv-font
   ============================================================ */
(() => {
  if (customElements.get('tv-nav-user')) return

  class TvNavUser extends HTMLElement {
    static get observedAttributes() {
      return ['name', 'src', 'collapsed', 'open']
    }
    constructor() {
      super()
      this.attachShadow({ mode: 'open' })
    }
    connectedCallback() {
      this.render()
      this.shadowRoot.addEventListener('click', this._onClick)
      document.addEventListener('click', this._onDocClick)
    }
    disconnectedCallback() {
      document.removeEventListener('click', this._onDocClick)
    }
    attributeChangedCallback() {
      if (this.shadowRoot && this.shadowRoot.childElementCount) this.render()
    }
    _onDocClick = (e) => {
      if (this.hasAttribute('open') && !this.contains(e.target)) this.removeAttribute('open')
    }
    _onClick = (e) => {
      const item = e.target.closest && e.target.closest('[data-action]')
      if (item) {
        this.removeAttribute('open')
        this.dispatchEvent(
          new CustomEvent('tv-action', { bubbles: true, composed: true, detail: { id: item.getAttribute('data-action') } })
        )
        return
      }
      if (e.target.closest && e.target.closest('.trigger')) {
        this.toggleAttribute('open')
      }
    }
    render() {
      const name = this.getAttribute('name') || ''
      const src = this.getAttribute('src')
      const collapsed = this.hasAttribute('collapsed')
      const open = this.hasAttribute('open')
      const avatar = `<tv-avatar size="sm" name="${name}"${src ? ` src="${src}"` : ''}></tv-avatar>`

      this.shadowRoot.innerHTML = `
        <style>
          :host{ display:block; position:relative;
            font-family:var(--tv-font,'Geist','Inter',system-ui,sans-serif); }
          .trigger{
            display:grid; grid-template-columns:28px 1fr 16px; gap:10px; align-items:center;
            width:100%; padding:6px 8px; border:none; background:transparent;
            border-radius:var(--radius-md,8px); cursor:pointer; text-align:left;
            transition:background var(--dur-quick,120ms) var(--ease-std,ease);
          }
          .trigger:hover{ background:var(--surface-100,#f1f5f9); }
          :host([open]) .trigger{ background:var(--surface-100,#f1f5f9); }
          .name{ overflow:hidden; text-overflow:ellipsis; white-space:nowrap; } /* layout only — type via .tv-label */
          .chev{ width:16px; height:16px; color:var(--surface-400,#94a3b8); display:inline-flex;
            align-items:center; justify-content:center; font-size:16px; line-height:1;
            transition:transform var(--dur-quick,120ms) var(--ease-std,ease); }
          :host([open]) .chev{ transform:rotate(180deg); }

          .menu{
            position:absolute; left:0; right:0; bottom:calc(100% + 6px);
            background:var(--surface-0,#fff); border:.5px solid var(--surface-200,#e2e8f0);
            border-radius:10px; box-shadow:0 8px 24px rgba(15,23,42,.08);
            padding:6px; display:none; flex-direction:column; gap:2px; z-index:50;
          }
          :host([open]) .menu{ display:flex; }
          .mi{
            display:grid; grid-template-columns:20px 1fr; gap:10px; align-items:center;
            width:100%; padding:8px 10px; border:none; background:transparent;
            border-radius:6px; cursor:pointer; text-align:left;
          } /* type via .tv-label; .mi.danger colour below outranks the role */
          .mi:hover{ background:var(--surface-100,#f1f5f9); }
          .mi .mic{ width:16px; height:16px; display:inline-flex; align-items:center; justify-content:center;
            font-size:16px; line-height:1; color:inherit; }
          .mi.danger{ color:var(--error-500,#D92D20); }
          .mi.danger:hover{ background:var(--error-100,#fee2e2); }

          /* collapsed — avatar only; menu opens to the right */
          :host([collapsed]) .trigger{ grid-template-columns:28px; justify-content:center; padding:6px 0; }
          :host([collapsed]) .name,
          :host([collapsed]) .chev{ display:none; }
          :host([collapsed]) .menu{ left:calc(100% + 6px); right:auto; bottom:0; min-width:180px; }
        </style>
        <button class="trigger" part="trigger" aria-haspopup="true" aria-expanded="${open}">
          ${avatar}
          <span class="name tv-label">${name}</span>
          <span class="chev"><i class="${window.__tvIcon ? window.__tvIcon('chevron') : 'icon-chevron-up'}"></i></span>
        </button>
        <div class="menu" role="menu">
          <button class="mi tv-label" role="menuitem" data-action="view-profile"><span class="mic"><i class="icon-user"></i></span>View profile</button>
          <button class="mi tv-label danger" role="menuitem" data-action="sign-out"><span class="mic"><i class="icon-log-out"></i></span>Sign out</button>
        </div>
      `
      if (window.__tvType) window.__tvType(this.shadowRoot)
      if (window.__tvIcons) window.__tvIcons(this.shadowRoot)
    }
  }
  customElements.define('tv-nav-user', TvNavUser)
})()
