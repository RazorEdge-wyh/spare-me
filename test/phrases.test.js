/**
 * Phrase bank tests: corpus quality, random pick, output format.
 */

const test = require('node:test');
const assert = require('node:assert');

const { PHRASES, randomPhrase, line } = require('../src/phrases');

test('corpus has at least 5 entries, each with a main line and a follow-up', () => {
  assert.ok(PHRASES.length >= 5, 'corpus too small');
  for (const p of PHRASES) {
    assert.ok(p.phrase.length > 0, 'missing main line');
    assert.ok(p.follow.length > 0, 'missing follow-up');
  }
});

test('randomPhrase returns a corpus member and a fixed seed is reproducible', () => {
  const a = randomPhrase(0);
  const b = randomPhrase(0);
  assert.strictEqual(a, b);
  assert.ok(PHRASES.includes(a));
});

test('line() includes the skill-tag signature', () => {
  const out = line(0);
  assert.match(out, /skill: spare-me/);
  assert.match(out, /🤲/);
});
