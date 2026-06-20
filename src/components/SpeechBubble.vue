<script setup lang="ts">
defineProps<{
  /** Name shown on the tab. */
  name: string
  /** Tab colour (any CSS colour). */
  accent: string
  side: 'left' | 'right'
  /** Text revealed so far (from the typewriter). */
  text: string
  /** True once the line has finished typing. */
  done: boolean
}>()

defineEmits<{ click: [] }>()
</script>

<template>
  <div class="absolute inset-x-0 bottom-0 z-10 px-3 pb-4">
    <div
      class="relative min-h-[96px] cursor-pointer animate-rise rounded-[18px] border border-paper-edge bg-paper px-4 pb-3.5 pt-4 text-ink shadow-[0_10px_30px_rgba(0,0,0,.3)]"
      :class="side === 'right' ? 'mr-[118px]' : 'ml-[118px]'"
      @click="$emit('click')"
    >
      <!-- tail pointing toward the character -->
      <span
        class="absolute bottom-6 h-[18px] w-[18px] rotate-45 bg-paper"
        :class="
          side === 'right'
            ? 'right-[-9px] border-b border-r border-paper-edge'
            : 'left-[-9px] border-b border-l border-paper-edge'
        "
      />

      <!-- name tab -->
      <div
        class="absolute -top-3 rounded-full px-3 py-0.5 font-serif text-[13px] font-semibold text-white shadow-[0_3px_8px_rgba(0,0,0,.25)]"
        :class="side === 'right' ? 'right-3.5' : 'left-3.5'"
        :style="{ background: accent }"
      >
        {{ name }}
      </div>

      <!-- text -->
      <div class="min-h-[48px] text-[16px] font-semibold leading-[1.5]">
        {{ text
        }}<span v-if="!done" class="inline-block w-[7px] animate-blink text-vermilion">▍</span>
      </div>

      <!-- advance nudge -->
      <div
        v-if="done"
        class="absolute bottom-2 animate-nudge text-2xl leading-none text-vermilion"
        :class="side === 'right' ? 'left-3' : 'right-3'"
      >
        ›
      </div>
    </div>
  </div>
</template>
