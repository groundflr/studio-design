<template>
  <div
    class="w-[32rem] h-[32rem] bg-white shadow-md rounded-xl flex flex-col pt-10 overflow-hidden"
  >
    <!-- SEARCH -->
    <div
      class="pb-5 px-14 z-10 duration-300"
      :class="{ 'shadow-md': !arrivedState.top }"
    >
      <div
        class="w-full h-10 rounded-md bg-surface-100 shrink-0 flex justify-start items-center gap-3 px-3 py-2"
      >
        <AppIcon
          icon="fa-regular fa-magnifying-glass"
          class="text-surface-400 shrink-0"
        />
        <input
          v-model="searchValue"
          type="text"
          placeholder="Search"
          class="placeholder:text-surface-400 font-medium text-sm text-surface-700 grow outline-none bg-transparent"
        />
      </div>
    </div>
    <!-- LIST -->
    <ul
      ref="list"
      class="grow py-3 flex flex-col overflow-y-auto studio-scrollbar px-14"
    >
      <template v-if="userStore.user && !userStore.$isInitialising">
        <HomeWorkspaceListItem
          v-for="workspace in filteredWorkspaces"
          :key="workspace.id"
          :workspace="workspace"
        />
        <span
          v-if="filteredWorkspaces.length === 0"
          class="w-full text-center text-sm text-surface-600"
          >No Workspaces</span
        >
      </template>
      <template v-else>
        <HomeWorkspaceListItemSkeleton />
        <HomeWorkspaceListItemSkeleton />
        <HomeWorkspaceListItemSkeleton />
      </template>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { type WorkspaceSummary } from '~/types/Workspace'
import { useUserStore } from '~/stores/user'
import { useUserWorkspacesStore } from '~/stores/userWorkspaces'

const userStore = useUserStore()
const userWorkspacesStore = useUserWorkspacesStore()

const { userWorkspaces } = storeToRefs(userWorkspacesStore)

const searchValue = ref('')

const searchFilter = useStringSearchFilter<WorkspaceSummary>(
  searchValue,
  (ws) => ws.title,
)

const filteredWorkspaces = useFilteredList(userWorkspaces, [searchFilter])

const list = ref<HTMLUListElement>()

const { arrivedState } = useScroll(list)
</script>
