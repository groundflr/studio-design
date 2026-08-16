/* ============================================================
   <tv-scroll-area>  —  Traverse component library
   A height-capped scrolling region with a persistent, tokenised
   scrollbar.

   Why it exists: macOS and iOS use overlay scrollbars that fade
   out when idle, so a scrollable panel looks like a truncated
   one — there is no standing cue that more content exists. This
   draws its own bar from design tokens so the affordance is
   always on screen, and so every scrolling surface in Traverse
   scrolls with the same visual language instead of whatever the
   OS supplies.

   Wrap any overflowing content. Slotted children keep the styles
   of the tree they were written in, so a panel can drop this
   around its own rows without restyling them.

   Usage:
     <tv-scroll-area max-height="308px">
       <div class="row">…</div>
       <div class="row">…</div>
     </tv-scroll-area>

     <!-- reserve the track even when content fits -->
     <tv-scroll-area max-height="240px" always>…</tv-scroll-area>

   Attributes:
     max-height  height cap before scrolling begins (default "320px").
     always      boolean — keep the track visible even when the content
                 doesn't overflow (overflow-y: scroll rather than auto).
                 Use when the height is fixed and you want no reflow as
                 content grows past the cap.
     gutter      space between the content and the bar (default "10px").

   Notes:
     · overscroll-behavior is contained, so scrolling to the end of the
       area doesn't start scrolling the page behind it.
     · The bar is 8px and always drawn — styling ::-webkit-scrollbar
       opts out of overlay scrollbars, which is the point.

   Tokens: --surface-100 (track), --surface-300 / --surface-400 (thumb),
     --radius-full, --tv-font.
   ============================================================ */
(() => {
  if (customElements.get('tv-scroll-area')) return

  const esc = (s) => String(s == null ? '' : s).replace(/"/g, '&quot;')

  class TvScrollArea extends HTMLElement {
    static get observedAttributes() { return ['max-height', 'always', 'gutter'] }
    constructor() {
      super()
      this.attachShadow({ mode: 'open' })
    }
    connectedCallback() { this.render() }
    attributeChangedCallback() { if (this.shadowRoot) this.render() }

    /** Scroll the area back to the top — useful after refiltering its content. */
    scrollToTop() {
      const box = this.shadowRoot && this.shadowRoot.querySelector('.box')
      if (box) box.scrollTop = 0
    }

    render() {
      const maxH = this.getAttribute('max-height') || '320px'
      const gutter = this.getAttribute('gutter') || '10px'
      const always = this.hasAttribute('always')

      this.shadowRoot.innerHTML = `
        <style>
          :host{ display:block; font-family:var(--tv-font,'Geist','Inter',system-ui,sans-serif); }
          :host([hidden]){ display:none; }
          .box{
            max-height:${esc(maxH)};
            overflow-y:${always ? 'scroll' : 'auto'};
            overflow-x:hidden;
            /* Keep the bar off the content without shifting it left. */
            padding-right:${esc(gutter)};
            overscroll-behavior:contain;
          }
          /* Styling the webkit scrollbar opts out of the OS overlay bar, which
             is what makes it persistent rather than fading when idle.
             NOTE: Chrome ignores these pseudo-elements entirely if
             scrollbar-width / scrollbar-color are also set on the element, so
             the standard properties are scoped to engines without the
             pseudo-element (Firefox) in the @supports block below. */
          .box::-webkit-scrollbar{ width:8px; }
          .box::-webkit-scrollbar-track{
            background:var(--surface-100,#f1f5f9);
            border-radius:var(--radius-full,9999px);
          }
          .box::-webkit-scrollbar-thumb{
            background:var(--surface-300,#cbd5e1);
            border-radius:var(--radius-full,9999px);
          }
          .box::-webkit-scrollbar-thumb:hover{ background:var(--surface-400,#94a3b8); }
          /* Firefox: no ::-webkit-scrollbar, so use the standard properties. */
          @supports not selector(::-webkit-scrollbar){
            .box{
              scrollbar-width:thin;
              scrollbar-color:var(--surface-300,#cbd5e1) var(--surface-100,#f1f5f9);
            }
          }
        </style>
        <div class="box" part="box"><slot></slot></div>
      `
    }
  }
  customElements.define('tv-scroll-area', TvScrollArea)
})()
