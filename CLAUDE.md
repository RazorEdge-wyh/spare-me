# CLAUDE.md

> spare-me's own project brief. This is a self-bootstrapping project: we build an "AI mistake-memory" skill, and this repo follows the same rules it teaches.

## What this project is

spare-me is a Claude Code skill: when the AI detects the user is **clearly angry**, it opens with a dramatic funny apology (Spare me, Your Majesty! / I deserve death!) **tagged with the skill name**, traces back the last turn to find the mistake, and **writes the reason into permanent memory** so it never repeats.

- `skills/spare-me/SKILL.md` is the product itself (pure Markdown, natively loadable by Claude Code).
- `bin/spare-me.js` + `src/` are the installer and the memory health-check tool.

## Common commands

```bash
npm test                              # run tests (Node built-in test runner, zero deps)
node bin/spare-me.js try              # print a random funny apology (easter egg)
node bin/spare-me.js init --yes --dir <project>   # install the skill into any project
node bin/spare-me.js doctor --dir <project>       # health-check the mistake memory
```

## Directory layout

```text
skills/        # the product: spare-me's SKILL.md
src/           # CLI logic: cli / init / skills / memory / doctor / render / phrases
bin/           # executable entry (thin shell)
test/          # Node test runner tests
docs/          # skill deep-dive
```

## Engineering conventions

- English identifiers, English comments that explain **why**, not **what**.
- Commit messages follow Conventional Commits (see commit-zh if present).
- **Zero dependencies is a hard constraint**: Node standard library only, no npm deps.
- Tests must cover every module in src/; any change to src/ requires `npm test`.
- When CLI output changes, update the README demo text to match.

## Watch out

- `src/memory.js`'s `parseEntries` **strips HTML comments first** — the format examples in the memory template are comments, not live records; don't convert them, or `doctor` will report false entries.
- The frontmatter `description` in `skills/spare-me/SKILL.md` drives skill triggering — if you change trigger words, update `src/skills.js`'s `SKILL_META` and `src/init.js`'s `CLAUDE_RULE` too.
- The README is the storefront — when you add commands or features, update the README demo text.
