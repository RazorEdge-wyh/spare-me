/**
 * Memory health-check tests: empty dir / repeated offense / healthy memory.
 */

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { runDoctor } = require('../src/doctor');
const { appendEntry } = require('../src/memory');

function tmpDir(name) {
  return fs.mkdtempSync(path.join(os.tmpdir(), `spare-me-${name}-`));
}

test('empty dir: no memory file, low score, suggests init', () => {
  const dir = tmpDir('empty');
  try {
    const report = runDoctor(dir);
    assert.strictEqual(report.max, 100);
    assert.ok(report.total < 50, 'empty dir must not score high');
    assert.strictEqual(report.checks[0].score, 0);
    assert.ok(report.problems.some((p) => p.msg.includes('spare-me init')));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('same mistake twice: flagged as repeated offense, penalty applied', () => {
  const dir = tmpDir('repeat');
  try {
    appendEntry(dir, { title: 'missed requirement #2', triggerInput: 'a', mistake: 'x', fix: 'item by item', remedy: 'fixed' });
    appendEntry(dir, { title: 'missed requirement #2', triggerInput: 'b', mistake: 'x', fix: 'item by item', remedy: 'fixed' });
    const report = runDoctor(dir);
    assert.ok(report.problems.some((p) => p.key === 'repeat' && p.msg.includes('repeated offense')));
    const repeatCheck = report.checks.find((c) => c.title.includes('repeated offenses'));
    assert.strictEqual(repeatCheck.score, 15); // 30 - 15 penalty
    assert.strictEqual(report.stats.repeats, 1);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('healthy memory: distinct mistakes + complete fields = full score', () => {
  const dir = tmpDir('good');
  try {
    appendEntry(dir, { title: 'missed requirement #2', triggerInput: 'a', mistake: 'x', fix: 'item by item', remedy: 'fixed' });
    appendEntry(dir, { title: 'claimed done without testing', triggerInput: 'b', mistake: 'y', fix: 'run tests', remedy: 'added' });
    const report = runDoctor(dir);
    assert.strictEqual(report.total, 100);
    assert.strictEqual(report.level, 'excellent');
    assert.deepStrictEqual(report.problems, []);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
