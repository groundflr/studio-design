<template>
  <div class="h-screen w-screen dotted-background">
    <template v-if="authStore.$isInitialising">
      <AppLoadingFullScreen />
    </template>
    <template v-else-if="authStore.isAuthenticated">
      <div
        class="fixed top-0 left-0 right-0 px-4 py-3 flex justify-between items-center"
      >
        <!-- LOGO -->
        <div class="h-12 w-40">
          <div
            class="bg-contain bg-no-repeat h-full w-full"
            style="background-image: url('/logo/studio_full_light.png')"
          />
        </div>

        <!-- BUTTONS -->
        <div class="flex justify-end items-center gap-1">
          <AppButtonIcon
            v-if="userStore.isSuperUser"
            v-tooltip="'System Admin'"
            size="xl"
            icon="fa-regular fa-gear-complex-code"
            @click="handleClickSystemAdmin"
          />
          <AppButtonIcon
            v-tooltip="'Sign Out'"
            size="xl"
            icon="fa-regular fa-arrow-right-from-bracket"
            @click="handleClickSignOut"
          />
        </div>
      </div>

      <div class="w-full h-full flex justify-center items-center">
        <div class="flex gap-24">
          <!-- LEFT -->
          <div class="flex flex-col max-w-sm">
            <HomeArrowGraphic />
            <div class="flex-col flex gap-5">
              <div class="flex flex-col gap-5 px-3 pb-5 pt-2 bg-surface-50 sur">
                <h1 class="text-5xl font-medium text-surface-700">
                  Continue building in your workspace.
                </h1>
                <p class="text-sm font-medium text-surface-500">
                  Select the workspace where you would like to continue building
                  simulated work experiences or create a new workspace below.
                </p>
              </div>
              <HomeAddWorkspaceButton />
            </div>
          </div>

          <!-- RIGHT -->
          <HomeWorkspaceList />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useUserStore } from '~/stores/user'

definePageMeta({
  layout: false,
})

const router = useRouter()
const authStore = useAuthStore()
const userStore = useUserStore()

async function handleClickSignOut() {
  await authStore.signOut()
}

function handleClickSystemAdmin() {
  if (!userStore.isSuperUser) {
    return
  }

  router.push({ name: 'system-admin-users' })
}
</script>

<style scoped>
.dotted-background {
  background-image: radial-gradient(circle, #cbd5e1 1px, #f8fafc 1px);
  background-size: 16px 16px;
  background-repeat: repeat;
}
</style>
