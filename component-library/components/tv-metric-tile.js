/* ============================================================
   <tv-metric-tile>  —  Traverse component library
   The "platform at a glance" metric tile, extracted from the
   system-admin-summary-v2 screen so the org and workspace
   summaries can reuse the exact same tile.

   A clickable tile: icon + label, a big figure with an optional
   trend, and a one-line description. Clicking it emits `tv-select`
   so the caller can open a tv-modal-card detail.

   Usage:
     <tv-metric-tile metric="members" icon="users" label="Members"
       value="318" trend="+24 this week" trend-dir="up" arrow
       desc="Everyone across every organisation and workspace.">
     </tv-metric-tile>

     <!-- compact sub-tile (3-up row) -->
     <tv-metric-tile compact icon="building" label="Orgs" value="10"
       trend="+1" trend-dir="up" desc="Top-level customer accounts.">
     </tv-metric-tile>

   Attributes:
     metric      id echoed back in the tv-select event detail
     label       small heading
     value       the figure
     trend       trend text (optional)
     trend-dir   up | flat | down            default up
     desc        one-line description (optional)
     icon        users | building | layout-grid | shield | plus | none
     arrow       show the corner "open" arrow
     compact     smaller padding + figure (for 3-up sub-tile rows)

   Events: tv-select (detail: { metric })
   Tokens (with fallbacks): --surface-0, --bg-subtle, --border-subtle,
     --border-default, --radius-lg, --fg-1/2/3/4, --success-600, --tv-font
   ============================================================ */
(() => {
  if (customElements.get('tv-metric-tile')) return

  const ICONS = {
    users:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    building:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>',
    'layout-grid':
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>',
    shield:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1Z"/></svg>',
    plus:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',
    arrow:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>',
    up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 7h6v6"/><path d="m22 7-8.5 8.5-5-5L2 17"/></svg>',
  }

  class TvMetricTile extends HTMLElement {
    static get observedAttributes() {
      return ['metric', 'label', 'value', 'trend', 'trend-dir', 'desc', 'icon', 'arrow', 'compact']
    }
    constructor() {
      super()
      this.attachShadow({ mode: 'open' })
    }
    connectedCallback() {
      this.render()
      this.addEventListener('click', this._onClick)
    }
    disconnectedCallback() {
      this.removeEventListener('click', this._onClick)
    }
    attributeChangedCallback() {
      if (this.shadowRoot) this.render()
    }
    _onClick = () => {
      this.dispatchEvent(
        new CustomEvent('tv-select', {
          bubbles: true,
          composed: true,
          detail: { metric: this.getAttribute('metric') || this.getAttribute('label') || '' },
        })
      )
    }
    render() {
      const label = this.getAttribute('label') || ''
      const value = this.getAttribute('value') || ''
      const trend = this.getAttribute('trend') || ''
      const dir = this.getAttribute('trend-dir') || 'up'
      const desc = this.getAttribute('desc') || ''
      const iconName = this.getAttribute('icon') || ''
      const showArrow = this.hasAttribute('arrow')
      const compact = this.hasAttribute('compact')
      const icon = ICONS[iconName] || ''
      const trendIcon = dir === 'up' ? ICONS.up : ''

      this.shadowRoot.innerHTML = `
        <style>
          :host{ display:block; font-family:var(--tv-font,'Geist','Inter',system-ui,sans-serif); }
          .tile{
            position:relative; display:block; width:100%; box-sizing:border-box;
            text-align:left; cursor:pointer;
            background:var(--surface-0,#fff); border:1px solid var(--border-subtle,#e2e8f0);
            border-radius:var(--radius-lg,12px); padding:${compact ? '14px' : '16px 18px'};
            transition:border-color .12s, background .12s;
          }
          .tile:hover{ border-color:var(--border-default,#cbd5e1); background:var(--bg-subtle,#f8fafc); }
          .tile:focus-visible{ outline:none; box-shadow:var(--shadow-ring-primary,0 0 0 3px rgba(99,102,241,.3)); }
          .go{ position:absolute; top:14px; right:14px; color:var(--fg-4,#94a3b8); width:15px; height:15px; }
          .go svg{ width:100%; height:100%; display:block; }
          .label{ display:flex; align-items:center; gap:7px; font-size:13px; font-weight:600; color:var(--fg-2,#334155); }
          .label .ic{ width:15px; height:15px; color:var(--fg-3,#64748b); }
          .label .ic svg{ width:100%; height:100%; display:block; }
          .fig{ display:flex; align-items:baseline; gap:10px; margin-top:6px; }
          .num{ font-size:${compact ? '22px' : '28px'}; font-weight:600; line-height:1; color:var(--fg-1,#0f172a); }
          .trend{ font-size:12px; font-weight:600; color:var(--success-600,#16a34a); display:inline-flex; align-items:center; gap:3px; }
          .trend.flat,.trend.down{ color:var(--fg-4,#94a3b8); }
          .trend svg{ width:13px; height:13px; }
          .desc{ font-size:12px; color:var(--fg-3,#64748b); line-height:1.5; margin-top:${compact ? '6px' : '8px'}; }
          .desc:empty{ display:none; }
          .trend:empty{ display:none; }
        </style>
        <button type="button" class="tile">
          ${showArrow ? `<span class="go" aria-hidden="true">${ICONS.arrow}</span>` : ''}
          <span class="label">${icon ? `<span class="ic" aria-hidden="true">${icon}</span>` : ''}${label}</span>
          <span class="fig">
            <span class="num">${value}</span>
            <span class="trend ${dir}">${trendIcon}${trend}</span>
          </span>
          <span class="desc">${desc}</span>
        </button>
      `
    }
  }
  customElements.define('tv-metric-tile', TvMetricTile)
})()
