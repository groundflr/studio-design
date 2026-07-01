/* ============================================================
   <tv-button>  —  Traverse component library
   The action primitive. Used standalone and inside <tv-modal-card>.

   Single source of truth: edit THIS file and every page updates.

   Usage:
     <tv-button variant="primary">Save adjustment</tv-button>
     <tv-button variant="secondary">Cancel</tv-button>
     <tv-button variant="danger" icon="rotate">Revert to AI</tv-button>
     <tv-button variant="primary" disabled>Save</tv-button>

   Attributes:
     variant  primary | secondary | danger | text   (default primary)
     size     md | sm                                (default md)
     icon     leading icon name (optional)
     disabled boolean
     label    text (optional — otherwise the slotted text is used)

   Clicks bubble out natively; listen with el.addEventListener('click', …).
   Tokens: --accent, --accent-hover, --surface-0, --border-subtle,
     --fg-2, --error-500, --error-100, --shadow-xs, --shadow-ring-primary
   ============================================================ */
(() => {
  if (customElements.get('tv-button')) return

  class TvButton extends HTMLElement {
    static get observedAttributes() {
      return ['variant', 'size', 'icon', 'disabled', 'label']
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
      const variant = this.getAttribute('variant') || 'primary'
      const size = this.getAttribute('size') || 'md'
      const iconName = this.getAttribute('icon')
      const disabled = this.hasAttribute('disabled')
      const label = this.getAttribute('label')
      const icon = iconName ? `<span class="ic"><i class="${window.__tvIcon ? window.__tvIcon(iconName) : 'icon-' + iconName}"></i></span>` : ''
      const text = label != null ? label : '<slot></slot>'

      this.shadowRoot.innerHTML = `
        <style>
          :host{ display:inline-flex; }
          button{
            display:inline-flex; align-items:center; gap:7px;
            font-family:var(--tv-font,'Geist','Inter',system-ui,sans-serif);
            cursor:pointer; /* type via .tv-button / .tv-button-sm */
            border:none; border-radius:var(--radius-md,8px);
            transition:background var(--dur-quick,100ms) var(--ease-std,ease),
                       color var(--dur-quick,100ms) var(--ease-std,ease),
                       border-color var(--dur-quick,100ms) var(--ease-std,ease);
          }
          button:focus-visible{ outline:none; box-shadow:var(--shadow-ring-primary,0 0 0 3px rgba(99,102,241,.3)); }
          .md{ height:36px; padding:0 16px; }
          .sm{ height:30px; padding:0 12px; }
          .ic{ display:inline-flex; align-items:center; font-size:15px; line-height:1; }

          /* variant colour uses button.<variant> so it outranks the .tv-button role class */
          button.primary{ background:var(--accent,#4f46e5); color:#fff; box-shadow:var(--shadow-xs,0 1px 2px rgba(0,0,0,.05)); }
          .primary:hover:not(:disabled){ background:var(--accent-hover,#4338ca); }

          button.secondary{ background:var(--surface-0,#fff); color:var(--fg-2,#334155); border:1px solid var(--border-subtle,#e2e8f0); }
          .secondary:hover:not(:disabled){ background:var(--bg-subtle,#f8fafc); }

          button.danger{ background:none; color:var(--error-500,#D92D20); padding-left:8px; padding-right:8px; }
          .danger:hover:not(:disabled){ background:var(--error-100,#fee2e2); }

          button.text{ background:none; color:var(--fg-2,#334155); padding-left:6px; padding-right:6px; }
          .text:hover:not(:disabled){ color:var(--fg-1,#0f172a); }

          button:disabled{ cursor:not-allowed; opacity:1; }
          .primary:disabled{ background:var(--surface-300,#cbd5e1); color:var(--surface-500,#64748b); box-shadow:none; }
          .secondary:disabled,.danger:disabled,.text:disabled{ color:var(--fg-4,#94a3b8); }
        </style>
        <button class="${variant} ${size} ${size === 'sm' ? 'tv-button-sm' : 'tv-button'}" part="button" ${disabled ? 'disabled' : ''}>${icon}${text}</button>
      `
      if (window.__tvType) window.__tvType(this.shadowRoot)
      if (window.__tvIcons) window.__tvIcons(this.shadowRoot)
    }
  }

  customElements.define('tv-button', TvButton)
})()
