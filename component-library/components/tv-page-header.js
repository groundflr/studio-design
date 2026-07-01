/* ============================================================
   <tv-page-header>  —  Traverse component library
   The standard page header on the org / workspace / system-admin
   pages: an uppercase overline, the page title, a description, and
   optional primary + secondary actions sitting inline with the
   title. Lifted from the dashboard `.org-page-header`.

   The actions are optional and independent, so the header covers
   all three cases: both buttons, one button, or none. Composes
   <tv-button>.

   Single source of truth: edit THIS file and every page updates.

   Usage:
     <tv-page-header overline="Workspace" title="L&D Hub"
       description="Manage members, integrations and settings."
       primary-label="Add user" primary-icon="plus"
       secondary-label="Invite"></tv-page-header>

     <tv-page-header title="Members" primary-label="Add user"></tv-page-header>
     <tv-page-header overline="Organisation" title="Acme Org"></tv-page-header>

   Attributes:
     overline         uppercase kicker (optional)
     title            page title (or slotted text)
     description      supporting line (optional)
     primary-label    shows the primary button (optional)
     primary-icon     leading icon on the primary (plus | rotate | check | send)
     secondary-label  shows the secondary button (optional)
     secondary-icon   leading icon on the secondary
   Slots: actions (override the built-in buttons with your own)
   Events: tv-primary · tv-secondary
   Type: reads the shared role classes .tv-overline / .tv-h1 / .tv-body
     (defined once from the --text-* tokens in colors_and_type.css and
     adopted via window.__tvType). This file holds no type literals —
     change the look at the token source, not here.
   Tokens: --text-overline-*, --text-h1-*, --text-body-* (type roles), --tv-font
   ============================================================ */
(() => {
  if (customElements.get('tv-page-header')) return

  class TvPageHeader extends HTMLElement {
    static get observedAttributes() {
      return ['overline', 'title', 'description', 'primary-label', 'primary-icon', 'secondary-label', 'secondary-icon']
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
    _onClick = (e) => {
      const btn = e.target.closest && e.target.closest('[data-act]')
      if (!btn) return
      const id = btn.getAttribute('data-act')
      this.dispatchEvent(new CustomEvent(id === 'primary' ? 'tv-primary' : 'tv-secondary', { bubbles: true, composed: true }))
    }
    render() {
      const overline = this.getAttribute('overline')
      const title = this.getAttribute('title')
      const description = this.getAttribute('description')
      const pLabel = this.getAttribute('primary-label')
      const pIcon = this.getAttribute('primary-icon')
      const sLabel = this.getAttribute('secondary-label')
      const sIcon = this.getAttribute('secondary-icon')
      const titleText = title != null ? title : '<slot></slot>'

      const hasActions = pLabel != null || sLabel != null || this.querySelector('[slot="actions"]')
      // secondary before primary (per the button do/don't)
      const secondary = sLabel != null
        ? `<tv-button variant="secondary"${sIcon ? ` icon="${sIcon}"` : ''} data-act="secondary">${sLabel}</tv-button>`
        : ''
      const primary = pLabel != null
        ? `<tv-button variant="primary"${pIcon ? ` icon="${pIcon}"` : ''} data-act="primary">${pLabel}</tv-button>`
        : ''

      // Type (weight/size/leading/tracking/colour) comes from the shared role
      // classes — .tv-overline / .tv-h1 / .tv-body — defined once from the
      // --text-* tokens. This component owns ONLY layout + spacing below.
      this.shadowRoot.innerHTML = `
        <style>
          :host{ display:block; font-family:var(--tv-font,'Geist','Inter',system-ui,sans-serif); }
          .header{ display:flex; align-items:flex-start; justify-content:space-between; gap:16px; }
          .text{ flex:1 1 auto; min-width:0; }
          .ov{ margin:0 0 6px; }        /* overline spacing only — type via .tv-overline */
          .sub{ margin:6px 0 0; }       /* description spacing only — type via .tv-body, colour re-pointed inline */
          .sub:empty{ display:none; }
          .actions{ display:flex; gap:8px; flex-shrink:0; align-items:center; }
          .actions:empty{ display:none; }
        </style>
        <div class="header" part="header">
          <div class="text">
            ${overline != null ? `<span class="tv-overline ov">${overline}</span>` : ''}
            <h1 class="tv-h1" part="title">${titleText}</h1>
            ${description != null ? `<p class="tv-body sub" style="color:var(--fg-3,#64748b)">${description}</p>` : ''}
          </div>
          <div class="actions" part="actions">
            ${hasActions ? `<slot name="actions">${secondary}${primary}</slot>` : ''}
          </div>
        </div>
      `
      if (window.__tvType) window.__tvType(this.shadowRoot)
    }
  }
  customElements.define('tv-page-header', TvPageHeader)
})()
