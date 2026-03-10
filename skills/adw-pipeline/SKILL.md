---
name: adw-pipeline
description: ADW (Agent Development Workflow) phase-chain pipeline. Plan → Build → Test → Review → Ship. Each phase is a discrete step with clear inputs/outputs. Use when building features end-to-end, not for quick fixes.
---

# ADW Phase-Chain Pipeline

From TAC's Grand Synthesis pattern #2. Composable phases for structured feature development.

## The 5 Phases

### Phase 1: Plan
**Input:** User request or PRD  
**Output:** `plan.md` with scope, approach, file list, test strategy  
**Model:** sonnet (reasoning without max cost)

```
1. Analyze the request
2. Identify affected files (read them)
3. Write plan.md: scope, approach, files to change, test cases
4. Get user approval before proceeding
```

### Phase 2: Build  
**Input:** Approved plan.md  
**Output:** Code changes  
**Model:** opus (implementation needs strongest model)

```
1. Read plan.md
2. Implement changes file by file
3. Each file: read → edit → verify syntax
4. No shortcuts — implement everything in the plan
```

### Phase 3: Test
**Input:** Code changes  
**Output:** Test results  
**Model:** sonnet (test writing is pattern-based)

```
1. Run existing tests (if any)
2. Write new tests for changed code
3. Run all tests, fix failures
4. Verify edge cases from plan.md
```

### Phase 4: Review
**Input:** All changes (git diff)  
**Output:** Review notes, fixes  
**Model:** sonnet (review is analytical)

```
1. Read the full diff
2. Check against plan.md — is everything covered?
3. Check for: bugs, security issues, missing error handling
4. Fix any issues found
5. Re-run tests
```

### Phase 5: Ship
**Input:** Reviewed, tested code  
**Output:** Commit + optional PR  
**Model:** haiku (commit messages are formulaic)

```
1. Stage changes
2. Write conventional commit message
3. Commit
4. Push (if configured)
```

## When to Use ADW

**Use ADW for:**
- New features (multi-file changes)
- Refactors affecting >3 files  
- Any task where you'd say "this needs a plan"

**Skip ADW for:**
- Quick fixes (typos, one-liner bugs)
- Documentation updates
- Config changes

## In Pi

Use pi's subagent chain:
```
chain: [
  { agent: "planner", task: "Plan: {task}" },
  { agent: "builder", task: "Build from plan: {previous}" },
  { agent: "worker",  task: "Test: {previous}" },
  { agent: "worker",  task: "Review: {previous}" }
]
```

Or manually follow the phases with model switches:
```
/model sonnet   → Plan
/model opus     → Build  
/model sonnet   → Test + Review
/model haiku    → Ship
```
