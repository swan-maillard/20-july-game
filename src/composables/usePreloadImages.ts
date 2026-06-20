import { onMounted, ref, toValue, type MaybeRefOrGetter } from 'vue'

/**
 * Warms the browser cache for a set of image URLs so they render instantly
 * the first time they're shown. References to the Image objects are retained
 * for the lifetime of the calling component so the decoded bitmaps stay warm.
 *
 * @returns `loaded` — a count of images that have finished loading.
 */
export function usePreloadImages(urls: MaybeRefOrGetter<string[]>) {
  const loaded = ref(0)
  const images: HTMLImageElement[] = []

  onMounted(() => {
    for (const url of toValue(urls)) {
      if (!url) continue
      const img = new Image()
      img.onload = () => {
        loaded.value += 1
      }
      img.src = url
      // Decode ahead of time so the later <img> swap is paint-ready.
      void img.decode?.().catch(() => {})
      images.push(img)
    }
  })

  return { loaded }
}
