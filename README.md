# Story Framework

A minimalist, Japanese-flavoured story framework built around one idea:
**everything is a scene.** The title, the opening SMS, a line of dialogue, a
puzzle, the ending — all scenes, played one after another with typewriter
speech bubbles for multiple characters.

Built with **Vite + Vue 3 + TypeScript + Tailwind CSS v4**.

## Run it

```bash
npm install
npm run dev        # start the dev server
npm run build      # type-check (vue-tsc) + production build
npm run typecheck  # type-check only
```

## The model

```
Story  ->  Chapters  ->  Scenes
```

A **chapter** is an ordered list of **scenes**. The engine ([src/App.vue](src/App.vue))
walks scenes start to finish, cross-fading between them and advancing whenever
the current scene emits `done`, then rolls into the next chapter. There are no
special-cased screens — the title and the ending are just `screen` scenes.

### Scene types

| `type`        | What it is                              | Done when…                        |
| ------------- | --------------------------------------- | --------------------------------- |
| `dialog`      | speech bubbles / narrator notes         | the last line is tapped           |
| `interactive` | a pluggable component (the SMS, a game) | the component emits `done`         |
| `screen`      | a centred full-bleed message            | its action button is tapped       |

```ts
{ type: 'dialog', lines: [
    { kind: 'say', who: 'marie', mood: 'happy', text: 'Hi!' },
    { kind: 'note', text: 'A narrator card.' },
] }

{ type: 'interactive', key: 'sms', props: { /* forwarded to the component */ } }

{ type: 'screen', variant: 'title', kicker: 'ものがたり', title: 'The Package',
  body: 'A parcel has arrived.', action: 'Begin' }   // omit action => terminal
```

## Project layout

```
src/
  data/                 all authorable content (edit these)
    characters.ts         the cast + portraits
    story.ts              chapters -> scenes
    sms.ts                config for the SMS interaction
    settings.ts           dev toggles (DEV_SKIP)
    index.ts              barrel — import { CHARACTERS, STORY } from '../data'
  components/
    scenes/               built-in scene types: DialogScene, ScreenScene
    dialogue/             bubble parts: SpeechBubble, NoteCard, CharacterPortrait
    interactions/         pluggable interactions + the registry (index.ts)
  composables/            useTypewriter, useReducedMotion, usePreloadImages
  types.ts                framework types (Scene, Chapter, Line, Character…)
  style.css               Tailwind theme tokens (fonts, colours, animations)
```

## Where to edit

| You want to…                  | Edit                                                                          |
| ----------------------------- | ----------------------------------------------------------------------------- |
| Write / arrange scenes        | [src/data/story.ts](src/data/story.ts)                                        |
| Add / restyle characters      | [src/data/characters.ts](src/data/characters.ts)                              |
| Tweak the opening SMS         | [src/data/sms.ts](src/data/sms.ts)                                            |
| Build a new interaction       | copy [PlaceholderInteraction.vue](src/components/interactions/PlaceholderInteraction.vue), register it in [interactions/index.ts](src/components/interactions/index.ts) |
| Tweak look / fonts / colours  | [src/style.css](src/style.css) (`@theme` block)                               |

### Characters

Add an entry to `CHARACTERS` in [src/data/characters.ts](src/data/characters.ts),
then reference it by key from a `say` line (`who: 'marie'`).

- `side` (`'left'` | `'right'`) places the portrait and points the bubble tail.
- `accent` colours the name tab.
- `portraits` maps a mood to a cut-out PNG url; empty shows a labelled placeholder.

All non-empty portraits are preloaded at startup (`usePreloadImages`) and the
portrait `<img>` stays mounted as the dialogue advances, so images appear
instantly with no flash when the mood changes.

### Interactions

An interaction is any component that emits `done` when the player completes it
(scene `props` are forwarded to it). Register it under a key in
[src/components/interactions/index.ts](src/components/interactions/index.ts) and
point a scene at that key. `InteractionShell` gives you the standard card +
title + the dev "skip" button (toggle `DEV_SKIP` in
[src/data/settings.ts](src/data/settings.ts) before shipping).
