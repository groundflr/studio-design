/* ============================================================
   <tv-status-ribbon>  —  Traverse component library
   Design-readiness ribbon for prototype pages. Fixed to the
   top-right of the viewport, it shows the ACTIVE screen's
   data-status (ready | wip | explore | superseded) so a developer
   opening the prototype in a browser can tell whether the design
   is buildable without reading source.

   Also decorates the page's devbar:
     - every .dev-btn[data-nav] gets a small status dot matching
       its target screen's status
     - buttons targeting a superseded screen render struck-through
       at reduced opacity
     - a "Hide status" toggle is appended to the end of the bar
       (persisted in sessionStorage — never localStorage)

   Active-screen resolution, in order:
     1. section.screen.is-active / section.screen.active
        (data-screen-name= or data-screen=)
     2. body[data-status]  (single-status prototypes: onboarding,
        page-skeleton)
   A missing data-status means NOT READY — it renders as WIP with
   an "unmarked" hint.

   For superseded screens the ribbon renders "Replaced by <name>"
   as a link that navigates to the replacement screen.

   Suppression for clean screenshots: ?chrome=0 in the URL, or the
   devbar toggle. Choice persists for the session only.

   Usage: place once anywhere in <body>:
     <tv-status-ribbon></tv-status-ribbon>

   Gallery/demo attributes (not for prototype use):
     inline                  render in flow instead of fixed top-right
     demo="ready|wip|explore|superseded"   force a status
     demo-replaced="name"    replacement name shown in the demo link

   Tokens (with fallbacks): --success-100/500, --warn-100/600,
     --info-100/500, --surface-0/100/200, --fg-3, --tv-font
   ============================================================ */
