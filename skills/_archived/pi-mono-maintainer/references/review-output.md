# Review Output Spec

Before submitting a PR, self-review against this spec. This is what Mario looks for.

## Self-Review Checklist

### A) Correctness
- Does the fix actually solve the root cause, not just the symptom?
- Are ALL instances of the bug fixed (searched the whole module)?
- Does it handle edge cases (nil, empty, narrow terminal, Windows paths)?

### B) Scope
- Is this the minimal change needed?
- Are any unrelated files touched? (they shouldn't be)
- Does it change default behavior for existing callers? (Mario flags this)

### C) Style
- Biome passes: tabs, indent 3, line width 120?
- No `any` types?
- No inline/dynamic imports?
- No hardcoded keybinding strings?
- `matchesKey()` used with named key constants?

### D) Tests
- Did you run `npm run check`? Full output, no tail.
- Did you run `./test.sh`?
- If you added behavior: is there a test for it?
- Are tests real (assert behavior) or performative (just run without asserting)?

### E) Commit
- Subject: `fix(pkg): imperative description` ≤ 72 chars?
- Body explains why, not just what?
- `fixes #NUMBER` present?
- Only specific files staged (not `-A`)?

### F) PR description
- No fluff, no emojis?
- Root cause stated in one sentence?
- Before/after behavior table if behavior changes?

## Structured Self-Review JSON

```json
{
  "ready": true,
  "scope": "minimal",
  "instances_checked": ["list all files searched"],
  "check_passed": true,
  "tests_passed": true,
  "changelog_edited": false,
  "default_behavior_changed": false,
  "concerns": []
}
```
