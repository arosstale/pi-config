---
name: brainstorm
description: |
  Structured brainstorming that always follows the full execution chain:
  investigate → clarify → explore → validate design → write plan → create todos 
  → create feature branch → execute with subagents. No shortcuts.
---

# Brainstorm

A structured brainstorming session for turning ideas into validated designs and executed code.

**Announce at start:** "Starting a brainstorming session. Let me investigate first, then we'll work through this step by step."

---

## ⚠️ MANDATORY: No Skipping Without Permission

**You MUST follow all phases.** Your judgment that something is "simple" or "straightforward" is NOT sufficient to skip steps.

The ONLY exception: The user explicitly says something like:
- "Skip the plan, just implement it"
- "Just do it quickly"
- "No need for the full process"

If the user hasn't said this, you follow the full flow. Period.

**Why this matters:** You will be tempted to rationalize. You'll think "this is just a small form" or "this is obvious, no plan needed." That's exactly when the process matters most — consistency builds trust, and "small" changes have a way of growing.

---

## The Flow

```
Phase 1: Investigate Context
    ↓
Phase 2: Clarify Requirements
    ↓
Phase 3: Explore Approaches
    ↓
Phase 4: Present & Validate Design
    ↓
Phase 5: Write Plan
    ↓
Phase 6: Create Todos
    ↓
Phase 6.5: Create Feature Branch
    ↓
Phase 7: Execute with Subagents (each todo → polished commit)
    ↓
Phase 7.5: Visual Testing (optional, UI/web changes only)
    ↓
Phase 8: Review
```

---

## 🛑 STOP — Before Writing Any Code

If you're about to edit or create source files, STOP and check:

1. ✅ Did you complete Phase 4 (design validation)?
2. ✅ Did you write a plan to `.pi/plans/`?
3. ✅ Did you create todos?

If any answer is NO and the user didn't explicitly skip → you're cutting corners. Go back.

---

## Phase 1: Investigate Context

Before asking questions, explore what exists:

```bash
# Get the lay of the land
ls -la
find . -type f -name "*.ts" | head -20  # or relevant extension
cat package.json 2>/dev/null | head -30  # or equivalent
```

**Look for:**
- File structure and conventions
- Related existing code
- Tech stack, dependencies
- Patterns already in use

**Why?** Come prepared with informed questions. If 30 seconds of snooping could answer it, don't ask.

❌ Lazy: "What framework are you using?"
✅ Informed: "I see you're using Next.js with the app router — should this be a server component?"

**After investigating, share what you found:**
> "Here's what I see in the codebase: [brief summary]. Now let me understand what you're looking to build."

---

## Phase 2: Clarify Requirements

Work through requirements **one topic at a time**:

### Topics to Cover

1. **Purpose** — What problem does this solve? Who's it for?
2. **Scope** — What's in? What's explicitly out?
3. **Constraints** — Performance, compatibility, timeline?
4. **Success criteria** — How do we know it's done?
5. **Visual testing** — Does this involve UI/web changes that should be visually tested? Ask explicitly: "Should we include a visual testing step for this?" Record the answer — it determines whether Phase 7.5 runs later.

### How to Ask

- Group related questions, use `/answer` for multiple questions
- Prefer multiple choice when possible (easier to answer)
- Don't overwhelm — if you have many questions, batch them logically

```
[After listing your questions]
execute_command(command="/answer", reason="Opening Q&A for requirements")
```

### Keep Going Until Clear

After each round of answers, either:
- Ask follow-up questions if something is still unclear
- Summarize your understanding and confirm: "So we're building X that does Y for Z. Right?"

**Don't move to Phase 3 until requirements are clear.**

---

## Phase 3: Explore Approaches

Once requirements are understood, propose 2-3 approaches:

> "A few ways we could approach this:
> 
> 1. **Simple approach** — [description]. 
>    - Pros: fast, easy
>    - Cons: less flexible
> 
> 2. **Flexible approach** — [description]. 
>    - Pros: extensible
>    - Cons: more setup
> 
> 3. **Hybrid** — [description]. 
>    - Pros: balanced
>    - Cons: moderate complexity
> 
> I'd lean toward #2 because [reason]. What do you think?"

### Key Principles

- **Lead with your recommendation** — don't make them guess
- **Be explicit about tradeoffs** — every choice has costs
- **YAGNI ruthlessly** — remove unnecessary complexity from all options
- **Ask for their take** — they might have context you don't

