/* ============================================================
   <tv-start-step>  —  Traverse component library
   One step in a guided get-started / onboarding path. A numbered
   row: sequence eyebrow, icon tile, title + description, and a
   trailing action. Three states carry "what's available to you":
   todo (actionable), done (completed, muted + check), locked
   (prerequisite not met yet — action disabled).

   Usage:
     <tv-start-step number="1" icon="film" variant="primary"
       title="Create a simulation"
       desc="Build the scenario candidates work through."
       cta="Create simulation"></tv-start-step>

     <tv-start-step number="3" icon="pencil" status="locked"
       title="Build a test" desc="Needs a simulation and assessment first."
       cta="Create test"></tv-start-step>

     el.addEventListener('tv-action', (e) => openCreateFlow())

   Attributes:
     number    sequence label (rendered as "Step N"); optional
     icon      leading Lucide icon name for the tile
     title     step title
     desc      one-line description
     cta       action button label
     variant   primary | secondary  (button style; default secondary)
     status    todo | done | locked (default todo)
   Events (bubble, composed): tv-action  detail: { number }
   Composes <tv-button>. Tokens: --surface-0/100/200/400/500/900,
     --primary-50/600, --success-100/600, --radius-lg/md.
   ============================================================ */
(() => {
  if (customElements.get('tv-start-step')) return

  const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  class TvStartStep extends HTMLElement {
    static get observedAttributes() {
      return ['number', 'icon', 'title', 'desc', 'cta', 'variant', 'status']
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
      const number = this.getAttribute('number') || ''
      const icon = this.getAttribute('icon') || 'circle'
      const title = this.getAttribute('title') || ''
      const desc = this.getAttribute('desc') || ''
      const cta = this.getAttribute('cta') || ''
      const variant = this.getAttribute('variant') || 'secondary'
      const status = this.getAttribute('status') || 'todo'
      const done = status === 'done'
      const locked = status === 'locked'
      const tileIcon = done ? 'check' : (locked ? 'lock' : icon)

      // Trailing action: a check tag when done, a (disabled when locked) button otherwise.
      const action = done
        ? `<span class="done-tag tv-label-sm"><i class="${window.__tvIcon ? window.__tvIcon('check') : 'icon-check'}"></i>Done</span>`
        : (cta ? `<tv-button variant="${esc(variant)}" size="sm" ${locked ? 'disabled' : ''}>${esc(cta)}</tv-button>` : '')

      this.shadowRoot.innerHTML = `
        <style>
          :host{ display:block; font-family:var(--tv-font,'Geist','Inter',system-ui,sans-serif); }
          .step{ display:flex; align-items:center; gap:16px;
            padding:16px 18px; background:var(--surface-0,#fff);
            border:1px solid var(--surface-200,#e2e8f0); border-radius:var(--radius-lg,12px); }
          .step.is-done{ background:var(--surface-50,#f8fafc); }
          .step.is-locked{ opacity:.72; }
          .tile{ flex:0 0 auto; width:44px; height:44px; border-radius:var(--radius-md,10px);
            display:grid; place-items:center; font-size:20px; line-height:1;
            background:var(--primary-50,#eef2ff); color:var(--primary-600,#4f46e5); }
          .step.is-done .tile{ background:var(--success-100,#dcfce7); color:var(--success-600,#16a34a); }
          .step.is-locked .tile{ background:var(--surface-100,#f1f5f9); color:var(--surface-400,#94a3b8); }
          .body{ flex:1 1 auto; min-width:0; }
          .eyebrow{ display:block; margin-bottom:2px; } /* type via .tv-eyebrow */
          .eyebrow:empty{ display:none; }
          .title{ } /* type via .tv-body-strong */
          .desc{ margin-top:2px; color:var(--surface-500,#64748b); } /* size via .tv-body-sm */
          .desc:empty{ display:none; }
          .action{ flex:0 0 auto; display:flex; align-items:center; }
          .done-tag{ display:inline-flex; align-items:center; gap:6px;
            color:var(--success-600,#16a34a); }
          .done-tag i{ font-size:15px; line-height:1; }
        </style>
        <div class="step ${done ? 'is-done' : ''} ${locked ? 'is-locked' : ''}">
          <span class="tile" aria-hidden="true"><i class="${window.__tvIcon ? window.__tvIcon(tileIcon) : 'icon-' + tileIcon}"></i></span>
          <div class="body">
            <span class="eyebrow tv-eyebrow">${number ? 'Step ' + esc(number) : ''}</span>
            <div class="title tv-body-strong">${esc(title)}</div>
            <div class="desc tv-body-sm">${esc(desc)}</div>
          </div>
          <div class="action">${action}</div>
        </div>
      `
      if (window.__tvType) window.__tvType(this.shadowRoot)
      if (window.__tvIcons) window.__tvIcons(this.shadowRoot)

      const btn = this.shadowRoot.querySelector('tv-button')
      if (btn) {
        btn.addEventListener('click', () => {
          if (this.getAttribute('status') === 'locked') return
          this.dispatchEvent(new CustomEvent('tv-action', { bubbles: true, composed: true, detail: { number: number } }))
        })
      }
    }
  }
  customElements.define('tv-start-step', TvStartStep)
})()
