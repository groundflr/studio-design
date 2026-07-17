/* ============================================================
   <tv-token-select>  —  Traverse component library
   Multi-select chip input with autocomplete. One component, two
   modes: free-text email tokens, or pick-from-a-list (existing
   org users / workspaces). Used by every invite / add-user modal.

   Usage:
     <!-- Email tokens (new-user org invites) -->
     <tv-token-select mode="email" placeholder="name@company.com"></tv-token-select>

     <!-- Pick from a list (existing users / workspaces) -->
     <tv-token-select id="ws" mode="options" placeholder="Search workspaces…"></tv-token-select>
     <script>
       document.getElementById('ws').options = [
         { value: 'ld-hub', name: 'L&D Hub' },
         { value: 'sales',  name: 'Sales Training' }
       ]
       // user rows: pass an `email` and the dropdown shows a tv-avatar + email
       ws.addEventListener('tv-change', (e) => console.log(e.detail.values))
     </script>

   Attributes:
     mode         'options' (default) | 'email'
     placeholder  input placeholder (shown while no chips)
     options      JSON array of {value,name,email?,desc?} — declarative
                  alternative to the .options property
     disabled     non-interactive

   Properties:
     options   array of {value,name,email?,desc?}  (get/set)
     selected  array of the chosen option objects   (get)
     value     array of the chosen values           (get)
   Methods: clear(), setDisabled(bool), count()
   Events (bubble, composed): tv-change  detail: { selected, values }
   Tokens (with fallbacks): --surface-0/100/200/400/500/700/900,
     --primary-100/400, --font-sans / --tv-font, --radius tokens.
   ============================================================ */
