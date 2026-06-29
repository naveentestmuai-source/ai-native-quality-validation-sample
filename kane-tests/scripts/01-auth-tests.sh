#!/usr/bin/env bash
# =============================================================================
# 01-auth-tests.sh
# Kane-CLI objectives covering Login, Registration, and Logout flows
# Run: bash kane-tests/scripts/01-auth-tests.sh
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
echo "  AUTH TESTS — Airbnb Clone"
echo "  Base URL: $BASE_URL"
echo "=============================================="

# ── 1. Valid login ────────────────────────────────────────────────────────────
run_test "Valid guest login" \
  "Go to $BASE_URL/login, enter 'guest@example.com' in the email field, enter 'guest123' in the password field, click the Sign In button, store whether the home page or dashboard loads as 'login_success'"

# ── 2. Invalid login (wrong password) ────────────────────────────────────────
run_test "Invalid login — wrong password shows error" \
  "Go to $BASE_URL/login, enter 'guest@example.com' in the email field, enter 'wrongpassword' in the password field, click the Sign In button, store the error message text as 'error_message'"

# ── 3. Empty form validation ──────────────────────────────────────────────────
run_test "Login — empty form submission" \
  "Go to $BASE_URL/login, click the Sign In button without entering any credentials, store whether a validation error or required field indicator appears as 'empty_form_error'"

# ── 4. New user registration ──────────────────────────────────────────────────
run_test "New user registration flow" \
  "Go to $BASE_URL/register, enter 'Test' in the first name field, enter 'User' in the last name field, enter 'testuser_$(date +%s)@example.com' in the email field, enter 'TestPass123!' in the password field, click the Create Account button, store whether registration succeeds or an error appears as 'registration_result'"

# ── 5. Host login ─────────────────────────────────────────────────────────────
run_test "Host user login" \
  "Go to $BASE_URL/login, enter 'host@example.com' in the email field, enter 'host123' in the password field, click the Sign In button, store whether the user is successfully authenticated as 'host_login_success'"

# ── 6. Login then logout ──────────────────────────────────────────────────────
run_test "Login then logout" \
  "Go to $BASE_URL/login, log in as guest@example.com with password guest123, after login find and click the logout or sign out option in the navigation, store whether the user is returned to the home or login page as 'logout_result'"

echo ""
echo "=============================================="
echo "  RESULTS: ✅ $PASS passed  ❌ $FAIL failed"
echo "=============================================="

[ "$FAIL" -eq 0 ] && exit 0 || exit 1
