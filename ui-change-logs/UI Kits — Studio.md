# UI Kits Studio — UI Change Log

One-line log of UI changes to the Studio UI kit prototype at `ui_kits/studio/index.html`. Newest at the bottom.

---

- 2026-05-18 — Added click-to-toggle collapsible sidebar to the Studio UI kit: `collapsed` + `setSidebarCollapsed` state lifted into `Dashboard`, persisted to `localStorage` under key `traverse.sidebarCollapsed.studio`; `Sidebar` and `NavItem` components accept `collapsed` prop; collapsed width is 64px (via inline style transition `150ms cubic-bezier`); in collapsed mode the workspace name, nav labels, badge chips, and hover arrow-right affordance are hidden, only the initials block and icon column remain visible; collapse toggle button (panel-left-close / panel-left-open icon) added to sidebar header with `aria-label` and `aria-pressed`; `title` attribute added to each `NavItem` for tooltip-as-label in collapsed state.
