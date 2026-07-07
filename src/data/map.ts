/* ============================================================================
   The map interaction: a jigsaw of the map (map.jpg, via headbreaker), plus
   an input where the player writes the name of the cabin's place.

   PLACEHOLDER — set `answer` to the real place name. Matching is
   case-insensitive and trims surrounding spaces.
   ========================================================================== */
export const MAP = {
  /** Correct name of the place where the cabin is. */
  answer: 'Trolltunga', // TODO: set the real place name

  /** Jigsaw grid for the map puzzle. */
  pieces: { horizontal: 4, vertical: 4 },
}
