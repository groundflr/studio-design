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
          /* Stacked fields breathe like the original .org-modal-form (16px gap) */
          :host(:not(:last-child)){ margin-bottom:16px; }
          /* Label matches .org-modal-label: sentence case, 12px / 500, surface-700 */
          .lbl{ display:flex; align-items:center; gap:6px; margin-bottom:6px;
            font-weight:500; font-size:12px; line-height:1.4; letter-spacing:0;
            text-transform:none; color:var(--surface-700,#334155); }
          .lbl:empty{ display:none; }
          .req{ font-weight:400; color:var(--surface-400,#94a3b8); }
          .hint{ margin-top:6px; } /* type via .tv-caption */
          .hint:empty{ display:none; }
          /* Control matches .org-modal-input: 13px, 8/10 padding, 0.5px border, 6px radius.
             padding is !important so a host page's universal reset (margin/padding 0)
             can't strip it — document rules otherwise override low-priority ::slotted styles. */
          ::slotted(input),::slotted(textarea),::slotted(select){
            width:100%; box-sizing:border-box;
            font-family:var(--tv-font,'Geist','Inter',system-ui,sans-serif);
            font-size:13px; line-height:1.5; color:var(--surface-900,#0f172a);
            background:var(--surface-0,#fff); border:0.5px solid var(--surface-200,#e2e8f0);
            border-radius:6px; padding:8px 10px !important; margin:0;
            transition:border-color .12s, box-shadow .12s, background .12s;
          }
          ::slotted(textarea){ resize:vertical; min-height:64px; }
          ::slotted(input:focus),::slotted(textarea:focus),::slotted(select:focus){
            outline:none; border-color:var(--border-focus,#818cf8);
            box-shadow:var(--shadow-ring-primary,0 0 0 3px rgba(99,102,241,.3));
          }
        </style>
        <label class="lbl">${label}${required ? '<span class="req">— required</span>' : ''}</label>
        <slot></slot>
        <div class="hint tv-caption">${hint}</div>
      `
      if (window.__tvType) window.__tvType(this.shadowRoot)
    }
  }
  customElements.define('tv-field', TvField)
})()
