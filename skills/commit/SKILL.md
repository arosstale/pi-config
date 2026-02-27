---
name: commit
description: "Read this skill before making git commits, rebases, merges, cherry-picks, or any git operation"
license: From mitsuhiko/agent-stuff
---

## CRITICAL — Never open an interactive editor

Any git command that opens an editor will hang the agent forever.

| Command | Safe version |
|---------|-------------|
| `git commit` | `git commit -m "message"` |
| `git rebase --continue` | `GIT_EDITOR=true git rebase --continue` |
| `git merge --continue` | `GIT_EDITOR=true git merge --continue` |
| `git cherry-pick --continue` | `GIT_EDITOR=true git cherry-pick --continue` |
| `git rebase -i` | **Never use** |

---

## The gate: self-review before every push

Mitsuhiko's rule: review on an empty session locally until the agent is happy with the results
before pushing. "PR machine" review (push → CI → maintainer catches it) is too slow and too public.

**The self-review is not the same pass that wrote the code.** Switch roles: you are now a reviewer
who didn't write this. The question is "is this correct?" not "does this match what I intended?"

### Checklist — run this against `git diff HEAD` before pushing

**1. New function calls**
For every function/method introduced in the diff that you haven't called before in this repo:
- Read its actual declaration (`.d.ts`, source, `grep -n "export.*functionName"`). Not the docs — the signature.
- Verify argument count, order, and types match what you're passing.
- If the type is uncertain, stop and read the source. A TODO is better than a wrong assumption.

**2. Imports**
- Every import resolves to something that actually exists at that path.
- No type-only values imported as values (missing `type` keyword in ESM strict mode).

**3. Type casts**
- `as never`, `as any`, `as unknown` in the diff? Each one is a red flag. Replace with a real type or explain why it's safe with a comment.

**4. Logic**
- Does the control flow match the intent? Scan for off-by-ones, inverted conditions, missing awaits.
- Are error paths handled, or does the happy path silently swallow them?

**5. Consistency**
- Does this match the patterns already in the codebase? The agent orients on what's there — sloppy code teaches it to write sloppy code.
- Naming, indentation, export style consistent with surrounding files.

**6. Typecheck**
- Run `pnpm check`, `bun run typecheck`, or `npx tsc --noEmit` — whichever the project uses.
- This is the last check, not the first. The checklist above runs before it.

If anything in 1–6 fails: fix it, re-run the checklist from the top.

---

## Commit format

`<type>(<scope>): <summary>`

- `type`: `feat` / `fix` / `docs` / `refactor` / `chore` / `test` / `perf`
- `scope`: optional short noun (`api`, `parser`, `ui`)
- `summary`: imperative, ≤72 chars, no trailing period
- Body: **always include one** unless the change is a trivial typo. Explain what, why, and any notable decisions. A reader of `git log` should understand the change without looking at the diff.
- No breaking-change footers, no sign-offs.

---

## Steps

1. `git status` + `git diff` — understand what changed.
2. Run the self-review checklist above against the diff.
3. `git log -n 20 --pretty=format:%s` — check scope conventions if needed.
4. Ask if any staged files are ambiguous.
5. Stage the intended files.
6. `git commit -m "<subject>" -m "<body>"`.
7. Only commit here — **do not push** unless the user explicitly asks.
