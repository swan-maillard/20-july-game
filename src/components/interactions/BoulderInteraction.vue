<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import boulderUrl from '../../assets/boulder.png'
import InteractionShell from './InteractionShell.vue'

// Routes, timing and difficulty for the boulder game.
const BOULDER = {
  routes: [
    { name: 'red', color: '#d2552f' },
    { name: 'blue', color: '#2f7ba8' },
    { name: 'green', color: '#3f8f52' },
  ],
  levels: 5, // holds per route, bottom to top
  memorizeSeconds: 10, // seconds to memorise before the holds grey out
  maxErrors: 2, // wrong holds allowed before the climb fails
}

/* Memorise the three coloured routes; when they grey out, climb the given
 * colour from the bottom by tapping its holds in order. A wrong hold = slip;
 * `maxErrors` wrong holds = a fall (jump to onFail). Completing = onSuccess.
 * Holds are placed randomly but always on the rock (see ROCK polygon). */
const props = defineProps<{ title?: string; onSuccess?: string; onFail?: string }>()
const emit = defineEmits<{ done: [target?: string]; skip: [target?: string] }>()

interface Hold {
  id: number
  x: number // percent of the wall (== image, since it fills)
  y: number // percent
  route: number // 0..n-1, or -1 for a decoy rock hold
}

const ROCK_GREY = '#6f7175'

// Rock outline, from the image map, as fractions of the 642×360 image.
const IMG_W = 642
const IMG_H = 360
const ROCK_PX = [
  49, 283, 27, 246, 58, 204, 60, 189, 97, 142, 103, 114, 148, 98, 224, 66, 250, 57, 312, 33, 343,
  28, 356, 28, 379, 13, 390, 15, 413, 29, 444, 42, 463, 50, 468, 69, 483, 90, 506, 117, 516, 125,
  559, 159, 552, 184, 568, 206, 587, 226, 576, 249, 571, 275, 558, 278, 531, 297, 481, 298, 397, 309,
]
const ROCK: [number, number][] = []
for (let i = 0; i < ROCK_PX.length; i += 2) ROCK.push([ROCK_PX[i] / IMG_W, ROCK_PX[i + 1] / IMG_H])
const ROCK_TOP = Math.min(...ROCK.map((p) => p[1]))
const ROCK_BOT = Math.max(...ROCK.map((p) => p[1]))

