---
name: pi-mono-contributor
description: Contribute bug fixes to badlogic/pi-mono. Covers the approval gate, issue proposal, fix workflow, formatting, and PR submission. Use when working on pi-mono issues.
---

# Pi-Mono Contributor

Contribution pipeline for `badlogic/pi-mono`. Fork: `arosstale/pi-mono`. Work dir: `C:/Users/Artale/AppData/Local/Temp/pi-mono-fork`.

## Project & People

- **Mario (badlogic)** — sole maintainer, ~2357 commits. Merges everything. On vacation periodically (check `VACATION.md` in root).
- **Nico (nicobailon)** — approved contributor. Focus: TUI overlays, extension APIs, FooterDataProvider, input events.
- **Armin (mitsuhiko)** — approved contributor. Focus: fuzzy finder, HTML export, model switching, compaction UX.
- **Us (arosstale)** — **NOT YET APPROVED** (as of Feb 22 2026). Must open a Contribution Proposal issue and wait for Mario's `lgtm` before any PR. Windows experience. Focus: Windows bugs, extension fixes.

**Architecture:** TypeScript monorepo. 7 packages: `ai`, `tui`, `agent`, `coding-agent`, `mom`, `pods`, `web-ui`.  
**Priorities:** Bug fixes > features. Core stays minimal — extensions go to packages, not core.  
**One PR = one issue.** No bundling. No changelog edits (maintainer adds those).  
**Won't merge:** MCP in core, heavy orchestration, agent-hierarchy frameworks, anything that bloats core.

## Gate: Approval Required

`arosstale` must be in `.github/APPROVED_CONTRIBUTORS` before any PR. PRs from unapproved authors are auto-closed by `pr-gate.yml`.

Check approval status:
```bash
gh api repos/badlogic/pi-mono/contents/.github/APPROVED_CONTRIBUTORS --jq '.content' \
  | python3 -c "import sys,base64; print(base64.b64decode(sys.stdin.read().strip()).decode())" \
  | grep -i arosstale && echo "APPROVED" || echo "NOT APPROVED - open issue first"
```

If not approved:
1. Open a **Contribution Proposal** issue (template: `.github/ISSUE_TEMPLATE/contribution.yml`)
2. Keep it to one screen. Write in your own voice — AI slop gets closed.
3. Wait for Mario to comment `lgtm` → bot auto-adds you to the list.
4. Mario is on vacation until **March 2, 2026** (extended Feb 22 — still committing his own work). Check `VACATION.md` before any action. PRs wait until he's back.

## Rules

- Format: `npm run check` — runs Biome (tabs, width 120, indent 3) + tsgo + web-ui check. **Must pass with zero errors.**
- Tests: `./test.sh` from repo root. Must pass.
- Never edit `CHANGELOG.md` — maintainer does that.
- Never run `npm run dev`, `npm run build`, `npm test` (only `npm run check` + specific vitest).
- No `any` types unless absolutely necessary.
- No inline/dynamic imports — always top-level imports.
- No hardcoded keybinding strings — use `matchesKey()` with named keys from `DEFAULT_EDITOR_KEYBINDINGS` / `DEFAULT_APP_KEYBINDINGS`.
- Commit with `git add <specific-files>` only — never `git add -A` or `git add .` (parallel agents may be working).
- Never `git reset --hard`, `git checkout .`, `git clean -fd`, or `git stash`.
- Include `fixes #<number>` or `closes #<number>` in commit message.
- Add `pkg:*` labels to issues: `pkg:agent`, `pkg:ai`, `pkg:coding-agent`, `pkg:mom`, `pkg:pods`, `pkg:tui`, `pkg:web-ui`.

## Triage — Skip If

- External dependency issue
- macOS/Linux-only (we're on Windows — can't reproduce)
- Requires >5 files changed
- Vague or missing repro steps
- Recent maintainer commit in same area (check `git log --oneline -20 -- <file>`)
- Feature request during stabilization period

## Workflow

### 1. Check approval gate
```bash
# See above — confirm arosstale is in APPROVED_CONTRIBUTORS
```

### 2. Read the issue fully
```bash
gh issue view <NUMBER> --repo badlogic/pi-mono --json title,body,comments,labels,state
```
Read all comments. Understand root cause before touching code.

### 3. Check for duplicate PRs
```bash
gh pr list --repo badlogic/pi-mono --state open --search "<keywords>"
gh pr list --repo badlogic/pi-mono --state closed --search "<keywords>"
```
If already fixed or in-progress: stop.

### 4. Clone and branch
```bash
cd /tmp
git clone https://github.com/arosstale/pi-mono.git pi-mono-fork
cd pi-mono-fork
git remote add upstream https://github.com/badlogic/pi-mono.git
git fetch upstream
git checkout -b fix/ISSUE-slug upstream/main
npm install
```

### 5. Analyze
- Read every file you'll modify in full before editing.
- Check reference implementations: `rg -n "<pattern>" packages/`
- Search for ALL instances of the bug pattern — fix every one.
- Check existing tests to understand expected behavior.

### 6. Fix
- Minimal change. Match existing code style.
- No `any`, no inline imports, no hardcoded keys.
- Run after each change:
  ```bash
  npm run check   # must pass, full output — no tail
  ```
- Run specific tests if relevant:
  ```bash
  cd packages/<pkg> && npx tsx ../../node_modules/vitest/dist/cli.js --run test/<file>.test.ts
  ```

### 7. Commit
```bash
git status                        # verify only your files show up
git add packages/tui/src/foo.ts   # specific files only
git commit -m "fix(tui): short description

More detail on what changed and why.

fixes #ISSUE"
```

### 8. Push and open PR
```bash
git push origin fix/ISSUE-slug

gh pr create \
  --repo badlogic/pi-mono \
  --head arosstale:fix/ISSUE-slug \
  --base main \
  --title "fix(pkg): description" \
  --body-file scripts/pr-template.md
```

Fill in `scripts/pr-template.md` before running `gh pr create`.

### 9. Monitor
- Check if CI passes (`gh pr checks <PR> --repo badlogic/pi-mono`).
- Mario reviews open → oldest first. Vacation = wait.
- If he requests changes: amend and force-push with `--force-with-lease`.
- Never force-push without `--force-with-lease`.

## Open PR Count Check
```bash
gh pr list --repo badlogic/pi-mono --author arosstale --state open --json number --jq length
```
Keep it reasonable — don't flood with low-quality PRs.

## Mistakes to Avoid

- Running `npm run check` with `| tail` — get the full output, there may be errors above
- Editing `CHANGELOG.md` — maintainer only
- `git add -A` — stages other agents' work
- Submitting without reading the full issue + all comments
- Fixing only 1 of N instances of a bug — search the whole module
- Opening a PR without being in APPROVED_CONTRIBUTORS — it gets auto-closed
- Writing issue proposals that sound AI-generated — Mario closes them
- Touching files outside your scope — check `git status` before committing
