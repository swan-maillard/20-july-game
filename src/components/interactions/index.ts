import type { Component } from 'vue'
import SmsInteraction from './SmsInteraction.vue'
import CoffeeInteraction from './CoffeeInteraction.vue'
import MapInteraction from './MapInteraction.vue'
import BoulderInteraction from './BoulderInteraction.vue'
import RiddleInteraction from './RiddleInteraction.vue'
import PlaceholderInteraction from './PlaceholderInteraction.vue'

/* ============================================================================
   INTERACTION REGISTRY.

   Maps an interactive scene's `key` (used in data/story.ts) to the component
   that plays it. Every interaction must emit `done` when the player completes
   it. Scene `props` are forwarded to the component.
   ========================================================================== */
export const INTERACTIONS: Record<string, Component> = {
  sms: SmsInteraction,
  coffee: CoffeeInteraction,
  map: MapInteraction,
  boulder: BoulderInteraction,
  riddle: RiddleInteraction,
  placeholder: PlaceholderInteraction,
}
