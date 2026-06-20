<script setup lang="ts">
import { reactive } from 'vue'
import { COFFEE } from '../../data'
import InteractionShell from './InteractionShell.vue';

/* Dial in heat / water / duration to match the recipe, then brew.
 * On a correct combination we jump to `onSuccess`; otherwise to `onFail`
 * (typically a "this is horrible, redo it" dialog that loops back here). */
const props = defineProps<{
  title?: string
  onSuccess?: string
  onFail?: string
}>()
const emit = defineEmits<{ done: [target?: string]; skip: [target?: string] }>()

const values = reactive({
  heat: COFFEE.heat.min,
  water: COFFEE.water.min,
  duration: COFFEE.duration.min,
})

const controls = [
  { key: 'heat', label: 'Heat', cfg: COFFEE.heat },
  { key: 'water', label: 'Water', cfg: COFFEE.water },
  { key: 'duration', label: 'Time', cfg: COFFEE.duration },
] as const

function step(key: 'heat' | 'water' | 'duration', cfg: { min: number; max: number; step: number }, dir: number) {
  values[key] = Math.min(cfg.max, Math.max(cfg.min, values[key] + dir * cfg.step))
}

function brew() {
  const ok =
    values.heat === COFFEE.answer.heat &&
    values.water === COFFEE.answer.water &&
    values.duration === COFFEE.answer.duration
  emit('done', ok ? props.onSuccess : props.onFail)
}

// Dev skip override: jump straight to the success outcome instead of letting
// the engine step linearly into the failure/retry dialog.
function skip() {
  emit('skip', props.onSuccess)
}
defineExpose({ skip })
</script>

<template>
  <InteractionShell>
    <div class="p-4 flex flex-col grow">

    <h3 class="mb-1 font-serif text-[20px]">{{ title ?? 'Make the coffee' }}</h3>
    <p class="mb-3 text-[13px] leading-snug opacity-80">Read the recipe, dial it in, then brew.</p>

    <!-- recipe -->
    <div class="mb-4 min-h-0 flex-1 overflow-y-auto rounded-xl border border-paper-edge bg-canvas/70 p-3">
      <div class="mb-1.5 font-sans text-[10px] uppercase tracking-[2px] text-ink-soft">Recipe</div>
      <p v-for="(l, i) in COFFEE.recipe" :key="i" class="font-mono text-[13px] leading-relaxed">
        {{ l }}
      </p>
    </div>

    <!-- controls -->
    <div class="mb-4 flex flex-col gap-2.5">
      <div v-for="c in controls" :key="c.key" class="flex items-center justify-between gap-3">
        <span class="font-sans text-[14px] font-bold">{{ c.label }}</span>
        <div class="flex items-center gap-2">
          <button
            class="flex h-9 w-9 items-center justify-center rounded-full border border-paper-edge bg-canvas text-[20px] font-bold leading-none text-ink transition active:opacity-70"
            aria-label="decrease"
            @click="step(c.key, c.cfg, -1)"
          >
            −
          </button>
          <span class="w-[78px] text-center font-mono text-[18px]">
            {{ values[c.key] }}<span class="text-[12px] text-ink-soft">{{ c.cfg.unit ? ' ' + c.cfg.unit : '' }}</span>
          </span>
          <button
            class="flex h-9 w-9 items-center justify-center rounded-full border border-paper-edge bg-canvas text-[20px] font-bold leading-none text-ink transition active:opacity-70"
            aria-label="increase"
            @click="step(c.key, c.cfg, 1)"
          >
            +
          </button>
        </div>
      </div>
    </div>

    <!-- brew -->
    <button
      class="w-full cursor-pointer rounded-md bg-vermilion px-6 py-3.5 font-sans text-[15px] font-bold tracking-wide text-white transition active:opacity-80"
      @click="brew"
    >
      Brew
    </button>
    </div>

  </InteractionShell>
</template>
