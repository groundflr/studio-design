<template>
  <AppButton
    variant="primary"
    label="+ New Workspace"
    @click="handleClickNewWorkspace"
  />

  <DialogInputTextAsync
    v-model="isDialogVisible"
    :is-loading="isLoading"
    heading="New Workspace"
    input-placeholder="Workspace title"
    confirm-action-label="Create Workspace"
    @resolve="(val: string) => handleClickCreateWorkspace(val)"
  />
</template>

<script setup lang="ts">
import { useWorkspaceStore } from '~/stores/workspace'

const router = useRouter()
const workspaceStore = useWorkspaceStore()
const { addToast } = useToastNotifications()

const isDialogVisible = ref(false)
const isLoading = ref(false)

function handleClickNewWorkspace() {
  isDialogVisible.value = true
}

async function handleClickCreateWorkspace(newWorkspaceTitle: string) {
  isLoading.value = true

  if (!newWorkspaceTitle) {
    isLoading.value = false
    return
  }

  const { data, error } =
    await workspaceStore.createWorkspace(newWorkspaceTitle)

  if (error !== null) {
    addToast({
      type: 'error',
      heading: 'Error creating new workspace',
      message:
        'An error occurred while creating the new workspace. Please try again.',
      life: 5000,
    })
    isLoading.value = false
    return
  }

  await router.push({ name: 'workspaceId', params: { workspaceId: data.id } })
  isLoading.value = false
}
</script>
