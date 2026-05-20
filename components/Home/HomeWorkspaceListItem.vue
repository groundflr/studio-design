<template>
  <li
    class="py-5 first-of-type:pt-0 border-b border-surface-100 last-of-type:border-none flex justify-start items-center gap-5 group select-none cursor-pointer duration-300 overflow-hidden shrink-0"
    @click="handleClickWorkspace"
  >
    <!-- PIC -->
    <AppWorkspaceProfileImageMedium :workspace="workspace" />

    <!-- DEETS -->
    <div
      class="grow flex flex-col gap-1 items-start justify-center overflow-hidden"
    >
      <span
        class="text-surface-800 group-hover:text-primary-700 font-semibold text-lg duration-300 truncate overflow-hidden w-full"
        >{{ workspace.title }}</span
      >
      <span
        v-if="workspace.userCount >= 0"
        class="font-medium text-sm text-surface-500 group-hover:text-surface-700 duration-300"
        >{{ workspace.userCount }} members</span
      >
    </div>
  </li>
</template>

<script setup lang="ts">
import { type WorkspaceSummary } from '~/types/Workspace'

const props = defineProps({
  workspace: {
    type: Object as PropType<WorkspaceSummary>,
    required: true,
  },
})

const router = useRouter()

function handleClickWorkspace() {
  router.push({
    name: 'workspaceId',
    params: { workspaceId: props.workspace.id },
  })
}
</script>
