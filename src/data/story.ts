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
        variant: 'title',
        kicker: '7月20日',
        title: 'July, 20th',
        body: 'The ordinary adventure of an extraordinary woman.',
        action: 'Let\s go',
      },
      { type: 'interactive', key: 'sms' },
      {
        type: 'dialog',
        lines: [
          { kind: 'say', who: 'marie', mood: 'thinking', text: 'An order code. Right. I definitely had one of those.', image: PhonePosten },
          { kind: 'say', who: 'marie', mood: 'sleepy', text: 'I even wrote it on a post-it so I wouldn’t forget it. Very responsible of me.', image: PhonePosten },
          { kind: 'say', who: 'marie', mood: 'surprised', text: '…and then I left the post-it at the cabin. Last weekend. Of course I did.', image: PhonePosten },
          { kind: 'say', who: 'dog', mood: 'happy', text: 'Woof!' },
        ],
      },
    ],
  },
  {
    id: 'coffee',
    title: 'コーヒータイム',
    scenes: [
      {
        type: 'dialog',
        lines: [
          { kind: 'say', who: 'marie', mood: 'neutral', text: 'But now it is 7am, I need to do some coffee.' },
        ],
      },
      // The brew. Success jumps past the retry dialog; failure jumps to it.
      {
        type: 'interactive',
        key: 'coffee',
        id: 'brew',
        props: { title: 'Make the coffee', onSuccess: 'coffee-good', onFail: 'coffee-bad' },
      },
      // Failure: complain, then `goto` loops back to the brew to try again.
      {
        type: 'dialog',
        id: 'coffee-bad',
        goto: 'brew',
        lines: [
          { kind: 'say', who: 'marie', mood: 'surprised', text: 'This coffee is really horrible. I need to do it again.' },
        ],
      },
      // Success: last scene of the chapter, so it flows on to the next one.
      {
        type: 'dialog',
        id: 'coffee-good',
        lines: [
          { kind: 'say', who: 'marie', mood: 'happy', text: 'Now THAT is a good cup. Brain: officially online.' },
        ],
      },
    ],
  },
  // ── The route ────────────────────────────────────────────────────────────
  {
    id: 'route',
    title: '航海闘争',
    scenes: [
      {
        type: 'dialog',
        lines: [
          { kind: 'say', who: 'marie', mood: 'happy', text: 'Right — coffee’s in, brain’s on. Let’s get to that cabin.' },
          { kind: 'say', who: 'marie', mood: 'thinking', text: '…wait. Which way was it again?' },
        ],
      },
      // Route puzzle (placeholder for now): a map with several lines — trace the
      // right one to the cabin.
      {
        type: 'interactive',
        key: 'placeholder',
        props: { title: 'Which line leads to the cabin? Trace the right route on the map.' },
      },
      {
        type: 'dialog',
        lines: [
          { kind: 'say', who: 'marie', mood: 'neutral', text: 'That one. Up past the ridge. I remember now.' },
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
        type: 'dialog',
        lines: [
          { kind: 'say', who: 'marie', mood: 'surprised', text: 'A boulder. Right across the trail. Of course.' },
          { kind: 'say', who: 'marie', mood: 'thinking', text: 'Okay — I used to climb. Read the holds, pick a line, commit.' },
          { kind: 'say', who: 'dog', mood: 'happy', text: 'Woof!' },
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
        variant: 'end',
        kicker: 'おめでとう',
        title: 'Congratulations!',
        body: 'You can now go to the post office and get your package! Happy birthday <3',
        // no action -> terminal scene
      },
    ],
  },
]
