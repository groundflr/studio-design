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
  const COMPONENTS = ['tv-status-tag', 'tv-button', 'tv-diff', 'tv-excerpt', 'tv-field', 'tv-toggle', 'tv-modal-card', 'tv-audit-row', 'tv-avatar', 'tv-metric-tile', 'tv-settings-section', 'tv-peek-rail']

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
