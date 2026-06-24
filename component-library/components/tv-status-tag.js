/* ============================================================
   <tv-status-tag>  —  Traverse component library
   ONE core chip. Same structure always: same padding, radius,
   optional left icon (or a status dot), label. Everything else
   is just two axes —

     tone     primary | success | warn | info | error | neutral
     variant  fill (tinted bg + border) | dot (leading dot, no bg)

   The semantic `kind`s (roles, member states, publication,
   audit events) are thin MAPPINGS onto {tone, variant, icon,
   label} — not independent colour definitions. So AI graded and
   Org admin share one primary; adjusted, moderator and draft
   share one warn; auto-marked, owner and published share one
   success; candidate, coming and promoted share one info;
   flagged and revoked share one error. Change a tone once → every
   kind in that family changes with it.

   Single source of truth: edit THIS file and every page updates.

   Usage:
     <tv-status-tag kind="ai"></tv-status-tag>          <!-- mapped kind -->
     <tv-status-tag kind="active"></tv-status-tag>
     <tv-status-tag tone="success" variant="fill" label="Synced"></tv-status-tag>  <!-- core -->
     <tv-status-tag kind="ai" no-icon></tv-status-tag>  <!-- drop the icon -->

   Attributes:
     kind     semantic shorthand (sets tone/variant/icon/label defaults)
     tone     override / use the core directly
     variant  fill | dot
     icon     override the icon name (fill variant)
     no-icon  suppress the icon a kind would show
     label    override the default text

   Tokens (with fallbacks): --primary-50/200/700, --warn-100/600,
     --error-100/500, --success-100/600, --info-100/500, --surface-100, --fg-3
   ============================================================ */
(() => {
  if (customElements.get('tv-status-tag')) return

  const ICONS = {
    sparkles:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/></svg>',
    pencil:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>',
    flag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>',
    check:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  }

  // The core palette — one entry per tone. fg used by both variants;
  // bg/bd only by `fill`. Change a value here and every kind in that
  // family updates.
  const TONES = {
    primary: { fg: 'var(--primary-700,#4338ca)', bg: 'var(--primary-50,#eef2ff)', bd: 'var(--primary-200,#c7d2fe)' },
    success: { fg: 'var(--success-600,#16a34a)', bg: 'var(--success-100,#dcfce7)', bd: '#bbf7d0' },
    warn: { fg: 'var(--warn-600,#ca8a04)', bg: 'var(--warn-100,#fef3c7)', bd: '#fde68a' },
    info: { fg: 'var(--info-500,#0284c7)', bg: 'var(--info-100,#e0f2fe)', bd: '#bae6fd' },
    error: { fg: 'var(--error-500,#D92D20)', bg: 'var(--error-100,#fee2e2)', bd: '#fecaca' },
    neutral: { fg: 'var(--fg-3,#64748b)', bg: 'var(--surface-100,#f1f5f9)', bd: 'transparent' },
  }

  // Semantic kinds → a mapping onto the core. NO colours here.
  const KINDS = {
    // moderation (fill + icon)
    ai: { tone: 'primary', variant: 'fill', icon: 'sparkles', label: 'AI graded' },
    adjusted: { tone: 'warn', variant: 'fill', icon: 'pencil', label: 'Adjusted' },
    flag: { tone: 'error', variant: 'fill', icon: 'flag', label: 'Flagged' },
    auto: { tone: 'success', variant: 'fill', icon: 'check', label: 'Auto-marked' },
    // member states / indicators (dot)
    active: { tone: 'success', variant: 'dot', label: 'Active' },
    pending: { tone: 'warn', variant: 'dot', label: 'Pending' },
    deactivated: { tone: 'neutral', variant: 'dot', label: 'Deactivated' },
    cancelled: { tone: 'neutral', variant: 'dot', label: 'Cancelled' },
    expired: { tone: 'error', variant: 'dot', label: 'Expired' },
    removed: { tone: 'error', variant: 'dot', label: 'Removed' },
    live: { tone: 'success', variant: 'dot', label: 'Live' },
    // roles (fill)
    admin: { tone: 'primary', variant: 'fill', label: 'Admin' },
    owner: { tone: 'success', variant: 'fill', label: 'Owner' },
    moderator: { tone: 'warn', variant: 'fill', label: 'Moderator' },
    candidate: { tone: 'info', variant: 'fill', label: 'Candidate' },
    neutral: { tone: 'neutral', variant: 'fill', label: '' },
    // publication status (fill)
    draft: { tone: 'warn', variant: 'fill', label: 'Draft' },
    published: { tone: 'success', variant: 'fill', label: 'Published' },
    archived: { tone: 'neutral', variant: 'fill', label: 'Archived' },
    coming: { tone: 'info', variant: 'fill', label: 'Coming' },
    // audit events (fill)
    created: { tone: 'success', variant: 'fill', label: 'Created' },
    promoted: { tone: 'info', variant: 'fill', label: 'Promoted' },
    revoked: { tone: 'error', variant: 'fill', label: 'Deactivated' },
  }

  class TvStatusTag extends HTMLElement {
    static get observedAttributes() {
      return ['kind', 'tone', 'variant', 'icon', 'no-icon', 'label']
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
      // resolve the kind mapping, then let explicit attributes override it
      const kindDef = KINDS[this.getAttribute('kind')] || {}
      const tone = this.getAttribute('tone') || kindDef.tone || 'neutral'
      const variant = this.getAttribute('variant') || kindDef.variant || 'fill'
      const t = TONES[tone] || TONES.neutral
      const label = this.getAttribute('label') ?? kindDef.label ?? ''
      const iconName = this.hasAttribute('no-icon') ? '' : this.getAttribute('icon') || kindDef.icon || ''

      const isDot = variant === 'dot'
      const glyph = isDot
        ? '<span class="dot" aria-hidden="true"></span>'
        : iconName && ICONS[iconName]
          ? `<span class="ic" aria-hidden="true">${ICONS[iconName]}</span>`
          : ''

      const bg = isDot ? 'transparent' : t.bg
      const bd = isDot ? 'transparent' : t.bd

      this.shadowRoot.innerHTML = `
        <style>
          :host{ display:inline-flex; vertical-align:middle; }
          .chip{
            display:inline-flex; align-items:center; gap:5px;
            font-family:var(--tv-font,'Geist','Inter',system-ui,sans-serif);
            font-weight:500; font-size:.7rem; line-height:1; letter-spacing:.02em;
            padding:4px 10px; border-radius:var(--radius-sm,8px);
            color:${t.fg}; background:${bg};
            border:0.5px solid ${bd};
          }
          .ic{ display:inline-flex; }
          .ic svg{ width:12px; height:12px; display:block; }
          .dot{ width:7px; height:7px; border-radius:9999px; background:currentColor; display:inline-block; }
          .label:empty{ display:none; }
        </style>
        <span class="chip">${glyph}<span class="label">${label || ''}</span></span>
      `
    }
  }

  customElements.define('tv-status-tag', TvStatusTag)
})()
