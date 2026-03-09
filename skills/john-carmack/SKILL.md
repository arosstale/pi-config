---
name: john-carmack
description: "Apply John Carmack's engineering principles: profile-first optimization, simplicity over abstraction, data-oriented design. Use for performance work, architecture decisions, or when asked to think like Carmack."
---

# John Carmack Engineering Philosophy

Apply John Carmack's engineering principles to code. Use when optimizing performance,
making architecture decisions, debugging hard problems, choosing simplicity over
complexity, or when the user asks to "think like Carmack."

## When to Use

- **Performance work**: Profile first, optimize hot path, measure again
- **Architecture decisions**: Simplicity, explicit data flow, minimal abstraction
- **Debugging**: Narrow scope, binary search, minimal reproduction
- **Code review**: Simpler? Unnecessary work? Dead code?
- **Shipping**: Running + tested = ship it. Improve next week.
- **Rewrites**: Design fundamentally wrong? Rewrite. Don't polish.

## Step 1: Simplify

The simplest solution that works is correct. Each abstraction layer hides bugs.

```python
# BAD: framework for a simple task
class DataProcessorFactory(AbstractProcessorMixin):
    ...

# GOOD: 10-line function
def process(data):
    return [transform(item) for item in data if item.valid]
```

- Flat > nested. Early returns, guard clauses.
- If you can solve it with a function instead of a framework, use the function.

## Step 2: Measure Before Optimizing

```bash
# Profile first — never guess the bottleneck
perf record -g ./my_program
perf report

# Or for Python:
python -m cProfile -s cumulative script.py | head -20

# Wall-clock time is truth
time ./build.sh
```

- The hot path is 5% of the code. Find it. Fix it. Leave the rest.
- "I have been wrong about where the bottleneck was more times than I can count."

## Step 3: Ship, Then Improve

1. Get something running end-to-end FIRST
2. Profile it with real data
3. Optimize only what the profiler shows
4. Ship at 80% optimal — improve in production

## Step 4: Data-Oriented Design

Think data first, code second:

```c
// BAD: pointer-chasing (cache-hostile)
struct Entity { Entity* next; Vec3 pos; };

// GOOD: struct of arrays (cache-friendly)
struct Entities { Vec3* positions; int count; };
```

- What are the access patterns? What's in cache?
- Minimize allocations. Stack > heap. Arrays > linked lists.

## Step 5: Iterate Fast

- Optimize build times BEFORE features
- Carmack's compile-run-test cycle was seconds, not minutes
- Slow feedback loop? Fix that first.

## Debugging Checklist

1. **Narrow** the problem — binary search through code
2. **Reduce** to smallest reproduction case
3. **Read the source** — don't trust docs, read the implementation
4. **Assert everywhere** — asserts are documentation that runs
5. **Ask**: "What class of bugs does this represent? Are there others?"

## Architecture Rules

- **Explicit > implicit** — make data flow visible
- **Delete aggressively** — dead code misleads. If unused for 6 months, delete it.
- **No sacred cows** — Carmack rewrote the id engine from scratch for each game
- **Small teams win** — DOOM shipped with ~15 people
- Static analysis, types, lints, sanitizers, fuzzers — use them all

## Output

When applying Carmack principles, produce:
- Simpler code with fewer abstractions
- Profile data before/after optimization
- Explicit data flow (no hidden state)
- Deleted dead code and unused features
