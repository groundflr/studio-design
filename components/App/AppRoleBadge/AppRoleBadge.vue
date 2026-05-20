<template>
  <AppTag :color="undefined" :class="tierClasses">{{ label }}</AppTag>
</template>

<script setup lang="ts">
type RoleOption =
  | 'org-owner'
  | 'org-admin'
  | 'workspace-admin'
  | 'standard'
  | 'moderator'
  | 'viewer'

const props = defineProps({
  role: {
    type: String as PropType<RoleOption>,
    required: true,
  },
})

const labelMap: Record<RoleOption, string> = {
  'org-owner': 'Org Owner',
  'org-admin': 'Org Admin',
  'workspace-admin': 'Workspace Admin',
  standard: 'Standard User',
  moderator: 'Moderator',
  viewer: 'Viewer',
}

const adminTierRoles: RoleOption[] = ['org-owner', 'org-admin', 'workspace-admin']

const label = computed<string>(() => labelMap[props.role])

const tierClasses = computed<string>(() =>
  adminTierRoles.includes(props.role)
    ? 'bg-primary-50 text-primary-700'
    : 'bg-surface-100 text-surface-600',
)
</script>
