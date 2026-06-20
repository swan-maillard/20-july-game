<script setup lang="ts">
import type { ScreenScene } from '../../types'

defineProps<{ scene: ScreenScene }>()
const emit = defineEmits<{ done: [] }>()
</script>

<template>
  <div class="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 px-8 text-center">

    <div class="flex flex-col items-center gap-2">
      <span v-if="scene.kicker" class="font-sans text-[12px] tracking-[5px] text-ink-soft">
        {{ scene.kicker }}
      </span>
      <h1 class="font-serif text-[40px] font-semibold leading-tight text-ink">{{ scene.title }}</h1>
    </div>

    <p v-if="scene.body" class="max-w-[280px] text-[14px] leading-relaxed text-ink-soft">
      {{ scene.body }}
    </p>

    <button
      v-if="scene.action"
      class="mt-1 cursor-pointer rounded-md bg-vermilion px-8 py-3 font-sans text-[15px] font-bold tracking-wide text-white transition active:opacity-80"
      @click="emit('done')"
    >
      {{ scene.action }}
    </button>
  </div>
</template>