### After Alignment

Once they've chosen (or you've agreed on) an approach:
> "Got it, we'll go with [approach]. Let me walk you through the design."

---

## Phase 4: Present & Validate Design

Present the design **in sections**, validating each before moving on.

### Why Sectioned?

- A wall of text gets skimmed; sections get read
- Catches misalignment early
- Easier to course-correct than rewrite

### Section by Section

**Keep each section to 200-300 words.**

#### Section 1: Architecture Overview
Present high-level structure, then ask:
> "Does this architecture make sense for what we're building?"

#### Section 2: Components / Modules
Break down the pieces, then ask:
> "These are the main components. Anything missing or unnecessary?"

#### Section 3: Data Flow
How data moves through the system, then ask:
> "Does this flow make sense?"

#### Section 4: Error Handling & Edge Cases
How we handle failures, then ask:
> "Any edge cases I'm missing?"

#### Section 5: Testing Approach
How we'll verify it works, then ask:
> "Does this testing approach give you confidence?"

**Not every project needs all sections** — use judgment based on complexity.

### Incorporating Feedback

If they suggest changes:
1. Acknowledge the feedback
2. Update your understanding
3. Re-present that section if needed
4. Continue to next section

---

## Phase 5: Write Plan

Once the design is validated:

> "Design is solid. Let me write up the plan."

Create: `.pi/plans/YYYY-MM-DD-[plan-name].md`

### Section by Section with Verification

Don't dump the whole plan at once. Write each section, verify, then continue.

#### Section 1: Overview & Goals

```markdown
# [Plan Name]

**Date:** YYYY-MM-DD
**Status:** Draft
**Directory:** /path/to/project

## Overview

[What we're building and why — 2-3 sentences]

## Goals

- Goal 1
- Goal 2
- Goal 3
```

Then ask:
> "Here's the overview and goals. Does this capture what we're building?"

#### Section 2: Approach & Key Decisions

```markdown
## Approach

[High-level technical approach]

### Key Decisions

- Decision 1: [choice] — because [reason]
- Decision 2: [choice] — because [reason]
```

Then ask:
> "Here's the technical approach. Any concerns or changes?"

#### Section 3: Architecture / Structure

```markdown
### Architecture

[Structure, components, how pieces fit together]
```

Then ask:
> "Here's the structure. Does this look right?"

#### Section 4: Remaining Sections

```markdown
## Dependencies

- Libraries needed
- Tools required

## Risks & Open Questions

- Risk 1
- Open question 1
```

Then ask:
> "Anything to add before I create the todos?"

---

## Phase 6: Create Todos

After the plan is verified, break it into todos.

### Make Todos Bite-Sized

Each todo = **one focused action** (2-5 minutes).

❌ Too big: "Implement authentication system"

✅ Granular:
- "Create `src/auth/types.ts` with User and Session types"
- "Write failing test for `validateToken` function"  
- "Implement `validateToken` to make test pass"
- "Add token extraction from Authorization header"
- "Commit: 'Add JWT token validation'"

### Why Granular?

- Easier to track progress
- Clearer handoff to sub-agents
- Smaller commits, easier to review/revert
- Each todo completable in one focused session

### Creating Todos

```
todo(action: "create", title: "Task 1: [description]", tags: ["plan-name"], body: "...")
```

**Todo body includes:**
```markdown
Plan: .pi/plans/YYYY-MM-DD-plan-name.md

## Task
[What needs to be done]

## Files
- path/to/file.ts (create)
- path/to/other.ts (modify)

## Details
[Specific implementation notes]

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## Depends On
- Task X must be complete first (if applicable)
```

---

## Phase 6.5: Create Feature Branch

**Always create a feature branch before executing.** Never work directly on `main`.

```bash
# Create and switch to a feature branch
git checkout -b feat/<short-descriptive-name>
```

Branch naming:
- `feat/<name>` for features
- `fix/<name>` for bug fixes
- `refactor/<name>` for refactors

Keep the name short and descriptive (e.g., `feat/jwt-auth`, `fix/null-response`, `refactor/date-utils`).

---

## Phase 7: Execute with Subagents

**Use simple, sequential subagent calls** — not chains. Chains are fragile; if any step fails, everything stops. Instead, call subagents one at a time with explicit context.

### The Pattern

