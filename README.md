<div align="center">

# 🤲 spare-me

### Make your AI drop to its knees — and actually learn from the mistake

**The angrier you get, the faster it kneels. Then it owns the mistake, logs it, and never makes it again.**

<br/>

![GitHub stars](https://img.shields.io/github/stars/RazorEdge-wyh/spare-me?style=social)
![License](https://img.shields.io/github/license/RazorEdge-wyh/spare-me)
![Node](https://img.shields.io/badge/node-%3E%3D16-green)
![Zero deps](https://img.shields.io/badge/deps-0-blueviolet)

Zero deps, pure Markdown, easy to tweak once installed.

```bash
npm i -g github:RazorEdge-wyh/spare-me && spare-me init
```

> Want it in Chinese? See the original [dawang-raoming（大王饶命）](https://github.com/RazorEdge-wyh/dawang-raoming).

</div>

---

## What it does

```text
You: You got it wrong AGAIN??? I've told you three times! Do you even read my requirements?!

Claude:
🤲 Spare me, Your Majesty! (skill: spare-me)
"I deserve death — I missed your second requirement."

— What I got wrong: last turn I only implemented pagination and skipped sorting.
— Logged to .claude/memory/spare-me.md; next time I'll read every requirement item by item.

Here is the implementation rewritten against the full requirements…
```

Without spare-me, an annoyed AI just mumbles "Sorry, I'll do better next time" — and repeats the mistake.

With spare-me, it goes: **kneel → own it → log it → never repeat it.**

Don't read this as a gag — the last step is the real product. Every time it annoys you, it gets smarter.

---

## The three steps, every time

1. **Kneel.** One medieval-court apology, always tagged `(skill: spare-me)`.
2. **Own it.** Look back at the last turn and say what actually went wrong — missed a requirement? buggy code? wrong output? Facts, no excuses.
3. **Log it.** Append the mistake to `.claude/memory/spare-me.md`, with the emphasis on "how to avoid" next time.

A second offense isn't met with another kneel-and-play-cute — the AI admits "this is the second time", and sets a stricter rule for itself.

No visible anger, no apology. An unsolicited apology is more annoying than the mistake.

---

## Install

```bash
npm i -g github:RazorEdge-wyh/spare-me
# or after publishing to npm: npm i -g spare-me

spare-me init
```

Your project now looks like:

```text
your-project/
├── .claude/
│   ├── skills/spare-me/SKILL.md   # the skill
│   └── memory/spare-me.md         # mistake memory
└── CLAUDE.md                      # carries an "AI anger self-check" rule
```

Then go make Claude angry once.

---

## Commands

```text
spare-me init     Install skill + memory template + behavior rule
spare-me try      Print a random apology — preview the tone
spare-me doctor   Health-check the memory; flag repeated offenses
```

---

## `doctor`: is it actually learning?

`doctor` opens `.claude/memory/spare-me.md` and grades the AI's memory:

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
  1. [repeat] Mistake "missed requirement #2" has appeared 2 times — repeated offense, time to escalate
  ...
```

Local-only heuristics — no network, no mutation, just a report. Use it to check weekly whether the AI has repeated a mistake, or to set a team rule: **escalate any mistake that happens twice**.

This repo runs `doctor` on itself. Right after `init` it honestly reports "memory file is empty — never triggered", and the score climbs as you make it learn.

---

## Why "never repeat it" isn't just talk

1. Claude Code natively loads **Skills**: the `SKILL.md` under `.claude/skills/` auto-matches by `description`, so it wakes up the moment you flare up.
2. spare-me is a **stateful skill** — it needs to keep sensing anger — so `init` also injects a behavior rule into `CLAUDE.md`: check before every reply whether the user is clearly angry; if so, activate (three layers: `description` + `CLAUDE.md` rule + `AGENTS.md`).
3. On trigger it runs the three steps and appends the mistake to memory. **New sessions start by skimming the memory file** and avoiding those mistakes.

---

## Inspiration

The moves aren't invented from thin air — a few projects did them first:

- Precise triggers, no misfires → [nav-diagnose](https://www.skill-gallery.jp/en/skills/alekspetrov/nav-diagnose): concrete anger signals, "no trigger on a single correction"
- Structured apology, no excuses → [apology-letter](https://claudeskills.info/skill/apology-letter/) (~1.3k★)
- Never apologize without evidence → [ex-skill](https://github.com/therealXiaomanChu/ex-skill)
- Cross-session Markdown memory → [mental-health-companion](https://github.com/zxc7563598/mental-health-companion)

---

## Roadmap

- [ ] More phrase banks: pirate, knight, corporate, sci-fi
- [ ] Global memory sync: sync entries to `~/.claude/`
- [ ] `doctor` trend line for repeated-offense rate
- [ ] Export `.cursor/rules` for Cursor users

Issues and PRs welcome at [spare-me/issues](https://github.com/RazorEdge-wyh/spare-me/issues).

---

## License

MIT © [Wang Yuehao](https://github.com/RazorEdge-wyh)
