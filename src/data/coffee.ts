/* ============================================================================
   The coffee interaction: dial in heat / water / duration to match the recipe.

   PLACEHOLDER — replace the recipe text and the `answer` with your own.
   Hint mechanic: the recipe is plain prose, but the first letter of each word
   in a line spells out a clue. Write the lines so the acrostic reveals (or
   points at) the right numbers.
   ========================================================================== */
export const COFFEE = {
  /** Lines of the recipe shown to the player (the puzzle text). */
  recipe: [
    'Heat each tray to three.',
    'Two hundred fifty in.',
    'Wait thirty, savour slowly.',
  ],

  /** The settings the player must dial in to brew it right. */
  answer: { heat: 3, water: 250, duration: 30 },

  /** Control ranges (min, max, step) and display unit. */
  heat: { min: 1, max: 5, step: 1, unit: '' },
  water: { min: 150, max: 400, step: 10, unit: 'ml' },
  duration: { min: 10, max: 60, step: 5, unit: 's' },
}
