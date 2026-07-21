/* ============================================================
   <tv-setup-stepper>  —  Traverse component library
   A compact, selectable vertical stepper for a guided setup:
   a connected list of steps, each showing a completed / current /
   upcoming state. Clicking a step selects it (the parent swaps the
   working canvas beside it). Completed steps show a check; the
   current step is highlighted.

   Usage:
     <tv-setup-stepper id="steps"></tv-setup-stepper>
     customElements.whenDefined('tv-setup-stepper').then(() => {
       document.getElementById('steps').steps = [
         { id:'details', title:'Organisation details & branding', status:'done' },
         { id:'auth',    title:'Authentication & sign-in',        status:'current' },
         { id:'billing', title:'Billing & subscription',          status:'upcoming', note:'Coming soon' },
       ]
     })
     steps.addEventListener('tv-step-select', e => showCanvas(e.detail.id))

   Property:
     steps  Array<{ id, title, status:'done'|'current'|'upcoming', note? }>
   Methods:
     select(id)  mark a step current + emit tv-step-select
   Events (bubble, composed): tv-step-select  detail: { id }
   Tokens: --primary-50/100/600, --success-100/500/600, --surface-0/100/200/400/500/700, --radius-md/lg.
   ============================================================ */
(() => {
  if (customElements.get('tv-setup-stepper')) return

  const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const STATE_LABEL = { done: 'Completed', current: 'In progress', upcoming: 'Upcoming' }

  class TvSetupStepper extends HTMLElement {
    constructor() {
      super()
      this.attachShadow({ mode: 'open' })
      this._steps = []
    }
    connectedCallback() {
      this._upgradeProperty('steps')
      this.render()
      if (!this._bound) {
        this._bound = true
        this.shadowRoot.addEventListener('click', (e) => {
          const row = e.target.closest && e.target.closest('[data-step]')
          if (!row) return
          this.select(row.getAttribute('data-step'))
        })
      }
    }
    _upgradeProperty(prop) {
      if (Object.prototype.hasOwnProperty.call(this, prop)) {
        const v = this[prop]; delete this[prop]; this[prop] = v
      }
    }
    get steps() { return this._steps }
    set steps(v) { this._steps = Array.isArray(v) ? v : []; if (this.shadowRoot) this.render() }

    select(id) {
      this.dispatchEvent(new CustomEvent('tv-step-select', { bubbles: true, composed: true, detail: { id: id } }))
    }

    _marker(s, num) {
      if (s.status === 'done') {
        return `<span class="mk done" aria-hidden="true"><i class="${window.__tvIcon ? window.__tvIcon('check') : 'icon-check'}"></i></span>`
      }
      return `<span class="mk ${s.status === 'current' ? 'current' : 'upcoming'}" aria-hidden="true">${num}</span>`
    }

    render() {
      const steps = this._steps
      this.shadowRoot.innerHTML = `
        <style>
          :host{ display:block; font-family:var(--tv-font,'Geist','Inter',system-ui,sans-serif); }
          .list{ display:flex; flex-direction:column; }
          .st{ position:relative; display:flex; gap:12px; width:100%; text-align:left;
            padding:12px 12px; background:none; border:0; cursor:pointer; font-family:inherit;
            border-radius:var(--radius-md,10px); transition:background .12s; }
          .st:hover{ background:var(--surface-50,#f8fafc); }
          .st.is-current{ background:var(--primary-50,#eef2ff); }
          .st:focus-visible{ outline:none; box-shadow:0 0 0 2px var(--primary-600,#4f46e5) inset; }
          .col{ position:relative; flex:0 0 auto; display:flex; justify-content:center; }
          /* connector line linking the markers */
          .st:not(:last-child) .col::after{ content:''; position:absolute; top:26px; bottom:-24px;
            left:50%; width:2px; transform:translateX(-50%); background:var(--surface-200,#e2e8f0); }
          .st.is-done .col::after{ background:var(--success-500,#16a34a); }
          .mk{ position:relative; z-index:1; width:26px; height:26px; border-radius:999px;
            display:grid; place-items:center; font-size:12px; font-weight:600; line-height:1; }
          .mk.done{ background:var(--success-500,#16a34a); color:#fff; font-size:14px; }
          .mk.current{ background:var(--primary-600,#4f46e5); color:#fff; }
          .mk.upcoming{ background:var(--surface-100,#f1f5f9); color:var(--surface-500,#64748b);
            box-shadow:inset 0 0 0 1px var(--surface-200,#e2e8f0); }
          .body{ flex:1 1 auto; min-width:0; padding-top:2px; }
          .title{ } /* type via .tv-body-strong */
          .st.is-upcoming .title{ color:var(--surface-500,#64748b); font-weight:500; }
          .state{ margin-top:2px; display:inline-flex; align-items:center; gap:5px; } /* .tv-body-sm */
          .state.done{ color:var(--success-600,#15803d); }
          .state.current{ color:var(--primary-600,#4f46e5); }
          .state.upcoming{ color:var(--surface-500,#64748b); }
        </style>
        <div class="list" role="list">
          ${steps.map((s, i) => {
            const st = s.status === 'done' ? 'is-done' : (s.status === 'current' ? 'is-current' : 'is-upcoming')
            const label = s.note || STATE_LABEL[s.status] || ''
            return `
              <button type="button" class="st ${st}" role="listitem" data-step="${esc(s.id)}"
                ${s.status === 'current' ? 'aria-current="step"' : ''}>
                <span class="col">${this._marker(s, i + 1)}</span>
                <span class="body">
                  <span class="title tv-body-strong">${esc(s.title)}</span>
                  <span class="state ${esc(s.status)} tv-body-sm">${esc(label)}</span>
                </span>
              </button>`
          }).join('')}
        </div>
      `
      if (window.__tvType) window.__tvType(this.shadowRoot)
      if (window.__tvIcons) window.__tvIcons(this.shadowRoot)
    }
  }
  customElements.define('tv-setup-stepper', TvSetupStepper)
})()
