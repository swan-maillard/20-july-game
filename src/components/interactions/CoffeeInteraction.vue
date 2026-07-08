<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import InteractionShell from './InteractionShell.vue'

// Recipe, answer and control ranges for the brew.
// Hint mechanic: the recipe is plain prose, but the first letter of each word
// in a line spells out a clue — write the lines so the acrostic points at the
// right numbers.
const COFFEE = {
  /** Lines of the recipe shown to the player. */
  recipe: [
    'First, turn on the heat',
    'First, add a cup of water',
    'First, set up the timer at a suitable duration',
    'Then, add a second cup of water',
    'Then, start the timer'
  ],
  /** The settings the player must dial in to brew it right. */
  answer: { heat: 1, water: 24, duration: 35 },
  /** Control ranges (min, max, step) and display unit. */
  heat: { min: 0, max: 5, step: 1, unit: '' },
  water: { min: 0, max: 30, step: 1, unit: 'cl' },
  duration: { min: 0, max: 60, step: 5, unit: 's' },
}

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
function lerp(a: number, b: number, t: number) {
  return Math.round(a + (b - a) * t)
}

// Visual bindings.
const waterFrac = computed(() => frac(values.water, COFFEE.water))
const heatFrac = computed(() => frac(values.heat, COFFEE.heat))
const durFrac = computed(() => frac(values.duration, COFFEE.duration))
const waterY = computed(() => 196 - waterFrac.value * 70) // boiler interior ~126..196
const heatAngle = computed(() => -120 + heatFrac.value * 240) // knob sweep
// Heat is shown as red: the stove + the pot's base go from cool grey to hot red.
const heatColor = computed(
  () => `rgb(${lerp(150, 226, heatFrac.value)}, ${lerp(153, 59, heatFrac.value)}, ${lerp(154, 30, heatFrac.value)})`,
)
const BREW_MS = 2200
const brewT = ref(0) // 0 → 1 across the brew animation

// Timer readout + ring: while brewing they count down to zero.
const shownFrac = computed(() => (brewing.value ? durFrac.value * (1 - brewT.value) : durFrac.value))
const shownSeconds = computed(() =>
  brewing.value ? Math.round(values.duration * (1 - brewT.value)) : values.duration,
)
const durLabel = computed(
  () => `${String(shownSeconds.value)}s`,
)
const RING = 2 * Math.PI * 26
const ringOffset = computed(() => RING * (1 - shownFrac.value))

// Reused for both the visible shape and its clip path.
const boilerPath =
  'M76,122 L58,196 Q65,203 72,196 Q79,203 86,196 Q93,203 100,196 Q107,203 114,196 Q121,203 128,196 Q135,203 142,196 L124,122 Z'
const collectorPath =
  'M62,46 L60,56 L73,110 Q80,116 87,110 Q94,116 100,110 Q107,116 114,110 Q120,116 127,110 L140,56 L138,46 Q100,36 62,46 Z'

