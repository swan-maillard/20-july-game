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
  /** Optional prop image shown centred on the stage while this line plays. */
  image?: string
}

/** A narrator / message card (no character). */
export interface NoteLine {
  kind: 'note'
  text: string
  /** Optional prop image shown centred on the stage while this line plays. */
  image?: string
}

export type Line = SayLine | NoteLine

/* --- Scene types ---------------------------------------------------------- */

/** Shared by every scene: optional id (so others can jump here) and an optional
 *  `goto` that redirects the story when the scene finishes (instead of the next
 *  scene in order). A scene can also be jumped to dynamically — an interaction
 *  may emit `done` with a target id (see CoffeeInteraction). */
interface SceneBase {
  /** Stable id so other scenes / interactions can jump to this one. */
  id?: string
  /** When this scene finishes with no explicit target, jump to this scene id
   *  instead of advancing to the next scene. */
  goto?: string
}

/** A run of speech bubbles / notes. Tap to advance; done after the last line. */
export interface DialogScene extends SceneBase {
  type: 'dialog'
  lines: Line[]
}

/** A pluggable interactive bit (the SMS, a mini-game, a puzzle). The matching
 *  component is looked up by `key` in the INTERACTIONS registry and emits
 *  `done` when the player completes it (optionally with a target id to jump to). */
export interface InteractiveScene extends SceneBase {
  type: 'interactive'
  key: string
  /** Optional props forwarded to the interactive component. */
  props?: Record<string, unknown>
}

/** A centred, full-bleed message: title, ending, or an interstitial. */
export interface ScreenScene extends SceneBase {
  type: 'screen'
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
