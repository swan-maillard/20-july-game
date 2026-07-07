import type { Character } from '../types'
import MarieNeutral from '../assets/marie-neutral.png'
import MarieHappy from '../assets/marie-happy.png'
import MarieThinking from '../assets/marie-thinking.png'
import MarieSleepy from '../assets/marie-sleepy.png'
import MarieSurprised from '../assets/marie-surprised.png'
import MarieProud from '../assets/marie-proud.png'

/**
 * The cast. Reference a character by key from story lines
 * (`{ kind: 'say', who: 'marie', ... }`). Each mood maps to a cut-out PNG;
 * an empty string falls back to a labelled placeholder.
 *
 * All non-empty portraits are preloaded at startup (see usePreloadImages),
 * so they appear instantly when a bubble shows.
 */
export const CHARACTERS: Record<string, Character> = {
  marie: {
    name: 'Marie',
    side: 'left',
    accent: '#d2552f',
    portraits: {
      neutral: MarieNeutral,
      happy: MarieHappy,
      thinking: MarieThinking,
      sleepy: MarieSleepy,
      surprised: MarieSurprised,
      proud: MarieProud,
      drinking: ''
    },
  },
  swan: {
    name: 'Swan',
    side: 'right',
    accent: '#2f6b9a',
    portraits: {
      disgusted: ''
    },
  },
}
