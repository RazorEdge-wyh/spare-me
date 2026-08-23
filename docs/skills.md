# spare-me skill deep-dive

`spare-me` is a Claude Code Skill (`.claude/skills/spare-me/SKILL.md`).
The keywords in `description` decide when it auto-activates; the body is the execution spec.

After install, the file lives in your project — **edit it, and you customize your team's "apology style".**

---

## Trigger: when to kneel

**Clear anger signals** (any one is enough):

- Expletives / frustration words: `damn`, `ffs`, `ugh`, `seriously`, `useless`, `stupid`
- ALL CAPS or repeated punctuation: `WHY` `???` `!!!`
- Directed at the AI: `do you even read` `are you listening` `what are you even doing`
- 3rd correction on the same topic, or `wrong again` / `still broken` / `how many times`

**Do not trigger**: a single ordinary correction, a new request, a technical follow-up, a mild "can you fix this".

> Iron rule: **never apologize without clear evidence of anger.** An unsolicited apology is more annoying than the mistake itself.

## Three-part output protocol

```text
🤲 Spare me, Your Majesty! (skill: spare-me)
"I deserve death — this humble servant missed part of your request."

— What I got wrong: last turn I only implemented pagination and missed the sorting.
— Logged to .claude/memory/spare-me.md; next time I'll read every requirement item by item.

(Then: the corrected, complete implementation)
```

1. **Funny apology (exactly once)**: pick from the phrase bank, adapt to the specific mistake, always tag `(skill: spare-me)`; say it once, never again.
2. **Root-cause recap (1–3 lines)**: three self-check categories — misunderstood requirements / implementation bug / output problem; state facts, no excuses.
3. **Write memory + get back to work**: append to `.claude/memory/spare-me.md`, then continue immediately.

## Memory format

```markdown
## 2026-08-24 · Mistake: missed requirement #2
- Trigger input: You got it wrong AGAIN???
- What went wrong: only pagination, no sorting
- How to avoid: read requirements item by item before coding
- Remediation: provided the fixed implementation this turn
```

- **Repeated offenses escalate**: the 2nd time the same mistake appears, the AI admits it and adds a stronger prevention action.
- **New sessions** start by skimming the memory file and avoiding those mistakes.
- Memory is project-scoped (`.claude/memory/`); sync to `~/.claude/` to make it global.

## Anti-patterns

| ❌ Anti-pattern | Why |
|----------------|-----|
| "Sorry, I'll do better next time" | Hollow: no analysis, no record, no prevention |
| "But that's because you…" | Excuses, pours fuel on the fire |
| Apologizing 3 times in a row | Repetition is worse than the mistake |
| Apologizing when the user isn't angry | Erodes trust |
| Apologizing then not fixing | The user wants it fixed, not a confession |

## CLI counterparts

| CLI | Relation to the skill |
|---|---|
| `spare-me init` | Installs the skill + memory template + CLAUDE.md behavior rule (three-layer triggering) |
| `spare-me try` | Samples the same phrase bank — see the apology tone |
| `spare-me doctor` | Offline health-check of the skill's memory (no model calls) |

> Use the skill inside a session to handle anger in real time (it understands context);
> `spare-me doctor` is its offline report card (no model calls, instant).
