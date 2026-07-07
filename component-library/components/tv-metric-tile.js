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
     accent      coloured icon box: primary | purple | sky | orange | teal |
                 success | info (or a raw colour). Omit for a plain inline icon.
     trend-pill  render the trend as a background pill (up=green, flat=grey,
                 down=red) instead of plain coloured text

   Events: tv-select (detail: { metric })
   Tokens (with fallbacks): --surface-0, --bg-subtle, --border-subtle,
     --border-default, --radius-lg, --fg-1/2/3/4, --success-600, --tv-font
   ============================================================ */
(() => {
  if (customElements.get('tv-metric-tile')) return

  class TvMetricTile extends HTMLElement {
    static get observedAttributes() {
      return ['metric', 'label', 'value', 'trend', 'trend-dir', 'desc', 'icon', 'arrow', 'compact', 'accent', 'trend-pill']
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
      // Optional coloured icon box (keyword → token, or a raw colour) + trend pill.
      const accentKey = this.getAttribute('accent') || ''
      const ACCENTS = { primary: '--primary-600', purple: '--cat-purple', sky: '--cat-sky', orange: '--cat-orange', teal: '--cat-teal', success: '--success-600', info: '--info-500' }
      const accent = ACCENTS[accentKey] ? `var(${ACCENTS[accentKey]})` : accentKey
      const box = accent ? ' box' : ''
      const pill = this.hasAttribute('trend-pill') ? ' pill' : ''
      const ic = (n) => (window.__tvIcon ? window.__tvIcon(n) : 'icon-' + n)
      const icon = iconName ? `<i class="${ic(iconName)}"></i>` : ''
      const trendIcon = dir === 'up' ? `<i class="${ic('up')}"></i>` : ''

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
          .go{ position:absolute; top:14px; right:14px; color:var(--fg-4,#94a3b8); width:15px; height:15px; font-size:15px; line-height:1; display:inline-flex; }
          .label{ display:flex; align-items:center; gap:7px; } /* type via .tv-label-sm */
          .label .ic{ width:15px; height:15px; color:var(--fg-3,#64748b); font-size:15px; line-height:1; display:inline-flex; align-items:center; }
          /* Coloured icon box (opt-in via [accent]) — mirrors the v1 metric-card icon tile. */
          .label .ic.box{ width:34px; height:34px; justify-content:center; border-radius:10px; font-size:17px;
            background:color-mix(in srgb, var(--tile-accent,#64748b) 12%, var(--surface-0,#fff)); color:var(--tile-accent,#64748b); }
          .fig{ display:flex; align-items:baseline; gap:10px; margin-top:6px; }
          .num{ } /* type via .tv-stat */
          /* trend colour uses :host so it outranks the .tv-label-sm role colour */
          .trend{ display:inline-flex; align-items:center; gap:3px; }
          :host .trend{ color:var(--success-600,#16a34a); }
          :host .trend.flat, :host .trend.down{ color:var(--fg-4,#94a3b8); }
          /* Opt-in background pill (via [trend-pill]) — easier to scan, from v1. */
          .trend.pill{ padding:3px 8px 3px 6px; border-radius:999px; }
          :host .trend.pill.up{ background:var(--success-100,#dcfce7); }
          :host .trend.pill.flat{ color:var(--fg-3,#64748b); background:var(--surface-100,#f1f5f9); }
          :host .trend.pill.down{ color:var(--error-600,#dc2626); background:var(--error-100,#fee2e2); }
          .trend i{ font-size:13px; line-height:1; }
          .desc{ margin-top:${compact ? '6px' : '8px'}; } /* type via .tv-caption */
          .desc:empty{ display:none; }
          .trend:empty{ display:none; }
        </style>
        <button type="button" class="tile"${accent ? ` style="--tile-accent:${accent}"` : ''}>
          ${showArrow ? `<span class="go" aria-hidden="true"><i class="${ic('arrow')}"></i></span>` : ''}
          <span class="label tv-label-sm">${icon ? `<span class="ic${box}" aria-hidden="true">${icon}</span>` : ''}${label}</span>
          <span class="fig">
            <span class="num tv-stat">${value}</span>
            <span class="trend ${dir}${pill} tv-label-sm">${trendIcon}${trend}</span>
          </span>
          <span class="desc tv-caption">${desc}</span>
        </button>
      `
      if (window.__tvType) window.__tvType(this.shadowRoot)
      if (window.__tvIcons) window.__tvIcons(this.shadowRoot)
    }
  }
  customElements.define('tv-metric-tile', TvMetricTile)
})()