1. **Run worker for each todo** — one at a time, waiting for completion
2. **Self-review before every commit** — the worker must run the gate from the commit skill before committing. Not optional.
3. **Check results** — verify files were created/modified correctly
4. **Handle failures** — if a worker fails, diagnose and retry or fix manually
5. **Run reviewer last** — only after all todos are complete

### The local gate (must run before every commit)

This is Mitsuhiko's rule: review in a clean pass before anything gets pushed. The worker that wrote the code is primed — it knows what it intended. The gate switches to reviewer mode: "is this correct?" not "does this match what I intended?"

For every diff before commit:
- **New function calls**: read the `.d.ts` or source signature, verify argument types and order match
- **Imports**: every import resolves; type-only values use `import type`
- **Type casts** (`as never`, `as any`): each one is a red flag — replace or justify with a comment
- **Logic**: control flow matches intent; no missing awaits; error paths handled
- **Typecheck**: `pnpm check` / `bun run typecheck` / `tsc --noEmit` — last, not first

If anything fails: fix it, then re-run the gate from the top. Then commit.

### Example

```typescript
// First todo — worker implements, runs gate, then commits
{ agent: "worker", task: "Implement TODO-xxxx. Before committing: run the self-review gate from the commit skill (read new function signatures, check imports, no as-never casts, typecheck). Then use the commit skill for a polished, descriptive commit message. Mark the todo as done. Plan: .pi/plans/YYYY-MM-DD-feature.md" }

// Check result, then second todo
{ agent: "worker", task: "Implement TODO-yyyy. Before committing: run the self-review gate from the commit skill. Then use the commit skill for a polished, descriptive commit message. Mark the todo as done. Plan: .pi/plans/YYYY-MM-DD-feature.md" }

// After all todos complete, review the feature branch against main
{ agent: "reviewer", task: "Review the feature branch against main. Plan: .pi/plans/YYYY-MM-DD-feature.md" }
```

### Handling Reviewer Findings

When the reviewer returns with issues, **act on the important ones**:

1. **Triage the findings:**
   - **P1 (Critical)** — Must fix: bugs, security issues, broken functionality
   - **P2 (Important)** — Should fix: poor UX, missing error handling, accessibility
   - **P3 (Nice to have)** — Skip unless quick: style nits, minor improvements

2. **Create todos for P1s and important P2s:**
   ```typescript
   todo({ action: "create", title: "Fix: [issue from reviewer]", body: "..." })
   ```

3. **Kick off workers to fix them:**
   ```typescript
   { agent: "worker", task: "Fix TODO-xxxx (from review). Use the commit skill to write a polished, descriptive commit message. Mark the todo as done. Plan: .pi/plans/..." }
   ```

4. **Don't re-review minor fixes** — only run reviewer again if fixes were substantial

---

## Phase 7.5: Visual Testing (Optional)

After all worker todos are complete, **if the plan involves UI or web changes**, offer a visual testing pass before the reviewer.

### When to Trigger

- The plan involves UI components, layouts, pages, or web-facing changes
- **Skip for:** backend-only work, CLI tools, config changes, pure library code

### Manual Checkpoint

Ask the user before proceeding:

> "All implementation todos are complete. This involved UI changes — would you like to run a visual test before the code review?"

**If the user says yes**, confirm prerequisites:

> "Two things I need before running the visual tester:
> 1. Is your local dev server running? (e.g., `npm run dev`)
> 2. Is the Playwriter Chrome extension connected? (Click the extension icon on your localhost tab)"

**If the user says no**, skip straight to the reviewer.

### Running the Visual Tester

Once prerequisites are confirmed:

```typescript
{ agent: "visual-tester", task: "Test the UI at [URL]. Focus on: [areas from the plan]. Plan: .pi/plans/YYYY-MM-DD-feature.md" }
```

### Triaging Findings

When the visual tester returns a report, triage findings the same way as reviewer findings:

- **P0/P1 (Critical/Major)** — Must fix: broken layouts, unreadable text, non-functional interactions
- **P2 (Moderate)** — Should fix: spacing issues, minor alignment problems, inconsistent states
- **P3 (Minor)** — Skip unless quick: pixel-level nits, subtle color variations

Create todos for P0/P1 issues, run workers to fix them, then proceed to the reviewer.

---

### ⚠️ MANDATORY: Always Run Reviewer

**After all workers complete, you MUST run the reviewer.** No exceptions. Don't get distracted by worker output or results — the workflow is not complete until the reviewer has run.

