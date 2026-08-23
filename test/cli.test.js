/**
 * CLI arg-parsing tests (output printing is not covered here).
 */

const test = require('node:test');
const assert = require('node:assert');

const { parseArgs } = require('../src/cli');

test('parseArgs recognizes init --yes', () => {
  const opts = parseArgs(['init', '--yes']);
  assert.deepStrictEqual(opts._, ['init']);
  assert.ok(opts.flags.has('yes'));
});

test('parseArgs recognizes --dir value', () => {
  const opts = parseArgs(['doctor', '--dir', './my-app']);
  assert.strictEqual(opts.dir, './my-app');
});

test('parseArgs recognizes help / version', () => {
  assert.ok(parseArgs(['--help']).flags.has('help'));
  assert.ok(parseArgs(['-V']).flags.has('version'));
  assert.ok(parseArgs(['help']).flags.has('help'));
});

test('parseArgs ignores unknown flags without treating them as commands', () => {
  const opts = parseArgs(['init', '--foo', 'bar']);
  assert.deepStrictEqual(opts._, ['init', 'bar']);
});
