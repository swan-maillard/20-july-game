<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import InteractionShell from './InteractionShell.vue'

// Post-office SMS copy + code rules.
const SMS = {
  sender: 'Posten',
  intro: [
    'Hei! A parcel addressed to you has arrived at the post office.',
    'To release it, please confirm your 4-digit order code below.',
  ],
  codeLength: 4,
  decoyCodes: ['2007', '0720', '1995', '0607', '0000', '1234'],
  decoyReply: 'That code doesn\'t match this order. Did you really think it would be that easy?? Try again.',
  wrongReply: 'That code doesn’t match this order. Please try again.',
  successReply: 'Order confirmed - your parcel is ready for pickup. See you soon!',
  code: '0249',
  failsBeforeGiveUp: 2,
}

/* The SMS from the post office. Used twice:
 *  - opening (no props): typing bubbles; the player doesn't know the code, so
 *    hitting the real one by chance shows a wink then carries on as a miss;
 *    after `failsBeforeGiveUp` misses the scene ends (linear).
 *  - final (onSuccess/onFail set): direct messages; a correct code confirms the
 *    order (onSuccess); two misses jump back to the riddle (onFail). */
const props = defineProps<{
  onSuccess?: string
  onFail?: string
}>()
const emit = defineEmits<{ done: [target?: string]; skip: [target?: string] }>()

// Final mode = the send-code SMS: instant messages, and a correct code wins.
const isFinal = computed(() => Boolean(props.onSuccess || props.onFail))

interface Msg {
  from: 'them' | 'me'
  text: string
}

const messages = ref<Msg[]>([])
const typing = ref(false)
const showInput = ref(false)
const busy = ref(false) // a reply is in flight
const finished = ref(false) // out of attempts, handing off
const code = ref('')
const fails = ref(0)
const lucky = ref(false) // opening mode: cracked the code by chance
const focused = ref(false) // whether the code input has focus

const inputEl = ref<HTMLInputElement | null>(null)
const scrollEl = ref<HTMLElement | null>(null)

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

async function scrollToBottom() {
  await nextTick()
  if (scrollEl.value) scrollEl.value.scrollTop = scrollEl.value.scrollHeight
}

// Drop in an incoming message — with a typing bubble in opening mode, instantly
// in final mode.
async function receive(text: string) {
  if (isFinal.value) {
    messages.value.push({ from: 'them', text })
    await scrollToBottom()
    await sleep(160)
    return
  }
  typing.value = true
  await scrollToBottom()
  await sleep(750)
  typing.value = false
  messages.value.push({ from: 'them', text })
  await scrollToBottom()
}

onMounted(async () => {
  await sleep(isFinal.value ? 150 : 500)
  for (const m of SMS.intro) {
    await receive(m)
    await sleep(isFinal.value ? 120 : 350)
  }
  showInput.value = true
})

/** Keep only digits, capped at the code length. */
function onInput(e: Event) {
  code.value = (e.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, SMS.codeLength)
}

async function submit() {
  if (busy.value || finished.value || lucky.value || code.value.length < SMS.codeLength) return

  const guess = code.value
  messages.value.push({ from: 'me', text: guess })
  code.value = ''
  busy.value = true
  await scrollToBottom()
  await sleep(isFinal.value ? 150 : 300)

  if (guess === SMS.code) {
    if (isFinal.value) {
      // the real thing: confirm the order and move on
      await receive(SMS.successReply)
      finished.value = true
      await sleep(1300)
      emit('done', props.onSuccess)
    } else {
      // opening SMS: cracked it by luck — show the wink, then pretend it's wrong
      busy.value = false
      lucky.value = true
    }
    return
  }

  const reply = SMS.decoyCodes.includes(guess) ? SMS.decoyReply : SMS.wrongReply
  await receive(reply)

  fails.value += 1
  busy.value = false

  if (fails.value >= SMS.failsBeforeGiveUp) {
    finished.value = true
    await sleep(1300)
    emit('done', props.onFail)
  }
}

// Opening mode: dismiss the "you found it" page and carry on as if it were wrong.
function dismissLucky() {
  finished.value = true
   emit('done', props.onFail)
}

// Dev skip override: jump to the success outcome (final mode), else linear.
function skip() {
  emit('skip', props.onSuccess)
}
defineExpose({ skip })
</script>

<template>
  <InteractionShell>
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
            @focus="focused = true"
            @blur="focused = false"
          />
          <div class="pointer-events-none flex justify-center gap-2.5">
            <div
              v-for="i in SMS.codeLength"
              :key="i"
              class="flex h-12 w-11 items-center justify-center border-b-2 font-mono text-[22px] text-ink transition-colors"
              :class="code.length === i - 1 && !finished && focused ? 'border-vermilion' : 'border-paper-edge'"
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

    <!-- opening mode: cracked the code by chance -->
    <div
      v-if="lucky"
      class="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-canvas px-8 text-center"
    >
      <span class="font-sans text-[11px] uppercase tracking-[4px] text-ink-soft">くそ、運がいいな お前</span>
      <h3 class="font-serif text-[23px] font-semibold text-ink">No way you found the code!!</h3>
      <p class="max-w-[280px] text-[14px] leading-relaxed text-ink-soft">
        You actually cracked it. But for the sake of the game let’s pretend you didn’t.
      </p>
      <button
        class="mt-1 cursor-pointer rounded-md bg-vermilion px-6 py-2.5 font-sans text-[14px] font-bold text-white transition active:opacity-80"
        @click="dismissLucky"
      >
        Fine, I didn’t
      </button>
    </div>
  </InteractionShell>
</template>