function highlight(text: string) {
  return text.replace(
    /\b(heat|water|timer)\w*/gi,
    (match) => `<strong>${match}</strong>`
  )
}

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
  // run the timer down to zero over the brew, then resolve
  let start = 0
  const tick = (now: number) => {
    if (!start) start = now
    brewT.value = Math.min(1, (now - start) / BREW_MS)
    if (brewT.value < 1) requestAnimationFrame(tick)
    else emit('done', ok ? props.onSuccess : props.onFail)
  }
  requestAnimationFrame(tick)
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
          <strong>{{ i + 1 }}</strong> – <span v-html="highlight(l)"></span>
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
        <svg viewBox="0 0 200 232" class="h-[200px] w-auto" role="img" aria-label="moka pot">
          <defs>
            <clipPath id="mokaBoiler"><path :d="boilerPath" /></clipPath>
            <clipPath id="mokaCollector"><path :d="collectorPath" /></clipPath>
            <linearGradient id="mokaHeat" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" :stop-color="heatColor" :stop-opacity="0.15 + heatFrac * 0.7" />
              <stop offset="100%" :stop-color="heatColor" stop-opacity="0" />
            </linearGradient>
          </defs>

          <!-- steam -->
          <g
            class="moka-steam"
            fill="none"
            stroke="#2a2a28"
            stroke-width="2.5"
            stroke-linecap="round"
            opacity="0.6"
          >
            <path d="M44,48 q-6,-7 0,-14 q6,-7 0,-14" />
            <path d="M53,46 q-6,-7 0,-14 q6,-7 0,-14" />
          </g>

          <!-- handle -->
          <path
            d="M137,64 L178,74 Q184,76 182,83 L163,118 L151,118 L154,108 L169,84 Q171,80 166,79 L135,72 Z"
            fill="#fff"
            stroke="#2a2a28"
            stroke-width="3"
            stroke-linejoin="round"
          />

          <!-- spout -->
          <path d="M61,52 L40,58 L61,66 Z" fill="#fff" stroke="#2a2a28" stroke-width="3" stroke-linejoin="round" />

          <!-- lower chamber (boiler): water + heat glow -->
          <path :d="boilerPath" fill="#fff" stroke="#2a2a28" stroke-width="3" stroke-linejoin="round" />
          <g clip-path="url(#mokaBoiler)">
            <rect x="52" :y="waterY" width="96" :height="198 - waterY" fill="#a9cfdd" 
              class="water" :class="{'water--off': brewing}" />
            <rect x="52" y="120" width="96" height="80" fill="url(#mokaHeat)" />
          </g>
          <path :d="boilerPath" fill="none" stroke="#2a2a28" stroke-width="3" stroke-linejoin="round" />

          <!-- waist band -->
          <path
            d="M77,111 L123,111 L121,122 L79,122 Z"
            fill="#fff"
            stroke="#2a2a28"
            stroke-width="3"
            stroke-linejoin="round"
          />

          <!-- upper chamber (collector): coffee -->
          <path :d="collectorPath" fill="#fff" stroke="#2a2a28" stroke-width="3" stroke-linejoin="round" />
          <g clip-path="url(#mokaCollector)">
            <rect
              x="58"
              :y="112 - 66*waterFrac"
              width="84"
              :height="66*waterFrac"
              fill="#4a2f1c"
              class="coffee"
              :class="{'coffee--on': brewing}"
            />
          </g>
          <path :d="collectorPath" fill="none" stroke="#2a2a28" stroke-width="3" stroke-linejoin="round" />

          <!-- lid + knob -->
          <path
            d="M90,33 C90,24 93,21 100,21 C107,21 110,24 110,33 Z"
            fill="#fff"
            stroke="#2a2a28"
            stroke-width="3"
            stroke-linejoin="round"
          />

          <!-- facet dashes -->
          <g stroke="#2a2a28" stroke-width="1.5" stroke-dasharray="3 5" fill="none" opacity="0.75">
            <path d="M86,50 L82,108" />
            <path d="M100,48 L100,108" />
            <path d="M114,50 L118,108" />
            <path d="M82,126 L66,192" />
            <path d="M100,124 L100,192" />
            <path d="M118,126 L134,192" />
          </g>

          <!-- pressure valve -->
          <circle cx="100" cy="152" r="6" fill="#fff" stroke="#2a2a28" stroke-width="2.5" />
          <circle cx="100" cy="152" r="2" fill="#2a2a28" />

          <!-- stove (reddens with heat) -->
          <ellipse cx="100" cy="215" rx="62" ry="9" :fill="heatColor" stroke="#2a2a28" stroke-width="2.5" />
          <ellipse cx="100" cy="215" rx="44" ry="5.5" fill="none" stroke="#2a2a28" stroke-width="1.5" opacity="0.45" />
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
              <circle cx="30" cy="30" r="20" :fill="heatColor" opacity="0.9" />
              <g :transform="`rotate(${heatAngle} 30 30)`">
                <rect x="28.5" y="9" width="3" height="14" rx="1.5" fill="#2a2a28" />
              </g>
            </svg>
          </button>
          <span class="font-mono text-[11px] text-ink-soft">{{ values.heat }}</span>
          <span class="text-[9px] uppercase tracking-[1px] text-ink-soft">heat</span>
        </div>
      </div>

      <!-- timer -->
       <div class="flex flex-col items-center mb-3">
        <div class="flex items-center justify-center gap-4">
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
      <span class="text-[9px] uppercase tracking-[1px] text-ink-soft">timer</span>
       </div>
      


      <!-- brew -->
      <button
        class="w-full cursor-pointer rounded-md bg-vermilion px-6 py-3.5 font-sans text-[15px] font-bold tracking-wide text-white transition active:opacity-80 disabled:opacity-60"
        :disabled="brewing || (waterFrac == 0 || heatFrac == 0 || durFrac == 0)"
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

.water {
  transform: scaleY(1);
  transform-origin: bottom;
  transform-box: fill-box;
  transition: transform 1.3s ease;
}

.water--off {
  transform: scaleY(0);
}

/* Gentle steam drift. */
.moka-steam {
  animation: moka-steam 2.4s ease-in-out infinite;
}
@keyframes moka-steam {
  0%,
  100% {
    opacity: 0.25;
  }
  50% {
    opacity: 0.7;
  }
}

@media (prefers-reduced-motion: reduce) {
  .moka-steam,
  .coffee {
    animation: none;
    transition: none;
  }
}
</style>
