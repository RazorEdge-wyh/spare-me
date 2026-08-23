<div align="center">

# 🤲 spare-me

### Make your AI drop to its knees in a funny apology — and actually learn from its mistakes

**Detects genuine anger → dramatic medieval-court apology (tagged with the skill) → root-cause recap → writes the mistake into permanent memory so it never repeats.**

<br/>

![GitHub stars](https://img.shields.io/github/stars/RazorEdge-wyh/spare-me?style=social)
![License](https://img.shields.io/github/license/RazorEdge-wyh/spare-me)
![Node](https://img.shields.io/badge/node-%3E%3D16-green)
![Zero deps](https://img.shields.io/badge/deps-0-blueviolet)

**One-line install, pure Markdown, zero dependencies.**

<br/>

```bash
npm i -g github:RazorEdge-wyh/spare-me && spare-me init   # install into .claude/skills/
spare-me try                                              # preview the apology tone
```

> 🇨🇳 Want it in Chinese? See the original [dawang-raoming（大王饶命）](https://github.com/RazorEdge-wyh/dawang-raoming).

</div>

---

## What it actually does

```text
You: You got it wrong AGAIN??? I've told you three times! Do you even read my requirements?!

Claude:
🤲 Spare me, Your Majesty! (skill: spare-me)
"I deserve death — I missed your second requirement."

— What I got wrong: last turn I only implemented pagination and skipped sorting.
— Logged to .claude/memory/spare-me.md; next time I'll read every requirement item by item.

Here is the implementation rewritten against the full requirements…
```

Without spare-me, when your AI annoys you it just says "Sorry, I'll do better next time" — and **repeats the same mistake**.

With spare-me, it goes: **kneel on the spot → own the mistake → carve the lesson into memory → actually never repeat it.**

This isn't just a joke — **"writing the mistake into permanent memory" is the real point**. Every time it annoys you, it learns.

---

## Features

- **Three-part output**: funny apology (always tagged `(skill: spare-me)`) → root-cause recap → permanent memory entry. De-escalates in seconds without losing momentum.
- **Permanent memory**: every mistake is appended to `.claude/memory/spare-me.md` and read at the start of new sessions, so it genuinely doesn't repeat.
- **Repeated-offense escalation**: the second time the same mistake appears, the AI admits it and tightens its rules.
- **Evidence first**: it never apologizes without clear anger signals — an unsolicited apology is more annoying than the mistake itself.
- **`spare-me doctor`**: grades how well your AI is learning — it flags repeated offenses and hollow records that lack a "how to avoid".
- **Zero deps, pure Markdown**: the SKILL.md is right there in your project; read it, edit it, make it your own.
- **One-line install**: `spare-me init` installs the skill + memory template + injects a CLAUDE.md behavior rule for reliable triggering.

---

## Quick start

```bash
# 1) Install (pick one)
npm i -g github:RazorEdge-wyh/spare-me      # direct from GitHub
#   or after publishing to npm: npm i -g spare-me

# 2) Install into any project
spare-me init
```

Your project now looks like:

```text
your-project/
├── .claude/
│   ├── skills/spare-me/SKILL.md   # the skill (auto-loaded by Claude Code)
│   └── memory/spare-me.md         # mistake memory (appended by the AI each time)
└── CLAUDE.md                      # now carries the "AI anger self-check" rule
```

**Then?** Go make Claude angry once — it will drop to its knees, own the mistake, and write the lesson into memory.

---

## Command reference

```text
spare-me init [--yes] [--dir <path>]   Install skill + memory template + CLAUDE.md behavior rule
spare-me try                           Print a random funny apology (easter egg / verify install)
spare-me doctor [--dir <path>]         Health-check the mistake memory (flags repeated offenses)
spare-me list                          List available skills
spare-me help                          Show help
spare-me --version                     Show version
```

## `spare-me doctor`: is your AI actually learning?

`doctor` scans `.claude/memory/spare-me.md` and tells you whether the AI is really improving:

```text
$ spare-me doctor

🤲 spare-me · Mistake Memory Check
Score: 85/100  🟡 Good  Minor gaps, easy to fix
────────────────────────────────────────────
  ✔ Has mistake-memory file
  ✔ Has records (currently 6)
  · Each record has "How to avoid" + "Trigger input" (5/6) -5
  · No repeated offenses (currently 1) -15
────────────────────────────────────────────
⚠ To fix (by impact)
  1. [repeat] .claude\memory\spare-me.md: Mistake "missed requirement #2" has appeared 2 times — repeated offense, time to escalate
  ...
```

Pure local heuristics — no network, no mutation, just a report. Useful for:
- A weekly look at whether the AI has repeated the same mistake;
- A team rule: **escalate any mistake that happens twice**.

> **Dogfooding**: this repo runs `spare-me doctor` on itself. Right after `init` it honestly reports "memory file is empty — never triggered", then the score climbs as you (and your AI) make it learn.

---

## How it works (3-minute read)

1. Claude Code natively supports **Skills**: every `SKILL.md` under a project's `.claude/skills/` is auto-matched by its `description` during a conversation.
2. spare-me is a **stateful skill** — it needs to keep sensing anger — so `init` also injects a behavior rule into your `CLAUDE.md`: **check before every reply whether the user is clearly angry; if so, activate spare-me** (three-layer guarantee: description + CLAUDE.md rule + AGENTS.md).
3. On trigger it emits the three-part output and appends the mistake to `.claude/memory/spare-me.md`. **New sessions start by reading the memory file** and avoiding those mistakes.

> Curious about the Skills mechanism? See [Superpowers](https://github.com/obra/superpowers) and [mattpocock/skills](https://github.com/mattpocock/skills).

---

## Credits & inspiration

spare-me stands on the shoulders of these projects — borrowing the best parts, then making them its own:

| Borrowed | Source | What we took |
|---|---|---|
| Precise triggers + anti-misfire | [nav-diagnose](https://www.skill-gallery.jp/en/skills/alekspetrov/nav-diagnose) | Concrete anger signals; "no trigger on a single correction" |
| Structured apology + anti-patterns | [apology-letter](https://claudeskills.info/skill/apology-letter/) (~1.3k★) | Acknowledge → own it → make it right → prevent; no excuses |
| Evidence principle | [ex-skill](https://github.com/therealXiaomanChu/ex-skill) | Never apologize without evidence (Layer 0 hard rule) |
| Incremental Markdown memory | [mental-health-companion](https://github.com/zxc7563598/mental-health-companion) | The cross-session memory format |

---

## Roadmap

- [ ] More phrase banks: pirate, knight, corporate, sci-fi
- [ ] Global memory sync: sync entries to `~/.claude/` with one command
- [ ] `doctor` trend line for repeated-offense rate
- [ ] Export `.cursor/rules` for Cursor users

Issues and PRs welcome at [spare-me/issues](https://github.com/RazorEdge-wyh/spare-me/issues).

---

## License

MIT © [Wang Yuehao](https://github.com/RazorEdge-wyh)
