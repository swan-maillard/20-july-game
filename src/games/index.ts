import type { Component } from 'vue'
import PlaceholderGame from '../components/PlaceholderGame.vue'

/* ============================================================================
   GAME REGISTRY.

   Map a `gameKey` (used in story.ts) to the component that plays it.
   Every game component must accept a `title` prop and emit `solve` when won.
   ========================================================================== */
export const GAMES: Record<string, Component> = {
  placeholder: PlaceholderGame,
}
