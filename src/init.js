/**
 * `spare-me init`: install the skill into a target project and lay the groundwork for "learning".
 *
 * 1. Install the skill — so Claude Code activates spare-me when it detects user anger.
 * 2. Generate the memory template — so the AI has a place to record mistakes.
 * 3. Inject a CLAUDE.md behavior rule — so the AI self-checks for anger before every reply (reliable triggering).
 */

const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline');
const render = require('./render');
const { listSkills, installSkills } = require('./skills');
const { TEMPLATE, memoryPath } = require('./memory');

/** Behavior rule injected into CLAUDE.md (idempotent: marker-based, no duplicates) */
const CLAUDE_RULE = `## spare-me: AI anger self-check (do not delete)

Before every reply, quickly judge: **is the user clearly angry in this turn?**
(signs: expletives, ALL CAPS, repeated punctuation \`???\` \`!!!\`, direct blame of the AI, 3rd correction on the same topic, complaints like "wrong again" / "useless")

- Yes → activate the \`spare-me\` skill, follow its 3-part output (funny apology + root-cause recap + memory entry), then get back to work.
- No → reply normally, never apologize without evidence.
`;

/** Minimal CLAUDE.md used when none exists */
const CLAUDE_MD_TEMPLATE = `# CLAUDE.md

> This project uses the spare-me skill. This file is a "project brief" for AI collaborators; adapt it to your project.

## What is this project
<!-- One line: the problem it solves, and the stack -->

## Common commands
\`\`\`
# install
npm install

# local dev
npm run dev

# test
npm test
\`\`\`

${CLAUDE_RULE}
`;

/**
 * Interactive prompt.
 * @returns {Promise<string|null>} answer or null (non-TTY / empty input)
 */
function ask(question, defaultValue = '') {
  return new Promise((resolve) => {
    if (!process.stdin.isTTY) return resolve(null);
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(question, (ans) => {
      rl.close();
      resolve(ans.trim() || defaultValue || null);
    });
  });
}

/** Generate the memory template (skips if it already exists) */
function writeMemoryTemplate(targetDir) {
  const file = memoryPath(targetDir);
  if (fs.existsSync(file)) return { file, skipped: true };
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, TEMPLATE, 'utf8');
  return { file, skipped: false };
}

/** Inject the CLAUDE.md behavior rule (idempotent: checks for the marker) */
function injectClaudeMd(targetDir, force = false) {
  const file = path.join(targetDir, 'CLAUDE.md');
  const marker = '## spare-me: AI anger self-check';
  if (fs.existsSync(file)) {
    const cur = fs.readFileSync(file, 'utf8');
    if (cur.includes(marker)) return { file, skipped: true };
    if (force) return { file, skipped: false };
    // append to the end
    fs.appendFileSync(file, `\n${CLAUDE_RULE}`, 'utf8');
    return { file, skipped: false };
  }
  fs.writeFileSync(file, CLAUDE_MD_TEMPLATE, 'utf8');
  return { file, skipped: false };
}

/**
 * init main flow.
 * @param {object} opts
 * @param {string} opts.dir target project dir (defaults to cwd)
 * @param {boolean} opts.yes non-interactive, use all defaults
 */
async function runInit(opts) {
  const targetDir = path.resolve(opts.dir || process.cwd());

  if (!fs.existsSync(targetDir) || !fs.statSync(targetDir).isDirectory()) {
    render.err(`Directory does not exist: ${targetDir}`);
    process.exitCode = 1;
    return;
  }

  render.title('🤲 spare-me · installing the "Spare Me" skill');

  // 1. Install skills
  const result = installSkills(targetDir);
  result.installed.forEach((n) => console.log(render.ok(`${n} installed`)));
  result.skipped.forEach((n) => console.log(render.info(`${n} already exists, skipped`)));
  result.errors.forEach((n) => console.log(render.warn(n)));

  if (!result.installed.length && !result.skipped.length) {
    render.err('No skills installed — check the skills/ directory.');
    return;
  }

  console.log(render.line());
  console.log(render.info(`Skills directory: ${path.join(targetDir, '.claude', 'skills')}`));
  console.log(render.info('Next Claude Code session will load them and activate on user anger.'));

  // 2. Generate the memory template
  const mem = writeMemoryTemplate(targetDir);
  if (mem.skipped) console.log(render.info('Memory file already exists, keeping it'));
  else console.log(render.ok(`Created memory template: ${path.relative(targetDir, mem.file)}`));

  // 3. Inject the CLAUDE.md behavior rule
  const wantRule = opts.yes || (await ask('Inject the "AI anger self-check" rule into CLAUDE.md (more reliable triggering)? [Y/n] ', 'y'));
  if (wantRule === 'y' || wantRule === 'Y' || wantRule === true) {
    const claude = injectClaudeMd(targetDir);
    if (claude.skipped) console.log(render.info('CLAUDE.md already has the spare-me rule, skipped'));
    else console.log(render.ok(`Injected behavior rule into ${path.relative(targetDir, claude.file)}`));
  }

  console.log(render.line());
  console.log(render.ok('Done. Go make Claude angry once — it will drop to its knees on the spot.'));
}

module.exports = { runInit, CLAUDE_RULE, CLAUDE_MD_TEMPLATE, writeMemoryTemplate, injectClaudeMd };
