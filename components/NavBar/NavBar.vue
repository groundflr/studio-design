<template>
  <nav
    ref="navRef"
    class="w-64 h-screen fixed top-0 flex flex-col gap-4 px-4 py-3 select-none z-50 left-4 rounded-r-xl bg-surface-100 duration-300 ease-in-out"
    :class="{
      'shadow-[0_10px_30px_-5px_rgba(0,0,0,0.2),0_20px_40px_-10px_rgba(0,0,0,0.15)]':
        layoutStore.currentLayout === 'float',
      '-translate-x-full hover:-translate-x-4':
        !forceNavOpen && layoutStore.currentLayout === 'float',
      '-translate-x-4': forceNavOpen && layoutStore.currentLayout === 'float',
      '-translate-x-4 shadow-none': layoutStore.currentLayout === 'default',
    }"
  >
    <!-- WORKSPACE MENU -->
    <div class="w-full flex flex-col gap-3">
      <!-- LOGO AND LAYOUT TOGGLE -->
      <div class="h-9 px-1 flex items-center justify-between">
        <div
          class="bg-contain bg-no-repeat h-full cursor-pointer flex-grow"
          style="background-image: url('/logo/studio_full_light.png')"
          @click="router.push({ name: 'index' })"
        />
        <LayoutToggle class="ml-2" />
      </div>
      <slot name="top" />
    </div>

    <ul class="flex flex-col gap-6 w-full">
      <slot name="nav-items" />
    </ul>

    <!-- handle -->
    <div
      class="w-1 h-12 rounded-full absolute top-1/2 -translate-y-1/2 right-1 -translate-x-1/2 duration-300"
      :class="{
        'bg-primary-700/30': layoutStore.currentLayout === 'float',
        'bg-transparent': layoutStore.currentLayout === 'default',
      }"
    ></div>
  </nav>
</template>

<script setup lang="ts">
import { useLayoutPreferencesStore } from '~/stores/layoutPreferences'

const layoutStore = useLayoutPreferencesStore()
const router = useRouter()

const forceNavOpen = ref(false)

provide('forceNavOpen', forceNavOpen)
</script>
