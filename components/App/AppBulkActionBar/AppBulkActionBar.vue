<template>
  <Transition
    enter-active-class="transition duration-150 ease-out"
    enter-from-class="opacity-0 translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition duration-100 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-2"
  >
    <div
      v-if="count > 0"
      class="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 bg-surface-900 text-surface-0 rounded-xl shadow-lg px-4 py-2.5 max-w-[90vw]"
    >
      <!-- Count label -->
      <span class="text-sm font-medium text-surface-0">
        {{ count }} {{ pluralisedNoun }} selected
      </span>

      <!-- Divider: label → actions -->
      <div class="h-5 w-px bg-surface-700" aria-hidden="true" />

      <!-- Action buttons slot -->
      <div class="flex items-center gap-1">
        <slot />
      </div>

      <!-- Divider: actions → Clear -->
      <div class="h-5 w-px bg-surface-700" aria-hidden="true" />

      <!-- Clear button -->
      <button
        type="button"
        class="text-surface-300 hover:text-surface-0 text-sm font-medium px-2 py-1 rounded"
        @click="emit('clear')"
      >
        Clear
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const props = defineProps({
  count: {
    type: Number,
    required: true,
  },
  noun: {
    type: String,
    default: 'item',
  },
})

const emit = defineEmits<{
  (e: 'clear'): void
}>()

const pluralisedNoun = computed<string>(() =>
  props.count === 1 ? props.noun : props.noun + 's',
)
</script>
