/* ============================================================
   <tv-nav-item>  —  Traverse component library
   The side-nav menu link atom. Icon + label, with the four states
   the sidebar needs: default, hover, active, and collapsed (icon
   only). Lifted from the dashboard `.sb-item` so every sidebar row
   is identical.

   Single source of truth: edit THIS file and every page updates.

   Usage:
     <tv-nav-item icon="layout-dashboard" label="Summary" active></tv-nav-item>
     <tv-nav-item icon="users" label="Users" count="6"></tv-nav-item>
     <tv-nav-item icon="settings" label="Settings" collapsed></tv-nav-item>

   Attributes:
     icon       leading icon name — any Lucide name (e.g. layout-dashboard, users)
     label      text (otherwise the slotted text is used)
     active     boolean — current page (indigo fill, white text)
     collapsed  boolean — icon only (label hidden, centred)
     count      optional trailing number chip (hidden when collapsed)
     href       optional link target (default "#")

   Clicks bubble out natively; listen with el.addEventListener('click', …).
   Tokens: --primary-500, --surface-100, --surface-500/700/900, --tv-font
   ============================================================ */
(() => {
  if (customElements.get('tv-nav-item')) return

  class TvNavItem extends HTMLElement {
    static get observedAttributes() {
      return ['icon', 'label', 'active', 'collapsed', 'count', 'href']
    }
    constructor() {
      super()
      this.attachShadow({ mode: 'open' })
    }
    connectedCallback() {
      this.render()
    }
    attributeChangedCallback(name) {
      if (!this.shadowRoot) return
      // `active` / `collapsed` are purely visual (driven by :host([active]) /
      // :host([collapsed]) CSS). Update them IN PLACE rather than rebuilding the
      // shadow tree — rebuilding destroyed the <a> the user was clicking
      // mid-gesture, which dropped the click and forced a second one to activate
      // the row. Structural attributes (icon/label/count/href) still full-render.
      if (name === 'active' || name === 'collapsed') { this._syncState(); return }
      this.render()
    }
    _syncState() {
      const a = this.shadowRoot.querySelector('a')
      if (!a) { this.render(); return }
      if (this.hasAttribute('active')) a.setAttribute('aria-current', 'page')
      else a.removeAttribute('aria-current')
    }
    render() {
      const iconName = this.getAttribute('icon')
      const label = this.getAttribute('label')
      const active = this.hasAttribute('active')
      const collapsed = this.hasAttribute('collapsed')
      const count = this.getAttribute('count')
      const href = this.getAttribute('href') || '#'
      const icon = `<span class="ic">${iconName ? `<i class="${window.__tvIcon ? window.__tvIcon(iconName) : 'icon-' + iconName}"></i>` : ''}</span>`
      const text = label != null ? label : '<slot></slot>'
      const chip = count != null && count !== '' ? `<span class="count tv-tag">${count}</span>` : ''

      this.shadowRoot.innerHTML = `
        <style>
          :host{ display:block; }
          a{
            display:grid; grid-template-columns:28px 1fr auto; gap:10px;
            align-items:center; padding:8px 10px; border-radius:var(--radius-md,8px);
            text-decoration:none; cursor:pointer; color:var(--surface-700,#334155);
            font-family:var(--tv-font,'Geist','Inter',system-ui,sans-serif);
            transition:background var(--dur-quick,120ms) var(--ease-std,ease),
                       color var(--dur-quick,120ms) var(--ease-std,ease);
          }
          a:hover{ background:var(--surface-100,#f1f5f9); color:var(--surface-900,#0f172a); }
          .ic{ width:28px; height:18px; display:inline-flex; align-items:center; justify-content:center;
            font-size:18px; line-height:1; color:var(--surface-500,#64748b); }
          a:hover .ic{ color:var(--surface-700,#334155); }
          .label{ min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; } /* layout only — type via .tv-label */
          :host .label{ color:inherit; }   /* follow the row colour: default / hover / active */
          .count{ justify-self:end; min-width:20px; height:18px; padding:0 6px;
            display:inline-flex; align-items:center; justify-content:center;
            border-radius:var(--radius-full,9999px); background:var(--surface-200,#e2e8f0); } /* layout only — type via .tv-tag */
          :host .count{ color:var(--surface-600,#475569); }

          /* active — current page */
          :host([active]) a{ background:var(--primary-500,#6366f1); color:#fff;
            box-shadow:0 1px 2px 0 rgba(79,70,229,.25); }
          :host([active]) a:hover{ background:var(--primary-500,#6366f1); }
          :host([active]) .ic{ color:#fff; }
          :host([active]) .count{ background:rgba(255,255,255,.22); color:#fff; }

          /* collapsed — icon only */
          :host([collapsed]) a{ grid-template-columns:28px; justify-content:center; gap:0; padding:8px 0; }
          :host([collapsed]) .label,
          :host([collapsed]) .count{ display:none; }
        </style>
        <a href="${href}" part="link" title="${label != null ? label : ''}"${active ? ' aria-current="page"' : ''}>
          ${icon}<span class="label tv-label">${text}</span>${chip}
        </a>
      `
      if (window.__tvType) window.__tvType(this.shadowRoot)
      if (window.__tvIcons) window.__tvIcons(this.shadowRoot)
    }
  }
  customElements.define('tv-nav-item', TvNavItem)
})()
