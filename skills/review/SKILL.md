---
name: review
description: Clean-slate review of uncommitted or unpushed changes before they leave the machine. Implements Mitsuhiko's rule — review in a fresh context before pushing, not after CI catches it. Use when asked to "review my changes", "check this before I push", or "/review".
---

# Review

Mitsuhiko's rule: "If you use a clanker to commit, you should /review on an empty session locally until the clanker is happy with the results before you push it up."

This skill is that review. It runs as a fresh reader — not the session that wrote the code. The question is "is this correct?" not "does this match what I intended?"

---

## What to review

By default: `git diff HEAD` (all uncommitted changes).

If the user specifies a scope:
- `git diff HEAD~N` — last N commits
- `git diff main..HEAD` — everything on the current branch vs main
- A specific file path

---

## The checklist

Work through the diff systematically. For each file changed:

### 1. New function calls
For every function or method introduced in the diff that wasn't already in the file:
- Find its actual declaration: grep the source, read the `.d.ts`, or check the import.
- Verify: argument count, order, and types match what's being passed.
- If a type is genuinely uncertain: say so explicitly. A TODO is better than a confident wrong assumption.

### 2. Imports
- Every import resolves to a real export at that path.
- Types imported as values without `import type` in ESM strict mode will fail at runtime.
- Removed imports that are still used elsewhere in the file.

### 3. Type casts
Flag every `as never`, `as any`, `as unknown` in the diff. Each one needs a justification:
- Is it genuinely necessary?
- Is there a real type that could replace it?
- If kept: is there a comment explaining why it's safe?

### 4. Logic
- Does the control flow match the stated intent?
- Missing `await` on async calls?
- Error paths: are they handled, or does the happy path silently swallow failures?
- Off-by-ones, inverted conditions, wrong variable used?

### 5. Consistency with the codebase
- Does this match the patterns already in the surrounding files?
- Naming, indentation, export style consistent with neighbours?
- (Gratzer's point: the agent orients on what's there — inconsistent code teaches future agents to write inconsistent code.)

### 6. Typecheck
Run the project's typecheck command last:
- `pnpm check` (pi-mono, biome + tsgo)
- `bun run typecheck` (pi-builder)
- `npx tsc --noEmit` (generic TypeScript)

This is confirmation, not the primary check. If steps 1–5 were done honestly, typecheck should pass.

---

## Output format

Be direct. Report findings as:

**✅ Clean** — if nothing found, say so clearly.

**Issues found:**
```
[file.ts:42] new function call — ExistingFunction(a, b, c) but signature is (a: string, b: number): void — c is not a parameter
[file.ts:88] import type missing — StopReason used as type but imported as value
[file.ts:120] as never — bypasses type check on sessionOptions; replace with CreateAgentSessionOptions
[file.ts:155] missing await — session.prompt() is async but called without await
```

For each issue: file, line, what's wrong, what to do instead.

If everything is clean after running all six steps: say so and the code is ready to push.

---

## What this is not

This is not a code style review, not an architecture review, not a completeness review. Those have their place. This is specifically: **will this break when it runs?** That's the question Mitsuhiko is asking before the push.
