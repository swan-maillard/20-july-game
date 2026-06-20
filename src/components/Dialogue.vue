<script setup lang="ts">
import { computed } from 'vue'
import type { Line } from '../types'
import { CHARACTERS } from '../config'
import { useTypewriter } from '../composables/useTypewriter'
import SpeechBubble from './SpeechBubble.vue'
import NoteCard from './NoteCard.vue'
import CharacterPortrait from './CharacterPortrait.vue'

const props = defineProps<{ line: Line; reduced: boolean }>()
const emit = defineEmits<{ advance: [] }>()

const { out, done, finish } = useTypewriter(
  () => props.line.text,
  () => !props.reduced,
)

function handleClick() {
  if (done.value) emit('advance')
  else finish()
}

// Resolve the speaking character (only for 'say' lines).
const character = computed(() =>
  props.line.kind === 'say' ? CHARACTERS[props.line.who] : undefined,
)
const side = computed(() => character.value?.side ?? 'left')
const mood = computed(() => (props.line.kind === 'say' ? props.line.mood ?? 'neutral' : 'neutral'))
const portrait = computed(() => character.value?.portraits?.[mood.value] ?? '')
const talking = computed(() => !done.value && !props.reduced)
</script>

<template>
  <NoteCard v-if="line.kind === 'note'" :text="out" :done="done" @click="handleClick" />
  <template v-else>
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
