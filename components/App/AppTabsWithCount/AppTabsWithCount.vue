<template>
  <div class="flex items-center gap-6 border-b border-surface-200">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      class="flex items-center gap-1.5 h-10 pb-px text-sm font-medium border-b-2 -mb-px transition-colors"
      :class="
        modelValue === option.value
          ? 'border-primary-600 text-primary-700'
          : 'border-transparent text-surface-500 hover:text-surface-700'
      "
      @click="emit('update:modelValue', option.value)"
    >
      {{ option.label }}
      <span
        v-if="option.count !== undefined"
        class="inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium leading-none"
        :class="
          modelValue === option.value
            ? 'bg-primary-50 text-primary-700'
            : 'bg-surface-100 text-surface-500'
        "
      >
        {{ option.count }}
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
interface TabOption {
  label: string
  value: string
  count?: number
}

defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  options: {
    type: Array as PropType<TabOption[]>,
    required: true,
  },
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>
