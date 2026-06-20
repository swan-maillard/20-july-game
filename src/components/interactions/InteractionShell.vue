<script setup lang="ts">
import { DEV_SKIP } from '../../data'

defineProps<{
  title: string
  instruction?: string
  /** Stretch the panel to fill the stage (for grid / tall interactions). */
  tall?: boolean
}>()

const emit = defineEmits<{ done: [] }>()
</script>

<template>
  <div
    class="absolute inset-x-3 bottom-4 z-10 animate-rise rounded-[18px] border border-paper-edge bg-paper p-[18px] text-ink shadow-[0_8px_28px_rgba(0,0,0,.10)]"
    :class="tall ? 'top-[92px] flex flex-col' : ''"
  >
    <h3 class="mb-1 font-serif text-[21px]">{{ title }}</h3>
    <p v-if="instruction" class="mb-3.5 text-[13.5px] leading-snug opacity-80">{{ instruction }}</p>

    <slot />

    <button
      v-if="DEV_SKIP"
      class="mx-auto mt-2.5 block bg-transparent font-mono text-[11px] text-ink/40"
      @click="emit('done')"
    >
      skip ›
    </button>
  </div>
</template>
