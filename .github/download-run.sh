#!/usr/bin/env bash
# Download artifacts for a single model + replication run, then flatten them
# into the structure expected by the benchmark/ analysis scripts.
#
# Usage:
#   .github/download-run.sh <model> <rep> [packages]
#
# Examples:
#   .github/download-run.sh "openai/gpt-4o-mini" 3
#   .github/download-run.sh "anthropic/claude-sonnet-4.5" 1 "thesis-six.json"
#
# Raw artifacts are saved to:  artifacts/<model_with_slashes_replaced>/rep<N>/
# Organized output is written: organized/<model_with_slashes_replaced>/run<N>/
#
# Before downloading, existing artifacts and organized folders are moved to:
#   logs/<datetime>/artifacts/ and logs/<datetime>/organized/

set -euo pipefail

# Create logs directory with datetime stamp and move existing folders
DATETIME=$(date +"%Y%m%d_%H%M%S")
LOGS_DIR="./logs/$DATETIME"

if [ -d "./artifacts" ] || [ -d "./organized" ]; then
  echo "========================================"
  echo "  Archiving existing data"
  echo "========================================"
  mkdir -p "$LOGS_DIR"
  
  if [ -d "./artifacts" ]; then
    echo "Moving ./artifacts → $LOGS_DIR/artifacts"
    mv "./artifacts" "$LOGS_DIR/artifacts"
  fi
  
  if [ -d "./organized" ]; then
    echo "Moving ./organized → $LOGS_DIR/organized"
    mv "./organized" "$LOGS_DIR/organized"
  fi
  
  echo "Previous data archived to: $LOGS_DIR"
  echo ""
fi

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
echo "Downloaded: $OUT_DIR"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "Organizing into organized/${MODEL_DIR}/run${REP}/ ..."
bash "$SCRIPT_DIR/organize-artifacts.sh" ./artifacts ./organized
echo "Done."
