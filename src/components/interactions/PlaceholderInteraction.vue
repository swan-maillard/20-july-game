<script setup lang="ts">
import InteractionShell from './InteractionShell.vue';

/* A do-nothing interaction: a card with a win button.
 * Copy this file to start a real one. The only contract is:
 *   - emit `done` when the player completes it
 * Then register it under a key in index.ts and point a scene at that key:
 *   { type: 'interactive', key: 'your-key' }
 * Optional `props` on the scene are forwarded here (e.g. `title`).
 * The dev "skip" button is provided by the engine, not here. */

defineProps<{ title?: string; button?: string }>()
const emit = defineEmits<{ done: [] }>()
</script>

<template>
  <InteractionShell>
    <div class="p-4 flex flex-col grow">
      <h3 class="mb-1 font-serif text-[21px]">{{ title ?? 'Placeholder' }}</h3>
    <p class="mb-3.5 text-[13.5px] leading-snug opacity-80">
      Placeholder interaction. Replace this with your own mechanic, then emit `done`.
    </p>
    <button
      class="w-full cursor-pointer rounded-md bg-vermilion px-6 py-3.5 font-sans text-[15px] font-bold tracking-wide text-white transition active:opacity-80"
      @click="emit('done')"
    >
      {{ button ?? 'Complete →' }}
    </button>
    </div>
    
  </InteractionShell>
</template>
