/**
 * Terminal output helpers: colors, icons, code hints.
 *
 * Design notes (this project walks its own talk):
 * - Some old Windows terminals don't understand ANSI; detect support first.
 * - All output goes through here so future color scheme / i18n changes are one-liners.
 */

const isTTY = Boolean(process.stdout && process.stdout.isTTY);

// Enable VT support on Windows 10+; fall back to plain text silently.
function enableWindowsAnsi() {
  if (process.platform !== 'win32') return;
  try {
    // eslint-disable-next-line no-undef
    const cp = require('node:child_process');
    cp.execSync('echo', { stdio: 'ignore' });
  } catch {
    /* no color is fine */
  }
}

const USE_COLOR = isTTY && !process.env.NO_COLOR;
enableWindowsAnsi();

const codes = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

function paint(text, name) {
  if (!USE_COLOR) return text;
  return `${codes[name] || ''}${text}${codes.reset}`;
}

const render = {
  bold: (t) => paint(t, 'bold'),
  dim: (t) => paint(t, 'dim'),
  red: (t) => paint(t, 'red'),
  green: (t) => paint(t, 'green'),
  yellow: (t) => paint(t, 'yellow'),
  blue: (t) => paint(t, 'blue'),
  magenta: (t) => paint(t, 'magenta'),
  cyan: (t) => paint(t, 'cyan'),
  gray: (t) => paint(t, 'gray'),

  /** Title line with an emoji */
  title(text) {
    return `${render.bold(render.cyan(text))}\n`;
  },

  /** ok / warn / err / info markers */
  ok(text) {
    return `${render.green('✔')} ${text}`;
  },
  warn(text) {
    return `${render.yellow('⚠')} ${text}`;
  },
  err(text) {
    return `${render.red('✖')} ${text}`;
  },
  info(text) {
    return `${render.blue('ℹ')} ${text}`;
  },

  /** Code line with a leading arrow */
  code(text) {
    return `${render.gray('  ')} $ ${render.bold(text)}`;
  },

  /** Plain divider */
  line() {
    return render.gray('─'.repeat(process.stdout.columns ? Math.min(process.stdout.columns, 60) : 60));
  },
};

module.exports = render;
