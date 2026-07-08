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

// Optional prop image centred on the stage for this line.
const image = computed(() => line.value?.image ?? '')
</script>

<template>
  <!-- Tap anywhere on the scene to finish the typing, then to advance. -->
  <div class="grow" @click="handleClick">
    <!-- centred prop image; fades when the line's image changes -->
    <Transition name="prop">
      <img
        v-if="image"
        :key="image"
        :src="image"
        alt=""
        class="pointer-events-none absolute left-1/2 top-[40%] max-h-[30%] w-auto max-w-[50%] -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,.18)]"
      />
    </Transition>

    <template v-if="line">
      <NoteCard v-if="line.kind === 'note'" :text="out" :done="done" />
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
        />
      </template>
    </template>
  </div>
</template>
