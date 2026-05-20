<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
      @click="onBackdropClick"
    >
      <div
        class="bg-surface-0 rounded-xl shadow-lg border border-surface-200 flex flex-col max-h-[90vh]"
        :class="sizeClass"
        @click.stop
      >
        <!-- Header: renders if title prop is set or header slot is provided -->
        <div
          v-if="title || $slots.header"
          class="flex items-center justify-between px-6 py-4 border-b border-surface-200"
        >
          <slot name="header">
            <span class="text-base font-medium text-surface-900">{{ title }}</span>
          </slot>
          <button
            type="button"
            class="w-8 h-8 flex items-center justify-center rounded-md hover:bg-surface-100 text-surface-500"
            @click="emit('close')"
          >
            <AppIcon icon="fa-solid fa-xmark" size="sm" />
          </button>
        </div>

        <!-- Body -->
        <div class="px-6 py-5 overflow-y-auto flex-1">
          <slot />
        </div>

        <!-- Footer: renders only when footer slot has content -->
        <div
          v-if="$slots.footer"
          class="flex items-center justify-end gap-2 px-6 py-4 border-t border-surface-200"
        >
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    required: false,
    default: undefined,
  },
  size: {
    type: String as PropType<'sm' | 'md' | 'lg'>,
    required: false,
    default: 'md',
  },
  closeOnBackdrop: {
    type: Boolean,
    required: false,
    default: true,
  },
  closeOnEsc: {
    type: Boolean,
    required: false,
    default: true,
  },
})

const emit = defineEmits<{ close: [] }>()

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm': return 'w-[400px]'
    case 'lg': return 'w-[640px]'
    default:   return 'w-[480px]'
  }
})

function onBackdropClick(event: MouseEvent) {
  if (event.target === event.currentTarget && props.closeOnBackdrop) {
    emit('close')
  }
}

function onEscKey(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.closeOnEsc && props.open) {
    emit('close')
  }
}

watch(
  () => props.open,
  (isOpen) => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
  },
)

onMounted(() => {
  document.addEventListener('keydown', onEscKey)
  // Apply lock immediately if open on mount
  if (props.open) {
    document.body.style.overflow = 'hidden'
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onEscKey)
  // Always restore scroll on unmount to prevent stuck lock
  document.body.style.overflow = ''
})
</script>
