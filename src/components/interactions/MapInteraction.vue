<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { Canvas, painters } from 'headbreaker'
import mapUrl from '../../assets/map.png'
import InteractionShell from './InteractionShell.vue'

// Puzzle config. Set `answer` to the real place name (case-insensitive).
const MAP = {
  answer: 'STAVANGER',
  pieces: { horizontal: 3, vertical: 3 },
}

/* A jigsaw of the map (headbreaker / Konva). Reassemble it to read the route,
 * then type the name of the cabin's place. Correct -> onSuccess; wrong ->
 * onFail (a dialog that loops back here). */
const props = defineProps<{ title?: string; onSuccess?: string; onFail?: string }>()
const emit = defineEmits<{ done: [target?: string]; skip: [target?: string] }>()

const puzzleEl = ref<HTMLDivElement | null>(null)
const ready = ref(false)
const solved = ref(false)
const place = ref('')

let canvas: Canvas | null = null

onMounted(() => {
  const el = puzzleEl.value
  if (!el) return

  const img = new Image()
  img.src = mapUrl
  img.onload = () => {
    if (!puzzleEl.value) return
    // The stage fills the element. The puzzle keeps the image's 1042×2000
    // ratio, scaled to fit inside the stage (clamping whichever side binds)
    // with a bit of room left over to shuffle. Rectangular pieces keep the
    // map undistorted.
    const IMG_W = 734
    const IMG_H = 740
    const width = el.clientWidth
    const height = el.clientHeight
    const scale = Math.min(width / IMG_W, height / IMG_H)
    const pieceSize = {
      x: Math.floor((IMG_W * scale) / MAP.pieces.horizontal),
      y: Math.floor((IMG_H * scale) / MAP.pieces.vertical),
    }
    const borderFill = { x: Math.round(pieceSize.x / 10), y: Math.round(pieceSize.y / 10) }
    const proximity = Math.round(Math.min(pieceSize.x, pieceSize.y) / 4)

    canvas = new Canvas(el, {
      width,
      height,
      image: img,
      pieceSize,
      proximity,
      borderFill,
      strokeWidth: 1.5,
      strokeColor: '#2f4a40',
      lineSoftness: 0.18,
      // Must pass the painter explicitly: headbreaker's default looks for a
      // global `window.headbreaker`, which doesn't exist in a bundle.
      painter: new painters.Konva(),
    })
    canvas.adjustImagesToPuzzleWidth()
    canvas.autogenerate({
      horizontalPiecesCount: MAP.pieces.horizontal,
      verticalPiecesCount: MAP.pieces.vertical,
    })
    canvas.shuffle(0.7)
    canvas.draw()
    canvas.attachRelativePositionValidator()
    canvas.onValid(() => {
      solved.value = true
    })
    ready.value = true
  }
})

onBeforeUnmount(() => {
  // Tear down the Konva stage so it doesn't linger after the scene changes.
  try {
    ;(canvas as unknown as { __konvaLayer__?: { getStage(): { destroy(): void } } })?.__konvaLayer__
      ?.getStage()
      ?.destroy()
  } catch {
    /* ignore */
  }
})

function submit() {
  const correct = place.value.trim().toLowerCase() === MAP.answer.trim().toLowerCase()
  emit('done', correct ? props.onSuccess : props.onFail)
}

// Dev skip -> jump straight to the success outcome.
function skip() {
  emit('skip', props.onSuccess)
}
defineExpose({ skip })
</script>

<template>
  <InteractionShell>
    <div class="flex grow flex-col p-4">
      <h3 class="mb-1 font-serif text-[20px]">{{ title ?? 'The route' }}</h3>
      <p class="mb-3 text-[13px] leading-snug opacity-80">
        Find out in which city the cabin was.
      </p>

      <!-- jigsaw -->
      <div
        class="relative mb-4 min-h-[260px] flex-1 overflow-hidden rounded-xl border border-paper-edge bg-canvas"
      >
        <div ref="puzzleEl" class="h-full w-full" />
        <span
          v-if="!ready"
          class="pointer-events-none absolute inset-0 flex items-center justify-center font-mono text-[12px] text-ink-soft"
        >
          Loadin...
        </span>
        <span
          v-if="solved"
          class="absolute right-2 top-2 rounded-md bg-pine px-2 py-0.5 font-mono text-[11px] text-white"
        >
          Solved ✓
        </span>
      </div>

      <!-- place name -->
      <div class="flex items-center gap-3">
        <input
          v-model="place"
          type="text"
          placeholder="Name of the place…"
          class="min-w-0 flex-1 rounded-md border border-paper-edge bg-white px-3 py-2.5 font-sans text-[15px] text-ink outline-none transition-colors focus:border-ink-soft"
          @keyup.enter="submit"
        />
        <button
          class="cursor-pointer rounded-md bg-vermilion px-5 py-2.5 font-sans text-[14px] font-bold text-white transition active:opacity-80 disabled:cursor-default disabled:opacity-40"
          :disabled="!place.trim()"
          @click="submit"
        >
          Confirm
        </button>
      </div>
    </div>
  </InteractionShell>
</template>
