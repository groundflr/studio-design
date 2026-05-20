---
name: project-atoms-build
description: Atoms-only first-pass build for Users and Permissions feature — tracks resolved decisions and atom queue state
metadata:
  type: project
---

An atoms-only build pass is in progress for the Users and Permissions feature (`uiux-tasks/Users and Permissions.md`). The task doc specifies 8 preview-card atoms. Build order: role-badges → status-dot → tabs-with-count → modal → filter-popover → bulk-action-bar → audit-list → peek-rail.

**Resolved conflict (2026-05-14):** Role badge colour spec conflict between Problem 8 (6-colour warm-desaturated palette) and Problem 2 (2-tier neutral). User chose 2-tier neutral. Problem 8's Component dependencies bullet updated to reflect this. No new tokens needed.

**Atom 1 complete:** `preview/role-badges.html` — two rows of badges (admin tier: primary-50/primary-700; non-admin tier: surface-100/surface-600) + inline-context demo rows.

**Atom 2 complete:** `components/App/AppStatusDot/AppStatusDot.vue` — dot + label, 6 status variants, `dotClassMap`/`textClassMap` lookups, optional `label` override prop. Uses existing `--success-*`, `--warn-*`, `--error-*`, `--surface-*` tokens. No new tokens.

**Atom 3 complete:** `components/App/AppTabsWithCount/AppTabsWithCount.vue` — v-model tab strip. Props: `modelValue: string`, `options: Array<{ label, value, count? }>`. Emits `update:modelValue`. Active tab: `border-primary-600 text-primary-700 border-b-2`; count chip: `bg-primary-50 text-primary-700` active / `bg-surface-100 text-surface-500` inactive. No new tokens.

**Atom 4 complete:** `components/App/AppModal/AppModal.vue` — portal modal via `<Teleport to="body">`. Props: `open` (required bool), `title?` (string), `size?` (sm/md/lg, default md → 400/480/640px), `closeOnBackdrop?` (default true), `closeOnEsc?` (default true). Emits: `close`. Slots: default body, `footer` (renders wrapper+divider only if slot used), `header` (overrides title span; close × always present alongside). Body scroll lock via `watch(open)` + `onMounted`/`onBeforeUnmount` cleanup. No new tokens.

**Atom 5 complete:** `components/App/AppFilterPopover/AppFilterPopover.vue` — `relative inline-block` wrapper with `ref` for click-outside. Props: `triggerLabel?` (default 'Filter'), `activeCount?` (default 0), `align?` ('left'|'right', default 'right'). Emits: `clear`. Slot: default (filter rows). Trigger uses computed `triggerClass`: active-count > 0 → primary-300 border + ring-2 ring-primary-100 + primary-700 text; open (no count) → primary-300 border only; default → surface-200 border hover:surface-300. Active-count chip: bg-primary-600/white, 10px, rounded-full. Popover: w-60, shadow-md, mt-1.5, z-40, right-0 or left-0 per align. Footer Clear button: disabled when activeCount === 0. ESC + mousedown click-outside: registered via `watch(isOpen)`, removed on close and `onBeforeUnmount`. No new tokens.

**Atom 6 complete:** `components/App/AppBulkActionBar/AppBulkActionBar.vue` — sticky-bottom dark bulk-action bar. Props: `count: Number` (required), `noun?: String` (default 'item'). Emits: `clear`. Slot: default (consumer action buttons). Container: `fixed bottom-6 left-1/2 -translate-x-1/2 z-30`, `bg-surface-900`, `rounded-xl`, `max-w-[90vw]`. Two `h-5 w-px bg-surface-700` dividers (after label, before Clear). Pluralisation: `count === 1 ? noun : noun + 's'` via computed. Transition: class-based slide-up + fade (`opacity-0 translate-y-2` → `opacity-100 translate-y-0`), 150ms enter / 100ms leave. Transition composes correctly with `-translate-x-1/2` because Tailwind's transform utilities all set `--tw-translate-*` CSS vars on the same `transform` property — the static `-translate-x-1/2` and the transitioning `translate-y-*` coexist without conflict. No new tokens.

**Atom 7 complete:** `components/App/AppAuditList/AppAuditList.vue` — vertical audit timeline. Props: `entries: Array<AuditEntry>` (required). No emits, no slots. Root: `<ul class="flex flex-col gap-0">`. Each `<li>`: `flex gap-3 py-2.5 border-t border-surface-200 first:border-t-0`. Dot: `h-2 w-2 rounded-full mt-1.5 shrink-0` — `bg-primary-300` (default) / `bg-warn-500` (warn). Right column: text via `v-html` (commented as trusted data-layer only), meta row uses `v-if`/`v-else-if` for actor+timestamp, actor-only, or timestamp-only variants. `AuditEntry` interface exported from `<script setup>` for consumer typing. `dotClass()` helper function (not computed) takes `tone` param directly. No new tokens.

**Atom 8 complete (final atom — 2026-05-14):** Three peek-rail components written.
- `components/App/AppPeekRail/AppPeekRail.vue` — `<aside class="shrink-0" :style="{ width }"><slot /></aside>`. Props: `width: string` (default `'325px'`). No emits, no slots beyond default.
- `components/App/AppPeekEmptyState/AppPeekEmptyState.vue` — card with `title`, optional `subtitle`, conditional `tips` list (default: ⌘-click + ⇧-click entries). Tips section `v-if="tips.length > 0"`. `KeyboardTip` interface inline.
- `components/App/AppPeekDetail/AppPeekDetail.vue` — full detail panel. Exports `PeekUser`, `WorkspaceMembership`, `MetaRow` interfaces. `RoleOption` type is inline (not imported from AppRoleBadge SFC — SFC local types unreliable across toolchains). Initials via `computed` splitting on whitespace. `orgRole` badge conditional (`v-if="user.orgRole"`). `meta` section conditional (`v-if="user.meta && user.meta.length > 0"`). `workspaces` section conditional (`v-if="user.workspaces && user.workspaces.length > 0"`). Danger row: `hover:bg-error-100` (substitutes spec's `error-50` which is absent). Five action emits: `open-profile`, `edit-profile`, `add-to-workspace`, `change-role`, `deactivate`. Emits typed: `close: []` and `action: [v: { action: string }]`. No new tokens.

**Build pass complete.** All 8 atoms done. Problem 2 Role Chip (Sections A–D) now implemented in `prototypes/dashboard/index.html` — see below.

**Problem 2 Role Chip (2026-05-18):** `.tb-role-chip` (distinct from existing `.role-chip`) injected into 8 screen headers via `.tb-chip-slot` spans. Single `#tb-role-popover` anchored via JS. PERSONA_DATA map covers 6 personas (u1–u6 from ORG_USERS). Devbar has Persona (6) + Workspace (4) button groups. "Learn more" link is `href="#"` — blocked on Problem 1 capability summary surface. Existing `.role-chip` variants (profile page, other users) left untouched.

**Why:** Keeps role-is-identity-not-status principle intact, no new tokens, consistent across role chips and role badges everywhere.

**How to apply:** All future role badge/chip implementations in this project use the 2-tier neutral convention, never the 6-colour per-role palette.

Related: [[project-ui-change-log-convention]]
