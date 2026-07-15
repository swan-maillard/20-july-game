import type { Chapter } from '../types'
import PhonePosten from '../assets/bg/phone-posten.png'
import Postit from '../assets/bg/postit.png'
import Cabin from '../assets/bg/cabin.png'
import Cup from '../assets/bg/cup.png'
import Moka from '../assets/bg/moka.png'
import CupBad from '../assets/bg/cup-bad.png'
import CupGood from '../assets/bg/cup-good.png'
import Backpack from '../assets/bg/backpack.png'
import SunMountain from '../assets/bg/sun-mountain.png'
import MapImg from '../assets/bg/map.png'
import MapX from '../assets/bg/map-x.png'
import MapMessy from '../assets/bg/map-messy.png'
import MapPin from '../assets/bg/map-pin.png'
import Bed from '../assets/bg/bed.png'
import Boulder from '../assets/bg/boulder.png'
import Rope from '../assets/bg/rope.png'
import Slip from '../assets/bg/slip.png'
import Summit from '../assets/bg/summit.png'
import Door from '../assets/bg/door.png'
import PostitX from '../assets/bg/postit-x.png'
import PostitMusic from '../assets/bg/postit-music.png'

/* ============================================================================
   THE STORY.

   A list of chapters; each chapter is an ordered list of scenes. The engine
   plays scenes start to finish, advancing when a scene emits `done`, then
   rolls into the next chapter.

   Scene shapes:
     { type: 'dialog', lines: [ … ] }
       line: { kind: 'say', who: <character id>, mood?: <mood>, text: '…', image? }
             { kind: 'note', text: '…' }                    // narrator card
     { type: 'interactive', key: '<registry key>', props?: { … } }   // sms, games…
     { type: 'screen', variant?, kicker?, title, body?, action? }     // title/end/…

   `key` for interactive scenes maps to a component in
   src/components/interactions/index.ts. `image` puts a centred illustration
   behind the bubble (see src/assets/bg).
   ========================================================================== */
