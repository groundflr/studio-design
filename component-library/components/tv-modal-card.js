/* ============================================================
   <tv-modal-card>  —  Traverse component library
   The atom of interaction. A focused action on a single object.
   Header (subject + marker) and footer (destructive-left / primary-right)
   are fixed; only the body (slotted) varies.

   Single source of truth: edit THIS file and every modal updates.

   Usage:
     <tv-modal-card id="grade" heading="Criterion 3 · Risk assessment"
        marker-kind="ai" marker-label="AI graded"
        danger-label="Revert to AI" primary-label="Save adjustment">
       …body markup (forms, excerpt, justification)…
     </tv-modal-card>
     <script>
       const m = document.getElementById('grade')
       openTrigger.addEventListener('click', () => m.open())
       m.addEventListener('tv-confirm', () => { ...persist... })
       m.addEventListener('tv-danger',  () => { ...revert... })
       m.confirmDisabled = true        // gate the primary until valid
     </script>

   Attributes:
     open            present while shown (managed by open()/close())
     size            sm | md | lg                    (default md)
     heading         title text
     subtitle        small uppercase context line
     icon            header icon name (default 'pencil')
     marker-kind     ai | adjusted | flag | auto …   (renders <tv-status-tag>)
     marker-label    marker text
     primary-label   shows the primary button when set
     danger-label    shows the destructive button when set
     dismissible     allow close button / esc / overlay (default true)
     confirm-disabled  disable the primary button
     guard           if present, prompt before closing when .dirty is true

   Events (bubble, composed):  tv-open, tv-confirm, tv-cancel, tv-danger, tv-close
   Methods:  open(), close({force})
   Property: confirmDisabled (bool), dirty (bool)
   ============================================================ */
