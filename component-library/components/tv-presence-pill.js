/* ============================================================
   <tv-presence-pill>  —  Traverse component library
   The live-presence pill from the System Admin summary header:
   a pulsing green dot + an online count + label, with the active
   session count divider-separated inside the same pill.

   When nobody is online (count 0 / missing) it renders its empty
   state: a static grey dot + muted "No <label>", no session count.

   Usage:
     <tv-presence-pill count="47" label="users online" sessions="63"></tv-presence-pill>
     <tv-presence-pill count="128" label="candidates online" sessions="141"></tv-presence-pill>

     <!-- empty / nobody online -->
     <tv-presence-pill count="0" label="users online"></tv-presence-pill>

   Stack a couple in a right-aligned column (as in the SA summary
   header) with display:inline-grid + gap on the wrapper.

   Attributes:
     count      online count. 0 / omitted → empty state.
     label      the online phrase, e.g. "users online" / "candidates online".
                Empty state reads "No <label>".
     sessions   active session count (optional). Hidden when empty/0
                or when the pill is in its empty state.

   Tokens (with fallbacks): --surface-0, --surface-200, --surface-500,
     --surface-700, --surface-900, --surface-400, --surface-100,
     --success-500, --tv-font
   ============================================================ */
(() => {
  if (customElements.get('tv-presence-pill')) return

  class TvPresencePill extends HTMLElement {
    static get observedAttributes() {
      return ['count', 'label', 'sessions']
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
      const raw = this.getAttribute('count')
      const count = raw == null || raw === '' ? 0 : parseInt(raw, 10) || 0
      const label = this.getAttribute('label') || ''
      const sessionsRaw = this.getAttribute('sessions')
      const sessions = sessionsRaw == null || sessionsRaw === '' ? 0 : parseInt(sessionsRaw, 10) || 0
      const empty = count <= 0

      const body = empty
        ? `<span class="empty tv-body-sm">No ${label}</span>`
        : `<span class="lbl tv-body-sm"><span class="n">${count}</span>${label}</span>` +
          (sessions > 0
            ? `<span class="sub tv-caption">${sessions} active session${sessions === 1 ? '' : 's'}</span>`
            : '')

      this.shadowRoot.innerHTML = `
        <style>
          :host{ display:block; font-family:var(--tv-font,'Geist','Inter',system-ui,sans-serif); }
          .pill{
            display:inline-flex; align-items:center; justify-content:flex-start;
            width:100%; box-sizing:border-box; height:34px; gap:9px; padding:0 15px 0 12px;
            border-radius:999px; background:var(--surface-0,#fff);
            border:1px solid var(--surface-200,#e2e8f0); white-space:nowrap;
          }
          /* Live pulsing dot (green) — reuses the sa-pulse motion pattern. */
          .dot{ position:relative; width:8px; height:8px; border-radius:50%;
            background:var(--success-500,#22c55e); flex-shrink:0; }
          .dot::after{ content:''; position:absolute; inset:0; border-radius:50%;
            background:var(--success-500,#22c55e); animation:tv-presence-pulse 1.8s ease-out infinite; }
          /* Empty state: static grey dot, no pulse. */
          :host([data-empty]) .dot{ background:var(--surface-400,#94a3b8); }
          :host([data-empty]) .dot::after{ display:none; }
          @keyframes tv-presence-pulse{
            0%   { transform:scale(1);   opacity:.5; }
            100% { transform:scale(3.4); opacity:0; }
          }
          @media (prefers-reduced-motion: reduce){ .dot::after{ animation:none; } }
          .lbl{ color:var(--surface-700,#334155); }
          .n{ font-weight:600; color:var(--surface-900,#0f172a); margin-right:2px; }
          .empty{ color:var(--surface-500,#64748b); }
          /* Active-session count — divider-separated + muted, inside the pill. */
          .sub{ padding-left:9px; margin-left:2px;
            border-left:1px solid var(--surface-200,#e2e8f0); color:var(--surface-500,#64748b); }
        </style>
        <span class="pill">
          <span class="dot" aria-hidden="true"></span>
          ${body}
        </span>
      `
      if (empty) this.setAttribute('data-empty', '')
      else this.removeAttribute('data-empty')
      if (window.__tvType) window.__tvType(this.shadowRoot)
    }
  }
  customElements.define('tv-presence-pill', TvPresencePill)
})()
