/* ============================================================
   <tv-avatar>  —  Traverse component library
   Initials / image avatar with an optional presence ring.
   The one avatar used on every row, peek rail, profile header
   and modal-card header, so they're identical everywhere.

   Single source of truth: edit THIS file and every page that
   uses <tv-avatar> updates on reload (and on Vercel deploy).

   Usage:
     <tv-avatar name="Sarah Chen"></tv-avatar>
     <tv-avatar name="Sarah Chen" size="lg"></tv-avatar>
     <tv-avatar src="/path/face.jpg" name="Sarah Chen"></tv-avatar>
     <tv-avatar name="Hugo Greer" status="online"></tv-avatar>
     <tv-avatar name="Theresa Roma" deactivated></tv-avatar>

   Attributes:
     name         used to derive initials and the alt text
     src          image URL (falls back to initials if it fails to load)
     size         sm (28) | md (36) | lg (64)            default md
     status       online | offline | active | pending | deactivated
                  → shows a presence dot in the corner (optional)
     deactivated  greyed tint for deactivated members

   Tokens (with fallbacks): --primary-100/700, --surface-0/200/400/600,
     --success-500, --warn-500, --fg-3, --tv-font
   ============================================================ */
(() => {
  if (customElements.get('tv-avatar')) return

  const SIZES = { sm: 28, md: 36, lg: 64 }
  const FONTS = { sm: 11, md: 13, lg: 22 }
  const DOTS = { sm: 8, md: 9, lg: 13 }
  const STATUS = {
    online: 'var(--success-500,#039855)',
    active: 'var(--success-500,#039855)',
    pending: 'var(--warn-500,#cc8925)',
    offline: 'var(--surface-400,#94a3b8)',
    deactivated: 'var(--surface-400,#94a3b8)',
  }

  function initials(name) {
    const parts = (name || '').trim().split(/\s+/).filter(Boolean)
    if (!parts.length) return '—'
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  class TvAvatar extends HTMLElement {
    static get observedAttributes() {
      return ['name', 'src', 'size', 'status', 'deactivated']
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
      const name = this.getAttribute('name') || ''
      const src = this.getAttribute('src') || ''
      const size = SIZES[this.getAttribute('size')] ? this.getAttribute('size') : 'md'
      const px = SIZES[size]
      const fs = FONTS[size]
      const dot = DOTS[size]
      const deact = this.hasAttribute('deactivated')
      const status = this.getAttribute('status')
      const statusColor = STATUS[status]
      const bg = deact ? 'var(--surface-200,#e2e8f0)' : 'var(--primary-100,#e0e7ff)'
      const fg = deact ? 'var(--surface-600,#475569)' : 'var(--primary-700,#4338ca)'

      const face = src
        ? `<img class="img" src="${src}" alt="${name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><span class="ini" style="display:none">${initials(name)}</span>`
        : `<span class="ini">${initials(name)}</span>`

      this.shadowRoot.innerHTML = `
        <style>
          :host{ display:inline-flex; vertical-align:middle; }
          .av{
            position:relative; flex:0 0 auto;
            width:${px}px; height:${px}px; border-radius:9999px;
            display:inline-flex; align-items:center; justify-content:center;
            overflow:visible;
            font-family:var(--tv-font,'Geist','Inter',system-ui,sans-serif);
            font-weight:600; font-size:${fs}px; letter-spacing:.01em;
            color:${fg}; background:${bg};
            ${deact ? 'opacity:.85;' : ''}
          }
          .img{ width:100%; height:100%; border-radius:9999px; object-fit:cover; display:block; }
          .ini{ width:100%; height:100%; border-radius:9999px; display:flex; align-items:center; justify-content:center; }
          .dot{
            position:absolute; right:0; bottom:0;
            width:${dot}px; height:${dot}px; border-radius:9999px;
            background:${statusColor || 'transparent'};
            box-shadow:0 0 0 2px var(--surface-0,#fff);
          }
        </style>
        <span class="av" role="img" aria-label="${name}">
          ${face}
          ${statusColor ? '<span class="dot" aria-hidden="true"></span>' : ''}
        </span>
      `
    }
  }
  customElements.define('tv-avatar', TvAvatar)
})()
