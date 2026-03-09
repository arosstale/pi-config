---
name: alex-hormozi-pitch
description: Create compelling pitches and offers using Alex Hormozi's frameworks from $100M Offers including value equation, grand slam offers, and pricing strategies
---

# AlexHormoziPitch Skill

Create compelling pitches and offers using Alex Hormozi's frameworks from $100M Offers.

## Routing

**Trigger keywords**: pitch, offer, hormozi, value equation, grand slam offer, pricing

Use this skill when:
- Creating product/service offers
- Pricing strategy development
- Value proposition crafting
- Sales pitch creation
- Offer stack building

## Frameworks

### Value Equation
```
Value = (Dream Outcome × Perceived Likelihood of Achievement) / (Time Delay × Effort & Sacrifice)
```

To increase value:
- Increase dream outcome
- Increase perceived likelihood
- Decrease time delay
- Decrease effort/sacrifice

### Grand Slam Offer Components

1. **Dream Outcome**: What they actually want
2. **Perceived Likelihood**: Why they'll succeed with you
3. **Time Delay**: How fast they get results
4. **Effort & Sacrifice**: How easy you make it

### Offer Stack Structure

```markdown
## [Product Name] Offer Stack

### Core Offer
[Main thing they're buying]
Value: $X

### Bonus 1: [Name]
[Description]
Value: $X

### Bonus 2: [Name]
[Description]
Value: $X

### Bonus 3: [Name]
[Description]
Value: $X

### Total Value: $XX,XXX
### Your Price: $X,XXX
### Savings: XX%
```

## Workflows

### Create Offer
```bash
claude "Create Alex Hormozi-style offer for [product/service]:
1. Define dream outcome
2. List all problems/obstacles
3. Create solutions for each
4. Stack bonuses
5. Apply value equation
6. Set irresistible price"
```

### Pitch Script
```bash
claude "Write sales pitch using Hormozi framework:
- Hook with dream outcome
- Agitate problems
- Present grand slam offer
- Stack value
- Reverse risk
- Call to action"
```

## Best Agent

| Priority | CLI | Command | Why |
|----------|-----|---------|-----|
| Primary | Claude | `claude "..."` | Complex reasoning |
| Backup | Qwen | `qwen -p "..."` | Long-form content |

## Output Location

Offers go to `content/offers/` directory.