(() => {
  if (customElements.get('tv-modal-card')) return

  const ICONS = {
    pencil:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>',
    sliders:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>',
    flag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>',
    userplus:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>',
    history:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/><path d="M12 7v5l4 2"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  }
  const FOCUSABLE =
    'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

  class TvModalCard extends HTMLElement {
    static get observedAttributes() {
      return ['heading', 'subtitle', 'icon', 'marker-kind', 'marker-label', 'primary-label', 'danger-label', 'size', 'confirm-disabled', 'dismissible']
    }

    constructor() {
      super()
      this.attachShadow({ mode: 'open' })
      this._lastFocus = null
      this._prevOverflow = ''
      this.dirty = false
      this._onKey = this._onKey.bind(this)
    }

    connectedCallback() {
      this.render()
    }
    attributeChangedCallback() {
      if (this.shadowRoot && this._built) this.render()
    }

    /* ---- public API ---- */
    get confirmDisabled() {
      return this.hasAttribute('confirm-disabled')
    }
    set confirmDisabled(v) {
      v ? this.setAttribute('confirm-disabled', '') : this.removeAttribute('confirm-disabled')
    }

    open() {
      if (this.hasAttribute('open')) return
      this._lastFocus = document.activeElement
      this.dirty = false
      this.setAttribute('open', '')
      this._prevOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      // next frame → run the enter transition
      requestAnimationFrame(() => this._ov && this._ov.classList.add('is-open'))
      document.addEventListener('keydown', this._onKey)
      this.dispatchEvent(new CustomEvent('tv-open', { bubbles: true, composed: true }))
      setTimeout(() => {
        const f = this._firstFocusable()
        f && f.focus()
      }, 60)
    }

    close({ force = false } = {}) {
      if (!this.hasAttribute('open')) return
      const dismissible = this.getAttribute('dismissible') !== 'false'
      if (!force && !dismissible) return
      if (!force && this.hasAttribute('guard') && this.dirty && !window.confirm('Discard your changes?')) return
      this._ov && this._ov.classList.remove('is-open')
      document.removeEventListener('keydown', this._onKey)
      let done = false
      const finish = () => {
        if (done) return
        done = true
        this.removeAttribute('open')
        document.body.style.overflow = this._prevOverflow
        if (this._lastFocus && this._lastFocus.focus) this._lastFocus.focus()
        this.dispatchEvent(new CustomEvent('tv-close', { bubbles: true, composed: true }))
      }
      this._card && this._card.addEventListener('transitionend', finish, { once: true })
      setTimeout(finish, 260)
    }

    /* ---- internals ---- */
    _firstFocusable() {
      const body = [...this.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null)
      return body[0] || this._closeBtn || this._card
    }
    _focusables() {
      const list = []
      if (this._closeBtn && this._closeBtn.offsetParent !== null) list.push(this._closeBtn)
      list.push(...[...this.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null))
      list.push(...[...this._footer.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null))
      return list
    }
    _onKey(e) {
      if (e.key === 'Escape') {
        e.preventDefault()
        this.close()
      } else if (e.key === 'Tab') {
        const f = this._focusables()
        if (!f.length) return
        const first = f[0]
        const last = f[f.length - 1]
        const active = this.shadowRoot.activeElement || document.activeElement
        if (e.shiftKey && active === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && active === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    render() {
      this._built = true
      const size = this.getAttribute('size') || 'md'
      const heading = this.getAttribute('heading') || ''
      const subtitle = this.getAttribute('subtitle') || ''
      const iconName = this.getAttribute('icon') || 'pencil'
      const icon = ICONS[iconName] || ICONS.pencil
      const markerKind = this.getAttribute('marker-kind')
      const markerLabel = this.getAttribute('marker-label') || ''
      const primary = this.getAttribute('primary-label')
      const danger = this.getAttribute('danger-label')
      const dismissible = this.getAttribute('dismissible') !== 'false'
      const confirmDisabled = this.hasAttribute('confirm-disabled')

      const widths = { sm: '440px', md: '600px', lg: '760px' }
      const marker = markerKind ? `<tv-status-tag kind="${markerKind}" label="${markerLabel}"></tv-status-tag>` : ''

      const footerBtns =
        danger || primary
          ? `${danger ? `<tv-button variant="danger" data-act="danger" class="f-danger">${danger}</tv-button>` : ''}
             <tv-button variant="secondary" data-act="cancel">Cancel</tv-button>
             ${primary ? `<tv-button variant="primary" data-act="confirm" ${confirmDisabled ? 'disabled' : ''}>${primary}</tv-button>` : ''}`
          : ''

      this.shadowRoot.innerHTML = `
        <style>
          :host{ display:contents; font-family:var(--tv-font,'Geist','Inter',system-ui,sans-serif); }
          .ov{
            position:fixed; inset:0; z-index:1000;
            display:flex; align-items:center; justify-content:center; padding:40px;
            background:rgb(15 23 42 / .42);
            -webkit-backdrop-filter:blur(2px); backdrop-filter:blur(2px);
            opacity:0; visibility:hidden;
            transition:opacity var(--dur-base,200ms) var(--ease-std,ease), visibility 0s linear var(--dur-base,200ms);
          }
          .ov.is-open{ opacity:1; visibility:visible; transition:opacity var(--dur-base,200ms) var(--ease-std,ease); }
          .card{
            width:${widths[size] || widths.md}; max-width:100%; max-height:88vh;
            display:flex; flex-direction:column; overflow:hidden;
            background:var(--surface-0,#fff); border:1px solid var(--border-subtle,#e2e8f0);
            border-radius:var(--radius-xl,16px); box-shadow:var(--shadow-lg,0 10px 15px -3px rgb(0 0 0/.1),0 4px 6px -4px rgb(0 0 0/.1));
            transform:translateY(8px) scale(.98); opacity:0;
            transition:transform var(--dur-base,200ms) var(--ease-std,ease), opacity var(--dur-base,200ms) var(--ease-std,ease);
          }
          .ov.is-open .card{ transform:none; opacity:1; }
          header{ display:flex; align-items:center; gap:10px; padding:14px 18px; border-bottom:1px solid var(--surface-100,#f1f5f9); flex:0 0 auto; }
          .hicon{ width:28px; height:28px; border-radius:var(--radius-md,8px); background:var(--primary-600,#4f46e5); color:#fff; display:grid; place-items:center; flex:0 0 auto; }
          .hicon svg{ width:15px; height:15px; }
          .titles{ min-width:0; display:flex; flex-direction:column; gap:1px; }
          .title{ font-weight:600; font-size:.875rem; line-height:1.3; color:var(--fg-1,#0f172a); }
          .subtitle{ font-weight:600; font-size:.6875rem; line-height:1.3; text-transform:uppercase; letter-spacing:.05em; color:var(--fg-3,#64748b); }
          .subtitle:empty{ display:none; }
          .marker{ margin-left:auto; display:inline-flex; }
          .marker:empty{ display:none; }
          .close{ width:30px; height:30px; border:none; background:none; cursor:pointer; border-radius:var(--radius-md,8px); display:grid; place-items:center; color:var(--fg-3,#64748b); flex:0 0 auto; transition:background var(--dur-quick,100ms) var(--ease-std,ease); }
          .close:hover{ background:var(--surface-100,#f1f5f9); color:var(--fg-1,#0f172a); }
          .close:focus-visible{ outline:none; box-shadow:var(--shadow-ring-primary,0 0 0 3px rgba(99,102,241,.3)); }
          .close svg{ width:16px; height:16px; }
          .marker + .close{ margin-left:0; }
          header.no-marker .close{ margin-left:auto; }
          .body{ padding:18px; overflow:auto; flex:1 1 auto; }
          ::slotted(* + *){ margin-top:14px; }
          footer{ display:flex; align-items:center; gap:10px; padding:13px 18px; border-top:1px solid var(--surface-100,#f1f5f9); flex:0 0 auto; justify-content:flex-end; }
          footer:empty{ display:none; }
          footer .f-danger{ margin-right:auto; }
          @media (prefers-reduced-motion: reduce){
            .ov, .card{ transition-duration:1ms !important; } .card{ transform:none; }
          }
        </style>
        <div class="ov" part="overlay">
          <div class="card" role="dialog" aria-modal="true" aria-label="${heading.replace(/"/g, '&quot;')}" part="card" tabindex="-1">
            <header class="${marker ? '' : 'no-marker'}">
              <span class="hicon" aria-hidden="true">${icon}</span>
              <span class="titles"><span class="title">${heading}</span><span class="subtitle">${subtitle}</span></span>
              <span class="marker">${marker}</span>
              ${dismissible ? `<button class="close" type="button" aria-label="Close">${ICONS.x}</button>` : ''}
            </header>
            <div class="body"><slot></slot></div>
            <footer>${footerBtns}</footer>
          </div>
        </div>
      `

      // refs
      this._ov = this.shadowRoot.querySelector('.ov')
      this._card = this.shadowRoot.querySelector('.card')
      this._footer = this.shadowRoot.querySelector('footer')
      this._closeBtn = this.shadowRoot.querySelector('.close')

      // wiring
      this._ov.addEventListener('mousedown', (e) => {
        if (e.target === this._ov) this.close()
      })
      this._closeBtn && this._closeBtn.addEventListener('click', () => this.close())
      this._footer.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-act]')
        if (!btn) return
        const act = btn.getAttribute('data-act')
        if (act === 'cancel') {
          this.dispatchEvent(new CustomEvent('tv-cancel', { bubbles: true, composed: true }))
          this.close()
        } else if (act === 'danger') {
          this.dispatchEvent(new CustomEvent('tv-danger', { bubbles: true, composed: true }))
        } else if (act === 'confirm') {
          if (this.hasAttribute('confirm-disabled')) return
          this.dispatchEvent(new CustomEvent('tv-confirm', { bubbles: true, composed: true }))
        }
      })
    }
  }

  customElements.define('tv-modal-card', TvModalCard)
})()
