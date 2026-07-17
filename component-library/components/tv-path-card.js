/* ============================================================
   <tv-path-card>  —  Traverse component library
   A large, selectable "choose your path" card for a first-run
   chooser (e.g. "What are you setting up — Simulations or
   Assessments?"). Icon tile (family-accented) or a row of
   illustration thumbnails, a title, a purpose line, and a
   selected state. Clicking emits tv-select; the parent manages
   which card is selected (single-select group).

   Usage:
     <tv-path-card value="simulations" accent="sky" icon="film"
       label="Simulations"
       desc="Build interactive scenarios candidates work through."
       images="../../assets/sim-icons/chat.png,../../assets/sim-icons/email.png"></tv-path-card>
     el.addEventListener('tv-select', (e) => choosePath(e.detail.value))

   Attributes:
     value     identifier returned in tv-select detail
     icon      leading Lucide icon (used when no images given)
     label     card title
     desc      one-line purpose
     accent    family colour: indigo|purple|sky|teal|green|orange|pink|red|yellow|grey
     images    optional comma-separated image srcs (sanctioned illustrations)
     selected  reflected; the chosen state (primary border + tint + check)
   Events (bubble, composed): tv-select  detail: { value }
   Tokens: --cat-*, --primary-50/300/600, --surface-0/200/500/900, --radius-lg/md.
   ============================================================ */
(() => {
  if (customElements.get('tv-path-card')) return

  const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const CAT = { indigo:'--cat-indigo', purple:'--cat-purple', sky:'--cat-sky', teal:'--cat-teal', green:'--cat-green', orange:'--cat-orange', pink:'--cat-pink', red:'--cat-red', yellow:'--cat-yellow', grey:'--cat-grey' }

  class TvPathCard extends HTMLElement {
    static get observedAttributes() {
      return ['value', 'icon', 'label', 'desc', 'accent', 'images', 'selected']
    }
    constructor() {
      super()
      this.attachShadow({ mode: 'open' })
    }
    connectedCallback() { this.render() }
    attributeChangedCallback() { if (this.shadowRoot) this.render() }
    get selected() { return this.hasAttribute('selected') }
    set selected(v) { v ? this.setAttribute('selected', '') : this.removeAttribute('selected') }

    render() {
      const value = this.getAttribute('value') || ''
      const icon = this.getAttribute('icon') || 'circle'
      const label = this.getAttribute('label') || ''
      const desc = this.getAttribute('desc') || ''
      const accentVar = CAT[this.getAttribute('accent')] || '--cat-indigo'
      const selected = this.hasAttribute('selected')
      const imgs = (this.getAttribute('images') || '').split(',').map(s => s.trim()).filter(Boolean)

      const media = imgs.length
        ? '<div class="imgs">' + imgs.map(s => '<img src="' + esc(s) + '" alt="" loading="lazy">').join('') + '</div>'
        : '<span class="ico" aria-hidden="true"><i class="' + (window.__tvIcon ? window.__tvIcon(icon) : 'icon-' + icon) + '"></i></span>'

      this.shadowRoot.innerHTML = `
        <style>
          :host{ display:block; font-family:var(--tv-font,'Geist','Inter',system-ui,sans-serif); }
          button{ display:flex; flex-direction:column; gap:12px; width:100%; height:100%; text-align:left;
            padding:18px; background:var(--surface-0,#fff); cursor:pointer; font-family:inherit;
            border:1px solid var(--surface-200,#e2e8f0); border-radius:var(--radius-lg,12px);
            transition:border-color .12s, background .12s, box-shadow .12s; }
          button:hover{ border-color:var(--primary-300,#a5b4fc); }
          button:focus-visible{ outline:none; border-color:var(--primary-600,#4f46e5);
            box-shadow:0 0 0 3px var(--primary-100,#e0e7ff); }
          :host([selected]) button{ border-color:var(--primary-600,#4f46e5);
            background:var(--primary-50,#eef2ff); box-shadow:inset 0 0 0 1px var(--primary-600,#4f46e5); }
          .top{ display:flex; align-items:flex-start; justify-content:space-between; }
          .ico{ width:44px; height:44px; border-radius:var(--radius-md,10px); display:grid; place-items:center;
            font-size:22px; line-height:1;
            background:color-mix(in srgb, var(${accentVar}) 12%, #fff); color:var(${accentVar}); }
          .check{ width:22px; height:22px; border-radius:999px; display:none; place-items:center;
            background:var(--primary-600,#4f46e5); color:#fff; font-size:13px; }
          :host([selected]) .check{ display:grid; }
          .title{ } /* type via .tv-h5 */
          .desc{ margin-top:2px; color:var(--surface-500,#64748b); } /* size via .tv-body-sm */
          .imgs{ display:flex; gap:8px; margin-top:2px; }
          .imgs img{ width:40px; height:40px; border-radius:var(--radius-md,8px); object-fit:cover;
            background:var(--surface-100,#f1f5f9); }
        </style>
        <button type="button" role="radio" aria-checked="${selected}" data-value="${esc(value)}">
          <div class="top">
            ${media}
            <span class="check" aria-hidden="true"><i class="${window.__tvIcon ? window.__tvIcon('check') : 'icon-check'}"></i></span>
          </div>
          <div>
            <div class="title tv-h5">${esc(label)}</div>
            <div class="desc tv-body-sm">${esc(desc)}</div>
          </div>
        </button>
      `
      if (window.__tvType) window.__tvType(this.shadowRoot)
      if (window.__tvIcons) window.__tvIcons(this.shadowRoot)

      const btn = this.shadowRoot.querySelector('button')
      if (btn) {
        btn.addEventListener('click', () => {
          this.dispatchEvent(new CustomEvent('tv-select', { bubbles: true, composed: true, detail: { value: value } }))
        })
      }
    }
  }
  customElements.define('tv-path-card', TvPathCard)
})()
