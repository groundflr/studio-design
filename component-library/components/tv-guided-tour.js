/* ============================================================
   <tv-guided-tour>  —  Traverse component library
   A step-through onboarding tour. Walks a set of "pieces" one
   at a time, top of hierarchy → smallest parts: each step names
   its tier, says plainly what the piece is, shows its sub-parts
   as chips, and offers the matching create action. Progress
   dots, Back / Next / Skip. Learning ties straight to doing.

   Usage:
     <tv-guided-tour id="tour"></tv-guided-tour>
     customElements.whenDefined('tv-guided-tour').then(() => {
       document.getElementById('tour').steps = [
         { tier:'Foundation', icon:'box', accent:'teal',
           title:'Environment',
           body:'The world your content is built in …',
           chips:['Characters','Terms','Tone'],
           cta:'Create environment', ctaValue:'environment' },
         …
       ]
     })
     tour.addEventListener('tv-action',  e => openCreate(e.detail.value))
     tour.addEventListener('tv-dismiss', () => hideTour())

   Property:
     steps  Array<{ tier, icon, accent, title, body, chips?, cta?, ctaValue? }>
            accent = --cat-* family (indigo|purple|sky|teal|green|orange|pink|red|yellow|grey)
   Methods:
     reset()          jump back to the first step
     go(i)            jump to step i
   Events (bubble, composed):
     tv-action   detail { value, step }   a step's CTA was pressed
     tv-step     detail { index, total }  navigated to a step
     tv-dismiss  detail { reason }         skipped ('skip') or finished ('done')
   Tokens: --cat-*, --primary-50/100/600, --surface-0/100/200/300/500/700/900,
           --radius-md/lg, --dur-base.
   ============================================================ */
