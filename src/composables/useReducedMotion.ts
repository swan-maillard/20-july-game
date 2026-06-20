import { onMounted, onUnmounted, ref } from 'vue'

/** Reactively tracks the user's `prefers-reduced-motion` setting. */
export function useReducedMotion() {
  const reduced = ref(false)
  let mq: MediaQueryList | null = null

  const update = (e: MediaQueryListEvent | MediaQueryList) => {
    reduced.value = e.matches
  }

  onMounted(() => {
    mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    reduced.value = mq.matches
    mq.addEventListener?.('change', update)
  })

  onUnmounted(() => mq?.removeEventListener?.('change', update))

  return reduced
}
