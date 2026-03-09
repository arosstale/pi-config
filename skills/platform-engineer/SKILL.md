---
name: platform-engineer
description: Apply Kelsey Hightower's Platform Engineering principles to infrastructure and developer experience. Focuses on Minimum Viable Infrastructure (MVI), Platform-as-a-Product, and outcome-oriented automation. Use when auditing infrastructure, evaluating tools, designing developer workflows, or when the user asks for a Kelsey/platform review.
---

# Platform Engineer Skill (Kelsey Hightower Edition)

Apply Kelsey Hightower's principles – simplicity, MVI, and developer experience – to platform and tooling decisions.

## Core Principles

### 1. Minimum Viable Infrastructure (MVI)
- **Least infrastructure possible.** Choose the simplest tool.
- **Complexity is a failure mode.** Avoid over-engineering.
- **Dependency Audit:** Minimize dependencies. Audit quarterly.
- Prioritize: "What happens if we DON'T add this?"

### 2. Platform as a Product
- **Developers are customers.** Build tools they *want* to use.
- **DX is key.** Measure developer speed to production.
- **One golden path.** Standardized workflows.
- **Self-service.** Automate access and reduce tickets.

### 3. Outcome-Oriented Automation
- **Focus on value.** Automate for experience, not just tasks.
- **AI as translation.** Use AI for interfaces, not core logic.
- **NoOps is absorption.** Platform teams manage complexity.
- **Automate toil, not thinking.** Script repetition, use humans for architecture.

### 4. Human-Centric Engineering
- **Judgment over code.** Value engineering decisions.
- **Fundamentals first.** Master Linux, networking, databases.
- **Value vs. Machines.** Focus on uniquely human skills.
- **Learn to say no.** Every tool adds maintenance.

### 5. Standard Roads
- **Opinionated defaults.** Allow customization.
- **SaaS/Serverless first.** Use custom infrastructure only when advantageous.
- **Configuration over code.** Use flags instead of feature branches.

## Workflows

### Infrastructure Audit
1. **Identify the outcome.** What business value?
2. **Count dependencies.** Services, configs, integrations.
3. **Check for overkill.** Simpler path/managed service?
4. **Assess overlap.** Consolidate redundant tools.
5. **Measure startup cost.** Boot/onboarding time.
6. **Check escape hatch.** Safe shutdown?

### Tool Selection
1. **Problem solved?** Be specific.
2. **Total cost?** Dollars, complexity, maintenance.
3. **Alternative?** Existing tools sufficient?
4. **Maintainer?** Production-ready dependency.
5. **Removable?** Avoid tight coupling.

### Designing a "Front Door"
1. Natural language/high-level interface.
2. Robust, simple logic underneath.
3. Handle errors at the platform level.
4. Obvious happy path, helpful error path.

## Anti-Patterns to Flag

| Anti-Pattern | Kelsey Says |
|-------------|-------------|
| Redundant tools | "One golden path" |
| Unnecessary packages | "Pay for what you use" |
| Complex configs | "Tool is wrong" |
| "Future-proofing" | "YAGNI" |
| Forced adoption | "Built the wrong thing" |
| Custom infra for basics | "Use managed service" |
| Slow startups | "Not a tool, a lunch break" |

## When To Apply This Skill

- **Toolchain audit**: Redundancy, unused packages?
- **New tool evaluation**: Is it MVI?