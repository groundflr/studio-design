/* ============================================================
   <tv-settings-section>  —  Traverse component library
   A settings section that reads as calm labelled values and
   flips to an edit form per section on demand (V2 principle:
   "state follows mode — view vs edit", not a flat wall of inputs).

   You provide two slots — the read view and the edit form — and
   the component owns the chrome: the title, the Edit affordance,
   and the Cancel / Save footer that appears only while editing.
   Content stays in light DOM, so prototype JS can still read the
   inputs inside the edit slot.

   Usage:
     <tv-settings-section title="Organisation details"
        subtitle="Your org's name and logo.">
       <div slot="view">
         <!-- labelled read-only values -->
       </div>
       <div slot="edit">
         <tv-field label="Organisation name"><input value="Acme Org"></tv-field>
       </div>
     </tv-settings-section>

   Attributes:
     title       section heading
     subtitle    supporting line (optional)
     editing     reflected; present while in edit mode
     save-label  primary button text          default "Save changes"
     edit-label  trigger text                  default "Edit"

   Events:  tv-edit, tv-cancel, tv-save
   Methods: enterEdit(), exitEdit()
   Composes <tv-button>. Tokens: --surface-0, --border-subtle,
     --radius-lg, --fg-1/2/3, --tv-font
   ============================================================ */
(() => {
  if (customElements.get('tv-settings-section')) return

  class TvSettingsSection extends HTMLElement {
    static get observedAttributes() {
      return ['title', 'subtitle', 'editing', 'save-label', 'edit-label']
    }
    constructor() {
      super()
      this.attachShadow({ mode: 'open' })
    }
    connectedCallback() {
      this.render()
      this.shadowRoot.addEventListener('click', this._onClick)
    }
    attributeChangedCallback() {
      if (this.shadowRoot && this.shadowRoot.childElementCount) this.render()
    }
    get editing() {
      return this.hasAttribute('editing')
    }
    set editing(v) {
      if (v) this.setAttribute('editing', '')
      else this.removeAttribute('editing')
    }
    enterEdit() {
      this.editing = true
      this.dispatchEvent(new CustomEvent('tv-edit', { bubbles: true, composed: true }))
    }
    exitEdit() {
      this.editing = false
    }
    _onClick = (e) => {
      const act = e.target.closest && e.target.closest('[data-act]')
      if (!act) return
      const a = act.getAttribute('data-act')
      if (a === 'edit') this.enterEdit()
      else if (a === 'cancel') {
        this.exitEdit()
        this.dispatchEvent(new CustomEvent('tv-cancel', { bubbles: true, composed: true }))
      } else if (a === 'save') {
        this.dispatchEvent(new CustomEvent('tv-save', { bubbles: true, composed: true }))
        this.exitEdit()
      }
    }
    render() {
      const title = this.getAttribute('title') || ''
      const subtitle = this.getAttribute('subtitle') || ''
      const saveLabel = this.getAttribute('save-label') || 'Save changes'
      const editLabel = this.getAttribute('edit-label') || 'Edit'

      this.shadowRoot.innerHTML = `
        <style>
          :host{ display:block; font-family:var(--tv-font,'Geist','Inter',system-ui,sans-serif); }
          .card{
            background:var(--surface-0,#fff); border:1px solid var(--border-subtle,#e2e8f0);
            border-radius:var(--radius-lg,12px); padding:18px 20px;
          }
          .head{ display:flex; align-items:flex-start; gap:12px; }
          .titles{ flex:1; min-width:0; }
          .title{ } /* type via .tv-h5 */
          .sub{ margin-top:3px; } /* type via .tv-caption */
          .sub:empty{ display:none; }
          .edit-btn{ flex:0 0 auto; }
          .body{ margin-top:16px; }
          /* mode switch — only one slot shows at a time */
          .view, .edit{ display:none; }
          :host(:not([editing])) .view{ display:block; }
          :host([editing]) .edit{ display:block; }
          :host([editing]) .edit-btn{ display:none; }
          .foot{ display:flex; justify-content:flex-end; gap:10px; margin-top:18px; }
          :host(:not([editing])) .foot{ display:none; }
        </style>
        <div class="card">
          <div class="head">
            <div class="titles">
              <div class="title tv-h5">${title}</div>
              <div class="sub tv-caption">${subtitle}</div>
            </div>
            <span class="edit-btn">
              <tv-button variant="secondary" size="sm" data-act="edit">${editLabel}</tv-button>
            </span>
          </div>
          <div class="body">
            <div class="view"><slot name="view"></slot></div>
            <div class="edit"><slot name="edit"></slot></div>
          </div>
          <div class="foot">
            <tv-button variant="secondary" data-act="cancel">Cancel</tv-button>
            <tv-button variant="primary" data-act="save">${saveLabel}</tv-button>
          </div>
        </div>
      `
      if (window.__tvType) window.__tvType(this.shadowRoot)
    }
  }
  customElements.define('tv-settings-section', TvSettingsSection)
})()
