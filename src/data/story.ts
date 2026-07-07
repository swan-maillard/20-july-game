import type { Chapter } from '../types'
import PhonePosten from '../assets/phone-posten.svg'

/* ============================================================================
   THE STORY.

   A list of chapters; each chapter is an ordered list of scenes. The engine
   plays scenes start to finish, advancing when a scene emits `done`, then
   rolls into the next chapter.

   Scene shapes:
     { type: 'dialog', lines: [ … ] }
       line: { kind: 'say', who: <character id>, mood?: <mood>, text: '…' }
             { kind: 'note', text: '…' }                    // narrator card
     { type: 'interactive', key: '<registry key>', props?: { … } }   // sms, games…
     { type: 'screen', variant?, kicker?, title, body?, action? }     // title/end/…

   `key` for interactive scenes maps to a component in
   src/components/interactions/index.ts.
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
        body: 'The ordinary adventure of an extraordinary woman.',
        action: 'Let\s go',
      },
      { type: 'interactive', key: 'sms' },
      {
        type: 'dialog',
        lines: [
          { kind: 'say', who: 'marie', mood: 'thinking', text: 'I completely forgot about this package!! What was the code again?', image: PhonePosten },
          { kind: 'say', who: 'marie', mood: 'sleepy', text: 'Ah I remember now, I wrote it on a post-it.', image: PhonePosten },
          { kind: 'say', who: 'marie', mood: 'surprised', text: '...and then I forgot the post-it on a cabin last time...', image: PhonePosten },
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
          { kind: 'say', who: 'marie', mood: 'neutral', text: 'So annoying, I have to go back to the cabin...' },
          { kind: 'say', who: 'marie', mood: 'sleepy', text: 'But first, I need my daily cup of coffee!' },
          { kind: 'say', who: 'marie', mood: 'sleepy', text: 'Let\'s try this new coffee recipe I got.' },
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
          { kind: 'say', who: 'marie', mood: 'surprised', text: 'Ew this coffee is really bad. Usually I would drink it, but I need good coffee right now.' },
          { kind: 'say', who: 'swan', mood: 'disgusted', text: 'C\'est pas bon du tout ! Mais pourquoi t\'as fait ça ?' },
          { kind: 'say', who: 'marie', mood: 'neutral', text: 'Ok ok I\'ll do it again.' },

        ],
      },
      // Success: last scene of the chapter, so it flows on to the next one.
      {
        type: 'dialog',
        id: 'coffee-good',
        lines: [
          { kind: 'say', who: 'marie', mood: 'drinking', text: 'SLUUURP' },
          { kind: 'say', who: 'marie', mood: 'happy', text: 'Now THAT is a good coffee! I am one satisfied woman.' },
          { kind: 'say', who: 'marie', mood: 'thinking', text: 'So, what was the ' },
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
          { kind: 'say', who: 'marie', mood: 'happy', text: 'Let\'s go to the cabin!' },
          { kind: 'say', who: 'marie', mood: 'happy', text: 'This is a great opportunity to make the most of this beautiful weather!' },
          { kind: 'say', who: 'marie', mood: 'thinking', text: '...wait. What cabin was it again?' },
          { kind: 'say', who: 'swan', mood: 'idea', text: 'Remember, we used a map to get to the cabin, I think I still have it in my bag.' },
          { kind: 'say', who: 'marie', mood: 'surprised', text: 'Look at this map, you made such a mess of it!! We\'ll spend hours figuring the path now...' },
        ],
      },
      // Route puzzle: reassemble the map jigsaw, then name the cabin's place.
      {
        type: 'interactive',
        key: 'map',
        props: { title: 'Put some order on the maps to find your way.' },
      },
      {
        type: 'dialog',
        lines: [
          { kind: 'say', who: 'marie', mood: 'happy', text: 'Yes it was this cabin, I remember now! Let\'s get ready.' },
          { kind: 'say', who: 'swan', mood: 'tired', text: 'I wanted to chill at home.' },
          { kind: 'say', who: 'marie', mood: 'neutral', text: 'No.' },
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
          { kind: 'say', who: 'marie', mood: 'surprised', text: 'A boulder has fallen on the trail! It blocks the whole path.' },
          { kind: 'say', who: 'marie', mood: 'thinking', text: 'Let\'s not panick. I have did the Brattkorturs, it should be easy!' },
        ],
      },
      // Boulder game (placeholder for now): show 3 coloured routes, 10s to memorise
      // them, they grey out, then climb one — following your colour from the bottom.
      {
        type: 'interactive',
        key: 'placeholder',
        props: { title: 'Memorise the three coloured routes (10s). They grey out — then climb one, following your colour from the bottom.' },
      },
      {
        type: 'dialog',
        lines: [
          { kind: 'say', who: 'marie', mood: 'proud', text: 'Sent it. First try. …Mostly.' },
        ],
      },
    ],
  },

  // ── The cabin: the riddle + sending the code ─────────────────────────────
  {
    id: 'cabin',
    title: 'ついに',
    scenes: [
      {
        type: 'screen',
        kicker: 'ついに',
        title: 'Chapter 4',
        body: 'Finally',
        action: 'Let\'s go',
      },
      {
        
        type: 'dialog',
        lines: [
          { kind: 'say', who: 'marie', mood: 'neutral', text: 'There it is. The cabin. We actually made it.' },
          { kind: 'say', who: 'marie', mood: 'thinking', text: 'The post-it is in here somewhere… but where did I hide it?' },
          { kind: 'say', who: 'marie', mood: 'surprised', text: 'A riddle. To myself. Past-me was feeling clever.' },
        ],
      },
      // Riddle (placeholder): solving it = finding the REAL post-it hidden in the
      // cabin you're standing in. "Send the code" then opens the SMS again.
      {
        type: 'interactive',
        key: 'placeholder',
        id: 'riddle',
        goto: 'send-code',
        props: {
          title: 'Where did past-you hide it? Solve the riddle — the post-it is tucked away in the very cabin you are standing in. Find it, then send the code.',
          button: 'Send the code',
        },
      },
      // Re-open the SMS in "final" mode. Correct code -> success -> epilogue.
      // Out of tries -> back to the riddle to look again.
      {
        type: 'interactive',
        key: 'sms',
        id: 'send-code',
        props: { answer: '0720', onSuccess: 'end', onFail: 'riddle' }, // TODO: set the real code
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
