<script setup lang="ts">
import GameShell from './GameShell.vue'

/* A do-nothing game: it just exposes the shell + a win button.
 * Copy this file to start a real game. The only contract is:
 *   - accept a `title` prop
 *   - emit `solve` when the player wins
 * Then register it under a key in games/index.ts and point a chapter at it. */

defineProps<{ title: string }>()
const emit = defineEmits<{ solve: [] }>()
</script>

<template>
  <GameShell
    :title="title"
    instruction="Placeholder game. Replace this with your own mechanic, then emit `solve` when the player wins."
    @solve="emit('solve')"
  >
    <button
      class="w-full cursor-pointer rounded-[14px] bg-vermilion p-3.5 font-sans text-[16px] font-extrabold text-white shadow-[0_6px_0_#a23d1d] transition-transform active:translate-y-1 active:shadow-[0_2px_0_#a23d1d]"
      @click="emit('solve')"
    >
      Complete game →
    </button>
  </GameShell>
</template>
