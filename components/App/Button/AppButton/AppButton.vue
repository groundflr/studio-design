<template>
  <button
    :disabled="disabled || loading"
    :class="[
      // general
      'border duration-200 overflow-hidden select-none',
      // text
      'font-medium leading-none',
      { 'opacity-60': props.disabled && !props.loading },
      // sizing
      ...selectedSizeClasses.button,
      // positioning
      'relative flex items-center justify-center',
      // focus
      'focus:outline-none focus:ring',
      ...selectedVariantClasses.button,
    ]"
  >
    <!-- ICON: LEFT -->
    <AppIcon
      v-if="icon && iconPosition === 'left'"
      :icon="icon"
      fixed-width
    />

    <!-- LABEL -->
    <span v-if="label">{{ label }}</span>

    <!-- ICON: RIGHT -->
    <AppIcon
      v-if="icon && iconPosition === 'right' && !hotKeyHint.length"
      :icon="icon"
      fixed-width
    />

    <!-- HOT KEY HINT -->
    <span
      v-if="hotKeyHint.length"
      class="flex justify-center items-center gap-px"
    >
      <span
        v-for="hint in hotKeyHint"
        :key="hint"
        class="text-4xs border px-0.5 py-px rounded-[4px] flex items-center justify-center font-semibold"
        :class="selectedVariantClasses.hotKeyHint"
      >
        {{ hint }}
      </span>
    </span>

    <!-- LOADING -->
    <div
      v-if="loading"
      class="absolute inset-0 flex items-center justify-center"
      :class="selectedVariantClasses.loadingScrim"
    >
      <AppLoadingSpinner :color="selectedVariantClasses.loadingSpinner[0]" />
    </div>
  </button>
</template>

<script setup lang="ts">
type Variant = 'primary' | 'outline' | 'destructive' | 'ghost' | 'ghost-primary'

interface VariantComponents {
  button: any[]
  hotKeyHint: any[]
  loadingScrim: any[]
  loadingSpinner: any[]
}

const variantClasses = computed<Record<Variant, VariantComponents>>(() => ({
  primary: {
    button: [
      // border and bg
      'border-primary-600 bg-primary-600 hover:border-primary-700 hover:bg-primary-700 disabled:hover:border-primary-600 disabled:hover:bg-primary-600',
      // focus
      'focus:ring-primary-400/50',
      // text color
      'text-white',
      // shadow
      'shadow-sm',
    ],
    hotKeyHint: ['border-white/40 bg-white/15 text-white/85'],
    loadingScrim: ['bg-primary-600'],
    loadingSpinner: ['text-white'],
  },
  outline: {
    button: [
      // border and bg
      'border-surface-300 bg-white hover:border-surface-400 hover:bg-surface-50 disabled:hover:border-surface-300 disabled:hover:bg-white',
      // focus
      'focus:ring-surface-600/50',
      // text color
      'text-surface-700',
      // shadow
      'shadow-sm',
    ],
    hotKeyHint: ['border-surface-700/25 bg-surface-700/10 text-surface-700/70'],
    loadingScrim: ['bg-white'],
    loadingSpinner: ['text-surface-700'],
  },
  destructive: {
    button: [
      // border and bg
      'border-error-500 bg-error-500 hover:border-error-600 hover:bg-error-600 disabled:hover:border-error-500 disabled:hover:bg-error-500',
      // focus
      'focus:ring-error-400/50',
      // text color
      'text-white',
      // shadow
      'shadow-sm',
    ],
    hotKeyHint: ['border-white/40 bg-white/15 text-white/85'],
    loadingScrim: ['bg-error-500'],
    loadingSpinner: ['text-white'],
  },
  ghost: {
    button: [
      // border
      'border-transparent disabled:hover:border-transparent',
      // bg
      {
        'bg-surface-700/10 hover:bg-surface-700/15 disabled:hover:bg-surface-700/10':
          props.selected,
        'bg-transparent hover:bg-surface-700/5 disabled:hover:bg-transparent':
          !props.selected,
      },
      // focus
      'focus:ring-surface-600/50',
      // text color
      'text-surface-700',
    ],
    hotKeyHint: ['border-transparent bg-surface-700/10 text-surface-700/85'],
    loadingScrim: ['bg-white'],
    loadingSpinner: ['text-surface-700'],
  },
  'ghost-primary': {
    button: [
      // border and bg
      'border-transparent bg-transparent hover:bg-primary-700/5 disabled:hover:border-transparent',
      // focus
      'focus:ring-primary-600/50',
      // text color
      'text-primary-700',
    ],
    hotKeyHint: ['border-transparent bg-primary-700/10 text-primary-700/85'],
    loadingScrim: ['bg-white'],
    loadingSpinner: ['text-primary-700'],
  },
}))

const sizeClasses = computed<Record<'xs' | 'sm' | 'md', { button: any[] }>>(
  (): Record<'xs' | 'sm' | 'md', { button: any[] }> => ({
    xs: {
      button: [
        // sizing
        'h-6',
        // general
        'rounded-md',
        // spacing
        'px-2 py-[0.5rem]',
        // text
        'text-xs',
      ],
    },
    sm: {
      button: [
        // sizing
        'h-7',
        {
          'min-w-20 w-fit': props.label,
          'size-7': !props.label && props.icon,
        },
        // general
        'rounded-md',
        // spacing
        'gap-1 px-[0.625rem] py-1',
        { 'pr-1': !!props.hotKeyHint.length },
        // text
        'text-xs',
      ],
    },
    md: {
      button: [
        // sizing
        'h-9',
        {
          'min-w-24 w-fit': props.label,
          'size-9': !props.label && props.icon,
        },
        // spacing
        'gap-2 px-3 py-[0.625rem]',
        { 'pr-2': !!props.hotKeyHint.length },
        // general
        'rounded-lg',
        // text
        'text-sm',
      ],
    },
  }),
)

const props = defineProps({
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
  iconPosition: {
    type: String as PropType<'left' | 'right'>,
    required: false,
    default: 'left',
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
  hotKeyHint: {
    type: Array as PropType<string[]>,
    required: false,
    default: () => [],
  },
  variant: {
    type: String as PropType<Variant>,
    default: 'primary',
  },
  size: {
    type: String as PropType<keyof typeof sizeClasses.value>,
    default: 'md',
  },
  selected: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const selectedVariantClasses = computed(() => {
  return variantClasses.value[props.variant]
})

const selectedSizeClasses = computed(() => {
  return sizeClasses.value[props.size]
})
</script>
