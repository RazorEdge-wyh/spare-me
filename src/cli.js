/**
 * spare-me CLI entry: argument parsing + command dispatch.
 *
 * Commands:
 *   spare-me init    [--yes] [--dir <path>]  Install the skill + memory template + CLAUDE.md behavior rule
 *   spare-me try                                Print a random funny apology (easter egg / verify install)
 *   spare-me doctor [--dir <path>]              Health-check the mistake memory
 *   spare-me list                               List available skills
 *   spare-me help / --help / -h
 *   spare-me --version / -V
 */

const path = require('node:path');
const render = require('./render');
const { SKILL_META } = require('./skills');
const { runInit } = require('./init');
const { runDoctor, printReport } = require('./doctor');
const { line } = require('./phrases');
const pkg = require('../package.json');

const HELP = `spare-me v${pkg.version} — make Claude drop to its knees and learn from its mistakes

Usage:
  spare-me init [--yes] [--dir <path>]   Install the skill, memory template, and CLAUDE.md behavior rule
  spare-me try                           Print a random funny apology (easter egg / verify install)
  spare-me doctor [--dir <path>]         Health-check the mistake memory (flags repeated offenses)
  spare-me list                          List available skills
  spare-me help                          Show help
  spare-me --version                     Show version

Options:
  --yes       non-interactive, use all defaults
  --dir <path> target project dir, defaults to the current one

Examples:
  spare-me init --yes              # install into the current project
  spare-me try                     # preview the apology tone
  spare-me doctor                  # check the memory health of the current project
`;

/** Simple arg parser: separates --flags and --key value */
function parseArgs(argv) {
  const opts = { _: [], flags: new Set(), dir: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--yes' || a === '-y') opts.flags.add('yes');
    else if (a === '--dir' || a === '-d') {
      opts.dir = argv[++i];
      if (opts.dir === undefined) {
        render.err('--dir needs a directory argument, e.g. --dir ./my-app');
        process.exit(1);
      }
    } else if (a === '--help' || a === '-h' || a === 'help') opts.flags.add('help');
    else if (a === '--version' || a === '-V' || a === 'version') opts.flags.add('version');
    else if (a.startsWith('-')) {
      /* unknown flag: ignore, don't treat as a command */
    } else opts._.push(a);
  }
  return opts;
}

/** Print a random funny apology (verify install + easter egg) */
function printTry() {
  console.log(line());
  console.log('');
  console.log(render.gray('↑ That\'s how it greets you when you\'ve had enough. Install: ' + render.code('spare-me init')));
}

/** Print the skill list */
function printList() {
  render.title('spare-me · Available skills');
  for (const s of SKILL_META) {
    console.log(`${s.icon} ${render.bold(s.name)}`);
    console.log(render.gray(`   ${s.desc}`));
    console.log(render.gray(`   Trigger: ${s.trigger}`));
    console.log('');
  }
  console.log(render.info(`${SKILL_META.length} skill${SKILL_META.length > 1 ? 's' : ''} available. Install: ` + render.code('spare-me init')));
}

async function main(argv) {
  const opts = parseArgs(argv);

  if (opts.flags.has('version')) {
    console.log(pkg.version);
    return;
  }
  if (opts.flags.has('help') || opts._.length === 0) {
    console.log(HELP);
    return;
  }

  const cmd = opts._[0];
  switch (cmd) {
    case 'init':
      await runInit({ dir: opts.dir, yes: opts.flags.has('yes') });
      break;
    case 'try':
      printTry();
      break;
    case 'doctor':
      printReport(runDoctor(path.resolve(opts.dir || process.cwd())));
      break;
    case 'list':
      printList();
      break;
    default:
      render.err(`Unknown command: ${cmd}`);
      console.log(HELP);
      process.exitCode = 1;
  }
}

module.exports = { main, parseArgs };
