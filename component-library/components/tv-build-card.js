/* ============================================================
   <tv-build-card>  —  Traverse component library
   A "starting point" card: an icon + title, an abstract placeholder
   graphic that illustrates the task type, a one-line description, and
   a primary action. Used in a grid of get-started launch points (the
   role-specific things you can set up / build next).

   The placeholder graphic is a token-built skeleton (rectangles, lines,
   dots) — NOT an illustrated character or hand-drawn art — so it stays
   inside the design-system rules.

   Usage:
     <tv-build-card icon="layout-grid" accent="sky" graphic="workspaces"
       title="Add a workspace" desc="Create a space for a team or department."
       cta="Get started" value="add-workspace"></tv-build-card>
     el.addEventListener('tv-action', e => route(e.detail.value))

   Attributes:
     icon      leading Lucide icon
     accent    --cat-* family for the icon tile (indigo|purple|sky|teal|green|orange|pink|red|yellow|grey)
     graphic   placeholder skeleton variant:
               workspaces | users | settings | chart | simulation | grading | content | templates
     title     card title
     desc      one-line description
     cta       action label (default "Get started")
     value     identifier returned in tv-action
     featured  larger emphasis (accent-tinted header)
     disabled  non-interactive
   Events (bubble, composed): tv-action  detail: { value }
   Tokens: --cat-*, --primary-100/300/600, --surface-0/50/100/200/300/500/700, --radius-md/lg.
   ============================================================ */
