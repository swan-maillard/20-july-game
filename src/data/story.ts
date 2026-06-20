import type { Chapter } from '../types'

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
    // no title -> no chapter label during these scenes
    scenes: [
      {
        type: 'screen',
        variant: 'title',
        kicker: 'July, 20th',
        title: 'The ordinary adventure...',
        body: '...of an extraordinary woman',
        action: 'さあ行こう',
      },
      { type: 'interactive', key: 'sms' },
    ],
  },
  {
    id: 'cabin',
    title: 'The Cabin',
    scenes: [
      {
        type: 'dialog',
        lines: [
          { kind: 'say', who: 'marie', mood: 'thinking', text: 'An order code. Right. I definitely had one of those.' },
          { kind: 'say', who: 'marie', mood: 'sleepy', text: 'I even wrote it on a post-it so I wouldn’t forget it. Very responsible of me.' },
          { kind: 'say', who: 'marie', mood: 'surprised', text: '…and then I left the post-it at the cabin. Last weekend. Of course I did.' },
          { kind: 'say', who: 'pigeon', mood: 'happy', text: 'Coo. (Translation: road trip.)' },
          { kind: 'say', who: 'marie', mood: 'neutral', text: '…thanks. Okay — back up the mountain. Let’s go find that note.' },
        ],
      },
      { type: 'interactive', key: 'placeholder', props: { title: 'Search the cabin' } },
      {
        type: 'dialog',
        lines: [
          { kind: 'say', who: 'marie', mood: 'happy', text: 'There it is. The post-it. I knew past-me loved me a little.' },
        ],
      },
    ],
  },
  {
    id: 'two',
    title: 'Chapter Two',
    scenes: [
      {
        type: 'dialog',
        lines: [
          { kind: 'say', who: 'marie', mood: 'neutral', text: 'Each chapter is just a run of scenes: dialog, an interaction, more dialog.' },
        ],
      },
      { type: 'interactive', key: 'placeholder' },
      {
        type: 'dialog',
        lines: [
          { kind: 'say', who: 'pigeon', mood: 'happy', text: 'That was the last chapter — the ending comes next.' },
        ],
      },
    ],
  },
  {
    id: 'epilogue',
    scenes: [
      {
        type: 'screen',
        variant: 'end',
        kicker: 'すばらしい',
        title: 'Congratulations',
        body: 'You can know go to the post office and get your package! Happy birthday :)',
        // no action -> terminal scene
      },
    ],
  },
]
