import { onUnmounted, ref } from 'vue'

/**
 * Loops a background track for the whole session. Browsers block autoplay with
 * sound until the user interacts, so if the first `play()` is rejected we start
 * on the first pointer/key gesture instead.
 *
 * @returns `muted` ref + `toggle()` so a UI control can mute/unmute if wanted.
 */
export function useBackgroundMusic(src: string, volume = 0.3) {
  const audio = new Audio(src)
  audio.loop = true
  audio.volume = volume
  const muted = ref(false)

  function play() {
    audio.play().then(removeGesture).catch(() => {
      /* blocked — wait for a gesture */
    })
  }

  function onGesture() {
    if (!muted.value) play()
  }
  function removeGesture() {
    window.removeEventListener('pointerdown', onGesture)
    window.removeEventListener('keydown', onGesture)
  }

  // Try right away; if the browser blocks it, the first gesture will start it.
  play()
  window.addEventListener('pointerdown', onGesture)
  window.addEventListener('keydown', onGesture)

  function toggle() {
    muted.value = !muted.value
    if (muted.value) audio.pause()
    else play()
  }

  onUnmounted(() => {
    removeGesture()
    audio.pause()
  })

  return { muted, toggle }
}
