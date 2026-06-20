<script setup lang="ts">
import { END } from '../config'
</script>

<template>
  <div class="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 px-8 text-center">
    <div class="font-mono text-[12px] uppercase tracking-[3px] text-ink/50">Fin</div>
    <h1 class="font-serif text-[40px] font-bold leading-none text-ink">{{ END.title }}</h1>
    <p class="max-w-[320px] text-[15px] font-semibold text-ink/70">{{ END.subtitle }}</p>
  </div>
</template>
