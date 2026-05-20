<template>
  <div
    class="w-screen h-screen flex justify-center items-center dotted-background"
  >
    <div
      v-if="!errorMessage"
      class="w-96 px-4 py-5 border rounded-md shadow-sm flex flex-col gap-6 bg-white"
    >
      <div class="flex flex-col items-center gap-4">
        <div
          class="bg-contain bg-no-repeat bg-center h-16 w-full cursor-pointer"
          style="background-image: url('/logo/studio_full_light.png')"
        />
        <div class="w-full flex gap-2 justify-center items-center">
          <hr class="w-full" />
          <span class="text-sm uppercase font-normal text-gray-700 shrink-0"
            >Complete Sign Up</span
          >
          <hr class="w-full" />
        </div>
      </div>
      <form
        class="flex flex-col gap-3"
        @submit.prevent="handleContinue"
      >
        <!-- EMAIL -->
        <AppInputLabel
          label="Email"
          for-id="email"
        >
          <AppInputText
            id="email"
            v-model="userData.email"
            placeholder="jane@example.com"
            autofocus
            readonly
            class="w-full"
            @keyup.enter.prevent="handleContinue"
          />
        </AppInputLabel>
        <!-- FIRST NAME -->
        <AppInputLabel
          label="First name"
          for-id="first-name"
        >
          <AppInputText
            id="first-name"
            v-model="userData.firstName"
            placeholder="Jane"
            class="w-full"
          />
        </AppInputLabel>
        <!-- LAST NAME -->
        <AppInputLabel
          label="Last name"
          for-id="last-name"
        >
          <AppInputText
            id="last-name"
            v-model="userData.lastName"
            placeholder="Doe"
            class="w-full"
          />
        </AppInputLabel>
      </form>
      <div class="w-full flex justify-end">
        <AppButton
          variant="primary"
          label="Continue"
          :disabled="isContinueButtonDisabled"
          @click="handleContinue"
        />
      </div>
    </div>

    <!-- ERROR -->
    <div
      v-if="errorMessage"
      class="flex flex-col items-center gap-2 bg-white p-4 border border-surface-200 rounded-lg shadow-sm"
    >
      <font-awesome-icon
        icon="fa-regular fa-circle-exclamation"
        class="text-2xl"
      />
      <span class="text-gray-700 text-sm">{{ errorMessage }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useUserStore } from '~/stores/user'

// STORES ============================================
const authStore = useAuthStore()
const userStore = useUserStore()

const { addToast } = useToastNotifications()
const router = useRouter()
const route = useRoute()

definePageMeta({
  layout: false,
})

const userId = computed(() => {
  return (route.query.id as string) || null
})

const errorMessage = ref<string | null>(null)

const isContinueButtonDisabled = computed(() => {
  return (
    !userData.value.email ||
    !userData.value.firstName ||
    !userData.value.lastName ||
    !userId.value
  )
})

if (
  !authStore.isAuthenticated ||
  !authStore.authUser ||
  !authStore.authUser?.email ||
  !authStore.authUser?.sub ||
  !userId.value
) {
  errorMessage.value = 'Invalid invite. Please try again.'
}

const userData = ref({
  email: authStore.authUser?.email || '',
  firstName: authStore.authUser?.given_name || '',
  lastName: authStore.authUser?.family_name || '',
  auth0Id: authStore.authUser?.sub || '',
})

async function handleContinue() {
  if (isContinueButtonDisabled.value) return
  if (!userId.value) return

  const { error } = await userStore.completeSignUp(userData.value, userId.value)

  if (error !== null) {
    addToast({
      type: 'error',
      heading: 'Could not complete sign up',
      message: 'There was a problem completing your sign up. Please try again.',
      life: 5000,
    })
    return
  }

  router.push('/')
}
</script>

<style scoped>
.dotted-background {
  background-image: radial-gradient(circle, #cbd5e1 1px, #f8fafc 1px);
  background-size: 16px 16px;
  background-repeat: repeat;
}
</style>
