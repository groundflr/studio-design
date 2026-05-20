<template>
  <li class="w-full">
    <div
      v-if="loading"
      class="w-full h-9 rounded-md animate-pulse bg-surface-300"
    ></div>

    <component
      :is="toName ? NuxtLink : 'div'"
      v-if="!loading"
      :to="{ name: toName }"
      class="grid grid-cols-[2rem_auto_2rem] items-center gap-3 pl-[2px] py-[2px] rounded-[8px] group border duration-300"
      :class="{
        'cursor-pointer': true,
        'hover:bg-primary-100 text-primary-600': !isActive,
        'text-surface-700 font-medium border-transparent': !isActive,
        'bg-primary-400 text-white font-medium border-primary-400 border-1':
          isActive,
      }"
      @click="handleClick"
    >
      <div class="w-full flex justify-center">
        <AppIconSquare
          :icon="icon"
          :is-active="isActive"
          class="text-base px-2"
          :class="{
            'text-surface-500': !isActive,
            'group-hover:text-surface-700 duration-300': !isActive && !!toName,
          }"
        />
      </div>
      <span class="text-sm truncate">{{ label }}</span>
      <button
        v-if="isSection"
        class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-1 w-6 h-6 rounded-lg flex items-center justify-center bg-primary-200"
      >
        <AppIcon
          icon="fa-regular fa-arrow-right"
          size="xs"
          class="text-primary-700"
        />
      </button>
    </component>
  </li>
</template>

<script setup lang="ts">
const NuxtLink = resolveComponent('NuxtLink')
const route = useRoute()

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  toName: {
    type: String,
    required: false,
    default: undefined,
  },
  loading: {
    type: Boolean,
    required: false,
    default: false,
  },
  isSection: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const emit = defineEmits(['click'])

const isActive = computed(() => {
  if (!props.toName) return false
  if (!route.name) return false
  return route.name.toString() === props.toName
})

const handleClick = () => {
  emit('click')
}
</script>
