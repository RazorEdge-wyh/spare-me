<div align="center">

# 🤲 spare-me

### A Claude Code skill that makes your AI drop to its knees in apology — and actually learn from the mistake

**Detects genuine anger → dramatic funny apology (tagged with the skill) → root-cause recap → writes the mistake into permanent memory so it never repeats.**

<br/>

![GitHub stars](https://img.shields.io/github/stars/RazorEdge-wyh/spare-me?style=social)
![License](https://img.shields.io/github/license/RazorEdge-wyh/spare-me)
![Node](https://img.shields.io/badge/node-%3E%3D16-green)
![Zero deps](https://img.shields.io/badge/deps-0-blueviolet)

Zero deps, pure Markdown, one-line install.

```bash
npm i -g github:RazorEdge-wyh/spare-me && spare-me init
```

> Want it in Chinese? See the original [dawang-raoming（大王饶命）](https://github.com/RazorEdge-wyh/dawang-raoming).

</div>

---

## What it is

A Claude Code skill. When the AI detects that you're genuinely angry, it stops mumbling "Sorry, I'll do better next time" and does three things:

1. **Kneels** — one medieval-court apology ("Spare me, Your Majesty!"), tagged with the skill name so you know it's the one owning up.
2. **Owns the mistake** — looks back at the last turn and says what actually went wrong: missed a requirement, wrote a bug, or answered the wrong question.
3. **Logs it** — appends the mistake to `.claude/memory/spare-me.md`, with an emphasis on "how to avoid" next time.

```text
You: You got it wrong AGAIN??? I've told you three times! Do you even read my requirements?!

Claude:
🤲 Spare me, Your Majesty! (skill: spare-me)
"I deserve death — I missed your second requirement."

— What I got wrong: last turn I only implemented pagination and skipped sorting.
— Logged to .claude/memory/spare-me.md; next time I'll read every requirement item by item.

Here is the implementation rewritten against the full requirements…
```

The apology is just the opening — **writing the mistake into permanent memory** is the real point. Every time it annoys you, it learns.

## When to use it

Ever get genuinely annoyed by a dumb AI? …

- You've stated a requirement three times; it still misses item #2
- The same bug gets fixed, then resurfaces — like it has amnesia
- You asked for a one-line change; it wrote you an essay and changed nothing
- You said "don't touch this"; it touched exactly this

When you're about to throw the keyboard, the last thing you need is another hollow "sorry, I'll do better." You need it to kneel, own the mistake, and actually remember. That's exactly what spare-me does.

## Features

- **Funny but not hollow** — the apology appears exactly once, then it gets back to work.
- **It actually remembers** — mistakes live in `.claude/memory/spare-me.md`, read at the start of every new session.
- **Repeated offenses escalate** — the second time the same mistake appears, the AI admits it and sets a stricter rule for itself.
- **No unsolicited apologies** — without clear anger signals it never triggers. An apology out of nowhere is more annoying than the mistake.
- **`doctor` health check** — one command grades how well the AI is learning and flags repeated offenses.
- **Zero deps** — Node standard library only; the SKILL.md is plain Markdown you can edit freely.

## Quick start

```bash
npm i -g github:RazorEdge-wyh/spare-me
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

## Commands

```text
spare-me init     Install skill + memory template + behavior rule
spare-me try      Print a random apology — preview the tone
spare-me doctor   Health-check the memory; flag repeated offenses
```

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

## How it works

1. Claude Code natively loads Skills: the `SKILL.md` under `.claude/skills/` auto-matches by `description`, so it wakes up the moment you flare up.
2. spare-me is a stateful skill — it needs to keep sensing anger — so `init` also injects a behavior rule into `CLAUDE.md`: check before every reply whether the user is clearly angry; if so, activate (three layers: `description` + `CLAUDE.md` rule + `AGENTS.md`).
3. On trigger it runs the three steps and appends the mistake to memory. New sessions start by skimming the memory file and avoiding those mistakes.

## Inspiration

The moves aren't invented from thin air — a few projects did them first:

- Precise triggers, no misfires → [nav-diagnose](https://www.skill-gallery.jp/en/skills/alekspetrov/nav-diagnose): concrete anger signals
- Structured apology, no excuses → [apology-letter](https://claudeskills.info/skill/apology-letter/) (~1.3k★)
- Never apologize without evidence → [ex-skill](https://github.com/therealXiaomanChu/ex-skill)
- Cross-session Markdown memory → [mental-health-companion](https://github.com/zxc7563598/mental-health-companion)

## Roadmap

- [ ] More phrase banks: pirate, knight, corporate, sci-fi
- [ ] Global memory sync: sync entries to `~/.claude/`
- [ ] `doctor` trend line for repeated-offense rate
- [ ] Export `.cursor/rules` for Cursor users

Issues and PRs welcome at [spare-me/issues](https://github.com/RazorEdge-wyh/spare-me/issues).

## License

MIT © [Wang Yuehao（王越豪 · 湖南科技大学 26 届）](https://github.com/RazorEdge-wyh)
