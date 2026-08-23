/**
 * Memory module tests: file location, append, parse, repeated-mistake stats.
 */

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { memoryPath, TEMPLATE, today, appendEntry, parseEntries, analyze } = require('../src/memory');

const ENTRY_A = { title: 'missed requirement #2', triggerInput: 'You got it wrong AGAIN???', mistake: 'pagination only', fix: 'read requirements item by item', remedy: 'rewrote it' };
const ENTRY_B = { title: 'missed requirement #2', triggerInput: 'You missed it AGAIN!', mistake: 'still pagination only', fix: 'copy out every requirement number', remedy: 'added sorting' };
const ENTRY_C = { title: 'claimed done without testing', triggerInput: 'is the bug fixed?', mistake: 'did not run tests', fix: 'run tests before replying', remedy: 'added tests' };

function tmpDir(name) {
  return fs.mkdtempSync(path.join(os.tmpdir(), `spare-me-${name}-`));
}

test('memoryPath points at .claude/memory/spare-me.md', () => {
  assert.ok(memoryPath('/p').endsWith(path.join('.claude', 'memory', 'spare-me.md')));
});

test('today() outputs YYYY-MM-DD', () => {
  assert.match(today(), /^\d{4}-\d{2}-\d{2}$/);
});

test('TEMPLATE has no live example record (so doctor is honest) but includes the format', () => {
  const entries = parseEntries(TEMPLATE);
  assert.strictEqual(entries.length, 0);
  assert.ok(TEMPLATE.includes('Record format'), 'template should document the record format');
});

test('appendEntry writes and round-trips through parseEntries', () => {
  const dir = tmpDir('append');
  try {
    const file = appendEntry(dir, ENTRY_A);
    assert.ok(fs.existsSync(file));
    const entries = parseEntries(fs.readFileSync(file, 'utf8'));
    assert.strictEqual(entries.length, 1);
    assert.strictEqual(entries[0].reason, 'missed requirement #2');
    assert.strictEqual(entries[0].fields['How to avoid'], 'read requirements item by item');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('analyze counts repeated offenses and incomplete entries', () => {
  const dir = tmpDir('analyze');
  try {
    appendEntry(dir, ENTRY_A);
    appendEntry(dir, ENTRY_B); // same mistake, 2nd time
    appendEntry(dir, ENTRY_C);

    const info = analyze(dir);
    assert.strictEqual(info.total, 3);
    assert.strictEqual(info.repeats.length, 1);
    assert.strictEqual(info.repeats[0].reason, 'missed requirement #2');
    assert.strictEqual(info.repeats[0].count, 2);
    assert.deepStrictEqual(info.incomplete, []);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('analyze flags entries missing "How to avoid" as incomplete', () => {
  const dir = tmpDir('incomplete');
  try {
    const file = memoryPath(dir);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, '## 2026-08-24 · Mistake: missing fields\n- Trigger input: x\n- What went wrong: y\n', 'utf8');

    const info = analyze(dir);
    assert.strictEqual(info.incomplete.length, 1);
    assert.strictEqual(info.incomplete[0].reason, 'missing fields');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
