import type { Character } from '../types'
import MarieHappy from '../assets/marie/happy.png'
import MarieThinking from '../assets/marie/thinking.png'
import MarieSleepy from '../assets/marie/sleepy.png'
import MarieProud from '../assets/marie/proud.png'
import MarieDrinkingCoffee from '../assets/marie/drinking-coffee.png'
import MarieBadCoffee from '../assets/marie/bad-coffee.png'
import MarieGoodCoffee from '../assets/marie/good-coffee.png'
import MarieSad from '../assets/marie/sad.png'

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
    accent: '#326de3',
    portraits: {
      happy: MarieHappy,
      thinking: MarieThinking,
      sleepy: MarieSleepy,
      proud: MarieProud,
      drinkingCoffee: MarieDrinkingCoffee,
      badCoffee: MarieBadCoffee,
      goodCoffee: MarieGoodCoffee,
      sad: MarieSad,
    },
  },
  swan: {
    name: 'Swan',
    side: 'right',
    accent: 'rgb(211, 178, 0)',
    portraits: {
      thinking: '',
      badCoffee: '',
      drinkingCoffee: '',
      sleepy: '',
      scared: '',
      happy: '',
      sad: ''
    },
  },
}
