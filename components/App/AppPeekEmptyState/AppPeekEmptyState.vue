<template>
  <div class="rounded-xl border border-surface-200 bg-surface-0 shadow-sm p-5 flex flex-col items-center text-center gap-3">
    <!-- Icon block -->
    <div class="w-11 h-11 inline-flex items-center justify-center bg-primary-50 text-primary-600 rounded-lg mb-1">
      <AppIcon :icon="iconClass" size="lg" />
    </div>

    <!-- Title -->
    <h3 class="text-base font-medium text-surface-900 m-0">{{ title }}</h3>

    <!-- Subtitle -->
    <p v-if="subtitle" class="text-sm text-surface-600 leading-relaxed m-0">
      {{ subtitle }}
    </p>

    <!-- Keyboard tips -->
    <ul
      v-if="tips.length > 0"
      class="w-full pt-3 mt-0 border-t border-surface-200 flex flex-col gap-2 text-left list-none p-0"
    >
      <li
        v-for="tip in tips"
        :key="tip.keys"
        class="flex items-center gap-2.5 text-xs text-surface-600"
      >
        <kbd
          class="font-mono text-[10.5px] px-1.5 py-0.5 bg-surface-100 border border-surface-200 rounded text-surface-600"
        >
          {{ tip.keys }}
        </kbd>
        <span>{{ tip.label }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
interface KeyboardTip {
  keys: string
  label: string
}

defineProps({
  title: {
    type: String,
    required: false,
    default: 'Peek at a user',
  },
  subtitle: {
    type: String,
    required: false,
    default:
      'Click any row to inspect them here — see workspaces, roles, last activity, and act without leaving the list.',
  },
  iconClass: {
    type: String,
    required: false,
    default: 'fa-solid fa-users',
  },
  tips: {
    type: Array as PropType<KeyboardTip[]>,
    required: false,
    default: (): KeyboardTip[] => [
      { keys: '⌘ click', label: 'Open the full profile in a new tab' },
      { keys: '⇧ click', label: 'Range-select for bulk actions' },
    ],
  },
})
</script>
