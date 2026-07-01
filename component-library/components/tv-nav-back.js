/* ============================================================
   <tv-nav-back>  —  Traverse component library
   The side-nav "back" link that sits at the top of a secondary
   rail (System Admin / Workspace / Organisation settings) and
   returns to the parent surface. Chevron + label; collapses to
   the chevron alone. Lifted from the dashboard `.sa-back`.

   Single source of truth: edit THIS file and every page updates.

   Usage:
     <tv-nav-back label="System Admin"></tv-nav-back>
     <tv-nav-back label="Workspace" collapsed></tv-nav-back>

   Attributes:
     label      text (otherwise the slotted text is used)
     icon       leading icon name (default chevron-left)
     collapsed  boolean — icon only (label hidden, centred)
     href       optional link target (renders an <a> instead of a button)

   Clicks bubble out natively (listen with addEventListener('click', …));
   a semantic `tv-back` event is also dispatched.
   Tokens: --surface-100/500/700/900, --radius-md, --tv-font
   ============================================================ */
(() => {
  if (customElements.get('tv-nav-back')) return

  class TvNavBack extends HTMLElement {
    static get observedAttributes() {
      return ['label', 'icon', 'collapsed', 'href']
    }
    constructor() {
      super()
      this.attachShadow({ mode: 'open' })
    }
    connectedCallback() {
      this.render()
      this.shadowRoot.addEventListener('click', this._onClick)
    }
    attributeChangedCallback() {
      if (this.shadowRoot) this.render()
    }
    _onClick = () => {
      this.dispatchEvent(new CustomEvent('tv-back', { bubbles: true, composed: true }))
    }
    render() {
      const label = this.getAttribute('label')
      const iconName = this.getAttribute('icon') || 'chevron-left'
      const collapsed = this.hasAttribute('collapsed')
      const href = this.getAttribute('href')
      const text = label != null ? label : '<slot></slot>'
      const tag = href != null ? 'a' : 'button'
      const attrs = href != null ? `href="${href}"` : 'type="button"'

      this.shadowRoot.innerHTML = `
        <style>
          :host{ display:block; }
          .back{
            display:flex; align-items:center; gap:6px;
            width:100%; box-sizing:border-box; padding:8px;
            border:none; background:transparent; text-align:left; text-decoration:none;
            border-radius:var(--radius-md,8px); cursor:pointer;
            color:var(--surface-700,#334155);
            font-family:var(--tv-font,'Geist','Inter',system-ui,sans-serif);
            transition:background var(--dur-quick,120ms) var(--ease-std,ease),
                       color var(--dur-quick,120ms) var(--ease-std,ease);
          }
          .back:hover{ background:var(--surface-100,#f1f5f9); color:var(--surface-900,#0f172a); }
          .ic{ display:inline-flex; align-items:center; justify-content:center;
            font-size:14px; line-height:1; color:var(--surface-500,#64748b); flex-shrink:0; }
          .label{ min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; } /* type via .tv-label */

          /* collapsed — chevron only, centred */
          :host([collapsed]) .back{ justify-content:center; padding:8px 0; }
          :host([collapsed]) .label{ display:none; }
          :host([collapsed]) .ic{ font-size:16px; }
        </style>
        <${tag} class="back" part="back" ${attrs} title="${label != null ? label : ''}">
          <span class="ic"><i class="${window.__tvIcon ? window.__tvIcon(iconName) : 'icon-' + iconName}"></i></span>
          <span class="label tv-label">${text}</span>
        </${tag}>
      `
      if (window.__tvType) window.__tvType(this.shadowRoot)
      if (window.__tvIcons) window.__tvIcons(this.shadowRoot)
    }
  }
  customElements.define('tv-nav-back', TvNavBack)
})()
