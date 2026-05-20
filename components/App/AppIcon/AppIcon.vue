<!-- Color with `text-[color] -->
<template>
  <font-awesome-icon
    :icon="icon"
    :class="[iconSize, { 'text-white': isActive }]"
  />
</template>

<script setup lang="ts">
const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  size: {
    type: String as PropType<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'>,
    required: false,
    default: 'md',
  },
  isActive: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const iconSize = computed(() => {
  switch (props.size) {
    case 'xs':
      return 'text-2xs'
    case 'sm':
      return 'text-sm'
    case 'md':
      return 'text-md'
    case 'lg':
      return 'text-lg'
    case 'xl':
      return 'text-xl'
    case '2xl':
      return 'text-2xl'
    case '3xl':
      return 'text-3xl'
    default:
      return 'text-md'
  }
})
</script>
