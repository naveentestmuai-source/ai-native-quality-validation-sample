#!/usr/bin/env bash
# =============================================================================
# 02-search-listing-tests.sh
# Kane-CLI objectives covering Search, Listing Browse, and Detail Page flows
# Run: bash kane-tests/scripts/02-search-listing-tests.sh
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

  if [ "$status" = "passed" ]; then
    echo "   ✅ PASSED — $summary"
    PASS=$((PASS + 1))
  else
    echo "   ❌ FAILED — $summary"
    FAIL=$((FAIL + 1))
  fi
}

echo "=============================================="
echo "  SEARCH & LISTINGS TESTS — Airbnb Clone"
echo "  Base URL: $BASE_URL"
echo "=============================================="

# ── 1. Home page loads with listings ─────────────────────────────────────────
run_test "Home page loads with listing cards" \
  "Go to $BASE_URL, store the number of property listing cards visible on the page as 'listing_count'"

# ── 2. Search by location ─────────────────────────────────────────────────────
run_test "Search by location filters results" \
  "Go to $BASE_URL, find the location search input, type 'Miami', press Enter or click the search button, store the number of listing cards now visible as 'miami_results'"

# ── 3. Search with no results ─────────────────────────────────────────────────
run_test "Search with no matching location shows empty state" \
  "Go to $BASE_URL, find the location search input, type 'ZZZNonExistentPlace999', press Enter or click the search button, store whether a no-results or empty state message appears as 'empty_state_shown'"

# ── 4. Listing card shows key info ────────────────────────────────────────────
run_test "Listing card displays title price and rating" \
  "Go to $BASE_URL, find the first listing card, store the title of the first listing as 'first_listing_title', store the price shown on the first listing card as 'first_listing_price', store the rating shown as 'first_listing_rating'"

# ── 5. Navigate to listing detail ────────────────────────────────────────────
run_test "Click listing card opens detail page" \
  "Go to $BASE_URL, click the first listing card, store the page URL after navigation as 'detail_url', store the listing title on the detail page as 'detail_title'"

# ── 6. Detail page — amenities and info ──────────────────────────────────────
run_test "Listing detail shows amenities bedrooms and bathrooms" \
  "Go to $BASE_URL, click the first listing card, store the number of bedrooms listed as 'bedrooms', store the number of bathrooms listed as 'bathrooms', store whether an amenities section is visible as 'has_amenities'"

# ── 7. Detail page — booking form visible ────────────────────────────────────
run_test "Listing detail shows booking/reserve form" \
  "Go to $BASE_URL, click the first listing card, store whether a booking form or Reserve button is visible on the detail page as 'booking_form_visible'"

# ── 8. Search with check-in and check-out dates ───────────────────────────────
run_test "Search with date range filters listings" \
  "Go to $BASE_URL, enter 'Miami' in the location search field, if there are check-in and check-out date inputs enter '2025-08-01' for check-in and '2025-08-05' for check-out, click search, store the number of results as 'dated_results'"

echo ""
echo "=============================================="
echo "  RESULTS: ✅ $PASS passed  ❌ $FAIL failed"
echo "=============================================="

[ "$FAIL" -eq 0 ] && exit 0 || exit 1
