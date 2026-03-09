---
name: steipete-pr-triage
description: Parallel AI-powered PR/Issue triage at scale. Spin up N subagents to analyze PRs in parallel, each producing a structured JSON signal report. Then ingest all reports into a single session for dedup, auto-close, merge-candidate ranking, and query. Based on steipete's technique for handling openclaw's 3000+ PR backlog.
---

# Steipete PR Triage

## The Technique

From steipete (@steipete, openclaw maintainer):

> "I spun up 50 Codex in parallel, let them analyze the PR and generate a JSON report
> with various signals, comparing with vision, intent (much higher signal than any of the
> text), risk and various other signals. Then I can ingest all reports into one session
> and run AI queries / de-dupe / auto-close / merge as needed on it.
> Same for Issues. Prompt Requests really are just issues with additional metadata.
> Don't even need a vector db."

Key insight: **intent > text**. The JSON signal report captures what the PR *actually does*
vs what it claims. Dedup happens at signal level, not title/description level.

## Signal Report Schema

Each subagent produces a JSON report for one PR:

```json
{
  "pr": 23582,
  "title": "fix(tool-policy): add group:fs and group:runtime to group:openclaw",
  "author": "arosstale",
  "signals": {
    "intent": "bug-fix",
    "scope": ["tool-policy", "agents"],
    "risk": "low",
    "correctness": "high",
    "test_coverage": "regression-test-added",
    "diff_size": "small",
    "changelog": true,
    "issue_ref": "#23610",
    "ai_assisted": true
  },
  "vision": "removes two missing sub-groups from group:openclaw; one-line change per group plus expanded test assertions",
  "duplicates_of": [],
  "merge_candidate": true,
  "auto_close_reason": null,
  "summary": "group:openclaw was missing read/write/exec/process. deny:['group:openclaw'] left those tools unblocked. Minimal focused fix with regression test."
}
```

## Workflow

### Phase 1 — Parallel Analysis

Run N subagents (one per PR batch) via `subagent` tool in PARALLEL mode:

```
tasks:
  - agent: scout
    task: "Fetch PR #N diff via gh pr diff N -R owner/repo. Analyze: intent, scope, risk (low/med/high), correctness (high/med/low/unknown), test_coverage, diff_size, changelog entry present, issue ref, duplicates (search open PRs for same title/files). Output JSON signal report."
  - agent: scout
    task: "Fetch PR #M ..."
```

Batch size: 10–20 PRs per subagent to stay within context limits.

### Phase 2 — Ingest & Query

Load all JSON reports into one session. Then run natural language queries:

```
"Which PRs fix the same bug? Group by (files changed ∩ intent)"
"Show all PRs with risk=high and no test coverage"
"List merge candidates: correctness=high AND changelog=true AND risk=low"
"Auto-close list: intent=feature AND we're in stabilisation mode"
"Which PRs touch discord/monitor/message-handler.process.ts?"
```

### Phase 3 — Actions

For each action group, run in parallel:
- **Merge candidates**: `gh pr merge N --squash -R repo`
- **Auto-close**: `gh pr close N -R repo --comment "Closing: duplicate of #M / feature during stabilisation / ..."`
- **Needs review**: post structured comment via `gh pr comment`

## Implementation

### Fetch PR batch (per subagent task)

```bash
# Get PR list
gh api "repos/OWNER/REPO/pulls?state=open&per_page=100&page=N" \
  --jq '.[] | {number, title, author: .user.login, additions, deletions, created_at}'

# Get diff
gh pr diff PR_NUMBER -R OWNER/REPO

# Get files changed
gh api "repos/OWNER/REPO/pulls/PR_NUMBER/files" \
  --jq '.[].filename'
```

### Signal extraction prompt (per PR)

```
Analyze this PR diff and metadata. Produce a JSON signal report with:
- intent: one of bug-fix / feature / docs / refactor / test / chore
- scope: array of modules/areas touched (infer from file paths)
- risk: low / medium / high (based on what could break)
- correctness: high / medium / low / unknown (does the fix actually solve the stated problem?)
- test_coverage: none / existing-passes / regression-test-added / e2e-added
- diff_size: tiny (<10 lines) / small (<50) / medium (<200) / large (200+)
- changelog: true/false
- issue_ref: issue number or null
- vision: one sentence describing what the diff actually does (ignore the PR description)
- duplicates_of: list of PR numbers that fix the same thing (check by files + intent)
- merge_candidate: true/false
- auto_close_reason: null or one of: duplicate / feature-during-stabilisation / already-in-main / too-broad / no-repro
- summary: 1-2 sentence plain English summary for maintainer
```

### Dedup detection

Two PRs are duplicates when:
- Same primary file(s) changed AND same intent AND similar vision
- OR: one PR's changes are a strict subset of another's

Check with:
```bash
gh api "repos/OWNER/REPO/pulls?state=open&per_page=100" \
  --jq '.[] | {number, title}' | \
  grep -i "KEYWORD"
```

## Tuning Parameters

| Parameter | Value | Notes |
|-----------|-------|-------|
| Subagents | 10–50 | More = faster; diminishing returns past context size |
| PRs per subagent | 10–20 | Adjust for diff size |
| Dedup window | All open PRs | Not just recent |
| Risk threshold for auto-merge | low only | Never auto-merge medium/high |
| Stabilisation filter | reject features | During release freeze |

## Openclaw-specific

When triaging openclaw/openclaw:

- **Stabilisation mode**: reject `intent=feature` (maintainer confirmed)
- **High-signal dup check**: 8 PRs for auto-update in 2 days → close all but best one
- **Author signals**: known contributors (steipete, gumadeiras, tyler6204) get higher trust
- **AI-assisted disclosure**: check for `[AI-assisted]` in body — required by CONTRIBUTING.md
- **CHANGELOG format**: `- Scope/Area: description. (#PR) Thanks @handle.`

## Notes

- No vector DB needed — JSON reports are small enough to fit in one context window for ~500 PRs
- Intent is higher signal than title/description — models frequently mislabel their own PRs
- Vision (what the diff *actually does*) catches: wrong fix, incomplete fix, scope creep, hidden changes
- Run Phase 1 async, collect all reports, then Phase 2 synchronously for coherent dedup
