# Benchmaxxing — Max Woolf's Agent Optimization Pipeline

> "The real annoying thing about Opus 4.6/Codex 5.3 is that it's impossible to publicly say they're an order of magnitude better than coding LLMs released just months before without sounding like an AI hype booster — but it's the counterintuitive truth." — Max Woolf

## When to Use
Trigger on: "benchmaxx", "optimize with agents", "agent pipeline for performance", "Woolf pipeline", "implement → benchmark → optimize", "model chaining for quality"

## The Pipeline (8 Phases)

### Phase 1: Implement with Constraints
Use a **fast model** (Codex, Haiku) for initial implementation.
Include hard functional constraints in the prompt:
```
- MUST handle edge case X
- MUST support input type Y  
- NEVER use library Z (we need zero-dep)
```

### Phase 2: Create Benchmarks FIRST
Before any optimization, establish ground truth:
```bash
# Create benchmark script that measures:
# 1. Correctness (vs reference implementation)
# 2. Speed (wall clock + CPU time)
# 3. Memory usage
# 4. Edge case handling
```
Use `pi-arena arena_run` to record baseline numbers.

### Phase 3: Cleanup Pass
Switch to **reasoning model** (Opus, o3) for structural improvements:
- Remove dead code
- Fix naming conventions
- Add type safety
- Initial algorithmic improvements

### Phase 4: Optimize to 60% Runtime
Target: reduce to 60% of Phase 2 baseline (1.7x faster).
```
Focus on:
- Algorithm selection (O(n²) → O(n log n))
- Data structure choice (Vec vs HashMap vs BTreeMap)
- Memory allocation patterns
- Loop vectorization hints
```

### Phase 5: Profile with Flamegraph
```bash
# Rust: cargo flamegraph
# Node: node --prof + node --prof-process
# Python: py-spy record -o profile.svg -- python bench.py
```
Feed the flamegraph to the reasoning model:
"Here is the flamegraph. The hotspot is in X. Optimize it."

### Phase 6: Final Optimization Pass
Agent-specific optimizations:
- SIMD hints
- Cache line alignment
- Branch prediction optimization
- Parallelism (rayon, worker_threads)

### Phase 7: Add Language Bindings
If Rust: use pyo3 for Python bindings.
If C/C++: use napi-rs for Node bindings.
```
This multiplies the value — fast core + ergonomic API.
```

### Phase 8: Verify Against Known-Good
Compare output against established libraries:
```
- scikit-learn reference output
- Known test vectors
- Published benchmark datasets
```

## Model Chaining Strategy
```
Phase 1-2: Fast model (Codex 5.3, Haiku 4.5)  → speed, iterate quickly
Phase 3-4: Reasoning model (Opus 4.6, o3)       → deep optimization
Phase 5-6: Reasoning model with context          → profile-guided optimization
Phase 7-8: Fast model                            → mechanical binding work
```

## Results Max Achieved
| Algorithm | vs Rust crate | vs Python lib |
|-----------|--------------|---------------|
| UMAP | 2–10x faster | 9–30x faster |
| HDBSCAN | 23–100x faster | 3–10x faster |
| GBDT | 1.1–1.5x faster | 24–42x faster fit |

## Integration with Pi Ecosystem
- **pi-arena**: Record benchmark runs at each phase with `arena_run`
- **pi-perf**: Use `perf_bench` for iteration timing
- **pi-validate**: Run `/validate` at each phase to track quality
- **Subagents**: Use fast model for Phase 1-2, reasoning model for Phase 3-6

## The AGENTS.md Factor
Max's key discovery: a detailed `AGENTS.md` (or `CLAUDE.md`) transforms output quality.
Effective rules:
- "NEVER use emoji in code comments"
- "MUST avoid redundant comments — code should be self-documenting"
- "Write prompts as separate Markdown files, tracked in git"
- Domain-specific conventions (naming, error handling, logging patterns)

## Source
Based on Max Woolf (minimaxir): "An AI agent coding skeptic tries AI agent coding, in excessive detail" (Feb 27, 2026)