(() => {
  if (customElements.get('tv-status-ribbon')) return

  const LABELS = { ready: 'READY', wip: 'WIP', explore: 'EXPLORING', superseded: 'SUPERSEDED' }
  const STORE_KEY = 'tv.statusChrome'

  function chromeOn() {
    const q = new URLSearchParams(location.search).get('chrome')
    if (q === '0') { try { sessionStorage.setItem(STORE_KEY, 'off') } catch (e) {} return false }
    if (q === '1') { try { sessionStorage.setItem(STORE_KEY, 'on') } catch (e) {} return true }
    try { return sessionStorage.getItem(STORE_KEY) !== 'off' } catch (e) { return true }
  }

  function screenName(sec) {
    return sec.getAttribute('data-screen-name') || sec.getAttribute('data-screen') || ''
  }
  function findScreen(name) {
    return (
      document.querySelector('section.screen[data-screen-name="' + name + '"]') ||
      document.querySelector('section.screen[data-screen="' + name + '"]')
    )
  }
  function statusOf(sec) {
    const raw = (sec && sec.getAttribute('data-status')) || ''
    return LABELS[raw] ? raw : 'wip'
  }

  class TvStatusRibbon extends HTMLElement {
    constructor() {
      super()
      this.attachShadow({ mode: 'open' })
      this._raf = 0
    }

    connectedCallback() {
      if (this.hasAttribute('demo')) { this.render(); return }
      document.documentElement.setAttribute('data-status-chrome', chromeOn() ? 'on' : 'off')
      this.installDevbarCss()
      this.render()
      this.decorateDevbar()
      this.installToggle()
      // Screen switches are class/attribute flips on the section elements —
      // one observer covers navigation and any live data-status edits.
      this._mo = new MutationObserver(() => {
        cancelAnimationFrame(this._raf)
        this._raf = requestAnimationFrame(() => { this.render(); this.decorateDevbar() })
      })
      this._mo.observe(document.body, {
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'data-status', 'data-superseded-by'],
      })
    }
    disconnectedCallback() {
      if (this._mo) this._mo.disconnect()
    }

    resolve() {
      if (this.hasAttribute('demo')) {
        const s = this.getAttribute('demo')
        return {
          name: '',
          status: LABELS[s] ? s : 'wip',
          unmarked: false,
          supersededBy: this.getAttribute('demo-replaced') || '',
        }
      }
      const sec = document.querySelector('section.screen.is-active, section.screen.active')
      if (sec) {
        return {
          name: screenName(sec),
          status: statusOf(sec),
          unmarked: !sec.getAttribute('data-status'),
          supersededBy: sec.getAttribute('data-superseded-by') || '',
        }
      }
      const b = document.body
      return {
        name: '',
        status: statusOf(b),
        unmarked: !b.getAttribute('data-status'),
        supersededBy: b.getAttribute('data-superseded-by') || '',
      }
    }

    render() {
      const { status, unmarked, supersededBy } = this.resolve()
      this.setAttribute('status', status)
      const replaced =
        status === 'superseded' && supersededBy
          ? `<a class="swap" href="#" data-goto="${supersededBy}">Replaced by ${supersededBy}</a>`
          : ''
      this.shadowRoot.innerHTML = `
        <style>
          :host{
            position:fixed; top:12px; right:12px; z-index:2147483000;
            display:block; font-family:var(--tv-font,'Geist','Inter',system-ui,sans-serif);
            pointer-events:none;
          }
          :host([inline]){ position:static; }
          :host([inline]) .ribbon{ align-items:flex-start; }
          .ribbon{
            display:flex; flex-direction:column; align-items:flex-end; gap:4px;
            pointer-events:auto;
          }
          .badge{
            display:inline-flex; align-items:center; gap:6px;
            font-weight:600; font-size:11px; line-height:1; letter-spacing:0.06em;
            padding:6px 10px; border-radius:9999px;
            border:1px solid rgb(0 0 0 / 0.06);
          }
          :host([status="ready"]) .badge{ background:var(--success-100,#dcfce7); color:var(--success-500,#039855); }
          :host([status="wip"]) .badge{ background:var(--warn-100,#fef3c7); color:var(--warn-600,#ca8a04); }
          :host([status="explore"]) .badge{ background:var(--info-100,#e0f2fe); color:var(--info-500,#0284c7); }
          :host([status="superseded"]) .badge{ background:var(--surface-100,#f1f5f9); color:var(--fg-3,#64748b); text-decoration:line-through; }
          .hint{ font-weight:500; letter-spacing:normal; text-transform:lowercase; opacity:0.75; }
          .swap{
            font-weight:500; font-size:11px; line-height:1;
            color:var(--fg-3,#64748b); background:var(--surface-0,#fff);
            border:1px solid var(--surface-200,#e2e8f0); border-radius:9999px;
            padding:5px 10px; text-decoration:none;
          }
          .swap:hover{ color:var(--fg-1,#0f172a); border-color:var(--surface-300,#cbd5e1); }
        </style>
        <div class="ribbon">
          <span class="badge">${LABELS[status]}${unmarked ? ' <span class="hint">unmarked</span>' : ''}</span>
          ${replaced}
        </div>
      `
      const link = this.shadowRoot.querySelector('.swap')
      if (link) {
        link.addEventListener('click', (e) => {
          e.preventDefault()
          this.navigateTo(link.getAttribute('data-goto'))
        })
      }
      // :host can't be matched from inside the shadow root under html[...],
      // so mirror the chrome state onto the host element itself.
      this.style.display = document.documentElement.getAttribute('data-status-chrome') === 'off' ? 'none' : 'block'
    }

    navigateTo(name) {
      const devBtn = document.querySelector('.devbar .dev-btn[data-nav="' + name + '"], [data-nav="' + name + '"]')
      if (devBtn) { devBtn.click(); return }
      const target = findScreen(name)
      const current = document.querySelector('section.screen.is-active, section.screen.active')
      if (!target) return
      if (current) current.classList.remove('is-active', 'active')
      target.classList.add(current && current.classList.contains('active') ? 'active' : 'is-active')
      this.render()
    }

    // Head-level stylesheet for light-DOM devbar decorations. Keyed off
    // html[data-status-chrome] so the toggle switches everything at once.
    installDevbarCss() {
      if (document.getElementById('tv-status-devbar-css')) return
      const s = document.createElement('style')
      s.id = 'tv-status-devbar-css'
      s.textContent = `
        .tv-status-dot{ display:none; }
        html[data-status-chrome="on"] .tv-status-dot{
          display:inline-block; width:6px; height:6px; border-radius:50%;
          margin-right:6px; vertical-align:1px; flex:none;
        }
        .tv-status-dot[data-s="ready"]{ background:var(--success-500,#039855); }
        .tv-status-dot[data-s="wip"]{ background:var(--warn-600,#ca8a04); }
        .tv-status-dot[data-s="explore"]{ background:var(--info-500,#0284c7); }
        .tv-status-dot[data-s="superseded"]{ background:var(--fg-3,#64748b); }
        html[data-status-chrome="on"] .tv-status-superseded{
          text-decoration:line-through; opacity:0.55;
        }
      `
      document.head.appendChild(s)
    }

    decorateDevbar() {
      document.querySelectorAll('.devbar [data-nav], .ctrlbar [data-nav]').forEach((btn) => {
        const target = findScreen(btn.getAttribute('data-nav'))
        if (!target) return
        const status = statusOf(target)
        let dot = btn.querySelector(':scope > .tv-status-dot')
        if (!dot) {
          dot = document.createElement('span')
          dot.className = 'tv-status-dot'
          dot.setAttribute('aria-hidden', 'true')
          btn.insertBefore(dot, btn.firstChild)
        }
        dot.setAttribute('data-s', status)
        btn.classList.toggle('tv-status-superseded', status === 'superseded')
        btn.title = LABELS[status] + (status === 'superseded' && target.getAttribute('data-superseded-by')
          ? ' — replaced by ' + target.getAttribute('data-superseded-by') : '')
      })
    }

    installToggle() {
      const bar = document.querySelector('.devbar, .ctrlbar')
      if (!bar || bar.querySelector('.tv-status-toggle')) return
      // Reuse the bar's own button class so the toggle inherits its styling.
      const cls = bar.querySelector('.dev-btn') ? 'dev-btn'
        : bar.querySelector('.devbar__btn') ? 'devbar__btn'
        : bar.querySelector('.cb') ? 'cb' : 'dev-btn'
      const btn = document.createElement('button')
      btn.className = cls + ' tv-status-toggle'
      btn.type = 'button'
      const sync = () => {
        const on = document.documentElement.getAttribute('data-status-chrome') !== 'off'
        btn.textContent = on ? 'Hide status' : 'Show status'
        btn.setAttribute('aria-pressed', on ? 'false' : 'true')
      }
      btn.addEventListener('click', () => {
        const on = document.documentElement.getAttribute('data-status-chrome') !== 'off'
        document.documentElement.setAttribute('data-status-chrome', on ? 'off' : 'on')
        try { sessionStorage.setItem(STORE_KEY, on ? 'off' : 'on') } catch (e) {}
        sync()
        this.render()
      })
      sync()
      bar.appendChild(btn)
    }
  }

  customElements.define('tv-status-ribbon', TvStatusRibbon)
})()
