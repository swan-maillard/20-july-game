/* ============================================================================
   Core types for the story framework.
   ========================================================================== */

/** A character's expression. Free-form string — add as many moods as you like;
 *  each one maps to an optional portrait image in the character config. */
export type Mood = string

/** A single talking character (see CHARACTERS in config.ts). */
export interface Character {
  /** Name printed on the bubble's name tab. */
  name: string
  /** Which edge of the stage this character + their bubble sit on. */
  side?: 'left' | 'right'
  /** Accent colour for the name tab (any CSS colour). */
  accent?: string
  /** mood -> cut-out portrait image URL. Missing / "" => labelled placeholder. */
  portraits?: Partial<Record<Mood, string>>
}

/** A spoken line, attributed to one of the CHARACTERS. */
export interface SayLine {
  kind: 'say'
  /** id of the speaking character in CONFIG.characters */
  who: string
  mood?: Mood
  text: string
}

/** A narrator / message card (no character). */
export interface NoteLine {
  kind: 'note'
  text: string
}

export type Line = SayLine | NoteLine

/** One step of the story: some intro lines, a game, then some outro lines. */
export interface Chapter {
  id: string
  /** Short label shown unobtrusively at the top while this chapter plays. */
  title: string
  /** Selects which game component appears (see the GAMES registry in games/). */
  gameKey: string
  intro: Line[]
  outro: Line[]
}
