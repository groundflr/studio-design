<template>
  <NavBar>
    <!-- WORKSPACE MENU -->
    <template #top>
      <NavBarWorkspaceButton />
    </template>

    <template
      v-if="workspaceId"
      #nav-items
    >
      <!-- Show back button when in section view -->
      <Transition
        mode="out-in"
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0 translate-x-4"
        enter-to-class="opacity-100 translate-x-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-x-0"
        leave-to-class="opacity-0 -translate-x-4"
      >
        <template v-if="!selectedSection">
          <NavBarGroup
            class="pt-1"
            label="Summary"
          >
            <NavBarItem
              label="Dashboard"
              icon="fa-regular fa-chart-tree-map"
              to-name="workspaceId"
            />
            <NavBarSection
              label="Simulations"
              icon="fa-regular fa-film"
              :is-selected="selectedSection === 'simulations'"
              :is-section="true"
              @select="handleSectionSelect('simulations')"
            />
            <NavBarSection
              label="Assessments"
              icon="fa-regular fa-flask-vial"
              :is-selected="selectedSection === 'assessments'"
              :is-section="true"
              @select="handleSectionSelect('assessments')"
            />
            <NavBarItem
              v-if="getFeatureActive('Sequences')"
              label="Sequences"
              icon="fa-regular fa-chart-tree-map"
              to-name="workspaceId-sequences"
            />
          </NavBarGroup>
        </template>

        <!-- Assessments section view -->
        <template v-else-if="selectedSection === 'assessments'">
          <NavBarGroup>
            <button
              v-if="selectedSection"
              class="inline-flex h-6 mb-1 hover:bg-surface-200 items-center px-2 text-surface-600 cursor-pointer rounded"
              @click="selectedSection = null"
            >
              <AppIcon
                icon="fa-regular fa-arrow-left"
                class="scale-80"
                size="xs"
              />
              <span
                class="text-[11px] text-surface-700 uppercase tracking-[0.1em] pl-1 font-semibold"
                >BACK</span
              >
            </button>
            <NavBarItem
              label="Tests"
              icon="fa-regular fa-vial"
              to-name="workspaceId-tests"
            />
            <NavBarItem
              label="Assessments"
              icon="fa-regular fa-flask-vial"
              to-name="workspaceId-assessments"
            />

            <NavBarItem
              label="Rubrics"
              icon="fa-regular fa-table-list"
              to-name=""
            >
              <template #after>
                <div
                  class="bg-surface-100 rounded-md px-0 py-1 text-2xs text-center font-semibold text-surface-300 mr-2 scale-90"
                >
                  COMING
                </div>
              </template>
            </NavBarItem>
          </NavBarGroup>
        </template>

        <!-- Simulations section view -->
        <template v-else-if="selectedSection === 'simulations'">
          <NavBarGroup>
            <button
              v-if="selectedSection"
              class="inline-flex h-6 hover:bg-surface-200 items-center px-2 text-surface-600 cursor-pointer rounded"
              @click="selectedSection = null"
            >
              <AppIcon
                icon="fa-regular fa-arrow-left"
                class="scale-80"
                size="xs"
              />
              <span
                class="text-[11px] text-surface-700 uppercase tracking-[0.1em] pl-1 font-semibold"
                >BACK</span
              >
            </button>

            <NavBarItem
              label="Simulations"
              icon="fa-regular fa-film"
              to-name="workspaceId-simulations"
            />
            <NavBarItem
              label="Characters"
              icon="fa-regular fa-person-dots-from-line"
              to-name="workspaceId-characters"
            />
            <!-- <NavBarItem
              label="Sequences"
              icon="fa-regular fa-layer-group"
              to-name="workspaceId-sequences"
            >
              <template #after>
                <div
                  class="bg-surface-100 rounded-md px-0 py-1 text-xs text-center font-semibold text-surface-300 mr-2 scale-90"
                >
                  DEMO
                </div>
              </template></NavBarItem
            > -->
            <NavBarItem
              label="Experiences"
              icon="fa-regular fa-cube"
              to-name=""
            >
              <template #after>
                <div
                  class="bg-surface-100 rounded-md px-0 py-1 text-xs text-center font-semibold text-surface-300 mr-2 scale-90"
                >
                  COMING
                </div>
              </template>
            </NavBarItem>

            <NavBarItem
              label="Environments"
              icon="fa-regular fa-diagram-venn"
              to-name="workspaceId-environments"
            >
            </NavBarItem>
          </NavBarGroup> </template
      ></Transition>

      <!-- Pinned items - always visible -->
      <NavBarWorkspacePins />
    </template>
  </NavBar>
</template>

<script setup lang="ts">
import { useRouteParams } from '@vueuse/router'
import { onClickOutside } from '@vueuse/core'
import { getFeatureActive } from '~/utils/getFeatureActive'

const workspaceId = useRouteParams('workspaceId')
const showResults = ref(false)
const route = useRoute()

// Track the currently selected section
const selectedSection = ref<string | null>(null)

const handleSectionSelect = (section: string) => {
  selectedSection.value = selectedSection.value === section ? null : section
}

watch(
  () => route.name,
  (newRouteName) => {
    const name = newRouteName?.toString()

    if (!name) return

    if (
      name.includes('simulations') ||
      name.includes('characters') ||
      name.includes('environments')
    ) {
      selectedSection.value = 'simulations'
    } else if (name.includes('assessments') || name.includes('tests')) {
      selectedSection.value = 'assessments'
    } else {
      selectedSection.value = null
    }
  },
  { immediate: true },
)

// Create a template ref for the container
const containerRef = ref<HTMLElement | null>(null)

// Use the container ref for click outside
onClickOutside(containerRef, () => {
  showResults.value = false
})
</script>
