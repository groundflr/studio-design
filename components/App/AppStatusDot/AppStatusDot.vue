<template>
  <span class="inline-flex items-center gap-1.5">
    <span class="inline-block h-[7px] w-[7px] rounded-full shrink-0" :class="dotClassMap[status]" />
    <span class="text-xs font-medium" :class="textClassMap[status]">
      {{ label ?? labelMap[status] }}
    </span>
  </span>
</template>

<script setup lang="ts">
type StatusOption =
  | 'active'
  | 'pending'
  | 'expired'
  | 'cancelled'
  | 'deactivated'
  | 'removed'

const props = defineProps({
  status: {
    type: String as PropType<StatusOption>,
    required: true,
  },
  label: {
    type: String,
    required: false,
    default: undefined,
  },
})

const labelMap: Record<StatusOption, string> = {
  active: 'Active',
  pending: 'Pending',
  expired: 'Expired',
  cancelled: 'Cancelled',
  deactivated: 'Deactivated',
  removed: 'Removed',
}

const dotClassMap: Record<StatusOption, string> = {
  active: 'bg-success-500',
  pending: 'bg-warn-500',
  expired: 'bg-error-500',
  cancelled: 'bg-surface-400',
  deactivated: 'bg-surface-400',
  removed: 'bg-surface-300',
}

const textClassMap: Record<StatusOption, string> = {
  active: 'text-success-600',
  pending: 'text-warn-600',
  expired: 'text-error-600',
  cancelled: 'text-surface-600',
  deactivated: 'text-surface-600',
  removed: 'text-surface-500',
}
</script>
