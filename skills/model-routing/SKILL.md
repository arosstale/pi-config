---
name: model-routing
description: Route to the optimal model based on task type. Classify → haiku, plan → sonnet, implement → opus, review → sonnet, commit message → haiku. Saves 40-60% on costs by not using expensive models for cheap tasks.
---

# Model Routing per Task Type

From TAC's Grand Synthesis pattern #3. One dict: classify the task, pick the model.

## The Routing Table

| Task Type | Model | Why |
|-----------|-------|-----|
| **Classify / Triage** | haiku | Fast, cheap, good enough for categorization |
| **Plan / Architecture** | sonnet | Needs reasoning but not max creativity |
| **Implement / Code** | opus (or sonnet for simple) | Complex multi-file needs strongest model |
| **Review / Audit** | sonnet | Good at finding issues, doesn't need to create |
| **Commit Messages** | haiku | Formulaic, fast, cheapest |
| **Documentation** | sonnet | Needs clarity but not deep reasoning |
| **Research / Analysis** | opus | Needs deepest reasoning |
| **Tests** | sonnet | Pattern-based, moderate complexity |
| **Quick Fix / Typo** | haiku | Trivial tasks, fastest response |

## How to Apply

Before starting a task, classify it and switch models:

- **"Fix this typo"** → stay on haiku
- **"Plan the architecture for X"** → switch to sonnet  
- **"Implement the full feature"** → switch to opus
- **"Review these changes"** → sonnet is enough
- **"Write a commit message"** → haiku

## Cost Impact

Typical session without routing: 100% opus = $15/MTok input
With routing: ~30% haiku ($0.80) + ~50% sonnet ($3) + ~20% opus ($15) = **~$4.66/MTok avg**

**That's a 69% cost reduction** for the same quality output.

## In Pi

Use `/model` to switch mid-session:
```
/model haiku     # for quick tasks
/model sonnet    # for planning/review  
/model opus      # for heavy implementation
```

The agent should proactively suggest model switches when task complexity changes.
