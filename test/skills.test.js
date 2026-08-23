/**
 * skills module tests: inventory and install logic.
 */

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { listSkills, installSkills } = require('../src/skills');

test('listSkills returns spare-me with a description', () => {
  const skills = listSkills();
  assert.strictEqual(skills.length, 1);
  assert.strictEqual(skills[0].name, 'spare-me');
  assert.ok(skills[0].description.length > 10, 'description should be long enough to trigger');
  const file = path.join(__dirname, '..', 'skills', 'spare-me', 'SKILL.md');
  assert.ok(fs.existsSync(file), 'missing SKILL.md');
});

test('installSkills copies into a temp project and is idempotent', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'spare-me-test-'));
  try {
    const first = installSkills(tmp);
    assert.strictEqual(first.installed.length, 1);
    assert.deepStrictEqual(first.errors, []);

    const second = installSkills(tmp);
    assert.strictEqual(second.skipped.length, 1);
    assert.strictEqual(second.installed.length, 0);

    const target = path.join(tmp, '.claude', 'skills', 'spare-me', 'SKILL.md');
    assert.ok(fs.existsSync(target));
    assert.match(fs.readFileSync(target, 'utf8'), /^---\n/);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

test('installSkills reports unknown skills as errors', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'spare-me-test-'));
  try {
    const result = installSkills(tmp, ['not-exist']);
    assert.strictEqual(result.errors.length, 1);
    assert.match(result.errors[0], /Unknown skill/);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});
