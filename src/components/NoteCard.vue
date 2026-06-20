<script setup lang="ts">
defineProps<{
  /** Text revealed so far (from the typewriter). */
  text: string
  /** True once the line has finished typing. */
  done: boolean
}>()

defineEmits<{ click: [] }>()
</script>

<template>
  <div
    class="absolute inset-x-4 top-1/2 z-10 -translate-y-1/2 cursor-pointer animate-rise rounded-[18px] border border-paper-edge bg-paper px-[18px] pb-[30px] pt-[18px] text-ink shadow-[0_16px_40px_rgba(0,0,0,.35)]"
    @click="$emit('click')"
  >
    <div class="mb-2 font-mono text-[11px] tracking-[1px] text-vermilion">MESSAGE</div>
    <div class="text-[16px] font-bold leading-[1.5]">
      {{ text
      }}<span v-if="!done" class="inline-block w-[7px] animate-blink text-vermilion">▍</span>
    </div>
    <div
      v-if="done"
      class="absolute bottom-2.5 right-3.5 animate-nudge text-2xl leading-none text-vermilion"
    >
      ›
    </div>
  </div>
</template>
