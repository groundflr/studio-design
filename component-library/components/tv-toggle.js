/* ============================================================
   <tv-toggle>  —  Traverse component library
   On/off switch for settings rows and scoring options.

   Usage:
     <tv-toggle checked label="Collect a why"></tv-toggle>
     <tv-toggle></tv-toggle>
     el.addEventListener('tv-change', (e) => console.log(e.detail.checked))

   Attributes:
     checked   on state (reflected; read/write via the .checked property)
     disabled  non-interactive
     label     optional text shown beside the switch

   Events (bubble, composed): tv-change  (detail: { checked })
                              change      (native, for form-ish wiring)
   Property: checked (boolean)
   Tokens (with fallbacks): --surface-300, --accent, --fg-2, --shadow-ring-primary
   ============================================================ */
(() => {
  if (customElements.get('tv-toggle')) return

  class TvToggle extends HTMLElement {
    static get observedAttributes() {
      return ['checked', 'disabled', 'label']
    }
    constructor() {
      super()
      this.attachShadow({ mode: 'open' })
      this._toggle = this._toggle.bind(this)
    }
    connectedCallback() {
      this.render()
    }
    attributeChangedCallback(name) {
      if (!this.shadowRoot) return
      // Only `checked` changes mid-life; mutate the existing node so the
      // CSS transition actually runs (a full re-render would snap to the
      // end state with no animation). label/disabled re-render.
      if (name === 'checked' && this._sw) this._sync()
      else this.render()
    }
    get checked() {
      return this.hasAttribute('checked')
    }
    set checked(v) {
      v ? this.setAttribute('checked', '') : this.removeAttribute('checked')
    }
    _sync() {
      if (!this._sw) return
      this._sw.classList.toggle('on', this.checked)
      this._sw.setAttribute('aria-checked', String(this.checked))
    }
    _toggle() {
      if (this.hasAttribute('disabled')) return
      this.checked = !this.checked
      this.dispatchEvent(new CustomEvent('tv-change', { bubbles: true, composed: true, detail: { checked: this.checked } }))
      this.dispatchEvent(new Event('change', { bubbles: true }))
    }
    render() {
      const checked = this.checked
      const disabled = this.hasAttribute('disabled')
      const label = this.getAttribute('label') || ''
      this.shadowRoot.innerHTML = `
        <style>
          :host{ display:inline-flex; align-items:center; gap:10px; font-family:var(--tv-font,'Geist','Inter',system-ui,sans-serif); }
          .sw{ width:38px; height:22px; border-radius:9999px; background:var(--surface-300,#cbd5e1);
            position:relative; flex:0 0 auto; cursor:pointer; border:none; padding:0;
            transition:background var(--dur-base,200ms) var(--ease-std,cubic-bezier(.4,0,.2,1)); }
          .sw.on{ background:var(--accent,#4f46e5); }
          .sw:disabled{ cursor:not-allowed; opacity:.5; }
          .sw:focus-visible{ outline:none; box-shadow:var(--shadow-ring-primary,0 0 0 3px rgba(99,102,241,.3)); }
          .knob{ position:absolute; top:2px; left:2px; width:18px; height:18px; border-radius:50%;
            background:#fff; box-shadow:0 1px 2px rgba(0,0,0,.2);
            transition:left var(--dur-base,200ms) var(--ease-std,cubic-bezier(.4,0,.2,1)); }
          .sw.on .knob{ left:18px; }
          @media (prefers-reduced-motion: reduce){ .sw,.knob{ transition-duration:1ms; } }
          .lbl{ cursor:pointer; } /* type via .tv-label */
          .lbl:empty{ display:none; }
        </style>
        <button class="sw ${checked ? 'on' : ''}" role="switch" aria-checked="${checked}" ${disabled ? 'disabled' : ''} part="switch"><span class="knob"></span></button>
        <span class="lbl tv-label">${label}</span>
      `
      if (window.__tvType) window.__tvType(this.shadowRoot)
      const sw = this.shadowRoot.querySelector('.sw')
      const lbl = this.shadowRoot.querySelector('.lbl')
      this._sw = sw
      sw.addEventListener('click', this._toggle)
      if (label) lbl.addEventListener('click', this._toggle)
    }
  }
  customElements.define('tv-toggle', TvToggle)
})()
