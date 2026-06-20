# Story Framework

A blank white-canvas framework with one keepable mechanic: **typewriter speech
bubbles for multiple characters**, driven by a small chapter-based story engine.
Everything decorative (themes, backdrops, progress trail, icons, code logic) has
been stripped out — what's left is structure to build on.

Built with **Vite + Vue 3 + TypeScript + Tailwind CSS v4**.

## Run it

```bash
npm install
npm run dev        # start the dev server
npm run build      # type-check (vue-tsc) + production build
npm run typecheck  # type-check only
```

## How it flows

`title screen → [ chapter: intro lines → game → outro lines ] × N → end screen`

State lives in [src/App.vue](src/App.vue). A chapter advances on tap.

## Where to edit

| You want to…                 | Edit                                                  |
| ---------------------------- | ----------------------------------------------------- |
| Write the story / dialogue   | [src/story.ts](src/story.ts)                          |
| Add / restyle characters     | [src/config.ts](src/config.ts)                        |
| Build a real game            | copy [src/components/PlaceholderGame.vue](src/components/PlaceholderGame.vue), register it in [src/games/index.ts](src/games/index.ts) |
| Change the title / end screen | [src/components/TitleScreen.vue](src/components/TitleScreen.vue), [src/components/EndScreen.vue](src/components/EndScreen.vue) |
| Tweak bubble look / tokens   | [src/style.css](src/style.css) (`@theme` block)       |

### Characters

Add an entry to `CHARACTERS` in `config.ts`, then reference it by key from a line:

```ts
{ kind: 'say', who: 'aiko', mood: 'happy', text: 'Hello!' }
```

- `side` (`'left'` | `'right'`) places the portrait and points the bubble tail.
- `accent` colours the name tab.
- `portraits` maps a mood to a cut-out PNG url; empty shows a labelled placeholder.

A `{ kind: 'note', text }` line renders a narrator card instead of a character.

### Games

A game is any component that takes a `title` prop and emits `solve` when won.
Register it under a key in `src/games/index.ts` and set that key as a chapter's
`gameKey` in `story.ts`. Set `DEV_SKIP = false` in `config.ts` to hide the skip
button before shipping.