(() => {
  if (customElements.get('tv-guided-tour')) return

  const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const CAT = { indigo:'--cat-indigo', purple:'--cat-purple', sky:'--cat-sky', teal:'--cat-teal', green:'--cat-green', orange:'--cat-orange', pink:'--cat-pink', red:'--cat-red', yellow:'--cat-yellow', grey:'--cat-grey' }

  class TvGuidedTour extends HTMLElement {
    constructor() {
      super()
      this.attachShadow({ mode: 'open' })
      this._steps = []
      this._i = 0
    }
    connectedCallback() {
      this._upgradeProperty('steps')
      this.render()
      // Bind the click router ONCE — render() replaces innerHTML but the listener
      // lives on the persistent shadowRoot, so re-binding per render would stack up.
      if (!this._bound) {
        this._bound = true
        this.shadowRoot.addEventListener('click', (e) => this._onClick(e))
      }
    }
    _onClick(e) {
      const t = e.target.closest && e.target.closest('[data-act]')
      if (!t || t.hasAttribute('disabled')) return
      const act = t.getAttribute('data-act')
      if (act === 'back') { this.go(this._i - 1); return }
      if (act === 'next') { this.go(this._i + 1); return }
      if (act === 'skip') { this.dispatchEvent(new CustomEvent('tv-dismiss', { bubbles: true, composed: true, detail: { reason: 'skip' } })); return }
      if (act === 'done') { this.dispatchEvent(new CustomEvent('tv-dismiss', { bubbles: true, composed: true, detail: { reason: 'done' } })); return }
      if (act === 'cta') {
        const s = this._steps[this._i] || {}
        this.dispatchEvent(new CustomEvent('tv-action', { bubbles: true, composed: true, detail: { value: s.ctaValue, step: this._i } }))
      }
    }
    // If a property was set before the element upgraded, the value shadows the
    // prototype accessor — replay it through the setter so it takes effect.
    _upgradeProperty(prop) {
      if (Object.prototype.hasOwnProperty.call(this, prop)) {
        const v = this[prop]
        delete this[prop]
        this[prop] = v
      }
    }
    get steps() { return this._steps }
    set steps(v) {
      this._steps = Array.isArray(v) ? v : []
      this._i = 0
      if (this.shadowRoot) this.render()
    }
    reset() { this.go(0) }
    go(i) {
      const n = this._steps.length
      if (!n) return
      this._i = Math.max(0, Math.min(i, n - 1))
      this.render()
      this.dispatchEvent(new CustomEvent('tv-step', { bubbles: true, composed: true, detail: { index: this._i, total: n } }))
    }

    render() {
      const steps = this._steps
      const total = steps.length
      const i = this._i
      const s = steps[i] || {}
      const accentVar = CAT[s.accent] || '--cat-indigo'
      const isFirst = i === 0
      const isLast = i === total - 1
      const chips = Array.isArray(s.chips) ? s.chips : []

      const dots = Array.from({ length: total }, (_, k) =>
        `<span class="dot${k === i ? ' is-on' : ''}" aria-hidden="true"></span>`).join('')

      this.shadowRoot.innerHTML = `
        <style>
          :host{ display:block; font-family:var(--tv-font,'Geist','Inter',system-ui,sans-serif); }
          .card{ background:var(--surface-0,#fff); border:1px solid var(--surface-200,#e2e8f0);
            border-radius:var(--radius-lg,12px); overflow:hidden; }
          .top{ display:flex; align-items:center; justify-content:space-between; gap:12px;
            padding:12px 16px; border-bottom:1px solid var(--surface-100,#f1f5f9); }
          .progress{ display:flex; align-items:center; gap:10px; }
          .dots{ display:flex; gap:5px; }
          .dot{ width:6px; height:6px; border-radius:999px; background:var(--surface-300,#cbd5e1); }
          .dot.is-on{ background:var(--primary-600,#4f46e5); }
          .count{ color:var(--surface-500,#64748b); } /* size via .tv-body-sm */
          .skip{ display:inline-flex; align-items:center; gap:4px; border:0; background:transparent;
            cursor:pointer; color:var(--surface-500,#64748b); font:inherit; padding:4px; border-radius:6px; }
          .skip:hover{ color:var(--surface-800,#1e293b); }
          .skip i{ font-size:15px; }
          .body{ display:flex; gap:16px; padding:20px 16px; align-items:flex-start;
            animation:tourStep var(--dur-base,0.18s) ease both; }
          @media (prefers-reduced-motion: reduce){ .body{ animation:none; } }
          @keyframes tourStep{ from{ opacity:0; transform:translateY(6px); } to{ opacity:1; transform:none; } }
          .ico{ flex:0 0 auto; width:48px; height:48px; border-radius:var(--radius-lg,12px);
            display:grid; place-items:center; font-size:24px; line-height:1;
            background:color-mix(in srgb, var(${accentVar}) 12%, #fff); color:var(${accentVar}); }
          .txt{ flex:1 1 auto; min-width:0; }
          .tier{ margin-bottom:2px; } /* .tv-overline */
          .title{ } /* .tv-h3 */
          .desc{ margin-top:6px; color:var(--surface-600,#475569); } /* .tv-body */
          .chips{ display:flex; flex-wrap:wrap; gap:6px; margin-top:12px; }
          .chip{ display:inline-flex; align-items:center; padding:3px 9px; border-radius:999px;
            background:var(--surface-100,#f1f5f9); color:var(--surface-600,#475569);
            border:1px solid var(--surface-200,#e2e8f0); }
          .chips:empty{ display:none; }
          .foot{ display:flex; align-items:center; gap:8px; padding:12px 16px;
            border-top:1px solid var(--surface-100,#f1f5f9); }
          .foot .spacer{ flex:1 1 auto; }
        </style>
        <div class="card" role="group" aria-label="Guided tour">
          <div class="top">
            <div class="progress">
              <span class="dots">${dots}</span>
              <span class="count tv-body-sm">${total ? (i + 1) + ' / ' + total : ''}</span>
            </div>
            <button class="skip" type="button" data-act="skip">
              <span class="tv-body-sm">Skip</span>
              <i class="${window.__tvIcon ? window.__tvIcon('x') : 'icon-x'}" aria-hidden="true"></i>
            </button>
          </div>
          <div class="body">
            <span class="ico" aria-hidden="true"><i class="${window.__tvIcon ? window.__tvIcon(s.icon || 'circle') : 'icon-' + (s.icon || 'circle')}"></i></span>
            <div class="txt">
              <span class="tier tv-overline">${esc(s.tier || '')}</span>
              <div class="title tv-h3">${esc(s.title || '')}</div>
              <p class="desc tv-body">${esc(s.body || '')}</p>
              <div class="chips">${chips.map(c => `<span class="chip tv-body-sm">${esc(c)}</span>`).join('')}</div>
            </div>
          </div>
          <div class="foot">
            <tv-button variant="text" size="sm" data-act="back" ${isFirst ? 'disabled' : ''}>Back</tv-button>
            <span class="spacer"></span>
            ${s.cta ? `<tv-button variant="${isLast ? 'primary' : 'secondary'}" size="sm" data-act="cta">${esc(s.cta)}</tv-button>` : ''}
            ${isLast
              ? (s.cta ? '' : `<tv-button variant="primary" size="sm" data-act="done">Done</tv-button>`)
              : `<tv-button variant="primary" size="sm" data-act="next">Next</tv-button>`}
          </div>
        </div>
      `
      if (window.__tvType) window.__tvType(this.shadowRoot)
      if (window.__tvIcons) window.__tvIcons(this.shadowRoot)
    }
  }
  customElements.define('tv-guided-tour', TvGuidedTour)
})()
