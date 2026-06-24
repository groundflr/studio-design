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

  const ICONS = {
    rotate:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.5 15a9 9 0 1 0 2.1-9.4L1 10"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    check:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',
  }

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
      const icon = iconName && ICONS[iconName] ? `<span class="ic">${ICONS[iconName]}</span>` : ''
      const text = label != null ? label : '<slot></slot>'

      this.shadowRoot.innerHTML = `
        <style>
          :host{ display:inline-flex; }
          button{
            display:inline-flex; align-items:center; gap:7px;
            font-family:var(--tv-font,'Geist','Inter',system-ui,sans-serif);
            font-weight:600; line-height:1; cursor:pointer;
            border:none; border-radius:var(--radius-md,8px);
            transition:background var(--dur-quick,100ms) var(--ease-std,ease),
                       color var(--dur-quick,100ms) var(--ease-std,ease),
                       border-color var(--dur-quick,100ms) var(--ease-std,ease);
          }
          button:focus-visible{ outline:none; box-shadow:var(--shadow-ring-primary,0 0 0 3px rgba(99,102,241,.3)); }
          .md{ height:36px; padding:0 16px; font-size:.875rem; }
          .sm{ height:30px; padding:0 12px; font-size:.75rem; }
          .ic{ display:inline-flex; }
          .ic svg{ width:15px; height:15px; display:block; }

          .primary{ background:var(--accent,#4f46e5); color:#fff; box-shadow:var(--shadow-xs,0 1px 2px rgba(0,0,0,.05)); }
          .primary:hover:not(:disabled){ background:var(--accent-hover,#4338ca); }

          .secondary{ background:var(--surface-0,#fff); color:var(--fg-2,#334155); border:1px solid var(--border-subtle,#e2e8f0); }
          .secondary:hover:not(:disabled){ background:var(--bg-subtle,#f8fafc); }

          .danger{ background:none; color:var(--error-500,#D92D20); padding-left:8px; padding-right:8px; }
          .danger:hover:not(:disabled){ background:var(--error-100,#fee2e2); }

          .text{ background:none; color:var(--fg-2,#334155); padding-left:6px; padding-right:6px; }
          .text:hover:not(:disabled){ color:var(--fg-1,#0f172a); }

          button:disabled{ cursor:not-allowed; opacity:1; }
          .primary:disabled{ background:var(--surface-300,#cbd5e1); color:var(--surface-500,#64748b); box-shadow:none; }
          .secondary:disabled,.danger:disabled,.text:disabled{ color:var(--fg-4,#94a3b8); }
        </style>
        <button class="${variant} ${size}" part="button" ${disabled ? 'disabled' : ''}>${icon}${text}</button>
      `
    }
  }

  customElements.define('tv-button', TvButton)
})()
