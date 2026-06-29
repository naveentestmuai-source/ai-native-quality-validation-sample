#!/usr/bin/env bash
# =============================================================================
# 04-api-tests.sh
# Kane-CLI objectives validating the backend REST API directly
# Run: bash kane-tests/scripts/04-api-tests.sh
# =============================================================================

set -euo pipefail

BASE_URL="${KANE_BASE_URL:-http://localhost:5173}"
API_URL="${KANE_API_URL:-http://localhost:5000}"
PASS=0
FAIL=0

run_test() {
  local name="$1"
  local objective="$2"
  echo ""
  echo "▶  $name"
  echo "   Objective: $objective"
  echo "   ---"

  result=$(kane-cli run "$objective" --agent --headless 2>/dev/null | tail -1)
  status=$(echo "$result" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('status','unknown'))" 2>/dev/null || echo "error")
  summary=$(echo "$result" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('summary',''))" 2>/dev/null || echo "")
  final_state=$(echo "$result" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('final_state',{}))" 2>/dev/null || echo "")

  if [ "$status" = "passed" ]; then
    echo "   ✅ PASSED — $summary"
    [ -n "$final_state" ] && echo "   📦 Extracted: $final_state"
    PASS=$((PASS + 1))
  else
    echo "   ❌ FAILED — $summary"
    FAIL=$((FAIL + 1))
  fi
}

echo "=============================================="
echo "  API TESTS — Airbnb Clone Backend"
echo "  API URL: $API_URL"
echo "=============================================="

# ── 1. Listings API returns data ──────────────────────────────────────────────
run_test "GET /api/listings returns listing array" \
  "Go to $API_URL/api/listings in the browser, store whether the page shows a JSON array or listings data as 'listings_api_ok', store the approximate number of listings if visible as 'listings_count'"

# ── 2. Auth login API ─────────────────────────────────────────────────────────
run_test "POST /api/auth/login via UI smoke test" \
  "Go to $BASE_URL/login, enter guest@example.com as the email, enter guest123 as the password, click Sign In, store whether authentication succeeds and a token or user session is established as 'auth_api_ok'"

# ── 3. Listings with location filter ─────────────────────────────────────────
run_test "GET /api/listings?location=Miami filters results" \
  "Go to $API_URL/api/listings?location=Miami in the browser, store whether the response contains listing data filtered to Miami as 'miami_filter_ok', store the count of listings returned as 'miami_count'"

# ── 4. Single listing endpoint ────────────────────────────────────────────────
run_test "GET /api/listings/1 returns single listing detail" \
  "Go to $API_URL/api/listings/1 in the browser, store whether a single listing object is returned with title and price fields as 'single_listing_ok', store the listing title if visible as 'listing_title'"

# ── 5. Protected endpoint without auth ───────────────────────────────────────
run_test "GET /api/bookings without auth returns 401" \
  "Go to $API_URL/api/bookings in the browser, store the HTTP status or error message shown as 'bookings_unauth_response', store whether it indicates unauthorized or missing authentication as 'is_401'"

echo ""
echo "=============================================="
echo "  RESULTS: ✅ $PASS passed  ❌ $FAIL failed"
echo "=============================================="

[ "$FAIL" -eq 0 ] && exit 0 || exit 1
