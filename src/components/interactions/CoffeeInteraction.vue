<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { COFFEE } from '../../data'
import InteractionShell from './InteractionShell.vue'

/* Set up the moka pot — water (slider), heat (stove knob), time (timer) — to
 * match the recipe, then brew. Correct combo jumps to `onSuccess`; otherwise
 * `onFail` (the "this is horrible, redo it" dialog that loops back here). */
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
const brewing = ref(false)

function frac(v: number, cfg: { min: number; max: number }) {
  return cfg.max === cfg.min ? 0 : (v - cfg.min) / (cfg.max - cfg.min)
}

// Visual bindings.
const waterFrac = computed(() => frac(values.water, COFFEE.water))
const heatFrac = computed(() => frac(values.heat, COFFEE.heat))
const durFrac = computed(() => frac(values.duration, COFFEE.duration))
const waterY = computed(() => 152 - waterFrac.value * 54) // boiler interior 98..152
const flameScale = computed(() => 0.3 + heatFrac.value) // flame grows with heat
const heatAngle = computed(() => -120 + heatFrac.value * 240) // knob sweep
const durLabel = computed(
  () => `${Math.floor(values.duration / 60)}:${String(values.duration % 60).padStart(2, '0')}`,
)
const RING = 2 * Math.PI * 26
const ringOffset = computed(() => RING * (1 - durFrac.value))

function turnHeat() {
  values.heat = values.heat >= COFFEE.heat.max ? COFFEE.heat.min : values.heat + COFFEE.heat.step
}
function stepDuration(dir: number) {
  const c = COFFEE.duration
  values.duration = Math.min(c.max, Math.max(c.min, values.duration + dir * c.step))
}

function brew() {
  if (brewing.value) return
  brewing.value = true
  const ok =
    values.heat === COFFEE.answer.heat &&
    values.water === COFFEE.answer.water &&
    values.duration === COFFEE.answer.duration
  // brief brew animation, then resolve
  window.setTimeout(() => emit('done', ok ? props.onSuccess : props.onFail), 1500)
}

// Dev skip override: jump straight to the success outcome.
function skip() {
  emit('skip', props.onSuccess)
}
defineExpose({ skip })
</script>

