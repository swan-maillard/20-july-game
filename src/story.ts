import type { Chapter } from './types'

/* ============================================================================
   THE STORY.

   Each chapter plays out as:  intro lines  ->  game  ->  outro lines.
   Line shapes:
     { kind: 'say',  who: <character id>, mood?: <mood>, text: '…' }
     { kind: 'note', text: '…' }                      // narrator / message card

   `gameKey` picks a component from the GAMES registry (src/games/index.ts).
   ========================================================================== */
export const STORY: Chapter[] = [
  {
    id: 'one',
    title: 'Chapter One',
    gameKey: 'placeholder',
    intro: [
      { kind: 'note', text: 'A short framing note — this is where you set the scene.' },
      { kind: 'say', who: 'marie', mood: 'surprised', text: 'Oh — hi! This is a speech bubble. Tap it to continue.' },
      { kind: 'say', who: 'pigeon', mood: 'happy', text: 'And this is a different character, talking from the other side.' },
      { kind: 'say', who: 'marie', mood: 'thinking', text: 'Below me is a placeholder game. Build your own in its place.' },
    ],
    outro: [
      { kind: 'say', who: 'marie', mood: 'happy', text: 'Nice — game cleared. On to the next chapter.' },
    ],
  },
  {
    id: 'two',
    title: 'Chapter Two',
    gameKey: 'placeholder',
    intro: [
      { kind: 'say', who: 'marie', mood: 'neutral', text: 'Every chapter is intro lines, then a game, then outro lines.' },
    ],
    outro: [
      { kind: 'say', who: 'pigeon', mood: 'happy', text: 'That was the last chapter — the end screen comes next.' },
    ],
  },
]
