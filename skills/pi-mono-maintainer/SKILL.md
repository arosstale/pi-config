---
name: pi-mono-maintainer
description: "REFERENCE ONLY — describes how Mario maintains badlogic/pi-mono. We are contributors, not maintainers. Use this to understand how Mario reviews and merges so we can write PRs that pass his process."
---

# Pi-Mono Maintainer Reference

**We are NOT maintainers.** This describes Mario's pipeline so we can write PRs that fit it.  
Repo: `badlogic/pi-mono`. Mario's handle: `badlogic`.

## How Mario Works

- **Solo maintainer.** No other person merges PRs. Everything flows through him.
- **Vacation blocks all merges.** Check `VACATION.md` at repo root. He announces via commit (`"Extend OSS vacation to ..."`).
- **Works in bursts.** Merges 5–15 PRs in a session, then goes quiet for days.
- **Squash merges everything.** One commit per PR on main.
- **Edits contributor code.** Mario will fix issues in your PR himself before merging. He doesn't always ask.
- **Writes changelog entries himself.** Do not touch `CHANGELOG.md`.
- **Lockstep versioning.** All 7 packages always share the same version. Releases via `npm run release:patch` or `release:minor`.

## What Gets Merged

- **Bug fixes** — always welcome if minimal and correct.
- **Windows fixes** — Mario merged mrexodia's VT input fix (#1495) and paste detection (#1526). Windows PRs get through.
- **Small, focused TUI/extension improvements** — Nico and Armin's style: targeted, no bloat.
- **New providers to `packages/ai`** — welcome if all required tests are included (see AGENTS.md provider checklist).

## What Gets Closed

- PRs without approval gate → auto-closed by `pr-gate.yml` workflow.
- AI-generated slop issues (he's explicit about this in CONTRIBUTING.md).
- Core bloat — anything that should be an extension goes to packages, not core.
- Bundled PRs — one issue, one PR. No exceptions.
- PRs touching `CHANGELOG.md` — he does that himself.
- Features during stabilization periods.

## The Gate Workflow (understand this)

```
contributor opens issue →
  Mario comments "lgtm" →
    bot adds handle to APPROVED_CONTRIBUTORS →
      contributor opens PR →
        pr-gate.yml checks list →
          if approved: CI runs
          if not: PR auto-closed with instructions
```

During vacation: Mario checks issues when back. `APPROVED_CONTRIBUTORS.vacation` is a separate list he maintains for trusted contributors who can PR while he's out.

## Mario's Review Style

From watching merged PRs and his comments on #1237:

- **He reads the diff, not just the description.** Write clear code, not clever code.
- **He checks for default behavior changes.** If your PR changes what happens when a caller passes nothing, he'll flag it.
- **He prefers opt-in over opt-out.** `#1237`: "if shortDescription is given, include, otherwise don't" — explicit over implicit.
- **He's direct, not chatty.** Short review comments. Don't pad your PR descriptions.
- **He merges fast when it's clean.** mrexodia's Windows VT fix: opened Feb 14, merged same day.
- **He fixes things himself.** He'll often just amend your commit rather than ask you to fix nits.

## PR Structure Mario Likes

Based on merged PRs:

```
fix(pkg): short description in imperative mood

Optional body: what changed, why, edge cases considered.

fixes #NUMBER
```

- Subject line: `fix(tui):`, `feat(ai):`, `refactor(coding-agent):` — conventional commits, imperative.
- No emojis anywhere — commits, issues, PR comments, code.
- No fluff ("Thanks so much!") — direct technical prose only.
- Body explains *why*, not just *what*.
- `fixes #NUMBER` closes the issue on merge.

## Gates Mario Runs Before Merging

From `.github/workflows/ci.yml` and AGENTS.md:

```bash
npm run check     # Biome lint+format (tabs, indent 3, width 120) + tsgo + web-ui check
./test.sh         # full test suite
```

Your PR must pass `npm run check` with **zero errors and zero warnings** before Mario even looks at it. If CI is red he won't review.

## Active Contributors to Watch (Their PRs Get Priority)

| Handle | Focus | Approval |
|--------|-------|---------|
| nicobailon | TUI overlays, extension APIs | ✓ vacation list |
| mitsuhiko | Fuzzy finder, model UX, compaction | ✓ vacation list |
| mrexodia | Windows, debugger tooling | ✓ vacation list |
| hjanuschka | Vacation VACATION.md, session dir events | ✓ vacation list |
| ferologics | Deep review, system theme | ✓ vacation list |
| barapa | TUI autocomplete | ✓ main list |

## Timing

- **Mario is on vacation until March 2, 2026** (extended Feb 22 — still committing his own fixes).
- PRs #1481 and #1237 are both sitting open, waiting for him.
- Best window: have a clean approved PR ready so it's at the top when he returns March 2.
- Oldest PRs reviewed first (he processes the backlog in order).

## Package Labels

Always add to issues and PRs:
- `pkg:agent` — `packages/agent`
- `pkg:ai` — `packages/ai`
- `pkg:coding-agent` — `packages/coding-agent`
- `pkg:mom` — `packages/mom`
- `pkg:pods` — `packages/pods`
- `pkg:tui` — `packages/tui`
- `pkg:web-ui` — `packages/web-ui`

## Checklist: Is Our PR Ready for Mario?

- [ ] `arosstale` is in `APPROVED_CONTRIBUTORS` or `APPROVED_CONTRIBUTORS.vacation`
- [ ] `npm run check` passes with zero errors in CI
- [ ] `./test.sh` passes
- [ ] One issue, one PR — nothing bundled
- [ ] No `CHANGELOG.md` edits
- [ ] Conventional commit subject (`fix(pkg): description`)
- [ ] `fixes #NUMBER` in commit body
- [ ] No `any` types introduced
- [ ] No inline/dynamic imports
- [ ] No hardcoded keybinding strings
- [ ] `git add <specific-files>` only — no `-A`
- [ ] PR description is concise, technical, no AI fluff
- [ ] Package label added to the issue
