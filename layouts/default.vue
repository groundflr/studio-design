<template>
  <div class="h-screen bg-surface-100">
    <NavBarWorkspace />
    <main
      class="h-full duration-500"
      :class="{ 'pl-64': layoutStore.currentLayout === 'default' }"
    >
      <div
        class="h-full duration-500"
        :class="{ 'p-3 pl-0': layoutStore.currentLayout === 'default' }"
      >
        <div
          id="main-content-window"
          class="h-full border bg-white overflow-auto studio-scrollbar duration-500"
          :class="{
            'rounded-xl border-surface-200':
              layoutStore.currentLayout === 'default',
            'border-0 border-transparent pl-4':
              layoutStore.currentLayout === 'float',
          }"
        >
          <slot />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useLayoutPreferencesStore } from '~/stores/layoutPreferences'

const layoutStore = useLayoutPreferencesStore()
</script>
