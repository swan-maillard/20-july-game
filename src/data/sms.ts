/* ============================================================================
   The opening scene: an SMS from the post office. The player must "confirm"
   an order code before the parcel is released. They don't know it — after a
   couple of failed tries, Marie gives up and the story takes over.
   ========================================================================== */
export const SMS = {
  /** Who the texts come from. */
  sender: 'Posten',
  /** Messages that arrive (one by one) before the code input appears. */
  intro: [
    'Hei! A parcel addressed to you has arrived at the post office.',
    'To release it, please confirm your 4-digit order code below.',
  ],
  /** How many characters the code has. */
  codeLength: 4,
  /** The "obvious" guess and its cheeky reply. */
  decoyCode: '2007',
  decoyReply: 'You didn’t think it would be that easy?',
  /** Reply for any other wrong code. */
  wrongReply: 'That code doesn’t match this order. Please try again.',
  /** Failed attempts before Marie gives up and starts talking. */
  failsBeforeGiveUp: 2,
}
