<!-- Provide icon (string) and size? ('sm' | 'md' | 'lg' | 'xl') (default 'md') -->
<template>
  <button
    class="bg-transparent hover:bg-surface-800/5 disabled:hover:bg-transparent text-surface-800 disabled:text-surface-500 duration-100 rounded-full flex justify-center items-center shrink-0"
    :class="buttonSizeClasses[size]"
    @click.stop
  >
    <font-awesome-icon
      :icon="icon"
      :class="iconSizeClass[size]"
    />
  </button>
</template>

<script setup lang="ts">
defineProps({
  icon: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: false,
    default: 'md',
  },
})

const buttonSizeClasses: Record<string, string> = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-10 h-10',
}

const iconSizeClass: Record<string, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
}
</script>
