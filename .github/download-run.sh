#!/usr/bin/env bash
# Download artifacts for a single model + replication run.
#
# Usage:
#   .github/download-run.sh <model> <rep> [packages]
#
# Examples:
#   .github/download-run.sh "openai/gpt-4o-mini" 3
#   .github/download-run.sh "anthropic/claude-sonnet-4.5" 1 "thesis-six.json"
#
# Artifacts are saved to:
#   artifacts/<model_with_slashes_replaced>/<rep>/

set -euo pipefail

MODEL="${1:?Usage: $0 <model> <rep> [packages]}"
REP="${2:?Usage: $0 <model> <rep> [packages]}"
PACKAGES="${3:-thesis-six.json}"
WORKFLOW="openrouter-exp.yml"

TITLE="$MODEL | rep $REP | $PACKAGES"
MODEL_DIR=$(echo "$MODEL" | tr '/' '_')
OUT_DIR="./artifacts/${MODEL_DIR}/rep${REP}"

echo "Looking for: \"$TITLE\""

RUN_ID=$(gh run list \
  --workflow "$WORKFLOW" \
  --json databaseId,displayTitle,conclusion \
  --limit 200 \
  | jq -r --arg t "$TITLE" \
      '.[] | select(.displayTitle == $t and .conclusion == "success") | .databaseId' \
  | head -1)

if [ -z "$RUN_ID" ]; then
  echo "ERROR: No successful run found matching \"$TITLE\""
  echo "       Run: gh run list --workflow $WORKFLOW --json displayTitle,conclusion"
  echo "       to see available runs."
  exit 1
fi

echo "Found run $RUN_ID — downloading to $OUT_DIR"
mkdir -p "$OUT_DIR"
gh run download "$RUN_ID" --dir "$OUT_DIR"
echo "Done: $OUT_DIR"
