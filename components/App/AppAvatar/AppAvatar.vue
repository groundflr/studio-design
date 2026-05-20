<template>
  <div
    class="rounded-full shrink-0 bg-surface-100 flex justify-center items-center overflow-hidden"
    :class="sizeClass"
  >
    <img
      v-if="url && url !== ''"
      :src="url"
      class="w-full h-full object-cover align-top"
    />
    <AppIcon
      v-else
      icon="fa-solid fa-user"
      class="text-surface-500 text-4xl"
      :class="iconSizeClass"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  url: {
    type: String,
    required: false,
    default: undefined,
  },
  size: {
    type: String as PropType<
      'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
    >,
    required: false,
    default: 'md',
  },
})

const sizeClass = computed(() => {
  switch (props.size) {
    case 'xs':
      return 'w-4 h-4'
    case 'sm':
      return 'w-6 h-6'
    case 'md':
      return 'w-8 h-8'
    case 'lg':
      return 'w-10 h-10'
    case 'xl':
      return 'w-12 h-12'
    case '2xl':
      return 'w-24 h-24'
    case '3xl':
      return 'w-24 h-24'
    case '4xl':
      return 'w-48 h-48'
    default:
      return 'w-10 h-10'
  }
})

const iconSizeClass = computed(() => {
  switch (props.size) {
    case 'xs':
      return 'text-2xs'
    case 'sm':
      return 'text-2xs'
    case 'md':
      return 'text-base'
    case 'lg':
      return 'text-lg'
    case 'xl':
      return 'text-xl'
    case '2xl':
      return 'text-2xl'
    case '3xl':
      return 'text-4xl'
    case '4xl':
      return 'text-6xl'
    default:
      return 'text-lg'
  }
})
</script>
