#!/usr/bin/env bash
# Check whether arosstale is in pi-mono's approved contributors list.
# Usage: ./check-approval.sh

set -euo pipefail

APPROVED=$(gh api repos/badlogic/pi-mono/contents/.github/APPROVED_CONTRIBUTORS \
  --jq '.content' \
  | python3 -c "import sys,base64; print(base64.b64decode(sys.stdin.read().strip()).decode())")

VACATION=$(gh api repos/badlogic/pi-mono/contents/.github/APPROVED_CONTRIBUTORS.vacation \
  --jq '.content' \
  | python3 -c "import sys,base64; print(base64.b64decode(sys.stdin.read().strip()).decode())")

echo "=== APPROVED_CONTRIBUTORS ==="
if echo "$APPROVED" | grep -qi "arosstale"; then
  echo "✓ arosstale is in the main approved list"
else
  echo "✗ NOT in main list"
fi

echo ""
echo "=== APPROVED_CONTRIBUTORS.vacation ==="
if echo "$VACATION" | grep -qi "arosstale"; then
  echo "✓ arosstale is in the vacation list"
else
  echo "✗ NOT in vacation list"
fi

echo ""
echo "=== Mario vacation status ==="
gh api "repos/badlogic/pi-mono/commits?per_page=30" \
  --jq '.[] | select(.commit.message | test("vacation|Vacation")) | "\(.commit.author.date[:10]): \(.commit.message | split("\n")[0])"' \
  2>/dev/null | head -3 || echo "(no recent vacation commits)"
