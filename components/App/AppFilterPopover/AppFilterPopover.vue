<template>
  <div ref="wrapperRef" class="relative inline-block">
    <!-- Trigger button -->
    <button
      type="button"
      class="bg-surface-0 border text-sm font-medium h-8 px-3 rounded-md flex items-center gap-1.5"
      :class="triggerClass"
      @click="toggleOpen"
    >
      <AppIcon icon="fa-solid fa-filter" size="xs" />
      {{ triggerLabel }}
      <span
        v-if="activeCount > 0"
        class="bg-primary-600 text-white text-[10px] font-semibold rounded-full px-1.5 min-w-[16px] h-4 inline-flex items-center justify-center"
      >{{ activeCount }}</span>
    </button>

    <!-- Popover -->
    <div
      v-if="isOpen"
      class="absolute w-60 bg-surface-0 border border-surface-200 rounded-lg shadow-md p-3 flex flex-col gap-3 mt-1.5 z-40"
      :class="alignClass"
    >
      <!-- Filter rows via default slot -->
      <slot />

      <!-- Footer -->
      <div class="flex justify-end pt-2 border-t border-surface-200 mt-1">
        <button
          type="button"
          class="text-primary-700 hover:bg-primary-50 disabled:text-surface-400 text-xs font-medium px-2 py-1 rounded"
          :disabled="activeCount === 0"
          @click="onClear"
        >
          Clear filters
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  triggerLabel: {
    type: String,
    required: false,
    default: 'Filter',
  },
  activeCount: {
    type: Number,
    required: false,
    default: 0,
  },
  align: {
    type: String as PropType<'left' | 'right'>,
    required: false,
    default: 'right',
  },
})

const emit = defineEmits<{ clear: [] }>()

const isOpen = ref<boolean>(false)
const wrapperRef = ref<HTMLElement | null>(null)

const triggerClass = computed(() => {
  if (props.activeCount > 0) {
    return 'border-primary-300 text-primary-700 ring-2 ring-primary-100'
  }
  if (isOpen.value) {
    return 'border-primary-300 text-surface-600'
  }
  return 'border-surface-200 text-surface-600 hover:border-surface-300'
})

const alignClass = computed(() => {
  return props.align === 'left' ? 'left-0' : 'right-0'
})

function toggleOpen() {
  isOpen.value = !isOpen.value
}

function close() {
  isOpen.value = false
}

function onClear() {
  emit('clear')
}

function onMousedown(event: MouseEvent) {
  if (wrapperRef.value && !wrapperRef.value.contains(event.target as Node)) {
    close()
  }
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    close()
  }
}

watch(isOpen, (open) => {
  if (open) {
    document.addEventListener('mousedown', onMousedown)
    document.addEventListener('keydown', onKeydown)
  } else {
    document.removeEventListener('mousedown', onMousedown)
    document.removeEventListener('keydown', onKeydown)
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onMousedown)
  document.removeEventListener('keydown', onKeydown)
})
</script>