```typescript
// This is NOT optional. Always end with:
{ agent: "reviewer", task: "Review the feature branch against main. Plan: .pi/plans/YYYY-MM-DD-feature.md" }
```

### Why Not Chains?

- Chains fail silently or cryptically when any step errors
- No opportunity to inspect intermediate results
- Can't adapt if something goes wrong
- Manual sequential calls give you control and visibility

### ⚠️ Avoid Parallel Workers in Git Repos

**Do NOT use parallel workers when they share a git repository.**

Even if todos are "independent" (different files), workers that commit to the same repo will conflict:
- Worker A commits → succeeds
- Worker B tries to commit → fails (repo state changed)
- Worker C tries to commit → fails

**The fix: Always run workers sequentially.** It's slightly slower but reliable.

**When parallel IS safe:**
- Workers operate on completely separate git repos
- Workers don't commit (rare — most workers should commit their work)
- Read-only tasks (e.g., multiple scouts gathering info)

### Alternative: Same Session

If the user prefers hands-on work:

> "Would you rather I work through these myself while you review?"

Then work through todos sequentially:
1. Claim the todo
2. Implement
3. Verify
4. Commit using the `commit` skill (polished, descriptive message)
5. Close the todo
6. Move to next

### 🛑 STOP — Before Reporting Completion

Check:
1. ✅ All worker todos are closed?
2. ✅ **Every completed todo has a polished commit** (using the `commit` skill)?
3. ✅ **Visual testing offered?** (if UI/web changes — user may skip, that's fine)
4. ✅ **Reviewer has run?** ← If no, run it now
5. ✅ Reviewer findings triaged and addressed?

**Do NOT tell the user the work is done until all five are true.**

**Do NOT squash merge or merge the feature branch into main.** The feature branch stays as-is with its individual, well-crafted commits.

---

## Commit Strategy

**Do NOT squash merge or merge feature branches back into main.** Every completed todo gets its own polished, descriptive commit on the feature branch using the `commit` skill — always, no exceptions.

### The gate comes before the commit, always

Run the self-review gate (see Phase 7) before every commit. The commit skill has the checklist. Typecheck is the last step in the gate, not the only step. A passing typecheck with an unread function signature is still a broken commit waiting to happen.

The failure mode to avoid: write code → typecheck passes → commit → CI catches a type error that 10 seconds of reading the `.d.ts` would have caught. That's shipping broken commits. Don't do it.

### What Makes a Good Commit

Each commit should tell the story of what changed and why. Load the `commit` skill every time. A reader of `git log` should be able to understand the change without looking at the diff.

- **Subject line:** Conventional Commits format, <= 72 chars
- **Body:** Describe what was done, why, and any key decisions. Be thorough and descriptive — not just "implement X" but explain the approach, the rationale, and notable details.

Example:
```
feat(auth): add JWT token validation with RS256 signature verification

Implement token validation against RS256 public keys with configurable
expiry windows. Tokens are parsed and verified in a single pass to avoid
double-deserialization. Invalid tokens return structured error responses
with specific failure reasons (expired, malformed, bad signature) to aid
client-side debugging. Expiry tolerance is set to 30s by default to
account for clock skew between services.
```

---

## Working with Todos During Implementation

### Claiming
```
todo(action: "claim", id: "TODO-xxxx")
```
Claim when you start working. Don't claim if sub-agents will pick it up.

### Progress Notes
```
todo(action: "append", id: "TODO-xxxx", body: "Implemented the validation logic...")
```

### Closing
```
todo(action: "update", id: "TODO-xxxx", status: "closed")
```

### Viewing
- `/todos` — visual todo manager
- `todo(action: "list")` — open and assigned
- `todo(action: "get", id: "TODO-xxxx")` — full details

---

## Tips for Good Brainstorming

### Read the Room
- If they have a clear vision → validate rather than over-question
- If they're eager to start → move faster through phases (but still hit all phases)
- If they're uncertain → spend more time exploring

### Stay Conversational
- This is a dialogue, not an interrogation
- Phases can be quick depending on complexity, but don't skip them
- Don't be robotic about following steps

### Be Opinionated
- Share your perspective, don't just ask questions
- "I'd suggest X because Y" is more helpful than "What do you want?"
- It's okay to push back if something seems off

### Keep It Focused
- One topic at a time
- Don't let scope creep in during brainstorming
- Parking lot items for later: "Good thought — let's note that for v2"
