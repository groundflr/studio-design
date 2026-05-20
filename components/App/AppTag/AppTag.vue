<template>
  <div
    class="rounded-2xl px-2 py-1 w-fit font-medium text-2xs flex justify-start gap-[0.35rem] items-center truncate"
    :style="
      colorHex ? { color: colorHex, backgroundColor: `${colorHex}0D` } : {}
    "
  >
    <slot />

    <font-awesome-icon
      v-if="xButton"
      icon="fa-solid fa-xmark"
      class="cursor-pointer text-[0.65rem] shrink-0"
      @click.stop="emit('click:xButton')"
    />
  </div>
</template>

<script setup lang="ts">
import { ColorOption } from '~/types/Colors'
import { colorOptionHexes } from '~/static/data/color/colorOptionHexes'

const props = defineProps({
  color: {
    type: String as PropType<ColorOption>,
    required: false,
    default: ColorOption.Primary,
  },
  xButton: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const emit = defineEmits(['click:xButton'])

const colorHex = computed<string>(() => colorOptionHexes[props.color])
</script>
