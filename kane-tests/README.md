# Kane-CLI Tests — Airbnb Clone Demo

This directory contains all **kane-cli** test objectives for the Airbnb Clone demo app, structured to show every layer of what kane-cli picks up, generates, and validates.

## What's in here

```
kane-tests/
├── objectives.yaml          ← All test objectives in declarative YAML
└── scripts/
    ├── 01-auth-tests.sh     ← Login, register, logout flows (6 objectives)
    ├── 02-search-listing-tests.sh  ← Search, listing grid, detail page (8 objectives)
    ├── 03-booking-tests.sh  ← Booking flow, auth gate, history (5 objectives)
    ├── 04-api-tests.sh      ← Backend REST API smoke tests (5 objectives)
    ├── 05-smoke-test.sh     ← 3-objective quick gate for PRs
    └── run-all.sh           ← Runs all suites with combined summary

.testmuai/
├── context.md               ← App context loaded by kane-cli on every run
└── variables/
    └── app.json             ← Parameterized values (URLs, credentials, test data)

.github/workflows/
└── kane-cli-tests.yml       ← CI: smoke on PR, full suite on merge to main
```

## Quick start

### 1. Install and authenticate

```bash
npm install -g @testmuai/kane-cli
kane-cli login
```

### 2. Start the app

```bash
# From repo root:
npm install
npm run dev
# Frontend: http://localhost:5173  |  Backend: http://localhost:5000
```

### 3. Run a specific suite

```bash
# Smoke test (fast, 3 objectives)
bash kane-tests/scripts/05-smoke-test.sh

# Auth tests
bash kane-tests/scripts/01-auth-tests.sh

# Search & listing tests
bash kane-tests/scripts/02-search-listing-tests.sh

# Booking flow tests
bash kane-tests/scripts/03-booking-tests.sh

# API tests
bash kane-tests/scripts/04-api-tests.sh

# Run everything
bash kane-tests/scripts/run-all.sh
```

### 4. Target a different environment

```bash
KANE_BASE_URL=https://staging.yourdomain.com bash kane-tests/scripts/run-all.sh
```

## What kane-cli picks up from this repo

When you run an objective, kane-cli automatically loads:

1. **`.testmuai/context.md`** — project context: routes, credentials, UI patterns, API endpoints. This is what tells the agent about your specific app without you repeating it in every objective.

2. **`.testmuai/variables/app.json`** — parameterized values like `{{base_url}}`, `{{guest_email}}`, `{{guest_password}}`. Use `{{varname}}` in any objective string.

3. **`~/.testmuai/kaneai/global-memory.md`** — your global agent context (set once per machine, applies to all projects).

## What kane-cli writes after each run

Every `kane-cli run` creates a session directory at:
```
~/.testmuai/kaneai/sessions/<session-id>/runs/<n>/
├── summary.json      ← run_end event (status, summary, final_state, test_url)
├── steps.ndjson      ← per-step progress events
└── screenshots/      ← screenshot at each agent step
```

The `test_url` in `summary.json` links directly to the run in the TestMu AI Test Manager dashboard.

## NDJSON output — what to parse

With `--agent`, every line of stdout is a JSON event:

```jsonc
// Progress event (one per agent step)
{"step": 1, "status": "passed", "remark": "Navigated to home page"}

// Terminal event — build CI gates on this
{
  "type": "run_end",
  "status": "passed",           // or "failed"
  "summary": "...",
  "final_state": {              // all "store as" values
    "listing_count": "28",
    "login_ok": "true"
  },
  "test_url": "https://test-manager.lambdatest.com/..."
}
```

Exit codes: `0` = passed, `1` = failed, `2` = error (auth/setup), `3` = timeout.

## Viewing results in the TestMu AI dashboard

After each run, open the `test_url` from the `run_end` event — it links to the full run in Test Manager, including step-by-step screenshots and the AI summary.

Or browse all runs: **TestMu AI → Test Manager → KaneAI → Sessions**
