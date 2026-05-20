<template>
  <button
    :disabled="disabled || loading"
    :class="[
      // general
      'shadow-sm rounded-lg duration-200 overflow-hidden select-none',
      // text
      'font-medium text-white leading-none text-sm',
      // border and bg
      'border border-primary-500 bg-primary-600 hover:border-primary-700 hover:bg-primary-700 disabled:hover:border-primary-500 disabled:hover:bg-primary-600',
      { 'opacity-60': disabled && !loading },
      // sizing
      'h-[39px]',
      { 'min-w-24 w-fit': label, 'size-[39px]': !label && icon },
      // spacing
      'gap-2 px-3 py-[0.625rem]',
      { 'pr-2': hotKeyHint },
      //positioning
      'relative flex items-center justify-center',
      // focus
      'focus:outline-none focus:ring focus:ring-primary-400/50',
    ]"
  >
    <!-- ICON -->
    <AppIcon
      v-if="icon"
      :icon="icon"
      fixed-width
    />

    <!-- LABEL -->
    <span v-if="label">{{ label }}</span>

    <!-- HOT KEY HINT -->
    <span
      v-if="hotKeyHint"
      class="text-4xs border border-white/40 bg-white/15 text-white/90 px-1 py-0.5 rounded-[4px] flex items-center justify-center font-medium"
    >
      {{ hotKeyHint }}
    </span>

    <!-- LOADING -->
    <div
      v-if="loading"
      class="absolute inset-0 flex items-center justify-center bg-primary-600"
    >
      <AppLoadingSpinner color="text-white" />
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
  hotKeyHint: {
    type: String,
    required: false,
    default: null,
  },
})
</script>
