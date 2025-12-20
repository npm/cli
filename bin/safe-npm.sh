#!/bin/bash

# safe-npm.sh: Wrapper for npm that adds min-age enforcement using --before for install/ci with auto-retry on no-version errors.
# It allows overriding default min age (7 days) via --min-age-days=N (e.g., ./safe-npm.sh install --min-age-days=5).
# It retries with reduced days (from N going down to 0), if ETARGET/no matching version error detected.
# Usage: ./safe-npm.sh install [args] [--min-age-days=N]  (or alias to npm)
# Handles: Cross-platform date (Linux/macOS), skips if --before manual, error propagation, real-time output.
# A sample package.json provided in smoke-tests to allow testing for packages published for the first time after the min-age condition: package.josn-safe-npm-min-age

set -euo pipefail

# Function to calculate date N days ago in ISO format (YYYY-MM-DD).
# Supports Linux (GNU date) and macOS (BSD date).
get_days_ago() {
  local days="$1"
  if date --version >/dev/null 2>&1; then
    # GNU date (Linux)
    date -d "$days days ago" +%Y-%m-%d
  elif [[ "$OSTYPE" == "darwin"* ]]; then
    # BSD date (macOS)
    date -v -"${days}"d +%Y-%m-%d
  else
    echo "Error: Unsupported OS for date calculation. Use manually." >&2
    exit 1
  fi
}

# Check if --before is already in args to avoid duplication.
has_before_flag() {
  for arg in "$@"; do
    if [[ "$arg" == "--before"* ]]; then
      return 0
    fi
  done
  return 1
}

# Parse custom --min-age-days from args and remove it.
min_age_days=7  # Default.
new_args=()
i=0
while [ $i -lt $# ]; do
  arg="${!((i+1))}"
  if [[ "$arg" =~ ^--min-age-days=([0-9]+)$ ]]; then
    min_age_days="${BASH_REMATCH[1]}"
    ((i++))  # Skip this arg.
  else
    new_args+=("$arg")
  fi
  ((i++))
done
set -- "${new_args[@]}"  # Update args without --min-age-days.

# Main logic.
cmd="${1:-}"
shift || true  # Shift off the command, leaving args.

if [[ "$cmd" != "install" && "$cmd" != "ci" ]]; then
  # Passthrough for non-install commands.
  npm "$cmd" "$@"
  exit $?
fi

if has_before_flag "$@"; then
  echo "Skipping auto --before; manual flag detected." >&2
  npm "$cmd" "$@"
  exit $?
fi

# Generate days array from min_age_days down to 0.
days_array=()
for ((d=min_age_days; d>=0; d--)); do
  days_array+=("$d")
done

# Retry loop for install/ci.
success=false
for days in "${days_array[@]}"; do
  if [ "$days" -eq 0 ]; then
    before_flag=""
    echo "Retrying without --before (0 days min age)." >&2
  else
    before_date=$(get_days_ago "$days")
    if [[ -z "$before_date" ]]; then
      echo "Error: Failed to calculate before date." >&2
      exit 1
    fi
    before_flag="--before=$before_date"
    echo "Trying --before=$before_date ($days days min age)." >&2
  fi

  # Run npm, capture stderr for error check, but output stdout in real-time.
  stderr_file=$(mktemp)
  if npm "$cmd" $before_flag "$@" 2>"$stderr_file"; then
    rm "$stderr_file"
    success=true
    break
  else
    if grep -q -e "ETARGET" -e "No matching version found" "$stderr_file"; then
      echo "No version available; retrying with reduced age." >&2
      rm "$stderr_file"
      continue
    else
      cat "$stderr_file" >&2
      rm "$stderr_file"
      echo "Install failed for non-age-related reason." >&2
      exit 1
    fi
  fi
done

if ! $success; then
  echo "All retries failed; check project dependencies." >&2
  exit 1
fi