export const STORY: Chapter[] = [
  {
    id: 'prologue',
    title: 'プロローグ',
    scenes: [
      {
        type: 'screen',
        kicker: '7月20日',
        title: 'July, 20th',
        body: 'The journey of a cheeky lady.',
        action: 'Let\'s go',
      },
      { type: 'interactive', key: 'sms' },
      {
        type: 'dialog',
        lines: [
          { kind: 'say', who: 'marie', mood: 'thinking', text: 'I completely forgot about this package!! What was the code again?', image: PhonePosten },
          { kind: 'say', who: 'marie', mood: 'sleepy', text: 'Ah I remember now, I wrote it on a post-it.', image: Postit },
          { kind: 'say', who: 'marie', mood: 'sad', text: '...and then I forgot the post-it on a cabin last time...', image: Cabin },
          { kind: 'say', who: 'swan', mood: 'sad', text: 'Typisk!!', image: Cabin },
        ],
      },
    ],
  },
  {
    id: 'coffee',
    title: 'コーヒータイム',
    scenes: [
      {
        type: 'screen',
        kicker: 'コーヒータイム',
        title: 'Chapter 1',
        body: 'Coffee Time',
        action: 'Let\'s go',
      },
      {
        type: 'dialog',
        lines: [
          { kind: 'say', who: 'marie', mood: 'sad', text: 'So annoying, I have to go back to the cabin...', image: Cabin },
          { kind: 'say', who: 'marie', mood: 'sleepy', text: 'But first, I need my daily cup of coffee!', image: Cup },
          { kind: 'say', who: 'marie', mood: 'sleepy', text: 'Let\'s try this new coffee recipe I got.', image: Moka },
          { kind: 'say', who: 'swan', mood: 'thinking', text: 'The recipe does not look very helpful...', image: Moka },
        ],
      },
      // The brew. Success jumps past the retry dialog; failure jumps to it.
      {
        type: 'interactive',
        key: 'coffee',
        id: 'brew',
        props: { title: 'Make yourself a cheeky cup of coffee', onSuccess: 'coffee-good', onFail: 'coffee-bad' },
      },
      // Failure: complain, then `goto` loops back to the brew to try again.
      {
        type: 'dialog',
        id: 'coffee-bad',
        goto: 'brew',
        lines: [
          { kind: 'say', who: 'marie', mood: 'drinkingCoffee', text: 'SLUUURP', image: Cup },
          { kind: 'say', who: 'swan', mood: 'drinkingCoffee', text: 'SLUUURP', image: Cup },
          { kind: 'say', who: 'marie', mood: 'badCoffee', text: 'Ew this coffee is really bad. Usually I would drink it, but I need good coffee right now.', image: CupBad },
          { kind: 'say', who: 'swan', mood: 'badCoffee', text: 'C\'est pas bon du tout ! Mais pourquoi t\'as fait ça ?', image: CupBad },
          { kind: 'say', who: 'swan', mood: 'thinking', text: 'You shouldn\'t wing the values, it is a very precise science!', image: CupBad },
          { kind: 'say', who: 'marie', mood: 'sleepy', text: 'Ok ok I\'ll do it again.', image: CupBad },
        ],
      },
      // Success: last scene of the chapter, so it flows on to the next one.
      {
        type: 'dialog',
        id: 'coffee-good',
        lines: [
          { kind: 'say', who: 'marie', mood: 'drinkingCoffee', text: 'SLUUURP', image: Cup },
          { kind: 'say', who: 'swan', mood: 'drinkingCoffee', text: 'SLUUURP', image: Cup },
          { kind: 'say', who: 'marie', mood: 'proud', text: 'Now THAT is a good coffee! I am one satisfied woman.', image: CupGood },
          { kind: 'say', who: 'swan', mood: 'goodCoffee', text: 'And I am one satisfied man.', image: CupGood },
        ],
      },
    ],
  },
  // ── The route ────────────────────────────────────────────────────────────
  {
    id: 'route',
    title: '道迷い',
    scenes: [
      {
        type: 'screen',
        kicker: '道迷い',
        title: 'Chapter 2',
        body: 'Navigation struggles',
        action: 'Let\'s go',
      },
      {
        type: 'dialog',
        lines: [
          { kind: 'say', who: 'marie', mood: 'happy', text: 'Let\'s go to the cabin!', image: Backpack },
          { kind: 'say', who: 'marie', mood: 'happy', text: 'This is a great opportunity to make the most of this beautiful weather!', image: SunMountain },
          { kind: 'say', who: 'marie', mood: 'thinking', text: '...wait. What cabin was it again?', image: MapImg },
          { kind: 'say', who: 'swan', mood: 'thinking', text: 'Remember, we used a map to get to the cabin, I think I still have it in my bag.', image: MapImg },
          { kind: 'say', who: 'marie', mood: 'sleepy', text: 'Look at this map, you made such a mess of it!! We\'ll spend hours figuring the path now...', image: MapMessy },
        ],
      },
      // Route puzzle: reassemble the map, then name the place. A wrong name jumps
      // to the fail dialog, which loops back to a fresh map.
      {
        type: 'interactive',
        key: 'map',
        id: 'map-puzzle',
        props: { title: 'Put some order on the map to find your way.', onSuccess: 'route-good', onFail: 'route-bad' },
      },
      // Wrong place: rethink, then `goto` loops back to the map.
      {
        type: 'dialog',
        id: 'route-bad',
        goto: 'map-puzzle',
        lines: [
          { kind: 'say', who: 'swan', mood: 'scared', text: 'I am 100% confident I never went there with you. Which man did you go there with??', image: MapX },
          { kind: 'say', who: 'marie', mood: 'sleepy', text:'...', image: MapX },
          { kind: 'say', who: 'swan', mood: 'sleepy', text:'Just kidding! Anyway let\'s find the real cabin.', image: MapX },
        ],
      },
      // Right place: last scene of the chapter, flows on to the next.
      {
        type: 'dialog',
        id: 'route-good',
        lines: [
          { kind: 'say', who: 'marie', mood: 'happy', text: 'Yes it was this cabin, I remember now! Let\'s get ready.', image: MapPin },
          { kind: 'say', who: 'swan', mood: 'sleepy', text: 'Oh no, I wanted to chill at home.', image: Bed },
          { kind: 'say', who: 'marie', mood: 'sleepy', text: 'No.', image: MapPin },
        ],
      },
    ],
  },
  // ── Boulder ────────────────────────────────────────────────────────────
  {
    id: 'boulder',
    title: '登山セッション',
    scenes: [
      {
        type: 'screen',
        kicker: '登山セッション',
        title: 'Chapter 3',
        body: 'Climbing session',
        action: 'Let\'s go',
      },
      {
        type: 'dialog',
        lines: [
          { kind: 'say', who: 'marie', mood: 'sad', text: 'A boulder has fallen on the trail! It blocks the whole path.', image: Boulder },
          { kind: 'say', who: 'swan', mood: 'scared', text: 'OH NO! Then, we need to go back home and chill.', image: Boulder },
          { kind: 'say', who: 'marie', mood: 'thinking', text: 'Let\'s not panic. I have done the Brattkortkurs, it should be easy!', image: Rope },
          
        ],
      },
      // Boulder game: memorise 3 coloured routes, they grey out, then climb the
      // given colour from the bottom. Two slips = a fall. Layout is random.
      {
        type: 'interactive',
        key: 'boulder',
        id: 'boulder-climb',
        props: { title: 'Climb the boulder', onSuccess: 'boulder-good', onFail: 'boulder-bad' },
      },
      // Fell: complain, then `goto` loops back to a fresh climb.
      {
        type: 'dialog',
        id: 'boulder-bad',
        goto: 'boulder-climb',
        lines: [
          { kind: 'say', who: 'marie', mood: 'sad', text: ' Aaah I slipped!!', image: Slip },
          { kind: 'say', who: 'swan', mood: 'thinking', text: 'We need to read the route and not go by instinct only!', image: Boulder },
          { kind: 'say', who: 'marie', mood: 'thinking', text: 'Let\'s try again.', image: Rope },
        ],
      },
      // Sent it: last scene of the chapter, flows on to the next.
      {
        type: 'dialog',
        id: 'boulder-good',
        lines: [
          { kind: 'say', who: 'marie', mood: 'proud', text: 'Made it!! First try. ...Mostly.', image: Summit },
          { kind: 'say', who: 'swan', mood: 'happy', text: 'I can see the cabin!!', image: Cabin },
        ],
      },
    ],
  },

  // ── The cabin: the riddle + sending the code ─────────────────────────────
  {
    id: 'cabin',
    title: '捜索',
    scenes: [
      {
        type: 'screen',
        kicker: '捜索',
        title: 'Chapter 4',
        body: 'The search',
        action: 'Let\'s go',
      },
      {
        type: 'dialog',
        lines: [
          { kind: 'say', who: 'marie', mood: 'happy', text: 'We finally made it!', image: Door },
          { kind: 'say', who: 'marie', mood: 'thinking', text: 'The post-it is in here somewhere... But where did I leave it?', image: Postit },
          { kind: 'say', who: 'swan', mood: 'thinking', text: 'Look we also forgot this post-it last time when doing our Disney karaoke.', image: PostitMusic },
          { kind: 'say', who: 'swan', mood: 'sad', text: 'But I don\'t find the post-it for the code...', image: Postit },
          { kind: 'say', who: 'marie', mood: 'thinking', text: 'Show me this post-it, maybe I\'ll suddenly remember.', image: PostitMusic },
        ],
      },
      // The riddle note. "Found the post-it" opens the SMS again.
      {
        type: 'interactive',
        key: 'riddle',
        id: 'riddle',
      },
      {
        type: 'dialog',
        lines: [
          { kind: 'say', who: 'marie', mood: 'proud', text: 'Yay I remembered where the post-it was!', image: Postit },
          { kind: 'say', who: 'marie', mood: 'thinking', text: 'I can now see if the code is correct.', image: PhonePosten },
        ],
      },
      // Re-open the SMS in "final" mode (direct messages, correct code known).
      // Correct -> success -> epilogue; two fails -> back to the riddle.
      {
        type: 'interactive',
        key: 'sms',
        id: 'send-code',
        props: { onSuccess: 'end', onFail: 'failed-code' },
      },
      {
        type: 'dialog',
        id: 'failed-code',
        lines: [
          { kind: 'say', who: 'marie', mood: 'sad', text: 'It might be that I haven\'t found the correct post-it actually... Let\'s think again.', image: PostitX },
        ],
        goto: 'riddle'
      },
    ],
  },

  {
    id: 'epilogue',
    scenes: [
      {
        type: 'screen',
        id: 'end',
        kicker: 'おめでとう',
        title: 'Congratulations!',
        body: 'You can now go to the post office and get your package! Happy birthday <3',
        // no action -> terminal scene
      },
    ],
  },
]
