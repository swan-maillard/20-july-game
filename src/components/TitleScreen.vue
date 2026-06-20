<script setup lang="ts">
const emit = defineEmits<{ start: [] }>()
</script>

<template>
  <div class="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 px-8 text-center">
    <div class="font-mono text-[12px] uppercase tracking-[3px] text-ink/50">A story</div>
    <h1 class="font-serif text-[46px] font-bold leading-none text-ink">Your<br />Title</h1>
    <p class="max-w-[300px] text-[15px] font-semibold text-ink/70">
      A short premise goes here. Tap begin to walk through the story.
    </p>
    <button
      class="mt-2 w-[220px] cursor-pointer rounded-[14px] bg-vermilion p-3.5 font-sans text-[16px] font-extrabold text-white shadow-[0_6px_0_#a23d1d] transition-transform active:translate-y-1 active:shadow-[0_2px_0_#a23d1d]"
      @click="emit('start')"
    >
      Begin →
    </button>
  </div>
</template>
