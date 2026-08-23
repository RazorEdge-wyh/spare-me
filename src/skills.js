/**
 * Skill inventory and install logic (mirrors the zh-skills pattern; this repo ships one skill).
 *
 * skills/ is the product itself (zero-dependency Markdown). Here we only:
 * - list available skills
 * - copy them into a target project's .claude/skills/
 */

const fs = require('node:fs');
const path = require('node:path');

// Package skills root (two levels above bin/spare-me.js is the package root)
const SKILLS_ROOT = path.resolve(__dirname, '..', 'skills');

/** Skill metadata (keep in sync with the frontmatter of each SKILL.md) */
const SKILL_META = [
  {
    name: 'spare-me',
    icon: '🤲',
    desc: 'When the user is clearly angry: dramatic funny apology + skill tag + root-cause recap + permanent memory',
    trigger: 'User is angry / frustrated / complaining "wrong again"',
  },
];

/** Parse SKILL.md frontmatter for name and description */
function readFrontmatter(file) {
  try {
    const raw = fs.readFileSync(file, 'utf8');
    const m = raw.match(/^---\n([\s\S]*?)\n---/);
    if (!m) return { name: path.basename(path.dirname(file)), description: '' };
    const meta = {};
    for (const line of m[1].split('\n')) {
      const kv = line.match(/^([a-z-]+):\s*(.*)$/);
      if (kv) meta[kv[1]] = kv[2];
    }
    return meta;
  } catch {
    return { name: path.basename(path.dirname(file)), description: '' };
  }
}

/** List all available skills (with parsed descriptions) */
function listSkills() {
  return fs.readdirSync(SKILLS_ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => {
      const meta = readFrontmatter(path.join(SKILLS_ROOT, d.name, 'SKILL.md'));
      return { name: d.name, description: meta.description || '' };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Install skills into a target project.
 * @param {string} targetDir target project root
 * @param {string[]} names skill names to install (empty = all)
 * @returns {{ installed: string[], skipped: string[], errors: string[] }}
 */
function installSkills(targetDir, names = []) {
  const result = { installed: [], skipped: [], errors: [] };
  const skillsDir = path.join(targetDir, '.claude', 'skills');

  const available = listSkills().map((s) => s.name);
  const toInstall = names.length ? names : available;

  for (const name of toInstall) {
    if (!available.includes(name)) {
      result.errors.push(`Unknown skill: ${name}`);
      continue;
    }
    const from = path.join(SKILLS_ROOT, name, 'SKILL.md');
    const to = path.join(skillsDir, name, 'SKILL.md');
    try {
      if (fs.existsSync(to)) {
        result.skipped.push(name);
        continue;
      }
      fs.mkdirSync(path.dirname(to), { recursive: true });
      fs.copyFileSync(from, to);
      result.installed.push(name);
    } catch (e) {
      result.errors.push(`${name}: ${e.message}`);
    }
  }

  return result;
}

module.exports = { SKILL_META, SKILLS_ROOT, listSkills, installSkills };
