# pi-gepa — Genetic Evolution via Prompt Adaptation

Evolve pi skills, AGENTS.md, and agent prompts through mutation + selection.
Use when asked to "evolve a skill", "optimize my prompt", "mutate AGENTS.md",
"improve skill performance", "GEPA", or when a skill repeatedly fails a task.

## Core Loop

```
FAILURE → ANALYZE → GENERATE mutations → EVALUATE → PRUNE → AMPLIFY → APPLY
```

Four phases (G-E-P-A):
1. **Generate**: Create N variants via prompt mutation strategies
2. **Evaluate**: Score each variant (correctness 0.5 + procedure 0.3 + conciseness 0.2)
3. **Prune**: Keep top-K variants that pass constraints
4. **Amplify**: Recombine best traits into next generation

## Mutation Strategies

Pick strategy based on situation:

| Strategy | When | How |
|----------|------|-----|
| **Gaussian** | Fine-tuning a working skill | Small random perturbations (σ=0.1) |
| **Simulated Annealing** | Stuck in local optimum | Large early mutations, shrinking over time |
| **Crossover** | Two partial solutions exist | Blend parameters from both |
| **Adaptive** | Unknown territory | Auto-select strategy based on success rate |

## Workflow: Evolve a Skill

```bash
# Step 1: Analyze current skill
ag evolve --skill ~/.pi/agent/skills/<name>/SKILL.md --dry-run

# Step 2: Generate variants (uses LLM)
ag evolve --skill <path> --generations 3

# Step 3: Compare before/after
diff original.md evolved.md
```

### Manual Evolution (no deps)

When DSPy is unavailable, use this process:

1. **Read** the SKILL.md completely
2. **Identify** weak points using the scoring rubric:
   - Structure (0.3): Has ≥3 sections? Code blocks? Subheadings?
   - Conciseness (0.3): Under 1000 words? No filler?
   - Completeness (0.4): Has triggers, examples, steps, output format?
3. **Generate** 3 variants by applying one mutation each:
   - **Trim**: Remove redundant sections, merge overlapping content
   - **Sharpen**: Replace vague instructions with specific commands/patterns
   - **Restructure**: Reorder for agent consumption (triggers first, details last)
4. **Evaluate** each variant against the original on a test prompt
5. **Select** the best variant
6. **Validate** constraints:
   - Size ≤ 2x original
   - Starts with `#` heading
   - No hallucinated tool names
   - All original capabilities preserved

## Workflow: Failure-Driven Mutation

When a task fails using a skill:

1. **Capture** the execution trace (what tools were called, what failed)
2. **Classify** the failure pattern:
   - Context overflow → Add compression step
   - Tool misuse → Clarify tool selection rules
   - Reasoning error → Add explicit reasoning step
   - Wrong output format → Add output template
3. **Generate** a targeted mutation (patch, not rewrite)
4. **Apply** the mutation to SKILL.md
5. **Log** the mutation for rollback: `ag learn "GEPA: <description>"`

## Workflow: Batch Analysis

Score all skills and find evolution candidates:

```bash
# Analyze all pi skills
ag evolve --dir ~/.pi/agent/skills

# Output: ranked table with scores (0-1)
# Top candidates = high score + small size (most efficient)
# Bottom candidates = low score (most room for improvement)
```

## Scoring Rubric

```
Final Score = Structure (0.3) + Conciseness (0.3) + Completeness (0.4)

Structure (0-0.3):
  +0.1  Has ≥3 sections
  +0.1  Has code blocks
  +0.1  Has ## subheadings

Conciseness (0-0.3):
  +0.15 Under 2000 words
  +0.15 Under 1000 words
  -0.10 Over 3000 words

Completeness (0-0.4):
  Check for: trigger, when, use, example, step, workflow, output
  Score = 0.4 × (found / 7)
```

## Constraints (Hard Limits)

Every mutation MUST pass these before being applied:

1. **Size**: Evolved skill ≤ 2× original size in bytes
2. **Structure**: Must start with `#` heading
3. **No hallucination**: No invented tool names not in original
4. **Functionality**: All original capabilities preserved (manual check)
5. **Parseable**: Valid Markdown that renders correctly

## Example: Evolving the `commit` Skill

```
Current score: 0.61 (564 words)
Weakness: Low completeness — missing explicit examples and output format

Mutation: Sharpen
  + Add "## Examples" section with 3 commit message examples
  + Add "## Output" section specifying conventional commit format
  + Trim redundant "Guidelines" that duplicate git conventions

Result: 0.83 (480 words) — better score, fewer words
```

## Integration with ag CLI

```bash
ag evolve --skill <path>        # Evolve single skill
ag evolve --dir <path>          # Batch analyze
ag evolve --skill <path> --dry-run  # Score without changing
ag gaps                         # Find knowledge gaps (related)
ag learn "GEPA: mutation applied to X"  # Log evolution
```

## Key Insight

The best mutations are **subtractive** — they remove noise rather than add content.
A skill that went from 2000→800 words while keeping all capabilities scores higher
than one that went from 2000→3000 words with additions.