<template>
  <InteractionShell>
    <div class="flex grow flex-col p-4">
      <h3 class="mb-1 font-serif text-[20px]">{{ title ?? 'Make the coffee' }}</h3>
      <p class="mb-3 text-[13px] leading-snug opacity-80">
        Read the recipe, set up the moka pot, then brew.
      </p>

      <!-- recipe -->
      <div class="mb-3 rounded-xl border border-paper-edge bg-canvas/70 p-2.5">
        <div class="mb-1 font-sans text-[10px] uppercase tracking-[2px] text-ink-soft">Recipe</div>
        <p v-for="(l, i) in COFFEE.recipe" :key="i" class="font-mono text-[12px] leading-snug">
          {{ l }}
        </p>
      </div>

      <!-- brew stage: water slider · moka pot · heat knob -->
      <div class="flex flex-1 items-center justify-center gap-2">
        <!-- water -->
        <div class="flex flex-col items-center gap-1">
          <input
            v-model.number="values.water"
            type="range"
            class="water-range h-[150px]"
            :min="COFFEE.water.min"
            :max="COFFEE.water.max"
            :step="COFFEE.water.step"
            :disabled="brewing"
            aria-label="water"
          />
          <span class="font-mono text-[11px] text-ink-soft">{{ values.water }}{{ COFFEE.water.unit }}</span>
          <span class="text-[9px] uppercase tracking-[1px] text-ink-soft">water</span>
        </div>

        <!-- moka pot -->
        <svg viewBox="0 0 140 210" class="h-[192px] w-auto" role="img" aria-label="moka pot">
          <defs>
            <clipPath id="mokaBoiler"><polygon points="38,152 102,152 96,98 44,98" /></clipPath>
            <clipPath id="mokaCollector"><polygon points="46,92 94,92 82,54 58,54" /></clipPath>
          </defs>

          <!-- burner + flame (in the gap beneath the pot) -->
          <ellipse cx="70" cy="184" rx="44" ry="5" fill="#3a3a38" />
          <g :transform="`translate(70 180) scale(1 ${flameScale}) translate(-70 -180)`">
            <g class="flame">
              <path d="M56,180 C48,168 50,156 56,148 C62,156 64,168 56,180 Z" fill="#ef8f2e" />
              <path d="M84,180 C76,168 78,156 84,148 C90,156 92,168 84,180 Z" fill="#ef8f2e" />
              <path d="M70,180 C59,164 61,146 70,136 C79,146 81,164 70,180 Z" fill="#f0902f" />
              <path d="M70,178 C63,166 65,152 70,144 C75,152 77,166 70,178 Z" fill="#ffd257" />
            </g>
          </g>

          <!-- handle -->
          <path
            d="M46,100 C20,104 20,128 46,126"
            fill="none"
            stroke="#2a2a28"
            stroke-width="8"
            stroke-linecap="round"
          />

          <!-- boiler (holds water) -->
          <polygon points="38,152 102,152 96,98 44,98" fill="#d7dbde" stroke="#8f959a" stroke-width="2" />
          <g clip-path="url(#mokaBoiler)">
            <rect x="36" :y="waterY" width="68" :height="152 - waterY" fill="#9cc6d6" />
            <rect x="36" :y="waterY" width="68" height="3" fill="#bfe0ec" />
          </g>
          <polygon
            points="38,152 102,152 96,98 44,98"
            fill="none"
            stroke="#8f959a"
            stroke-width="2"
          />

          <!-- screw band -->
          <rect x="43" y="90" width="54" height="9" rx="2" fill="#b7bcc0" stroke="#8f959a" stroke-width="1.5" />

          <!-- collector (coffee) -->
          <polygon points="46,92 94,92 82,54 58,54" fill="#dfe3e6" stroke="#8f959a" stroke-width="2" />
          <g clip-path="url(#mokaCollector)">
            <rect
              x="46"
              y="54"
              width="48"
              height="40"
              fill="#4a2f1c"
              class="coffee"
              :class="{ 'coffee--on': brewing }"
            />
          </g>
          <polygon points="46,92 94,92 82,54 58,54" fill="none" stroke="#8f959a" stroke-width="2" />

          <!-- spout -->
          <polygon points="93,60 106,56 93,70" fill="#c9ced1" stroke="#8f959a" stroke-width="1.5" />
          <!-- lid + knob -->
          <ellipse cx="70" cy="54" rx="13" ry="3.5" fill="#c9ced1" stroke="#8f959a" stroke-width="1.5" />
          <circle cx="70" cy="47" r="4.5" fill="#2a2a28" />

          <!-- steam while brewing -->
          <g v-if="brewing" fill="none" stroke="#c9ced1" stroke-width="2.5" stroke-linecap="round">
            <path class="steam" d="M66,40 q-4,-6 0,-12 q4,-6 0,-12" />
            <path class="steam steam--2" d="M76,40 q4,-6 0,-12 q-4,-6 0,-12" />
          </g>
        </svg>

        <!-- heat knob -->
        <div class="flex flex-col items-center gap-1">
          <button
            class="rounded-full transition active:scale-95"
            :disabled="brewing"
            aria-label="turn heat"
            @click="turnHeat"
          >
            <svg viewBox="0 0 60 60" class="h-[56px] w-[56px]">
              <circle cx="30" cy="30" r="27" fill="#e7e1d5" stroke="#8f959a" stroke-width="2" />
              <circle cx="30" cy="30" r="20" fill="#d7dbde" />
              <g :transform="`rotate(${heatAngle} 30 30)`">
                <rect x="28.5" y="9" width="3" height="14" rx="1.5" fill="#d2552f" />
              </g>
            </svg>
          </button>
          <span class="font-mono text-[11px] text-ink-soft">{{ values.heat }}</span>
          <span class="text-[9px] uppercase tracking-[1px] text-ink-soft">heat</span>
        </div>
      </div>

      <!-- timer -->
      <div class="my-3 flex items-center justify-center gap-4">
        <button
          class="flex h-9 w-9 items-center justify-center rounded-full border border-paper-edge bg-canvas text-[20px] font-bold leading-none text-ink transition active:opacity-70"
          :disabled="brewing"
          aria-label="less time"
          @click="stepDuration(-1)"
        >
          −
        </button>
        <div class="relative h-16 w-16">
          <svg viewBox="0 0 64 64" class="h-16 w-16 -rotate-90">
            <circle cx="32" cy="32" r="26" fill="none" stroke="#e7e1d5" stroke-width="5" />
            <circle
              cx="32"
              cy="32"
              r="26"
              fill="none"
              stroke="#d2552f"
              stroke-width="5"
              stroke-linecap="round"
              :stroke-dasharray="RING"
              :stroke-dashoffset="ringOffset"
            />
          </svg>
          <span class="absolute inset-0 flex items-center justify-center font-mono text-[14px] text-ink">
            {{ durLabel }}
          </span>
        </div>
        <button
          class="flex h-9 w-9 items-center justify-center rounded-full border border-paper-edge bg-canvas text-[20px] font-bold leading-none text-ink transition active:opacity-70"
          :disabled="brewing"
          aria-label="more time"
          @click="stepDuration(1)"
        >
          +
        </button>
      </div>

      <!-- brew -->
      <button
        class="w-full cursor-pointer rounded-md bg-vermilion px-6 py-3.5 font-sans text-[15px] font-bold tracking-wide text-white transition active:opacity-80 disabled:opacity-60"
        :disabled="brewing"
        @click="brew"
      >
        {{ brewing ? 'Brewing…' : 'Brew' }}
      </button>
    </div>
  </InteractionShell>
</template>

<style scoped>
/* Vertical water slider. */
.water-range {
  writing-mode: vertical-lr;
  direction: rtl;
  width: 10px;
  accent-color: #d2552f;
  cursor: pointer;
}

/* Coffee rises into the top chamber while brewing. */
.coffee {
  transform: scaleY(0);
  transform-origin: bottom;
  transform-box: fill-box;
  transition: transform 1.3s ease;
}
.coffee--on {
  transform: scaleY(1);
}

/* Flame flicker + steam. */
.flame {
  animation: coffee-flicker 0.45s ease-in-out infinite alternate;
}
@keyframes coffee-flicker {
  from {
    opacity: 0.78;
  }
  to {
    opacity: 1;
  }
}
.steam {
  animation: coffee-steam 2.2s ease-in-out infinite;
  opacity: 0;
}
.steam--2 {
  animation-delay: 1.1s;
}
@keyframes coffee-steam {
  20% {
    opacity: 0.6;
  }
  100% {
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .flame,
  .steam,
  .coffee {
    animation: none;
    transition: none;
  }
}
</style>
