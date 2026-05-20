<template>
  <div class="rounded-xl border border-surface-200 bg-white flex flex-col overflow-hidden">

    <!-- Header row: close button -->
    <div class="flex items-center justify-end px-4 pt-3 pb-1">
      <button
        type="button"
        class="inline-flex items-center justify-center h-6 w-6 rounded text-surface-400 hover:text-surface-700 hover:bg-surface-100 transition-colors"
        aria-label="Close preview"
        @click="emit('close')"
      >
        <AppIcon icon="fa-solid fa-xmark" size="xs" />
      </button>
    </div>

    <!-- Identity head -->
    <div class="flex flex-col items-center gap-2 px-5 pb-4">
      <!-- Avatar with initials fallback (AppAvatar does not support initials) -->
      <div
        class="h-14 w-14 rounded-full shrink-0 overflow-hidden bg-surface-100 flex items-center justify-center"
        aria-hidden="true"
      >
        <img
          v-if="user.avatarUrl"
          :src="user.avatarUrl"
          :alt="user.name"
          class="h-full w-full object-cover"
        />
        <span
          v-else
          class="text-base font-semibold text-surface-500 select-none leading-none"
        >
          {{ initials }}
        </span>
      </div>

      <!-- Name + org-role badge + status dot -->
      <div class="flex flex-col items-center gap-1 text-center">
        <div class="flex items-center gap-1.5 flex-wrap justify-center">
          <span class="text-sm font-semibold text-surface-900">{{ user.name }}</span>
          <AppRoleBadge v-if="user.orgRole" :role="user.orgRole" />
        </div>
        <div class="flex items-center gap-1.5">
          <AppStatusDot :status="user.status" />
          <span class="text-xs text-surface-500">{{ user.email }}</span>
        </div>
      </div>
    </div>

    <!-- Meta dl -->
    <div
      v-if="user.meta && user.meta.length > 0"
      class="border-t border-surface-200 px-5 py-3"
    >
      <dl class="flex flex-col gap-0">
        <div
          v-for="row in user.meta"
          :key="row.label"
          class="flex justify-between items-baseline py-2 border-t border-surface-100 first:border-t-0"
        >
          <dt class="text-[11px] uppercase tracking-[0.04em] text-surface-400 shrink-0 pr-3">
            {{ row.label }}
          </dt>
          <dd class="text-xs text-surface-700 text-right truncate">
            {{ row.value || '—' }}
          </dd>
        </div>
      </dl>
    </div>

    <!-- Workspace memberships -->
    <div
      v-if="user.workspaces && user.workspaces.length > 0"
      class="border-t border-surface-200 px-5 py-3"
    >
      <p class="text-[11px] uppercase tracking-[0.04em] text-surface-400 mb-2">
        Workspaces
      </p>
      <ul class="flex flex-col gap-1.5">
        <li
          v-for="ws in user.workspaces"
          :key="ws.workspaceId"
          class="flex items-center gap-2"
        >
          <AppRoleBadge :role="ws.role" />
          <span class="text-xs text-surface-600 truncate">{{ ws.workspaceName }}</span>
        </li>
      </ul>
    </div>

    <!-- Quick actions -->
    <div class="border-t border-surface-200 px-3 py-2 flex flex-col gap-px">
      <p class="text-[10px] font-medium tracking-[0.07em] uppercase text-surface-500 px-3 pt-1 pb-1">
        Quick actions
      </p>
      <button
        type="button"
        class="w-full text-left px-3 py-2 rounded text-sm text-surface-700 hover:bg-surface-100 transition-colors inline-flex items-center gap-2.5"
        @click="emit('action', { action: 'open-profile' })"
      >
        <AppIcon icon="fa-solid fa-arrow-up-right-from-square" size="xs" class="text-surface-500" />
        Open full profile
      </button>
      <button
        type="button"
        class="w-full text-left px-3 py-2 rounded text-sm text-surface-700 hover:bg-surface-100 transition-colors inline-flex items-center gap-2.5"
        @click="emit('action', { action: 'edit-profile' })"
      >
        <AppIcon icon="fa-solid fa-pen-to-square" size="xs" class="text-surface-500" />
        Edit profile
      </button>
      <button
        type="button"
        class="w-full text-left px-3 py-2 rounded text-sm text-surface-700 hover:bg-surface-100 transition-colors inline-flex items-center gap-2.5"
        @click="emit('action', { action: 'add-to-workspace' })"
      >
        <AppIcon icon="fa-solid fa-plus" size="xs" class="text-surface-500" />
        Add to workspace
      </button>
      <button
        type="button"
        class="w-full text-left px-3 py-2 rounded text-sm text-surface-700 hover:bg-surface-100 transition-colors inline-flex items-center gap-2.5"
        @click="emit('action', { action: 'change-role' })"
      >
        <AppIcon icon="fa-solid fa-rotate" size="xs" class="text-surface-500" />
        Change role
      </button>
      <div class="h-px bg-surface-200 my-1 mx-1" />
      <button
        type="button"
        class="w-full text-left px-3 py-2 rounded text-sm text-error-600 hover:bg-error-100 transition-colors inline-flex items-center gap-2.5"
        @click="emit('action', { action: 'deactivate' })"
      >
        <AppIcon icon="fa-solid fa-power-off" size="xs" class="text-error-600" />
        Deactivate account
      </button>
    </div>

  </div>
</template>

<script setup lang="ts">
// RoleOption mirrors the union in AppRoleBadge.vue. Kept inline because
// importing a local type from a Vue SFC is not reliable across toolchains.
type RoleOption =
  | 'org-owner'
  | 'org-admin'
  | 'workspace-admin'
  | 'standard'
  | 'moderator'
  | 'viewer'

export interface WorkspaceMembership {
  workspaceId: string
  workspaceName: string
  role: RoleOption
}

export interface MetaRow {
  label: string
  value?: string
}

export interface PeekUser {
  id: string
  name: string
  email: string
  avatarUrl?: string
  /** Org-level role — renders a badge in the identity head if non-null. */
  orgRole?: RoleOption
  status: 'active' | 'pending' | 'expired' | 'cancelled' | 'deactivated' | 'removed'
  /** Optional key-value rows rendered as a <dl> beneath the identity head. */
  meta?: MetaRow[]
  /** All workspace memberships for this user. */
  workspaces?: WorkspaceMembership[]
}

const props = defineProps({
  user: {
    type: Object as PropType<PeekUser>,
    required: true,
  },
})

const emit = defineEmits<{
  close: []
  action: [v: { action: string }]
}>()

/** Two-letter initials derived from the user's display name. */
const initials = computed<string>(() => {
  const parts = props.user.name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
})
</script>
