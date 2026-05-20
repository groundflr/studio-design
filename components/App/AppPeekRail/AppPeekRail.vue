<template>
  <aside class="shrink-0" :style="{ width }">
    <slot />
  </aside>
</template>

<script setup lang="ts">
defineProps({
  width: {
    type: String,
    required: false,
    default: '325px',
  },
})
</script>
