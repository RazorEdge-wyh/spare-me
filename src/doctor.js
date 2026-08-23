/**
 * `spare-me doctor`: health-check the mistake memory.
 *
 * spare-me's core promise is "never repeat the mistake", so the check targets three things:
 *   1. Is there a memory file at all? (no record = promise broken)
 *   2. Is every entry complete? (missing "How to avoid" = recording without fixing)
 *   3. Any repeated offenses? (same mistake >=2 times = recording but not improving)
 *
 * Pure heuristics, no side effects, runs offline. Report object is separated from printing for testing.
 */

const fs = require('node:fs');
const path = require('node:path');
const { memoryPath, analyze } = require('./memory');

const LEVELS = [
  { min: 90, key: 'excellent', label: '🟢 Excellent', note: 'AI remembers and improves fast' },
  { min: 70, key: 'good', label: '🟡 Good', note: 'Minor gaps, easy to fix' },
  { min: 50, key: 'fair', label: '🟠 Fair', note: 'Little memory has accumulated' },
  { min: 0, key: 'danger', label: '🔴 Danger', note: 'Not learning yet' },
];

function levelOf(score) {
  return LEVELS.find((l) => score >= l.min) || LEVELS[LEVELS.length - 1];
}

/**
 * Run the check and return a report object (pure data, easy to test/reuse).
 * @param {string} targetDir project root
 */
function runDoctor(targetDir) {
  const info = analyze(targetDir);
  const checks = [];
  const problems = [];

  // 1. Memory file exists? (20)
  checks.push({ title: 'Has mistake-memory file', score: info.hasFile ? 20 : 0, max: 20 });
  if (!info.hasFile) {
    problems.push({ key: 'file', file: path.relative(targetDir, info.file), msg: 'No memory file yet — run `spare-me init` to create the template' });
  }

  // 2. Any records? (20)
  checks.push({ title: `Has records (currently ${info.total})`, score: info.total >= 1 ? 20 : 0, max: 20 });
  if (info.hasFile && info.total === 0) {
    problems.push({ key: 'file', file: path.relative(targetDir, info.file), msg: 'Memory file is empty — the skill has not been triggered yet' });
  }

  // 3. Completeness (30): an entry is complete only with both "How to avoid" and "Trigger input"
  const complete = info.total > 0
    ? Math.round((info.total - info.incomplete.length) / info.total * 30)
    : 0;
  checks.push({ title: `Each record has "How to avoid" + "Trigger input" (${info.total - info.incomplete.length}/${info.total})`, score: complete, max: 30 });
  for (const e of info.incomplete.slice(0, 3)) {
    problems.push({ key: 'complete', file: path.relative(targetDir, info.file), msg: `${e.date} "${e.reason}" is missing fields — recording without fixing is pointless` });
  }
  if (info.incomplete.length > 3) {
    problems.push({ key: 'complete', file: '(more)', msg: `${info.incomplete.length - 3} more incomplete records` });
  }

  // 4. Repeated offenses (30): same mistake >= 2 times
  const repeatPenalty = Math.min(info.repeats.length * 15, 30);
  checks.push({ title: `No repeated offenses (currently ${info.repeats.length})`, score: 30 - repeatPenalty, max: 30 });
  for (const r of info.repeats.slice(0, 3)) {
    problems.push({ key: 'repeat', file: path.relative(targetDir, info.file), msg: `Mistake "${r.reason}" has appeared ${r.count} times — repeated offense, time to escalate` });
  }

  const total = checks.reduce((sum, c) => sum + c.score, 0);
  const level = levelOf(total);

  return {
    targetDir,
    total,
    max: 100,
    level: level.key,
    levelLabel: level.label,
    levelNote: level.note,
    checks,
    problems,
    stats: { total: info.total, repeats: info.repeats.length, incomplete: info.incomplete.length },
  };
}

/** Print the report (pure display, no side effects) */
function printReport(report) {
  const render = require('./render');
  console.log(render.title('🤲 spare-me · Mistake Memory Check'));
  console.log(`${render.bold(`Score: ${report.total}/100`)}  ${render.bold(report.levelLabel)}  ${render.gray(report.levelNote)}`);
  console.log(render.line());

  for (const c of report.checks) {
    const mark = c.score >= c.max ? render.green('✔') : render.yellow('·');
    const detail = c.score < c.max ? render.red(`-${c.max - c.score}`) : '';
    console.log(`  ${mark} ${c.title}${detail}`);
  }

  if (report.problems.length) {
    console.log(render.line());
    console.log(render.bold('⚠ To fix (by impact)'));
    report.problems.slice(0, 12).forEach((p, idx) => {
      console.log(`  ${idx + 1}. [${p.key}] ${p.file}: ${p.msg}`);
    });
  } else {
    console.log(render.line());
    console.log(render.ok('Memory is healthy — the AI is learning.'));
  }

  console.log(render.line());
  console.log(render.info('Memory location: ' + report.stats.total + ' records · fix hints in `.claude/memory/spare-me.md`.'));
}

module.exports = { runDoctor, printReport, LEVELS };
