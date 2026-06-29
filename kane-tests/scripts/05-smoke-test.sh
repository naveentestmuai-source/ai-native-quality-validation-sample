#!/usr/bin/env bash
# =============================================================================
# 05-smoke-test.sh
# Quick 3-objective smoke test — ideal for PR validation and CI gates
# Run: bash kane-tests/scripts/05-smoke-test.sh
# =============================================================================

set -euo pipefail

BASE_URL="${KANE_BASE_URL:-http://localhost:5173}"
PASS=0
FAIL=0

run_test() {
  local name="$1"
  local objective="$2"
  echo ""
  echo "▶  $name"

  result=$(kane-cli run "$objective" --agent --headless 2>/dev/null | tail -1)
  status=$(echo "$result" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('status','unknown'))" 2>/dev/null || echo "error")
  summary=$(echo "$result" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('summary',''))" 2>/dev/null || echo "")

  if [ "$status" = "passed" ]; then
    echo "   ✅ PASSED — $summary"
    PASS=$((PASS + 1))
  else
    echo "   ❌ FAILED — $summary"
    FAIL=$((FAIL + 1))
  fi
}

echo "=============================================="
echo "  SMOKE TEST — Airbnb Clone"
echo "  Base URL: $BASE_URL"
echo "=============================================="

run_test "App loads and shows listings" \
  "Go to $BASE_URL, store whether property listing cards are visible on the home page as 'app_loaded', store the count of visible listings as 'listing_count'"

run_test "Login works with demo credentials" \
  "Go to $BASE_URL/login, enter guest@example.com in the email field, enter guest123 in the password field, click Sign In, store whether login succeeds and the user is redirected or authenticated as 'login_ok'"

run_test "Listing detail page loads correctly" \
  "Go to $BASE_URL, click the first listing card, store the listing title on the detail page as 'detail_title', store whether a price and Reserve or Book button are visible as 'detail_complete'"

echo ""
echo "=============================================="
echo "  SMOKE RESULTS: ✅ $PASS passed  ❌ $FAIL failed"
echo "=============================================="

[ "$FAIL" -eq 0 ] && exit 0 || exit 1
