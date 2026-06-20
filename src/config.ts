import type { Character } from './types'

/** Show a "skip" button on every game while building. Set to false to ship. */
export const DEV_SKIP = true

export const CHARACTERS: Record<string, Character> = {
  marie: {
    name: 'Marie',
    side: 'left',
    accent: '#d2552f',
    portraits: {
      neutral: '',
      happy: '',
      thinking: '',
      sleepy: '',
      surprised: '',
      proud: '',
    },
  },
  pigeon: {
    name: 'pigeon',
    side: 'right',
    accent: '#2f6b9a',
    portraits: {
      neutral: '',
      happy: '',
    },
  },
}

/** The closing screen. */
export const END = {
  title: 'The End',
  subtitle: 'Swap this out for your own ending.',
}
