<template>
  <ul class="flex flex-col gap-0">
    <li
      v-for="entry in entries"
      :key="entry.id"
      class="flex gap-3 py-2.5 border-t border-surface-200 first:border-t-0"
    >
      <!-- Timeline dot — default tone: primary-300; warn tone: warn-500 -->
      <span
        class="inline-block h-2 w-2 rounded-full mt-1.5 shrink-0"
        :class="dotClass(entry.tone)"
        aria-hidden="true"
      />

      <!-- Right column: text + meta row -->
      <div class="flex-1 min-w-0">
        <!--
          v-html is intentional here. The text field may contain trusted HTML
          markup (e.g. <strong> for actor names) originating from the data
          layer. Never bind user-generated or unescaped content directly.
        -->
        <p
          class="text-sm text-surface-800 leading-snug"
          v-html="entry.text"
        />

        <!-- Meta row: actor and/or timestamp -->
        <div
          v-if="entry.actor && entry.timestamp"
          class="text-xs text-surface-500 mt-0.5 flex items-center gap-1.5"
        >
          <span>{{ entry.actor }}</span>
          <span class="text-surface-300" aria-hidden="true">·</span>
          <span>{{ entry.timestamp }}</span>
        </div>
        <div
          v-else-if="entry.actor"
          class="text-xs text-surface-500 mt-0.5"
        >
          {{ entry.actor }}
        </div>
        <div
          v-else-if="entry.timestamp"
          class="text-xs text-surface-500 mt-0.5"
        >
          {{ entry.timestamp }}
        </div>
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
export interface AuditEntry {
  id: string
  text: string
  actor?: string
  timestamp: string
  tone?: 'default' | 'warn'
}

defineProps({
  entries: {
    type: Array as PropType<AuditEntry[]>,
    required: true,
  },
})

function dotClass(tone: AuditEntry['tone']): string {
  return tone === 'warn' ? 'bg-warn-500' : 'bg-primary-300'
}
</script>
