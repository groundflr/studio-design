/* ============================================================
   <tv-nav-group>  —  Traverse component library
   A side-nav menu list item group: an optional heading
   (<tv-nav-heading>) followed by a slotted list of <tv-nav-item>s.
   Use it to chunk the sidebar into labelled sections.

   Single source of truth: edit THIS file and every page updates.

   Usage:
     <tv-nav-group heading="Settings">
       <tv-nav-item icon="building" label="Organisation"></tv-nav-item>
       <tv-nav-item icon="layout-grid" label="Workspace"></tv-nav-item>
     </tv-nav-group>

   Attributes:
     heading    optional section label (renders a <tv-nav-heading>)
     collapsed  boolean — propagates to the heading; <tv-sidebar>
                also propagates it to the slotted items

   Tokens: (delegates styling to its children)
   ============================================================ */
(() => {
  if (customElements.get('tv-nav-group')) return

  class TvNavGroup extends HTMLElement {
    static get observedAttributes() {
      return ['heading', 'collapsed']
    }
    constructor() {
      super()
      this.attachShadow({ mode: 'open' })
    }
    connectedCallback() {
      this.render()
    }
    attributeChangedCallback() {
      if (this.shadowRoot) this.render()
    }
    render() {
      const heading = this.getAttribute('heading')
      const collapsed = this.hasAttribute('collapsed')
      const head = heading != null && heading !== ''
        ? `<tv-nav-heading label="${heading}"${collapsed ? ' collapsed' : ''}></tv-nav-heading>`
        : ''
      this.shadowRoot.innerHTML = `
        <style>
          :host{ display:block; }
          .items{ display:flex; flex-direction:column; gap:2px; }
        </style>
        ${head}
        <div class="items" part="items"><slot></slot></div>
      `
    }
  }
  customElements.define('tv-nav-group', TvNavGroup)
})()
