<template>
  <div>
    <NavBarSectionItem
      :label="label"
      :icon="icon"
      :is-selected="isSelected"
      :is-section="isSection"
      @click="$emit('select')"
    />
    <div v-if="isSelected && items.length > 0">
      <NavBarItem
        v-for="item in items"
        :key="item.label"
        :label="item.label"
        :icon="item.icon"
        :to-name="item.toName"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface NavItem {
  label: string
  icon: string
  toName: string
  isSection: boolean
}

defineProps({
  label: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  isSelected: {
    type: Boolean,
    default: false,
  },
  items: {
    type: Array as PropType<NavItem[]>,
    default: () => [],
  },
  isSection: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['select'])
</script>
