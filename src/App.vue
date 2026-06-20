<script setup lang="ts">
import { computed, ref, type Component } from 'vue'
import { STORY, CHARACTERS, DEV_SKIP } from './data'
import { INTERACTIONS } from './components/interactions'
import { useReducedMotion } from './composables/useReducedMotion'
import { usePreloadImages } from './composables/usePreloadImages'
import DialogScene from './components/scenes/DialogScene.vue'
import ScreenScene from './components/scenes/ScreenScene.vue'
import PlaceholderInteraction from './components/interactions/PlaceholderInteraction.vue'

const reduced = useReducedMotion()

// Warm the cache for every portrait + per-line prop image at startup so they
// show instantly later on.
const portraitUrls = Object.values(CHARACTERS).flatMap((c) => Object.values(c.portraits ?? {}))
const lineImages = STORY.flatMap((ch) =>
  ch.scenes.flatMap((s) => (s.type === 'dialog' ? s.lines.map((l) => l.image) : [])),
)
const preloadUrls = [...portraitUrls, ...lineImages].filter((url): url is string => Boolean(url))
usePreloadImages(preloadUrls)

// The engine: a cursor over chapters -> scenes. Scenes advance on `done`.
const chapterIndex = ref(0)
const sceneIndex = ref(0)

const chapter = computed(() => STORY[chapterIndex.value])
const scene = computed(() => chapter.value.scenes[sceneIndex.value])
const positionKey = computed(() => `${chapterIndex.value}-${sceneIndex.value}`)

// Current scene instance — lets the dev skip call an optional skip() override
// the scene exposes (interactions use it to jump straight to their success).
const sceneRef = ref<{ skip?: () => void } | null>(null)

// Chapter label is for in-world scenes, not the framing screens.
const showChapterTitle = computed(() => Boolean(chapter.value.title) && scene.value.type !== 'screen')

// Dev-only: a skip button on every scene that jumps to the next one. Hidden on
// the terminal scene (nothing to skip to).
const isTerminal = computed(
  () =>
    chapterIndex.value === STORY.length - 1 &&
    sceneIndex.value === chapter.value.scenes.length - 1,
)
const showSkip = computed(() => DEV_SKIP && !isTerminal.value)

// Resolve the current scene to a component + its props.
const sceneComponent = computed<Component>(() => {
  const s = scene.value
  if (s.type === 'dialog') return DialogScene
  if (s.type === 'screen') return ScreenScene
  return INTERACTIONS[s.key] ?? PlaceholderInteraction
})

const sceneProps = computed<Record<string, unknown>>(() => {
  const s = scene.value
  if (s.type === 'dialog') return { lines: s.lines, reduced: reduced.value }
  if (s.type === 'screen') return { scene: s }
  return s.props ?? {}
})

// Walk to the next scene in order, then the next chapter; stop at the very end.
function linearNext() {
  if (sceneIndex.value + 1 < chapter.value.scenes.length) {
    sceneIndex.value += 1
  } else if (chapterIndex.value + 1 < STORY.length) {
    chapterIndex.value += 1
    sceneIndex.value = 0
  }
  // else: terminal scene — nothing follows.
}

// Jump to the scene with the given id (searched across the whole story).
function jumpTo(id: string) {
  for (let ci = 0; ci < STORY.length; ci++) {
    const si = STORY[ci].scenes.findIndex((s) => s.id === id)
    if (si !== -1) {
      chapterIndex.value = ci
      sceneIndex.value = si
      return
    }
  }
  console.warn(`[story] no scene with id "${id}" — advancing linearly`)
  linearNext()
}

// A scene finished. An explicit target (from the scene's `done` payload) wins,
// then the scene's own `goto`, otherwise we just move on.
function advance(target?: string) {
  const dest = target ?? scene.value.goto
  if (dest) jumpTo(dest)
  else linearNext()
}

// An interaction emitted `skip` — go to its target (e.g. its success scene),
// or linearly if it didn't name one.
function onSkip(target?: string) {
  if (target) jumpTo(target)
  else linearNext()
}

// The dev skip button. If the current scene exposes a skip() override (an
// interaction jumping to success), use it; otherwise just step to the next.
function devSkip() {
  const inst = sceneRef.value
  if (inst && typeof inst.skip === 'function') inst.skip()
  else linearNext()
}
</script>

<template>
  <div class="flex h-[100dvh] w-full justify-center bg-[#e8e4db] font-sans text-ink">
    <!-- the stage: a phone-width washi canvas -->
    <div class="flex flex-col relative h-full w-full max-w-[480px] select-none overflow-hidden bg-canvas">
      <!-- minimal chapter label -->
      <div v-if="showChapterTitle" class="pt-3 text-center">
        <span class="font-serif text-[13px] font-semibold tracking-wide text-ink-soft">
          {{ chapter.title }}
        </span>
      </div>
      <Transition name="scene">
        <component
          :is="sceneComponent"
          :key="positionKey"
          ref="sceneRef"
          v-bind="sceneProps"
          @done="advance"
          @skip="onSkip"
        />
      </Transition>

      <!-- dev: skip the scene (interactions override this to jump to success) -->
      <button
        v-if="showSkip"
        class="absolute right-3 top-3 z-40 rounded-md border border-paper-edge bg-paper/80 px-2.5 py-1 font-mono text-[11px] text-ink-soft backdrop-blur-sm transition active:opacity-70"
        @click="devSkip"
      >
        skip ›
      </button>
    </div>
  </div>
</template>
