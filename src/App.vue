<script setup lang="ts">
import { computed, ref, type Component } from 'vue'
import { STORY, CHARACTERS } from './data'
import { INTERACTIONS } from './components/interactions'
import { useReducedMotion } from './composables/useReducedMotion'
import { usePreloadImages } from './composables/usePreloadImages'
import DialogScene from './components/scenes/DialogScene.vue'
import ScreenScene from './components/scenes/ScreenScene.vue'
import PlaceholderInteraction from './components/interactions/PlaceholderInteraction.vue'

const reduced = useReducedMotion()

// Warm the cache for every character portrait at startup so bubbles show
// their image instantly later on.
const portraitUrls = Object.values(CHARACTERS)
  .flatMap((c) => Object.values(c.portraits ?? {}))
  .filter((url): url is string => Boolean(url))
usePreloadImages(portraitUrls)

// The engine: a cursor over chapters -> scenes. Scenes advance on `done`.
const chapterIndex = ref(0)
const sceneIndex = ref(0)

const chapter = computed(() => STORY[chapterIndex.value])
const scene = computed(() => chapter.value.scenes[sceneIndex.value])
const positionKey = computed(() => `${chapterIndex.value}-${sceneIndex.value}`)

// Chapter label is for in-world scenes, not the framing screens.
const showChapterTitle = computed(() => Boolean(chapter.value.title) && scene.value.type !== 'screen')

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

// Move to the next scene, then the next chapter; stop at the very end.
function advance() {
  if (sceneIndex.value + 1 < chapter.value.scenes.length) {
    sceneIndex.value += 1
  } else if (chapterIndex.value + 1 < STORY.length) {
    chapterIndex.value += 1
    sceneIndex.value = 0
  }
  // else: terminal scene — nothing follows.
}
</script>

<template>
  <div class="flex h-[100dvh] w-full justify-center bg-[#e8e4db] font-sans text-ink">
    <!-- the stage: a phone-width washi canvas -->
    <div class="relative h-full w-full max-w-[480px] select-none overflow-hidden bg-canvas">
      <!-- minimal chapter label -->
      <div v-if="showChapterTitle" class="absolute inset-x-0 top-0 z-20 pt-3 text-center">
        <span class="font-serif text-[13px] font-semibold tracking-wide text-ink-soft">
          {{ chapter.title }}
        </span>
      </div>

      <!-- one scene at a time, cross-faded -->
      <Transition name="scene" mode="out-in">
        <component
          :is="sceneComponent"
          :key="positionKey"
          v-bind="sceneProps"
          @done="advance"
        />
      </Transition>
    </div>
  </div>
</template>
