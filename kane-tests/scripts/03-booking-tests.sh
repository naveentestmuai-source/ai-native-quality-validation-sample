#!/usr/bin/env bash
# =============================================================================
# 03-booking-tests.sh
# Kane-CLI objectives covering the end-to-end booking flow
# Run: bash kane-tests/scripts/03-booking-tests.sh
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
echo "  BOOKING FLOW TESTS — Airbnb Clone"
echo "  Base URL: $BASE_URL"
echo "=============================================="

# ── 1. Reserve button requires auth ──────────────────────────────────────────
run_test "Reserve button prompts login when unauthenticated" \
  "Go to $BASE_URL, click the first listing card, find the Reserve or Book button and click it without being logged in, store whether a login prompt or redirect to login appears as 'auth_required_for_booking'"

# ── 2. Full booking flow — happy path ────────────────────────────────────────
run_test "Authenticated user can initiate booking" \
  "Go to $BASE_URL/login, log in as guest@example.com with password guest123, navigate to the home page, click the first listing card, on the listing detail page find the check-in date field and enter '2025-08-10', find the check-out date field and enter '2025-08-15', set guest count to 2 if there is a guest input, click the Reserve button, store the result or confirmation message as 'booking_result'"

# ── 3. View bookings page ─────────────────────────────────────────────────────
run_test "Authenticated user can view their bookings page" \
  "Go to $BASE_URL/login, log in as guest@example.com with password guest123, navigate to $BASE_URL/bookings, store whether any booking cards or a bookings list is visible as 'bookings_visible', store the number of bookings shown as 'booking_count'"

# ── 4. Price calculation visible ─────────────────────────────────────────────
run_test "Listing detail shows price calculation" \
  "Go to $BASE_URL, click the first listing card, store the nightly price from the detail page as 'nightly_price', store whether a total price calculation section is visible as 'total_price_visible'"

# ── 5. Guest count validation ─────────────────────────────────────────────────
run_test "Booking form respects max guest count" \
  "Go to $BASE_URL, click the first listing card, store the maximum guests allowed for this listing as 'max_guests', store whether there is any guest count input or selector on the booking form as 'guest_input_exists'"

echo ""
echo "=============================================="
echo "  RESULTS: ✅ $PASS passed  ❌ $FAIL failed"
echo "=============================================="

[ "$FAIL" -eq 0 ] && exit 0 || exit 1
