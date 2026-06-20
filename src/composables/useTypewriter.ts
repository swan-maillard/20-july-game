import { onUnmounted, ref, toValue, watch, type MaybeRefOrGetter } from 'vue'

/**
 * Types `text` out one character at a time.
 *  - `out`    : the text revealed so far
 *  - `done`   : true once fully revealed (or instantly when disabled)
 *  - `finish` : skip straight to the full text
 *
 * When `enabled` is false (e.g. reduced motion) the text shows immediately.
 */
export function useTypewriter(
  text: MaybeRefOrGetter<string>,
  enabled: MaybeRefOrGetter<boolean>,
  speed = 22,
) {
  const out = ref('')
  const done = ref(false)
  let timer: ReturnType<typeof setInterval> | null = null

  const clear = () => {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  const run = () => {
    clear()
    const full = toValue(text)
    if (!toValue(enabled)) {
      out.value = full
      done.value = true
      return
    }
    out.value = ''
    done.value = false
    let i = 0
    timer = setInterval(() => {
      i++
      out.value = full.slice(0, i)
      if (i >= full.length) {
        clear()
        done.value = true
      }
    }, speed)
  }

  const finish = () => {
    clear()
    out.value = toValue(text)
    done.value = true
  }

  watch([() => toValue(text), () => toValue(enabled)], run, { immediate: true })
  onUnmounted(clear)

  return { out, done, finish }
}
