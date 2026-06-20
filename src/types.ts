/* ============================================================================
   Core types for the scene-based story framework.

   Story  ->  Chapters  ->  Scenes.
   A scene owns a visual and the rule for when it is "done" (which advances the
   story). Everything the player sees — the title, the opening SMS, a line of
   dialogue, a puzzle, the ending — is a scene.
   ========================================================================== */

/** A character's expression. Free-form; each maps to an optional portrait. */
export type Mood = string

/** A single talking character (see CHARACTERS in data/characters.ts). */
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

/* --- Scene types ---------------------------------------------------------- */

/** A run of speech bubbles / notes. Tap to advance; done after the last line. */
export interface DialogScene {
  type: 'dialog'
  lines: Line[]
}

/** A pluggable interactive bit (the SMS, a mini-game, a puzzle). The matching
 *  component is looked up by `key` in the INTERACTIONS registry and emits
 *  `done` when the player completes it. */
export interface InteractiveScene {
  type: 'interactive'
  key: string
  /** Optional props forwarded to the interactive component. */
  props?: Record<string, unknown>
}

/** A centred, full-bleed message: title, ending, or an interstitial. */
export interface ScreenScene {
  type: 'screen'
  /** Visual flavour. 'title' adds the hinomaru mark. */
  variant?: 'title' | 'end' | 'plain'
  kicker?: string
  title: string
  body?: string
  /** Button label. Omit for a terminal screen with no way forward. */
  action?: string
}

export type Scene = DialogScene | InteractiveScene | ScreenScene

/** An ordered run of scenes. */
export interface Chapter {
  id: string
  /** Optional label shown at the top during dialog / interactive scenes. */
  title?: string
  scenes: Scene[]
}
