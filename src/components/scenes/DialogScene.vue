<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { Line } from '../../types'
import { CHARACTERS } from '../../data'
import { useTypewriter } from '../../composables/useTypewriter'
import SpeechBubble from '../dialogue/SpeechBubble.vue'
import NoteCard from '../dialogue/NoteCard.vue'
import CharacterPortrait from '../dialogue/CharacterPortrait.vue'

const props = defineProps<{ lines: Line[]; reduced: boolean }>()
const emit = defineEmits<{ done: [] }>()

const index = ref(0)
const line = computed<Line | undefined>(() => props.lines[index.value])

const { out, done, finish } = useTypewriter(
  () => line.value?.text ?? '',
  () => !props.reduced,
)

// Tap: finish typing, else advance to the next line, else end the scene.
function handleClick() {
  if (!done.value) {
    finish()
  } else if (index.value + 1 < props.lines.length) {
    index.value += 1
  } else {
    emit('done')
  }
}

// An empty dialog scene is a no-op.
onMounted(() => {
  if (props.lines.length === 0) emit('done')
})

// Resolve the speaking character (only for 'say' lines).
const character = computed(() =>
  line.value?.kind === 'say' ? CHARACTERS[line.value.who] : undefined,
)
const side = computed(() => character.value?.side ?? 'left')
const mood = computed(() => (line.value?.kind === 'say' ? line.value.mood ?? 'neutral' : 'neutral'))
const portrait = computed(() => character.value?.portraits?.[mood.value] ?? '')
const talking = computed(() => !done.value && !props.reduced)
</script>

<template>
  <div class="absolute inset-0">
    <template v-if="line">
      <NoteCard v-if="line.kind === 'note'" :text="out" :done="done" @click="handleClick" />
      <template v-else>
        <!-- The portrait stays mounted as the line cursor moves, so only its
             reactive `src` changes — the preloaded image swaps with no flash. -->
        <CharacterPortrait :src="portrait" :mood="mood" :side="side" :talking="talking" />
        <SpeechBubble
          :name="character?.name ?? line.who"
          :accent="character?.accent ?? '#d2552f'"
          :side="side"
          :text="out"
          :done="done"
          @click="handleClick"
        />
      </template>
    </template>
  </div>
</template>
