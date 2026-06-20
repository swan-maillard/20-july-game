<script setup lang="ts">
import InteractionShell from './InteractionShell.vue'

/* A do-nothing interaction: the shell + a win button.
 * Copy this file to start a real one. The only contract is:
 *   - emit `done` when the player completes it
 * Then register it under a key in index.ts and point a scene at that key:
 *   { type: 'interactive', key: 'your-key' }
 * Optional `props` on the scene are forwarded here (e.g. `title`). */

defineProps<{ title?: string }>()
const emit = defineEmits<{ done: [] }>()
</script>

<template>
  <InteractionShell
    :title="title ?? 'Placeholder'"
    instruction="Placeholder interaction. Replace this with your own mechanic, then emit `done`."
    @done="emit('done')"
  >
    <button
      class="w-full cursor-pointer rounded-md bg-vermilion px-6 py-3.5 font-sans text-[15px] font-bold tracking-wide text-white transition active:opacity-80"
      @click="emit('done')"
    >
      Complete →
    </button>
  </InteractionShell>
</template>
