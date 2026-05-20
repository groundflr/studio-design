<template>
  <button
    class="relative text-surface-700 bg-white hover:bg-surface-50 focus:ring disabled:opacity-60 focus:ring-primary-500/30 duration-200 border border-surface-300 rounded-lg shadow-sm leading-[normal] flex items-center justify-center gap-2 select-none text-center w-fit whitespace-nowrap overflow-hidden"
    :class="{
      'h-6 text-xs px-2 py-[0.5rem]': size === 'xs',
      'h-9 text-xs min-w-20 px-4 py-[0.625rem]': size === 'sm',
      'h-10 text-sm min-w-20 px-4 py-[0.625rem]': size === 'md',
    }"
    :disabled="disabled"
    @click.stop.prevent.capture="(e) => loading || $emit('click', e)"
  >
    <AppIcon
      v-if="icon"
      :icon="icon"
    />
    <span
      v-if="label"
      class="font-medium"
      >{{ label }}</span
    >
    <AppIcon
      v-if="appendIcon"
      :icon="appendIcon"
    />
    <div
      v-if="loading"
      class="absolute inset-0 bg-white flex items-center justify-center"
    >
      <AppLoadingSpinner
        color="text-surface-500"
        class="size-2"
      />
    </div>
  </button>
</template>

<script setup lang="ts">
defineProps({
  label: {
    type: String,
    required: false,
    default: null,
  },
  icon: {
    type: String,
    required: false,
    default: null,
  },
  appendIcon: {
    type: String,
    required: false,
    default: null,
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
  loading: {
    type: Boolean,
    required: false,
    default: false,
  },
  size: {
    type: String as PropType<'xs' | 'sm' | 'md'>,
    required: false,
    default: 'md',
  },
})

defineEmits(['click'])
</script>
