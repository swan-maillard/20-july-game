<script setup lang="ts">
import { computed, ref } from 'vue'
import { STORY } from './story'
import { GAMES } from './games'
import { useReducedMotion } from './composables/useReducedMotion'
import Dialogue from './components/Dialogue.vue'
import TitleScreen from './components/TitleScreen.vue'
import EndScreen from './components/EndScreen.vue'
import PlaceholderGame from './components/PlaceholderGame.vue'

type Screen = 'title' | 'play' | 'end'
type Phase = 'intro' | 'game' | 'outro'

const reduced = useReducedMotion()

const screen = ref<Screen>('title')
const ch = ref(0)
const phase = ref<Phase>('intro')
const line = ref(0)

const chapter = computed(() => STORY[ch.value])
const currentLine = computed(() => {
  const lines = phase.value === 'intro' ? chapter.value.intro : chapter.value.outro
  return lines[line.value]
})
const gameComp = computed(() => GAMES[chapter.value.gameKey] ?? PlaceholderGame)

// Enter a chapter, skipping straight to its game if it has no intro lines.
function enterChapter(index: number) {
  ch.value = index
  phase.value = 'intro'
  line.value = 0
  if (chapter.value.intro.length === 0) phase.value = 'game'
}

function start() {
  screen.value = 'play'
  enterChapter(0)
}

function nextChapter() {
  if (ch.value + 1 >= STORY.length) screen.value = 'end'
  else enterChapter(ch.value + 1)
}

function advance() {
  if (phase.value === 'intro') {
    if (line.value + 1 < chapter.value.intro.length) line.value++
    else {
      phase.value = 'game'
      line.value = 0
    }
  } else if (phase.value === 'outro') {
    if (line.value + 1 < chapter.value.outro.length) line.value++
    else nextChapter()
  }
}

function solveGame() {
  if (chapter.value.outro.length === 0) {
    nextChapter()
    return
  }
  phase.value = 'outro'
  line.value = 0
}
</script>

<template>
  <div class="flex h-[100dvh] w-full justify-center bg-neutral-100 font-sans">
    <!-- the white canvas — your stage -->
    <div class="relative h-full w-full max-w-[480px] select-none overflow-hidden bg-white">
      <TitleScreen v-if="screen === 'title'" @start="start" />
      <EndScreen v-else-if="screen === 'end'" />

      <template v-else>
        <!-- minimal chapter label -->
        <div class="absolute inset-x-0 top-0 z-10 pt-3 text-center">
          <span class="font-serif text-[13px] font-semibold tracking-wide text-ink/50">
            {{ chapter.title }}
          </span>
        </div>

        <Dialogue
          v-if="phase !== 'game' && currentLine"
          :key="`${phase}-${line}`"
          :line="currentLine"
          :reduced="reduced"
          @advance="advance"
        />

        <component
          :is="gameComp"
          v-else-if="phase === 'game'"
          :title="chapter.title"
          @solve="solveGame"
        />
      </template>
    </div>
  </div>
</template>
