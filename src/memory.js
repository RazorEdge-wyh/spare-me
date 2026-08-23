/**
 * Mistake-memory file read/write.
 *
 * The core value of spare-me: turn "why the user is angry" into reusable memory
 * so it never happens again. This module handles locating, appending, parsing
 * and counting repeated mistakes.
 *
 * File: <project>/.claude/memory/spare-me.md
 * Entry format (append one block per trigger):
 *   ## 2026-08-24 · Mistake: missed requirement #2
 *   - Trigger input: You got it wrong AGAIN???
 *   - What went wrong: only pagination, no sorting
 *   - How to avoid: read requirements item by item before coding
 *   - Remediation: provided the fixed implementation this turn
 */

const fs = require('node:fs');
const path = require('node:path');

/** Memory file location relative to the project root */
const MEMORY_REL = path.join('.claude', 'memory', 'spare-me.md');

/** Absolute path to the memory file */
function memoryPath(targetDir) {
  return path.join(targetDir, MEMORY_REL);
}

/** Today in YYYY-MM-DD (local timezone) */
function today() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** init-generated template (no live example entry, so doctor can honestly say "never triggered") */
const TEMPLATE = `# spare-me mistake memory

> Maintained by the spare-me skill. Each time the user is clearly angry, the AI
> records the mistake and the fix so it never repeats.
> A mistake appearing >=2 times is a "repeated offense"; the AI escalates and tightens its rules.

<!-- Record format (append on each trigger):
## 2026-08-24 · Mistake: missed requirement #2
- Trigger input: You got it wrong AGAIN???
- What went wrong: only pagination, no sorting
- How to avoid: read requirements item by item before coding
- Remediation: provided the fixed implementation this turn
-->
`;

/** Append one mistake record (creates directories). Returns the file path. */
function appendEntry(targetDir, entry) {
  const file = memoryPath(targetDir);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const date = entry.date || today();
  const block = `\n## ${date} · Mistake: ${entry.title}\n` +
    `- Trigger input: ${entry.triggerInput}\n` +
    `- What went wrong: ${entry.mistake}\n` +
    `- How to avoid: ${entry.fix}\n` +
    `- Remediation: ${entry.remedy}\n`;
  fs.appendFileSync(file, block, 'utf8');
  return file;
}

/**
 * Parse the memory file into structured entries.
 * @returns {Array<{date, reason, title, fields}>} fields maps field name -> content
 */
function parseEntries(raw) {
  // Strip HTML comments first (template format examples are comments, not records)
  const body = raw.replace(/<!--[\s\S]*?-->/g, '');
  const blocks = body.split(/\n(?=## )/).filter((b) => /^## /.test(b));
  return blocks.map((block) => {
    const lines = block.trim().split('\n');
    const head = lines[0].replace(/^##\s+/, '');
    const date = head.split(' · ')[0] || '';
    const reasonMatch = head.match(/Mistake:\s*(.+)$/i);
    const reason = reasonMatch ? reasonMatch[1].trim() : head.trim();
    const fields = {};
    for (const l of lines.slice(1)) {
      const m = l.match(/^- (.+?)[：:]\s*(.*)$/);
      if (m) fields[m[1]] = m[2];
    }
    return { date, reason, title: head, fields };
  });
}

/**
 * Analyze memory health: entry count, repeated mistakes (offenses), incomplete entries.
 */
function analyze(targetDir) {
  const file = memoryPath(targetDir);
  const hasFile = fs.existsSync(file);
  const raw = hasFile ? fs.readFileSync(file, 'utf8') : '';
  const entries = parseEntries(raw);

  const reasonCount = {};
  for (const e of entries) reasonCount[e.reason] = (reasonCount[e.reason] || 0) + 1;
  const repeats = Object.entries(reasonCount)
    .filter(([, n]) => n >= 2)
    .sort((a, b) => b[1] - a[1])
    .map(([reason, count]) => ({ reason, count }));

  const incomplete = entries
    .filter((e) => !e.fields['How to avoid'] || !e.fields['Trigger input'])
    .map((e) => ({ date: e.date, reason: e.reason }));

  return { hasFile, file, total: entries.length, repeats, incomplete };
}

module.exports = { MEMORY_REL, memoryPath, TEMPLATE, today, appendEntry, parseEntries, analyze };
