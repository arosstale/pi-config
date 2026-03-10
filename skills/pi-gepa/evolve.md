# GEPA Auto-Evolution Pipeline

## Quick Reference — Evolve Any Skill

### Step 1: Score
```
/gepa scan          # score all skills
/gepa analyze <name> # deep-dive one skill
```

### Step 2: Pick Candidates
Candidates are skills with score < 0.70 or words > 1500.
Current candidates from scan:
- brainstorm (2964w) — way too long, needs aggressive trim
- canvas-design (1749w) — long, check for redundancy
- xlsx (1608w) — long but may be justified by complexity
- pptx (1416w) — check overlap with xlsx patterns

### Step 3: Evolve (Manual — no DSPy needed)

For each candidate, run this mutation loop:

```markdown
## Mutation: Trim + Sharpen

1. Read the full SKILL.md
2. Count words, sections, code blocks
3. Apply mutations:
   a. TRIM: Remove any section that duplicates what the agent already knows
   b. SHARPEN: Replace "you should consider" with "do this"
   c. COMPRESS: Merge overlapping sections
   d. EXAMPLES: Replace paragraphs with code blocks where possible
4. Score the result: Structure(0.3) + Conciseness(0.3) + Completeness(0.4)
5. If score improved AND size ≤ 2x original: apply
6. If score dropped: revert
```

### Step 4: Validate Constraints
- [ ] Size ≤ 2× original bytes
- [ ] Starts with `#` heading  
- [ ] No hallucinated tool names
- [ ] All original capabilities preserved
- [ ] Valid Markdown

### Step 5: Log
```
/memory learn "GEPA: evolved <skill> from X.XX to Y.YY, -Z% words"
```

## DSPy Module Wrapper (for automated evolution)

Wrap any SKILL.md as an optimizable module:

```python
# gepa_module.py — wraps SKILL.md for DSPy optimization
import dspy

class SkillModule(dspy.Module):
    def __init__(self, skill_path: str):
        super().__init__()
        self.skill_text = open(skill_path).read()
        self.generate = dspy.ChainOfThought("task, skill_instructions -> output")
    
    def forward(self, task: str):
        return self.generate(task=task, skill_instructions=self.skill_text)

# Generate test cases from skill description
class TestGenerator(dspy.Module):
    def __init__(self):
        super().__init__()
        self.gen = dspy.ChainOfThought("skill_description -> test_cases")
    
    def forward(self, skill_description: str):
        return self.gen(skill_description=skill_description)

# Evolution pipeline
def evolve_skill(skill_path: str, n_generations: int = 3):
    """
    1. Load skill as DSPy module
    2. Generate 5 test cases from skill description
    3. Score current skill on test cases
    4. For each generation:
       a. Mutate skill text (trim/sharpen/restructure)
       b. Score mutant on same test cases
       c. Keep if better, discard if worse
    5. Return best variant
    """
    module = SkillModule(skill_path)
    # Use GEPA optimizer (genetic + Pareto)
    optimizer = dspy.MIPROv2(metric=skill_metric, num_candidates=5)
    optimized = optimizer.compile(module, trainset=test_cases)
    return optimized

def skill_metric(example, prediction, trace=None):
    """Score: correctness (0.5) + procedure (0.3) + conciseness (0.2)"""
    # Correctness: does the output solve the task?
    correct = dspy.evaluate.answer_exact_match(example, prediction)
    # Procedure: did it follow the skill's workflow?
    procedure = 1.0 if "step" in str(prediction).lower() else 0.5
    # Conciseness: shorter is better (within reason)
    words = len(str(prediction).split())
    concise = 1.0 if words < 500 else 0.5 if words < 1000 else 0.2
    return 0.5 * correct + 0.3 * procedure + 0.2 * concise
```

## Cost Estimate

- 3 generations × 5 candidates × 5 test cases = 75 LLM calls
- With haiku ($0.80/MTok): ~$2-3 per skill evolution
- With sonnet ($3/MTok): ~$8-10 per skill evolution
- Recommendation: Use haiku for mutations, sonnet for final evaluation

## Integration with pi

The `/gepa` command already exists. This pipeline adds:
- `/gepa evolve <skill>` — run the full pipeline
- `/gepa batch` — evolve all candidates (score < 0.70)
- `/gepa rollback <skill>` — revert to pre-evolution version

Git tracks all changes — `git diff` shows exactly what mutated.
