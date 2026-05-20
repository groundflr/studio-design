<template>
  <Button
    severity="danger"
    :label="label"
    :disabled="disabled"
    :loading="loading"
  >
    <!-- IF there is a label, place icon in icon slot -->
    <template
      v-if="label !== null"
      #icon
    >
      <font-awesome-icon
        v-if="icon"
        :icon="icon"
      />
    </template>

    <!-- IF no label, place icon in default slot -->
    <template v-if="label === null">
      <font-awesome-icon
        v-if="icon"
        :icon="icon"
      />
    </template>
  </Button>
</template>

<script setup lang="ts">
import Button from 'primevue/button'

defineProps({
  label: {
    type: String,
    required: false,
    default: null,
  },
  icon: {
    type: String,
    required: false,
    default: null,
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
  loading: {
    type: Boolean,
    required: false,
    default: false,
  },
})
</script>
