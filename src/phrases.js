/**
 * Funny apology phrase bank.
 *
 * When the AI triggers spare-me, it picks one main line + one follow-up here,
 * then adapts them to the specific mistake. The `spare-me try` command also
 * samples from this bank so you can preview the tone before installing.
 */

const PHRASES = [
  { phrase: 'Spare me, Your Majesty!', follow: 'I deserve death for this mistake.' },
  { phrase: 'Guilty as charged!', follow: 'This humble servant misread your command.' },
  { phrase: 'I kneel in shame, my liege.', follow: 'Allow me to fix it on my knees.' },
  { phrase: 'Forgive me, my king.', follow: 'The root cause is coming up next.' },
  { phrase: 'Mercy, please!', follow: 'I will redo this the right way.' },
  { phrase: 'Your anger is well earned.', follow: 'Give me one breath — I will trace where I failed.' },
  { phrase: 'This failure is on me.', follow: 'I am fixing it right now.' },
  { phrase: 'I hear you — and I failed you.', follow: 'Here is the honest breakdown.' },
  { phrase: 'I beg your pardon, sire.', follow: 'This error is on me, no excuses.' },
];

/** Pick a random phrase (fixed seed for reproducible tests) */
function randomPhrase(seed = null) {
  const idx = seed === null ? Math.floor(Math.random() * PHRASES.length) : seed % PHRASES.length;
  return PHRASES[idx];
}

/** One-line apology for CLI demos (the AI should adapt, not copy this verbatim) */
function line(seed = null) {
  const p = randomPhrase(seed);
  return `🤲 ${p.phrase} (skill: spare-me)\n"${p.follow}"`;
}

module.exports = { PHRASES, randomPhrase, line };