(() => {
  if (customElements.get('tv-build-card')) return

  const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const CAT = { indigo:'--cat-indigo', purple:'--cat-purple', sky:'--cat-sky', teal:'--cat-teal', green:'--cat-green', orange:'--cat-orange', pink:'--cat-pink', red:'--cat-red', yellow:'--cat-yellow', grey:'--cat-grey' }

  // Abstract, token-built skeletons. Each returns markup placed inside .graphic.
  const GRAPHICS = {
    workspaces: '<div class="g-row">' + '<span class="g-tile"></span>'.repeat(3) + '</div>',
    users: '<div class="g-people">' + ('<span class="g-person"><span class="g-dot"></span><span class="g-lines"><i></i><i></i></span></span>').repeat(3) + '</div>',
    settings: '<div class="g-panel">' + ('<span class="g-set"><i class="g-lbl"></i><span class="g-toggle"></span></span>').repeat(3) + '</div>',
    chart: '<div class="g-chart"><span class="g-bar" style="height:40%"></span><span class="g-bar" style="height:70%"></span><span class="g-bar" style="height:55%"></span><span class="g-bar" style="height:90%"></span><span class="g-bar" style="height:65%"></span></div>',
    simulation: '<div class="g-chat"><span class="g-bubble in"></span><span class="g-bubble out"></span><span class="g-bubble in short"></span></div>',
    grading: '<div class="g-panel">' + ('<span class="g-check"><span class="g-box"></span><i class="g-lbl"></i></span>').repeat(3) + '</div>',
    content: '<div class="g-doc"><i></i><i></i><i class="short"></i><i></i></div>',
    templates: '<div class="g-row">' + ('<span class="g-thumb"><i></i><i></i></span>').repeat(3) + '</div>',
    environment: '<div class="g-stage"><span class="g-stage-floor"></span><span class="g-stage-obj a"></span><span class="g-stage-obj b"></span><span class="g-stage-fig"></span></div>',
  }

  class TvBuildCard extends HTMLElement {
    static get observedAttributes() {
      return ['icon', 'accent', 'graphic', 'title', 'desc', 'cta', 'value', 'featured', 'disabled']
    }
    constructor() {
      super()
      this.attachShadow({ mode: 'open' })
    }
    connectedCallback() { this.render() }
    attributeChangedCallback() { if (this.shadowRoot) this.render() }

    render() {
      const icon = this.getAttribute('icon') || 'circle'
      const accentVar = CAT[this.getAttribute('accent')] || '--cat-indigo'
      const graphic = GRAPHICS[this.getAttribute('graphic')] || GRAPHICS.content
      const title = this.getAttribute('title') || ''
      const desc = this.getAttribute('desc') || ''
      const cta = this.getAttribute('cta') || 'Get started'
      const value = this.getAttribute('value') || ''
      const disabled = this.hasAttribute('disabled')

      this.shadowRoot.innerHTML = `
        <style>
          :host{ display:block; height:100%; font-family:var(--tv-font,'Geist','Inter',system-ui,sans-serif); }
          .card{ display:flex; flex-direction:column; height:100%; gap:14px; box-sizing:border-box;
            padding:18px; background:var(--surface-0,#fff);
            border:1px solid var(--surface-200,#e2e8f0); border-radius:var(--radius-lg,12px);
            transition:border-color .12s, box-shadow .12s; }
          .card:hover{ border-color:var(--primary-300,#a5b4fc); }
          :host([featured]) .card{ box-shadow:inset 0 0 0 1px var(--primary-600,#4f46e5); border-color:var(--primary-600,#4f46e5); }
          .head{ display:flex; align-items:center; gap:10px; }
          .ico{ width:32px; height:32px; border-radius:var(--radius-md,8px); display:grid; place-items:center;
            font-size:17px; line-height:1; background:color-mix(in srgb, var(${accentVar}) 12%, #fff); color:var(${accentVar}); }
          .title{ } /* .tv-body-strong */
          /* placeholder graphic frame — faint accent wash so each card carries colour */
          .graphic{ position:relative; height:96px; border-radius:var(--radius-md,8px);
            background:color-mix(in srgb, var(${accentVar}) 6%, var(--surface-50,#f8fafc));
            border:1px solid color-mix(in srgb, var(${accentVar}) 14%, var(--surface-100,#f1f5f9));
            padding:12px; display:flex; align-items:center; justify-content:center; overflow:hidden; }
          .desc{ color:var(--surface-500,#64748b); flex:1 1 auto; } /* .tv-body-sm */
          .foot{ margin-top:auto; }
          /* --- skeleton primitives (all token-built, abstract) --- */
          .g-row{ display:flex; gap:8px; width:100%; }
          .g-tile{ flex:1; height:56px; border-radius:6px; background:var(--surface-200,#e2e8f0); }
          .g-people{ display:flex; flex-direction:column; gap:8px; width:100%; }
          .g-person{ display:flex; align-items:center; gap:8px; }
          .g-dot{ width:16px; height:16px; border-radius:999px; background:color-mix(in srgb, var(${accentVar}) 30%, var(--surface-200,#e2e8f0)); flex:0 0 auto; }
          .g-lines{ display:flex; flex-direction:column; gap:4px; flex:1; }
          .g-lines i{ height:5px; border-radius:3px; background:var(--surface-200,#e2e8f0); }
          .g-lines i:last-child{ width:60%; }
          .g-panel{ display:flex; flex-direction:column; gap:8px; width:100%; }
          .g-set{ display:flex; align-items:center; justify-content:space-between; gap:8px; }
          .g-lbl{ height:6px; width:52%; border-radius:3px; background:var(--surface-200,#e2e8f0); display:block; }
          .g-toggle{ width:22px; height:12px; border-radius:999px; background:color-mix(in srgb, var(${accentVar}) 35%, var(--surface-200,#e2e8f0)); flex:0 0 auto; }
          .g-chart{ display:flex; align-items:flex-end; gap:7px; height:100%; width:100%; }
          .g-bar{ flex:1; border-radius:3px 3px 0 0; background:color-mix(in srgb, var(${accentVar}) 28%, var(--surface-200,#e2e8f0)); }
          .g-chat{ display:flex; flex-direction:column; gap:7px; width:100%; }
          .g-bubble{ height:14px; border-radius:8px; background:var(--surface-200,#e2e8f0); }
          .g-bubble.in{ width:66%; }
          .g-bubble.out{ width:52%; align-self:flex-end; background:color-mix(in srgb, var(${accentVar}) 30%, var(--surface-200,#e2e8f0)); }
          .g-bubble.short{ width:40%; }
          .g-check{ display:flex; align-items:center; gap:8px; }
          .g-box{ width:14px; height:14px; border-radius:4px; box-shadow:inset 0 0 0 2px var(--surface-300,#cbd5e1); flex:0 0 auto; }
          .g-check:first-child .g-box{ background:color-mix(in srgb, var(${accentVar}) 40%, #fff); box-shadow:none; }
          .g-doc{ display:flex; flex-direction:column; gap:6px; width:100%; }
          .g-doc i{ height:6px; border-radius:3px; background:var(--surface-200,#e2e8f0); }
          .g-doc i.short{ width:55%; }
          .g-thumb{ flex:1; height:56px; border-radius:6px; background:var(--surface-100,#f1f5f9);
            border:1px solid var(--surface-200,#e2e8f0); display:flex; flex-direction:column; gap:4px; padding:8px; justify-content:center; }
          .g-thumb i{ height:5px; border-radius:3px; background:var(--surface-200,#e2e8f0); }
          .g-thumb i:last-child{ width:60%; }
          .g-stage{ position:relative; width:100%; height:100%; }
          .g-stage-floor{ position:absolute; left:8%; right:8%; bottom:30%; height:2px; border-radius:2px; background:color-mix(in srgb, var(${accentVar}) 30%, var(--surface-200,#e2e8f0)); }
          .g-stage-obj{ position:absolute; bottom:30%; width:16px; border-radius:3px 3px 0 0; }
          .g-stage-obj.a{ left:26%; height:24px; background:var(--surface-200,#e2e8f0); }
          .g-stage-obj.b{ left:54%; height:36px; background:color-mix(in srgb, var(${accentVar}) 28%, var(--surface-200,#e2e8f0)); }
          .g-stage-fig{ position:absolute; bottom:30%; left:40%; width:12px; height:12px; border-radius:999px; background:color-mix(in srgb, var(${accentVar}) 34%, var(--surface-200,#e2e8f0)); }
        </style>
        <div class="card">
          <div class="head">
            <span class="ico" aria-hidden="true"><i class="${window.__tvIcon ? window.__tvIcon(icon) : 'icon-' + icon}"></i></span>
            <span class="title tv-body-strong">${esc(title)}</span>
          </div>
          <div class="graphic" aria-hidden="true">${graphic}</div>
          <p class="desc tv-body-sm">${esc(desc)}</p>
          <div class="foot">
            <tv-button variant="${this.hasAttribute('featured') ? 'primary' : 'secondary'}" size="sm" ${disabled ? 'disabled' : ''} data-cta>${esc(cta)}</tv-button>
          </div>
        </div>
      `
      if (window.__tvType) window.__tvType(this.shadowRoot)
      if (window.__tvIcons) window.__tvIcons(this.shadowRoot)

      if (!this._bound) {
        this._bound = true
        // Bound once on the persistent shadowRoot; read value live so it survives re-renders.
        this.shadowRoot.addEventListener('click', (e) => {
          if (this.hasAttribute('disabled')) return
          if (e.target.closest && e.target.closest('[data-cta]')) {
            this.dispatchEvent(new CustomEvent('tv-action', { bubbles: true, composed: true, detail: { value: this.getAttribute('value') || '' } }))
          }
        })
      }
    }
  }
  customElements.define('tv-build-card', TvBuildCard)
})()