(() => {
  if (customElements.get('tv-token-select')) return

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  class TvTokenSelect extends HTMLElement {
    static get observedAttributes() {
      return ['mode', 'placeholder', 'disabled', 'options']
    }
    constructor() {
      super()
      this.attachShadow({ mode: 'open' })
      this._options = []
      this._selected = []
      this._activeIdx = -1
    }
    connectedCallback() {
      // Honour an .options property set on the element BEFORE it upgraded
      // (consumers on this codebase run their wiring before the async
      // component scripts define the element). Without this, that early
      // assignment sits as an own property shadowing the prototype setter.
      this._upgradeProperty('options')
      // Adopt options provided declaratively before first render.
      if (!this._options.length && this.hasAttribute('options')) {
        try { this._options = JSON.parse(this.getAttribute('options')) || [] } catch (e) { this._options = [] }
      }
      this.render()
    }
    _upgradeProperty(prop) {
      if (Object.prototype.hasOwnProperty.call(this, prop)) {
        const v = this[prop]
        delete this[prop]
        this[prop] = v
      }
    }
    attributeChangedCallback(name, oldV, newV) {
      if (!this.shadowRoot || !this._area) return
      if (name === 'placeholder') { this._basePlaceholder = newV || ''; this._syncPlaceholder() }
      else if (name === 'disabled') { this.setDisabled(this.hasAttribute('disabled')) }
      else if (name === 'options') {
        try { this.options = JSON.parse(newV) || [] } catch (e) { /* ignore */ }
      } else if (name === 'mode') { this.render() }
    }

    /* ---- public API ---- */
    get mode() { return this.getAttribute('mode') === 'email' ? 'email' : 'options' }
    get options() { return this._options.slice() }
    set options(v) {
      this._options = Array.isArray(v) ? v.slice() : []
      if (this._dropdown) this._renderDropdown()
    }
    get selected() { return this._selected.slice() }
    get value() { return this._selected.map((s) => s.value) }
    count() { return this._selected.length }
    clear() { this._selected = []; if (this._input) this._input.value = ''; this._renderChips(); this._closeDropdown(); this._emit() }
    setDisabled(d) {
      if (d) this.setAttribute('disabled', ''); else this.removeAttribute('disabled')
      if (!this._area) return
      this._area.classList.toggle('is-disabled', !!d)
      this._input.disabled = !!d
      if (d) this._closeDropdown()
    }

    /* ---- internals ---- */
    _emit() {
      this.dispatchEvent(new CustomEvent('tv-change', {
        bubbles: true, composed: true,
        detail: { selected: this.selected, values: this.value }
      }))
    }
    _has(v) { return this._selected.some((s) => s.value === v) }
    _syncPlaceholder() {
      if (this._input) this._input.setAttribute('placeholder', this._selected.length ? '' : (this._basePlaceholder || ''))
    }
    _renderChips() {
      Array.prototype.slice.call(this._area.querySelectorAll('.ts-chip')).forEach((c) => c.remove())
      this._selected.forEach((item) => {
        const chip = document.createElement('span')
        chip.className = 'ts-chip'
        chip.innerHTML = '<span class="ts-chip-label">' + (item.name || item.value) + '</span>' +
          '<button type="button" class="ts-chip-x" aria-label="Remove ' + (item.name || item.value) + '"><i class="' + window.__tvIcon('x') + '"></i></button>'
        chip.querySelector('.ts-chip-x').addEventListener('click', (e) => {
          e.stopPropagation(); this._remove(item.value); this._input.focus()
        })
        this._area.insertBefore(chip, this._input)
      })
      this._syncPlaceholder()
    }
    _add(item) { if (this._has(item.value)) return; this._selected.push(item); this._input.value = ''; this._renderChips(); this._emit() }
    _remove(v) { this._selected = this._selected.filter((s) => s.value !== v); this._renderChips(); this._emit() }

    _availableOptions() {
      const q = (this._input.value || '').toLowerCase().trim()
      return this._options.filter((o) => {
        if (this._has(o.value)) return false
        if (!q) return true
        return (o.name || '').toLowerCase().indexOf(q) !== -1 ||
               (o.email || '').toLowerCase().indexOf(q) !== -1 ||
               (o.desc || '').toLowerCase().indexOf(q) !== -1
      })
    }
    _renderDropdown() {
      if (this.mode === 'email' || !this._dropdown) return
      const list = this._availableOptions()
      this._dropdown.innerHTML = ''
      if (!list.length) {
        const empty = document.createElement('div')
        empty.className = 'ts-empty'
        empty.textContent = 'No matches'
        this._dropdown.appendChild(empty)
        return
      }
      list.forEach((o, i) => {
        const opt = document.createElement('div')
        opt.className = 'ts-option' + (i === this._activeIdx ? ' is-active' : '')
        opt.setAttribute('role', 'option')
        if (o.email) {
          opt.innerHTML = '<div class="ts-opt-user"><tv-avatar name="' + o.name + '" size="sm"></tv-avatar>' +
            '<div class="ts-opt-text"><div class="ts-opt-name">' + o.name + '</div>' +
            '<div class="ts-opt-email">' + o.email + '</div></div></div>'
        } else {
          opt.innerHTML = '<div class="ts-opt-name">' + o.name + '</div>' +
            (o.desc ? '<div class="ts-opt-desc">' + o.desc + '</div>' : '')
        }
        opt.addEventListener('mousedown', (ev) => { ev.preventDefault(); this._add(o); this._renderDropdown(); this._dropdown.classList.add('is-open') })
        this._dropdown.appendChild(opt)
      })
    }
    _openDropdown() { if (this.mode === 'email' || !this._dropdown) return; this._renderDropdown(); this._dropdown.classList.add('is-open') }
    _closeDropdown() { if (this._dropdown) this._dropdown.classList.remove('is-open'); this._activeIdx = -1 }
    _commitEmail() {
      const v = (this._input.value || '').replace(/,/g, '').trim()
      if (v && EMAIL_RE.test(v) && !this._has(v)) this._add({ value: v, name: v })
    }

    render() {
      const isEmail = this.mode === 'email'
      this._basePlaceholder = this.getAttribute('placeholder') || ''
      this.shadowRoot.innerHTML = `
        <style>
          :host{ display:block; position:relative;
            font-family:var(--tv-font,var(--font-sans,'Geist','Inter',system-ui,sans-serif)); }
          .ts-area{ display:flex; flex-wrap:wrap; align-items:center; gap:6px;
            min-height:42px; padding:6px 8px; box-sizing:border-box;
            border:1px solid var(--surface-200,#e2e8f0); border-radius:10px;
            background:var(--surface-0,#fff); cursor:text;
            transition:border-color .12s, box-shadow .12s; }
          .ts-area.is-focused{ border-color:var(--primary-400,#818cf8);
            box-shadow:0 0 0 3px var(--primary-100,#e0e7ff); }
          .ts-area.is-disabled{ background:var(--surface-100,#f1f5f9); cursor:not-allowed; opacity:.6; }
          .ts-chip{ display:inline-flex; align-items:center; gap:6px; max-width:100%;
            padding:4px 4px 4px 10px; background:var(--surface-100,#f1f5f9);
            border:1px solid var(--surface-200,#e2e8f0); border-radius:999px;
            font-weight:500; font-size:13px; color:var(--surface-900,#0f172a); }
          .ts-chip-label{ overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
          .ts-chip-x{ display:inline-flex; align-items:center; justify-content:center;
            width:18px; height:18px; border:0; border-radius:999px; background:transparent;
            color:var(--surface-500,#64748b); cursor:pointer; flex:0 0 auto; }
          .ts-chip-x:hover{ background:var(--surface-200,#e2e8f0); color:var(--surface-800,#1e293b); }
          .ts-chip-x i{ font-size:13px; line-height:1; }
          .ts-input{ flex:1 1 120px; min-width:120px; padding:4px; border:0; outline:0;
            font-family:inherit; font-size:14px; color:var(--surface-900,#0f172a); background:transparent; }
          .ts-input::placeholder{ color:var(--surface-400,#94a3b8); }
          .ts-dropdown{ position:absolute; top:calc(100% + 4px); left:0; right:0;
            background:var(--surface-0,#fff); border:1px solid var(--surface-200,#e2e8f0);
            border-radius:10px; box-shadow:0 10px 24px -8px rgba(15,23,42,.18);
            max-height:220px; overflow-y:auto; padding:4px; z-index:30; display:none; }
          .ts-dropdown.is-open{ display:block; }
          .ts-option{ padding:10px 12px; border-radius:6px; cursor:pointer; }
          .ts-option:hover, .ts-option.is-active{ background:var(--surface-100,#f1f5f9); }
          .ts-opt-user{ display:flex; align-items:center; gap:10px; }
          .ts-opt-text{ min-width:0; }
          .ts-opt-name{ font-weight:500; font-size:13px; color:var(--surface-900,#0f172a); }
          .ts-opt-desc{ font-size:12px; color:var(--surface-500,#64748b); margin-top:2px; }
          .ts-opt-email{ font-size:12px; color:var(--surface-500,#64748b); margin-top:1px; }
          .ts-empty{ padding:10px 12px; font-size:13px; color:var(--surface-400,#94a3b8); text-align:center; }
        </style>
        <div class="ts-area" part="area">
          <input class="ts-input" type="text" autocomplete="off" role="combobox" aria-expanded="false"
            aria-label="${this.getAttribute('aria-label') || 'Add items'}">
        </div>
        ${isEmail ? '' : '<div class="ts-dropdown" role="listbox"></div>'}
      `
      if (window.__tvIcons) window.__tvIcons(this.shadowRoot)
      this._area = this.shadowRoot.querySelector('.ts-area')
      this._input = this.shadowRoot.querySelector('.ts-input')
      this._dropdown = this.shadowRoot.querySelector('.ts-dropdown')

      this._area.addEventListener('mousedown', (e) => {
        if (this._area.classList.contains('is-disabled')) return
        if (e.target === this._area) { e.preventDefault(); this._input.focus() }
      })
      this._input.addEventListener('focus', () => { this._area.classList.add('is-focused'); this._openDropdown() })
      this._input.addEventListener('blur', () => {
        this._area.classList.remove('is-focused')
        if (this.mode === 'email') this._commitEmail()
        setTimeout(() => this._closeDropdown(), 150)
      })
      this._input.addEventListener('input', () => {
        if (this.mode === 'email') { if (/,\s*$/.test(this._input.value)) this._commitEmail() }
        else { this._activeIdx = -1; this._openDropdown() }
      })
      this._input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          if (this.mode === 'email') { this._commitEmail() }
          else { const l = this._availableOptions(); if (this._activeIdx >= 0 && l[this._activeIdx]) { this._add(l[this._activeIdx]); this._openDropdown() } }
        } else if (e.key === ',') {
          e.preventDefault()
          if (this.mode === 'email') { this._commitEmail() }
          else { const l = this._availableOptions(); const pick = (this._activeIdx >= 0 && l[this._activeIdx]) ? l[this._activeIdx] : l[0]; if (pick) { this._add(pick); this._openDropdown() } }
        }
        else if (e.key === 'Backspace' && !this._input.value && this._selected.length) { this._remove(this._selected[this._selected.length - 1].value) }
        else if (e.key === 'Escape') { this._closeDropdown() }
        else if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && this.mode === 'options') {
          e.preventDefault()
          const n = this._availableOptions().length; if (!n) return
          this._activeIdx = e.key === 'ArrowDown' ? (this._activeIdx + 1) % n : (this._activeIdx - 1 + n) % n
          this._renderDropdown()
        }
      })

      // Re-apply state after a (re)render.
      this._renderChips()
      if (this.hasAttribute('disabled')) this.setDisabled(true)
    }
  }
  customElements.define('tv-token-select', TvTokenSelect)
})()
