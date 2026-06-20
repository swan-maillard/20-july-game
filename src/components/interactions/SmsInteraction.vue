<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import { SMS } from '../../data'

/* The opening SMS conversation, modelled as an interaction. The post office
 * asks the player to confirm an order code; every guess is rejected (with a
 * special line for the obvious one). After `failsBeforeGiveUp` attempts the
 * scene emits `done` and Marie takes over in the next scene. */
const emit = defineEmits<{ done: [] }>()

interface Msg {
  from: 'them' | 'me'
  text: string
}

const messages = ref<Msg[]>([])
const typing = ref(false)
const showInput = ref(false)
const busy = ref(false) // a reply is in flight
const finished = ref(false) // out of attempts, handing off to the story
const code = ref('')
const fails = ref(0)

const inputEl = ref<HTMLInputElement | null>(null)
const scrollEl = ref<HTMLElement | null>(null)

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

async function scrollToBottom() {
  await nextTick()
  if (scrollEl.value) scrollEl.value.scrollTop = scrollEl.value.scrollHeight
}

/** Show the "typing…" bubble, then drop in an incoming message. */
async function receive(text: string) {
  typing.value = true
  await scrollToBottom()
  await sleep(750)
  typing.value = false
  messages.value.push({ from: 'them', text })
  await scrollToBottom()
}

function focusInput() {
  nextTick(() => inputEl.value?.focus())
}

onMounted(async () => {
  await sleep(500)
  for (const m of SMS.intro) {
    await receive(m)
    await sleep(350)
  }
  showInput.value = true
  focusInput()
})

/** Keep only digits, capped at the code length. */
function onInput(e: Event) {
  code.value = (e.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, SMS.codeLength)
}

async function submit() {
  if (busy.value || finished.value || code.value.length < SMS.codeLength) return

  const guess = code.value
  messages.value.push({ from: 'me', text: guess })
  code.value = ''
  busy.value = true
  await scrollToBottom()
  await sleep(300)

  const reply = guess === SMS.decoyCode ? SMS.decoyReply : SMS.wrongReply
  await receive(reply)

  fails.value += 1
  busy.value = false

  if (fails.value >= SMS.failsBeforeGiveUp) {
    finished.value = true
    await sleep(1300)
    emit('done')
  } else {
    focusInput()
  }
}
</script>

<template>
  <div class="absolute inset-0 z-10 flex flex-col bg-canvas">
    <!-- header -->
    <header class="flex flex-col items-center border-b border-paper-edge px-4 py-3">
      <span class="font-mono text-[10px] uppercase tracking-[3px] text-ink-soft">SMS</span>
      <span class="font-serif text-[17px] font-semibold text-ink">{{ SMS.sender }}</span>
    </header>

    <!-- conversation -->
    <div ref="scrollEl" class="flex-1 space-y-2.5 overflow-y-auto px-4 py-5">
      <div
        v-for="(m, i) in messages"
        :key="i"
        class="flex animate-rise"
        :class="m.from === 'me' ? 'justify-end' : 'justify-start'"
      >
        <div
          class="max-w-[78%] whitespace-pre-wrap px-3.5 py-2.5 text-[15px] leading-snug"
          :class="
            m.from === 'me'
              ? 'rounded-2xl rounded-br-md bg-vermilion text-white'
              : 'rounded-2xl rounded-bl-md border border-paper-edge bg-paper text-ink'
          "
        >
          {{ m.text }}
        </div>
      </div>

      <!-- typing indicator -->
      <div v-if="typing" class="flex justify-start">
        <div
          class="flex items-center gap-1 rounded-2xl rounded-bl-md border border-paper-edge bg-paper px-4 py-3.5"
        >
          <span class="h-1.5 w-1.5 animate-dot rounded-full bg-ink-soft" />
          <span class="h-1.5 w-1.5 animate-dot rounded-full bg-ink-soft [animation-delay:0.2s]" />
          <span class="h-1.5 w-1.5 animate-dot rounded-full bg-ink-soft [animation-delay:0.4s]" />
        </div>
      </div>
    </div>

    <!-- code input -->
    <footer v-if="showInput" class="animate-rise border-t border-paper-edge px-4 py-4">
      <p class="mb-3 text-center font-sans text-[12px] tracking-wide text-ink-soft">
        Enter your {{ SMS.codeLength }}-digit order code
      </p>
      <div class="flex items-center gap-3">
        <div class="relative flex-1">
          <!-- transparent input drives the visible cells below -->
          <input
            ref="inputEl"
            :value="code"
            type="text"
            inputmode="numeric"
            autocomplete="one-time-code"
            aria-label="Order code"
            :maxlength="SMS.codeLength"
            :disabled="busy || finished"
            class="absolute inset-0 h-full w-full cursor-text opacity-0"
            @input="onInput"
            @keyup.enter="submit"
          />
          <div class="pointer-events-none flex justify-center gap-2.5">
            <div
              v-for="i in SMS.codeLength"
              :key="i"
              class="flex h-12 w-11 items-center justify-center border-b-2 font-mono text-[22px] text-ink transition-colors"
              :class="code.length === i - 1 && !finished ? 'border-vermilion' : 'border-paper-edge'"
            >
              {{ code[i - 1] ?? '' }}
            </div>
          </div>
        </div>
        <button
          class="cursor-pointer rounded-md bg-vermilion px-5 py-3 font-sans text-[14px] font-bold text-white transition active:opacity-80 disabled:cursor-default disabled:opacity-40"
          :disabled="code.length < SMS.codeLength || busy || finished"
          @click="submit"
        >
          Valider
        </button>
      </div>
    </footer>
  </div>
</template>
