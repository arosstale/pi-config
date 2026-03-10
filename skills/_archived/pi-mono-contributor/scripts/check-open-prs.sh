#!/usr/bin/env bash
# Show our open PRs and the full open PR queue for pi-mono.
# Usage: ./check-open-prs.sh

set -euo pipefail

echo "=== Our open PRs ==="
COUNT=$(gh pr list --repo badlogic/pi-mono --author arosstale --state open --json number --jq length 2>/dev/null || echo 0)
echo "arosstale has $COUNT open PR(s)"
gh pr list --repo badlogic/pi-mono --author arosstale --state open \
  --json number,title,createdAt --jq '.[] | "#\(.number) \(.title) (\(.createdAt[:10]))"' 2>/dev/null

echo ""
echo "=== All open PRs (oldest first) ==="
gh pr list --repo badlogic/pi-mono --state open \
  --json number,title,author,createdAt \
  --jq 'sort_by(.createdAt) | .[] | "#\(.number) [\(.author.login)] \(.title) (\(.createdAt[:10]))"' 2>/dev/null

echo ""
echo "=== Recent commits to main ==="
gh api "repos/badlogic/pi-mono/commits?per_page=5" \
  --jq '.[] | "\(.commit.author.date[:10]) \(.author.login // .commit.author.name) — \(.commit.message | split("\n")[0])"' 2>/dev/null
