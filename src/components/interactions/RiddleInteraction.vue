<script setup lang="ts">
import InteractionShell from './InteractionShell.vue'

/* A paper note with a hand-written riddle. Reading it points the player to the
 * real post-it hidden in their room; "Found the post-it" opens the SMS. */
const emit = defineEmits<{ done: [target?: string]; skip: [target?: string] }>()

// The riddle written on the note. PLACEHOLDER — write your own.
const RIDDLE = {
  lines: [
    "- Don't let them, don't let them see",
    "- But voice inside sings a different song",
    "- I'll fool myself, she'll walk in",
    "- There's gems in the land, so hold up your",
    "- a far off place",
    "- Can friends do this?",
    "- It's she who holds her tongue who gets a"
  ],
  action: 'Found the post-it!',
}

function found() {
  emit('done')
}
function skip() {
  emit('skip')
}
defineExpose({ skip })
</script>

<template>
  <InteractionShell>
    <div class="flex grow flex-col items-center justify-center gap-7 p-5">
      <!-- paper note -->
      <div
        class="relative -rotate-2 rounded-[3px] border border-[#e4d9b8] bg-[#f7efd6] px-8 py-9 shadow-[0_12px_28px_rgba(0,0,0,.18)]"
      >
        <!-- sticky tape -->
        <span
          class="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 -rotate-2 rounded-[1px] bg-white/45 shadow-sm"
        />
        <p class="whitespace-pre-line font-hand text-[1.2rem] leading-[1.3] text-[#3a2f1c]">
          {{ RIDDLE.lines.join('\n') }}
        </p>
      </div>

      <button
        class="cursor-pointer rounded-md bg-vermilion px-6 py-3 font-sans text-[15px] font-bold tracking-wide text-white transition active:opacity-80"
        @click="found"
      >
        {{ RIDDLE.action }}
      </button>
    </div>
  </InteractionShell>
</template>
