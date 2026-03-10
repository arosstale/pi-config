---
name: openclaw-maintainer
description: "REFERENCE ONLY — describes how openclaw/openclaw maintainers review and merge PRs. Use this to understand what maintainers check so we can write better PRs."
---

# OpenClaw Maintainer (Reference Only)

We are contributors, not maintainers. Read this to understand what maintainers look for.

## Maintainer Watch: vincentkoc

@vincentkoc is a listed maintainer with a territorial pattern around **Slack**. He actively consolidates competing Slack PRs into his own branches (#23799 merged Feb 22). He posted a spam warning on our account (Feb 22 — unsubstantiated, PRs stayed open, steipete did not act on it).

**Rules when touching Slack:**
- Check for open vincentkoc PRs covering same files before submitting
- If he's active in the same module, hold off and review his PR instead
- Do not engage with his warnings — steipete is the sole authority

## What Maintainers Check Before Merging

- **One PR = one issue.** Bundled unrelated changes get rejected or split.
- **CHANGELOG.md entry** — required. Format: `- Scope/Area: description. (#PR) Thanks @handle.` under `### Fixes` in the `(Unreleased)` section.
- **Tests are real** — must exercise the actual bug path, not just pass.
- **`pnpm check` passes** — TypeScript errors block merge.
- **No self-comments** — contributors who comment on their own PRs look bad.
- **Security > stability > UX** — security fixes take priority.
- **Won't merge:** core skills (→ ClawHub), MCP in core (→ mcporter), agent-hierarchy frameworks, features during stabilisation.

## What Actually Gets Merged

Based on observation:
- Focused bug fixes with clear reproduction steps
- PRs where the author clearly used the software and hit the bug themselves
- Clean diffs with no scope creep
- Security fixes from contributors who understand the threat model

## Merge Process

Squash merge. Maintainer adds `Co-authored-by:`. New contributors get added to clawtributors. Oldest PRs processed first (more likely to conflict if left longer).

## How Steipete Handles the PR Backlog at Scale (Feb 2026)

From steipete directly:

> "I spun up 50 Codex in parallel, let them analyze the PR and generate a JSON report
> with various signals, comparing with vision, intent (much higher signal than any of the
> text), risk and various other signals. Then I can ingest all reports into one session
> and run AI queries / de-dupe / auto-close / merge as needed on it.
> Same for Issues. Prompt Requests really are just issues with additional metadata.
> Don't even need a vector db. There's like 8 PRs for auto-update in the last 2 days alone
> (still need to ingest 3k PRs, only have 1k so far)."

**What this means for us:**

- Every PR gets a machine-generated JSON signal report: intent, scope, risk, correctness, vision (what the diff *actually* does), duplicates
- **Intent and vision are higher signal than PR title/description** — the model reads the diff, not just what you wrote
- **Duplicate detection is automated** — 8 PRs touching the same bug = 7 get auto-closed
- **Auto-close is real** — features during stabilisation, duplicates, and no-repro issues get closed programmatically
- The queue is ~4000 PRs. Steipete has ingested ~1000. Yours is in there eventually.

**Implications for writing PRs:**

1. **The diff is the truth** — write a clean, focused diff. The AI reads it directly. Scope creep is visible.
2. **One issue per PR is enforced at the signal level** — bundled changes get flagged as `risk=medium/high`
3. **Duplicate check is on files + intent**, not just title — check open PRs by *files changed*, not keyword search
4. **`correctness` signal** — the model judges whether your fix actually solves the problem. A wrong fix scores `correctness=low` and won't merge even if CI is green
5. **`vision` field** — one-sentence description of what the diff does. If yours says "adds unrelated test helpers" alongside the fix, that's flagged

## For Us as Contributors

- Write the PR description as a teaching document — maintainer has never seen this bug
- One fix per PR
- CHANGELOG entry mandatory
- If a maintainer comments: fix the code, don't reply
- Discord first for anything non-trivial: https://discord.gg/qkhbAGHRBT
