<script setup lang="ts">
defineProps<{
  /** Cut-out portrait url. Empty => labelled placeholder. */
  src: string
  /** Mood label, shown on the placeholder. */
  mood: string
  side: 'left' | 'right'
  /** Whether the character is currently speaking (drives the talk wiggle). */
  talking: boolean
}>()
</script>

<template>
  <div
    class="pointer-events-none absolute bottom-1.5 z-20 flex h-[200px] w-[124px] items-end justify-center"
    :class="[
      side === 'right' ? 'right-2' : 'left-2',
      talking ? 'animate-talkshake' : 'animate-breathe',
    ]"
  >
    <!-- src is preloaded at startup and decoded synchronously, so swapping
         moods on this persistent <img> is paint-ready (no flash, no delay). -->
    <img
      v-if="src"
      :src="src"
      :alt="mood"
      decoding="sync"
      draggable="false"
      class="max-h-full max-w-full object-contain drop-shadow-[0_0_2px_rgba(0,0,0,.2)]"
    />
    <div
      v-else
      class="flex h-[170px] w-[108px] flex-col items-center justify-center gap-1.5 rounded-[16px_16px_10px_10px] border-2 border-dashed border-ink/30 bg-ink/[0.04] p-2 text-center text-ink/60"
    >
      <span class="text-[11px] font-extrabold uppercase tracking-[0.6px]">{{ mood }}</span>
      <span class="text-[10px] leading-tight opacity-80">add cut-out<br />photo here</span>
    </div>
  </div>
</template>
