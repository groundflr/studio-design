/* ============================================================
   tv-components.js  —  one-line loader for the Traverse library

   Put this single line on any prototype page and you get every
   tv-* component, each from its single source-of-truth file:

     <script src="/component-library/tv-components.js"></script>

   It finds its own folder automatically, so it works locally
   (python3 -m http.server), on Vercel, and in subfolders.
   Add a new component file below when you build one.
   ============================================================ */
;(() => {
  const COMPONENTS = ['tv-status-tag', 'tv-button', 'tv-diff', 'tv-excerpt', 'tv-field', 'tv-toggle', 'tv-modal-card', 'tv-audit-row', 'tv-avatar', 'tv-metric-tile', 'tv-settings-section', 'tv-peek-rail', 'tv-nav-heading', 'tv-nav-item', 'tv-nav-group', 'tv-nav-user', 'tv-nav-header', 'tv-nav-back', 'tv-nav-workspace', 'tv-sidebar', 'tv-page-header', 'tv-tab', 'tv-tab-group', 'tv-token-select', 'tv-start-step', 'tv-create-tile', 'tv-path-card', 'tv-guided-tour', 'tv-priority-actions']

  // ---- Shared type-role stylesheet -------------------------------------
  // One stylesheet, adopted into every component's shadow root, so headings
  // and body text read ONE central definition: the --text-* role tokens in
  // design-system/colors_and_type.css. Components apply a role class
  // (.tv-h1 / .tv-h2 / .tv-overline / .tv-body / .tv-meta) and hold NO type
  // literals — change a role's look at the token source and all follow.
  const TV_TYPE_CSS = `
    .tv-display-lg,.tv-display-sm,.tv-h1,.tv-h2,.tv-h3,.tv-h4,.tv-h5,.tv-h6,
    .tv-body-lg,.tv-body,.tv-body-strong,.tv-body-sm,
    .tv-label,.tv-label-strong,.tv-label-sm,.tv-button,.tv-button-sm,.tv-tag,
    .tv-caption,.tv-overline,.tv-eyebrow,.tv-micro,.tv-stat,.tv-mono,.tv-link{
      font-family:var(--tv-font,'Geist','Inter',system-ui,sans-serif); margin:0; }
    .tv-display-lg{ font-weight:var(--text-display-lg-weight,500); font-size:var(--text-display-lg-size,3rem); line-height:var(--text-display-lg-leading); letter-spacing:var(--text-display-lg-tracking); color:var(--text-display-lg-color,#0f172a); }
    .tv-display-sm{ font-weight:var(--text-display-sm-weight,600); font-size:var(--text-display-sm-size,2.25rem); line-height:var(--text-display-sm-leading); letter-spacing:var(--text-display-sm-tracking); color:var(--text-display-sm-color,#0f172a); }
    .tv-h1{ font-weight:var(--text-h1-weight,600); font-size:var(--text-h1-size,1.875rem); line-height:var(--text-h1-leading); letter-spacing:var(--text-h1-tracking); color:var(--text-h1-color,#0f172a); }
    .tv-h2{ font-weight:var(--text-h2-weight,600); font-size:var(--text-h2-size,1.5rem); line-height:var(--text-h2-leading); letter-spacing:var(--text-h2-tracking); color:var(--text-h2-color,#0f172a); }
    .tv-h3{ font-weight:var(--text-h3-weight,600); font-size:var(--text-h3-size,1.25rem); line-height:var(--text-h3-leading); letter-spacing:var(--text-h3-tracking); color:var(--text-h3-color,#0f172a); }
    .tv-h4{ font-weight:var(--text-h4-weight,600); font-size:var(--text-h4-size,1.125rem); line-height:var(--text-h4-leading); letter-spacing:var(--text-h4-tracking); color:var(--text-h4-color,#0f172a); }
    .tv-h5{ font-weight:var(--text-h5-weight,600); font-size:var(--text-h5-size,1rem); line-height:var(--text-h5-leading); letter-spacing:var(--text-h5-tracking); color:var(--text-h5-color,#0f172a); }
    .tv-h6{ font-weight:var(--text-h6-weight,600); font-size:var(--text-h6-size,0.875rem); line-height:var(--text-h6-leading); letter-spacing:var(--text-h6-tracking); color:var(--text-h6-color,#0f172a); }
    .tv-body-lg{ font-weight:var(--text-body-lg-weight,400); font-size:var(--text-body-lg-size,1rem); line-height:var(--text-body-lg-leading); letter-spacing:var(--text-body-lg-tracking); color:var(--text-body-lg-color,#334155); }
    .tv-body{ font-weight:var(--text-body-weight,400); font-size:var(--text-body-size,0.875rem); line-height:var(--text-body-leading); letter-spacing:var(--text-body-tracking); color:var(--text-body-color,#334155); }
    .tv-body-strong{ font-weight:var(--text-body-strong-weight,500); font-size:var(--text-body-strong-size,0.875rem); line-height:var(--text-body-strong-leading); letter-spacing:var(--text-body-strong-tracking); color:var(--text-body-strong-color,#0f172a); }
    .tv-body-sm{ font-weight:var(--text-body-sm-weight,400); font-size:var(--text-body-sm-size,0.75rem); line-height:var(--text-body-sm-leading); letter-spacing:var(--text-body-sm-tracking); color:var(--text-body-sm-color,#334155); }
    .tv-label{ font-weight:var(--text-label-weight,500); font-size:var(--text-label-size,0.875rem); line-height:var(--text-label-leading); letter-spacing:var(--text-label-tracking); color:var(--text-label-color,#0f172a); }
    .tv-label-strong{ font-weight:var(--text-label-strong-weight,600); font-size:var(--text-label-strong-size,0.875rem); line-height:var(--text-label-strong-leading); letter-spacing:var(--text-label-strong-tracking); color:var(--text-label-strong-color,#0f172a); }
    .tv-label-sm{ font-weight:var(--text-label-sm-weight,600); font-size:var(--text-label-sm-size,0.75rem); line-height:var(--text-label-sm-leading); letter-spacing:var(--text-label-sm-tracking); color:var(--text-label-sm-color,#0f172a); }
    .tv-button{ font-weight:var(--text-button-weight,600); font-size:var(--text-button-size,0.875rem); line-height:var(--text-button-leading); letter-spacing:var(--text-button-tracking); color:var(--text-button-color,#0f172a); }
    .tv-button-sm{ font-weight:var(--text-button-sm-weight,600); font-size:var(--text-button-sm-size,0.75rem); line-height:var(--text-button-sm-leading); letter-spacing:var(--text-button-sm-tracking); color:var(--text-button-sm-color,#0f172a); }
    .tv-tag{ font-weight:var(--text-tag-weight,600); font-size:var(--text-tag-size,0.6875rem); line-height:var(--text-tag-leading); letter-spacing:var(--text-tag-tracking); color:var(--text-tag-color,#0f172a); }
    .tv-caption{ font-weight:var(--text-caption-weight,500); font-size:var(--text-caption-size,0.75rem); line-height:var(--text-caption-leading); letter-spacing:var(--text-caption-tracking); color:var(--text-caption-color,#64748b); }
    .tv-overline{ display:block; text-transform:uppercase; font-weight:var(--text-overline-weight,600); font-size:var(--text-overline-size,0.6875rem); line-height:var(--text-overline-leading); letter-spacing:var(--text-overline-tracking,0.06em); color:var(--text-overline-color,#4f46e5); }
    .tv-eyebrow{ display:block; text-transform:uppercase; font-weight:var(--text-eyebrow-weight,600); font-size:var(--text-eyebrow-size,0.6875rem); line-height:var(--text-eyebrow-leading); letter-spacing:var(--text-eyebrow-tracking,0.05em); color:var(--text-eyebrow-color,#64748b); }
    .tv-micro{ display:block; text-transform:uppercase; font-weight:var(--text-micro-weight,600); font-size:var(--text-micro-size,0.625rem); line-height:var(--text-micro-leading); letter-spacing:var(--text-micro-tracking,0.04em); color:var(--text-micro-color,#64748b); }
    .tv-stat{ font-weight:var(--text-stat-weight,700); font-size:var(--text-stat-size,1.875rem); line-height:var(--text-stat-leading); letter-spacing:var(--text-stat-tracking); color:var(--text-stat-color,#0f172a); font-variant-numeric:tabular-nums; }
    .tv-mono{ font-family:var(--font-mono,ui-monospace,Menlo,monospace); font-weight:var(--text-mono-weight,400); font-size:var(--text-mono-size,0.75rem); line-height:var(--text-mono-leading); letter-spacing:var(--text-mono-tracking); color:var(--text-mono-color,#334155); }
    .tv-link{ font-weight:var(--text-link-weight,500); color:var(--text-link-color,#4f46e5); text-decoration:none; cursor:pointer; }
    .tv-link:hover{ text-decoration:underline; }
  `
  window.__TV_TYPE_CSS__ = TV_TYPE_CSS
  try {
    const sheet = new CSSStyleSheet()
    sheet.replaceSync(TV_TYPE_CSS)
    window.__TV_TYPE_SHEET__ = sheet
  } catch (e) {
    /* constructable stylesheets unsupported — components fall back to an inline <style> */
  }
  // Adopt the shared type sheet into a component's shadow root (call after render).
  window.__tvType = (root) => {
    if (!root) return
    if (window.__TV_TYPE_SHEET__ && 'adoptedStyleSheets' in root) {
      if (!root.adoptedStyleSheets.includes(window.__TV_TYPE_SHEET__))
        root.adoptedStyleSheets = [...root.adoptedStyleSheets, window.__TV_TYPE_SHEET__]
    } else if (window.__TV_TYPE_CSS__ && !root.querySelector('style[data-tv-type]')) {
      const s = document.createElement('style')
      s.setAttribute('data-tv-type', '')
      s.textContent = window.__TV_TYPE_CSS__
      root.appendChild(s)
    }
  }

  // ---- Shared icon stylesheet (Lucide font) ----------------------------
  // Components render <i class="icon-NAME"> and call window.__tvIcons(root)
  // after render. The vendored Lucide font CSS is linked INTO each shadow
  // root because its .icon-* class rules don't cross the shadow boundary
  // (only the @font-face, which is document-global, would). Any Lucide
  // icon name works as `icon="name"`; a few legacy short names are aliased
  // so existing prototypes keep rendering. Override the font location with
  // window.__TV_LUCIDE_HREF__ before this script loads (default: vendored
  // /fonts/lucide/lucide.css, resolved relative to this file).
  const ICON_ALIAS = { rotate: 'rotate-cw', sliders: 'sliders-horizontal', userplus: 'user-plus', chevron: 'chevron-up', arrow: 'arrow-up-right', up: 'trending-up' }
  window.__tvIcon = (name) => (name ? 'icon-' + (ICON_ALIAS[name] || name) : '')
  const __tvSelf = (document.currentScript && document.currentScript.src) || ''
  const LUCIDE_HREF =
    window.__TV_LUCIDE_HREF__ || (__tvSelf ? new URL('../fonts/lucide/lucide.css', __tvSelf).href : '/fonts/lucide/lucide.css')
  window.__tvIcons = (root) => {
    if (!root || root.querySelector('link[data-tv-icons]')) return
    const l = document.createElement('link')
    l.setAttribute('data-tv-icons', '')
    l.rel = 'stylesheet'
    l.href = LUCIDE_HREF
    root.appendChild(l)
  }

  // Load the Geist webfont for tv-* components (component-scoped via --tv-font;
  // does NOT touch the global --font-sans, so legacy prototypes stay on Inter).
  if (!document.getElementById('tv-font-geist')) {
    const f = document.createElement('link')
    f.id = 'tv-font-geist'
    f.rel = 'stylesheet'
    f.href = 'https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800&display=swap'
    document.head.appendChild(f)
  }

  // resolve this script's folder so component paths are location-independent
  const self = document.currentScript && document.currentScript.src
  const base = self ? self.slice(0, self.lastIndexOf('/') + 1) : '/component-library/'

  COMPONENTS.forEach((name) => {
    const s = document.createElement('script')
    s.src = `${base}components/${name}.js`
    s.async = false // preserve order (components may reference each other)
    document.head.appendChild(s)
  })
})()