function pointInRock(x: number, y: number): boolean {
  let inside = false
  for (let i = 0, j = ROCK.length - 1; i < ROCK.length; j = i++) {
    const [xi, yi] = ROCK[i]
    const [xj, yj] = ROCK[j]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}
// Horizontal extent of the rock at a given height.
function rockSpanAt(y: number): [number, number] | null {
  const xs: number[] = []
  for (let i = 0, j = ROCK.length - 1; i < ROCK.length; j = i++) {
    const [xi, yi] = ROCK[i]
    const [xj, yj] = ROCK[j]
    if (yi > y !== yj > y) xs.push(((xj - xi) * (y - yi)) / (yj - yi) + xi)
  }
  if (xs.length < 2) return null
  return [Math.min(...xs), Math.max(...xs)]
}

const phase = ref<'memorize' | 'climb' | 'won'>('memorize')
const holds = ref<Hold[]>([])
const routes = ref<number[][]>([]) // route index -> ordered hold ids (bottom to top)
const target = ref(0)
const climbed = ref<number[]>([])
const countdown = ref(BOULDER.memorizeSeconds)
const shake = ref(false)
const errors = ref(0)

let timer: number | undefined

function rand(min: number, max: number) {
  return min + Math.random() * (max - min)
}
function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Fresh random layout: one hold per route + one decoy on each level, spread
// across the rock's actual width at that height. Which colour sits where is
// shuffled every time. All holds are guaranteed to sit on the rock.
function generate() {
  const hs: Hold[] = []
  const rmap: number[][] = BOULDER.routes.map(() => [])
  const n = BOULDER.routes.length + 1 // holds per level (routes + one decoy)
  const L = BOULDER.levels
  const range = ROCK_BOT - ROCK_TOP
  const topY = ROCK_TOP + range * 0.14 // skip the narrow tip
  const botY = ROCK_BOT - range * 0.05
  let id = 0
  for (let level = 0; level < L; level++) {
    const t = L === 1 ? 0 : level / (L - 1)
    const y = botY - t * (botY - topY) // bottom -> top
    const span = rockSpanAt(y)
    if (!span) continue
    const inset = (span[1] - span[0]) * 0.14 + 0.02
    let lo = span[0] + inset
    let hi = span[1] - inset
    if (hi < lo) lo = hi = (span[0] + span[1]) / 2
    const assign = shuffle([...BOULDER.routes.map((_, r) => r), -1])
    for (let i = 0; i < n; i++) {
      const f = n === 1 ? 0.5 : i / (n - 1)
      let x = lo + (hi - lo) * f + rand(-0.03, 0.03)
      let yy = y + rand(-0.02, 0.02)
      if (!pointInRock(x, yy)) {
        x = (lo + hi) / 2
        yy = y
      }
      hs.push({ id, x: x * 100, y: yy * 100, route: assign[i] })
      if (assign[i] >= 0) rmap[assign[i]].push(id)
      id++
    }
  }
  holds.value = hs
  routes.value = rmap
}

function startMemorize() {
  phase.value = 'memorize'
  countdown.value = BOULDER.memorizeSeconds
  timer = window.setInterval(() => {
    countdown.value -= 1
    if (countdown.value <= 0) {
      window.clearInterval(timer)
      startClimb()
    }
  }, 1000)
}

function startClimb() {
  phase.value = 'climb'
  target.value = Math.floor(Math.random() * BOULDER.routes.length)
  climbed.value = []
  errors.value = 0
}

function isLit(h: Hold) {
  return climbed.value.includes(h.id)
}
function holdFill(h: Hold) {
  if (phase.value === 'memorize') return h.route >= 0 ? BOULDER.routes[h.route].color : ROCK_GREY
  return isLit(h) ? BOULDER.routes[target.value].color : ROCK_GREY
}

function tapHold(h: Hold) {
  if (phase.value !== 'climb') return
  const seq = routes.value[target.value]
  if (h.id === seq[climbed.value.length]) {
    climbed.value.push(h.id)
    if (climbed.value.length === seq.length) win()
  } else {
    errors.value += 1
    if (errors.value >= BOULDER.maxErrors) fail()
    else slip()
  }
}

// Wrong hold, but tries left: slip back to the start of the route.
function slip() {
  shake.value = true
  climbed.value = []
  window.setTimeout(() => (shake.value = false), 400)
}
// Out of tries — fall, then jump to the fail dialog (which loops back here).
function fail() {
  shake.value = true
  window.setTimeout(() => emit('done', props.onFail), 500)
}
function win() {
  phase.value = 'won'
  window.setTimeout(() => emit('done', props.onSuccess), 900)
}

// Dev skip -> jump straight to the success outcome.
function skip() {
  emit('skip', props.onSuccess)
}
defineExpose({ skip })

onMounted(() => {
  generate()
  startMemorize()
})
onBeforeUnmount(() => window.clearInterval(timer))
</script>

<template>
  <InteractionShell>
    <div class="flex grow flex-col gap-3 p-4">
      <h3 class="font-serif text-[20px]">{{ title }}</h3>

      <!-- status -->
      <div class="min-h-[38px]">
        <template v-if="phase === 'memorize'">
          <p class="mb-1.5 text-[13px] font-semibold">
            Read the routes before attempting the climb. {{ countdown }}s
          </p>
          <div class="h-1.5 overflow-hidden rounded-full bg-paper-edge">
            <div
              class="memo-bar h-full rounded-full bg-vermilion"
              :style="{ width: (countdown / BOULDER.memorizeSeconds) * 100 + '%' }"
            />
          </div>
        </template>
        <template v-else-if="phase === 'climb'">
          <p class="flex flex-wrap items-center gap-1.5 text-[13px] font-semibold">
            Climb the
            <span
              class="inline-block h-3.5 w-3.5 rounded-full"
              :style="{ background: BOULDER.routes[target].color }"
            />
            <span class="uppercase tracking-wide">{{ BOULDER.routes[target].name }}</span>
            route, from bottom to top.
          </p>
        </template>
        <template v-else>
          <p class="text-[14px] font-bold text-pine">Too easy!</p>
        </template>
      </div>

      <!-- wall -->
      <div class="flex flex-1 items-center justify-center">
        <div
          class="relative w-full overflow-hidden rounded-xl border border-paper-edge bg-ink/5"
          :class="{ 'boulder-shake': shake }"
          style="aspect-ratio: 642 / 360"
        >
          <img :src="boulderUrl" alt="" class="absolute inset-0 h-full w-full object-contain" />
          <button
            v-for="h in holds"
            :key="h.id"
            class="absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 shadow-sm transition-colors"
            :class="[
              phase === 'climb' && !isLit(h) ? 'cursor-pointer active:scale-90' : 'cursor-default',
              isLit(h) && climbed[climbed.length - 1] === h.id ? 'ring-2 ring-white/80' : '',
            ]"
            :style="{ left: h.x + '%', top: h.y + '%', background: holdFill(h), borderColor: 'rgba(0,0,0,.3)' }"
            aria-label="hold"
            @click="tapHold(h)"
          />
        </div>
      </div>
    </div>
  </InteractionShell>
</template>

<style scoped>
.memo-bar {
  transition: width 1s linear;
}
.boulder-shake {
  animation: boulder-shake 0.4s;
}
@keyframes boulder-shake {
  0%,
  100% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-8px);
  }
  40% {
    transform: translateX(8px);
  }
  60% {
    transform: translateX(-5px);
  }
  80% {
    transform: translateX(5px);
  }
}
@media (prefers-reduced-motion: reduce) {
  .memo-bar,
  .boulder-shake {
    animation: none;
    transition: none;
  }
}
</style>
