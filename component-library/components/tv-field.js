/* ============================================================
   <tv-field>  —  Traverse component library
   Labelled form-control wrapper. Put a native input / textarea /
   select inside and it gets the standard label + control styling.
   Used in modal card bodies and settings edit states.

   Usage:
     <tv-field label="Score">
       <input type="number" min="0" max="10" value="8" />
     </tv-field>

     <tv-field label="Justification" required hint="Only the moderator sees this">
       <textarea placeholder="Why are you changing this?"></textarea>
     </tv-field>

   Attributes:
     label     the field label (uppercase overline)
     hint      small helper text below the control (optional)
     required  show a "— required" note next to the label

   Slot a single control element (input / textarea / select) directly.
   Tokens (with fallbacks): --fg-1/3/4, --surface-0, --border-subtle,
     --border-focus, --radius-md, --shadow-ring-primary
   ============================================================ */
(() => {
  if (customElements.get('tv-field')) return

  class TvField extends HTMLElement {
    static get observedAttributes() {
      return ['label', 'hint', 'required']
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
      const label = this.getAttribute('label') || ''
      const hint = this.getAttribute('hint') || ''
      const required = this.hasAttribute('required')
      this.shadowRoot.innerHTML = `
        <style>
          :host{ display:block; font-family:var(--tv-font,'Geist','Inter',system-ui,sans-serif); }
          .lbl{ display:flex; align-items:center; gap:7px; margin-bottom:7px; } /* type via .tv-eyebrow */
          .lbl:empty{ display:none; }
          .req{ text-transform:none; letter-spacing:0; color:var(--fg-4,#94a3b8); } /* reset eyebrow casing for the suffix */
          .hint{ margin-top:6px; } /* type via .tv-caption */
          .hint:empty{ display:none; }
          /* padding is !important so a host page's universal reset
             (margin/padding 0) can't strip the control's inner padding —
             document rules otherwise override low-priority ::slotted styles. */
          ::slotted(input),::slotted(textarea),::slotted(select){
            width:100%; box-sizing:border-box;
            font-family:var(--tv-font,'Geist','Inter',system-ui,sans-serif);
            font-size:.875rem; line-height:1.5; color:var(--fg-1,#0f172a);
            background:var(--surface-0,#fff); border:1px solid var(--border-subtle,#e2e8f0);
            border-radius:var(--radius-md,8px); padding:9px 11px !important; margin:0;
            transition:border-color .1s, box-shadow .1s;
          }
          ::slotted(textarea){ resize:vertical; min-height:64px; }
          ::slotted(input:focus),::slotted(textarea:focus),::slotted(select:focus){
            outline:none; border-color:var(--border-focus,#818cf8);
            box-shadow:var(--shadow-ring-primary,0 0 0 3px rgba(99,102,241,.3));
          }
        </style>
        <label class="lbl tv-eyebrow">${label}${required ? '<span class="req">— required</span>' : ''}</label>
        <slot></slot>
        <div class="hint tv-caption">${hint}</div>
      `
      if (window.__tvType) window.__tvType(this.shadowRoot)
    }
  }
  customElements.define('tv-field', TvField)
})()
