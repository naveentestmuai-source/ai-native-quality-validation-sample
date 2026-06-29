#!/usr/bin/env bash
# =============================================================================
# run-all.sh
# Runs all Kane-CLI test suites and prints a combined summary.
# Usage:
#   bash kane-tests/scripts/run-all.sh              # run all suites sequentially
#   bash kane-tests/scripts/run-all.sh --suite smoke  # run only the smoke suite
#   KANE_BASE_URL=https://staging.example.com bash kane-tests/scripts/run-all.sh
# =============================================================================

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SUITE="${1:-all}"
BASE_URL="${KANE_BASE_URL:-http://localhost:5173}"

# Terminal colours
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; BOLD='\033[1m'; RESET='\033[0m'

echo ""
echo -e "${BOLD}${CYAN}╔══════════════════════════════════════════════════╗${RESET}"
echo -e "${BOLD}${CYAN}║        KANE-CLI TEST RUN — Airbnb Clone          ║${RESET}"
echo -e "${BOLD}${CYAN}╚══════════════════════════════════════════════════╝${RESET}"
echo -e "  Base URL : ${BOLD}$BASE_URL${RESET}"
echo -e "  Suite    : ${BOLD}$SUITE${RESET}"
echo -e "  Date     : $(date)"
echo ""

# Verify kane-cli is available
if ! command -v kane-cli &>/dev/null; then
  echo -e "${RED}✗ kane-cli not found. Install with:${RESET}"
  echo "    npm install -g @testmuai/kane-cli"
  echo "  Then authenticate:"
  echo "    kane-cli login"
  exit 2
fi

echo -e "  kane-cli : $(kane-cli --version 2>/dev/null || echo 'unknown version')"
echo ""

TOTAL_PASS=0
TOTAL_FAIL=0
FAILED_SUITES=()

run_suite() {
  local label="$1"
  local script="$2"

  echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
  echo -e "${BOLD}  Suite: $label${RESET}"
  echo ""

  if KANE_BASE_URL="$BASE_URL" bash "$script"; then
    echo -e "${GREEN}  Suite PASSED${RESET}"
    TOTAL_PASS=$((TOTAL_PASS + 1))
  else
    echo -e "${RED}  Suite FAILED${RESET}"
    TOTAL_FAIL=$((TOTAL_FAIL + 1))
    FAILED_SUITES+=("$label")
  fi
  echo ""
}

case "$SUITE" in
  smoke)
    run_suite "Smoke Test" "$SCRIPT_DIR/05-smoke-test.sh"
    ;;
  auth)
    run_suite "Auth Tests" "$SCRIPT_DIR/01-auth-tests.sh"
    ;;
  search)
    run_suite "Search & Listings" "$SCRIPT_DIR/02-search-listing-tests.sh"
    ;;
  booking)
    run_suite "Booking Flow" "$SCRIPT_DIR/03-booking-tests.sh"
    ;;
  api)
    run_suite "API Tests" "$SCRIPT_DIR/04-api-tests.sh"
    ;;
  all|*)
    run_suite "Smoke Test"        "$SCRIPT_DIR/05-smoke-test.sh"
    run_suite "Auth Tests"        "$SCRIPT_DIR/01-auth-tests.sh"
    run_suite "Search & Listings" "$SCRIPT_DIR/02-search-listing-tests.sh"
    run_suite "Booking Flow"      "$SCRIPT_DIR/03-booking-tests.sh"
    run_suite "API Tests"         "$SCRIPT_DIR/04-api-tests.sh"
    ;;
esac

echo -e "${BOLD}${CYAN}╔══════════════════════════════════════════════════╗${RESET}"
echo -e "${BOLD}${CYAN}║                 FINAL SUMMARY                    ║${RESET}"
echo -e "${BOLD}${CYAN}╚══════════════════════════════════════════════════╝${RESET}"
echo -e "  Suites passed : ${GREEN}${BOLD}$TOTAL_PASS${RESET}"
echo -e "  Suites failed : ${RED}${BOLD}$TOTAL_FAIL${RESET}"

if [ ${#FAILED_SUITES[@]} -gt 0 ]; then
  echo ""
  echo -e "${RED}  Failed suites:${RESET}"
  for s in "${FAILED_SUITES[@]}"; do
    echo -e "    ${RED}✗ $s${RESET}"
  done
fi

echo ""

if [ "$TOTAL_FAIL" -eq 0 ]; then
  echo -e "${GREEN}${BOLD}  ✅ All suites passed!${RESET}"
  exit 0
else
  echo -e "${RED}${BOLD}  ❌ $TOTAL_FAIL suite(s) failed.${RESET}"
  exit 1
fi
