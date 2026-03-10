---
name: brainstorm
description: |
  Structured brainstorming that always follows the full execution chain:
  investigate → clarify → explore → validate design → write plan → create todos 
  → create feature branch → execute with subagents. No shortcuts.
---

# Brainstorm

**Announce:** "Starting a brainstorming session. Let me investigate first."

## Mandatory Flow — No Skipping

Skip ONLY if user explicitly says "just do it" / "skip the plan."

```
1. Investigate → 2. Clarify → 3. Explore → 4. Validate Design
→ 5. Write Plan → 6. Create Todos → 6.5. Feature Branch
→ 7. Execute → 7.5. Visual Test (UI only) → 8. Review
```

**Before writing any code:** Did you validate design? Write a plan? Create todos? If no → go back.

## Phase 1: Investigate Context

```bash
ls -la && find . -type f -name "*.ts" | head -20
cat package.json 2>/dev/null | head -30
```

Look for: file structure, conventions, tech stack, related code. Share findings before asking questions.

## Phase 2: Clarify Requirements

Cover one topic at a time:
1. **Purpose** — What problem? Who's it for?
2. **Scope** — What's in/out?
3. **Constraints** — Performance, timeline?
4. **Success criteria** — How do we know it's done?
5. **Visual testing needed?** — Ask if UI changes involved.

Prefer multiple choice. Don't move on until requirements are clear.

## Phase 3: Explore Approaches

Propose 2-3 approaches with pros/cons. Lead with your recommendation:

> "I'd lean toward #2 because [reason]. What do you think?"

YAGNI ruthlessly. Be explicit about tradeoffs.

## Phase 4: Validate Design

Present design in sections (200-300 words each), validate each before moving on:
1. Architecture Overview
2. Components/Modules
3. Data Flow
4. Error Handling & Edge Cases
5. Testing Approach

Not every project needs all sections.

## Phase 5: Write Plan

Create `.pi/plans/YYYY-MM-DD-[name].md`:

```markdown
# [Plan Name]
**Date:** YYYY-MM-DD | **Status:** Draft | **Directory:** /path/to/project

## Overview
[2-3 sentences]

## Goals
- Goal 1, 2, 3

## Approach & Key Decisions
- Decision 1: [choice] — because [reason]

## Architecture
[Structure, components]

## Risks & Open Questions
```

Write section by section, verify each.

## Phase 6: Create Todos

Each todo = **one focused action** (2-5 minutes). Include: task description, files affected, acceptance criteria, dependencies.

❌ "Implement authentication system"
✅ "Create `src/auth/types.ts` with User and Session types"

## Phase 6.5: Feature Branch

```bash
git checkout -b feat/<short-name>  # or fix/ or refactor/
```

## Phase 7: Execute with Subagents

**Sequential workers, not chains.** One todo at a time:

```typescript
{ agent: "worker", task: "Implement TODO-xxxx. Run self-review gate before committing (read signatures, check imports, no as-never casts, typecheck). Use commit skill. Mark done." }
```

**Self-review gate before every commit:**
1. New function calls → verify argument types match `.d.ts`
2. Imports → all resolve, type-only use `import type`
3. Type casts (`as never`, `as any`) → red flag, replace or justify
4. Logic → control flow matches intent, no missing awaits
5. Typecheck → `tsc --noEmit` last

**No parallel workers in shared git repos** — they conflict on commits. Sequential only.

After all todos: **always run reviewer.**

```typescript
{ agent: "reviewer", task: "Review feature branch against main." }
```

Triage findings: P1 (must fix) → create todos → fix. P3 (nit) → skip.

## Phase 7.5: Visual Testing (UI changes only)

Ask: "Would you like a visual test before code review?" If yes, confirm dev server + Playwright extension running, then:

```typescript
{ agent: "visual-tester", task: "Test UI at [URL]. Focus: [areas from plan]." }
```

## Phase 8: Completion Checklist

Before reporting done:
- [ ] All todos closed with polished commits
- [ ] Visual testing offered (if UI)
- [ ] Reviewer ran
- [ ] Reviewer findings addressed
- [ ] Feature branch stays as-is (no squash merge into main)

## Commit Strategy

Each todo → one polished conventional commit. Load `commit` skill every time.

```
feat(auth): add JWT validation with RS256 signatures

Implement token validation against RS256 public keys with configurable
expiry. Tokens parsed in single pass. Invalid tokens return structured
errors (expired, malformed, bad signature). 30s expiry tolerance default.
```
