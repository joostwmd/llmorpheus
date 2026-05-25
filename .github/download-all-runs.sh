#!/usr/bin/env bash
# Download artifacts for all thesis models across all replications, then
# flatten them into the structure expected by the benchmark/ analysis scripts.
#
# Usage:
#   .github/download-all-runs.sh [packages] [max_rep]
#
# Examples:
#   .github/download-all-runs.sh                        # thesis-six.json, reps 1-5
#   .github/download-all-runs.sh thesis-six.json 3      # reps 1-3 only
#
# Raw artifacts are saved to:  artifacts/<model_dir>/rep<N>/
# Organized output is written: organized/<model_dir>/run<N>/<pkg>/
#   (summary.json, mutants.json, LLMorpheusOutput.txt, StrykerInfo.json all flat)
#
# Before downloading, existing artifacts and organized folders are moved to:
#   logs/<datetime>/artifacts/ and logs/<datetime>/organized/
#
# At the end, a summary is printed showing which runs are missing or failed.

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

PACKAGES="${1:-thesis-six.json}"
MAX_REP="${2:-5}"
WORKFLOW="openrouter-exp.yml"

MODELS=(
  "openai/gpt-4o-mini"
  "google/gemini-3.5-flash"
  "anthropic/claude-haiku-4.5"
  "anthropic/claude-sonnet-4.5"
  "meta-llama/llama-3.3-70b-instruct"
  "meta-llama/llama-3.1-8b-instruct"
  "qwen/qwen-2.5-coder-32b-instruct"
  "deepseek/deepseek-chat-v3.1"
)

echo "Fetching run list from GitHub..."
RUNS=$(gh run list \
  --workflow "$WORKFLOW" \
  --json databaseId,displayTitle,conclusion \
  --limit 500)

MISSING=()
FAILED=()
SUCCESS=()

for model in "${MODELS[@]}"; do
  model_dir=$(echo "$model" | tr '/' '_')
  for rep in $(seq 1 "$MAX_REP"); do
    title="$model | rep $rep | $PACKAGES"

    # Check for any run with this title (successful or not)
    any_run=$(echo "$RUNS" \
      | jq -r --arg t "$title" \
          '.[] | select(.displayTitle == $t) | .databaseId' \
      | head -1)

    run_id=$(echo "$RUNS" \
      | jq -r --arg t "$title" \
          '.[] | select(.displayTitle == $t and .conclusion == "success") | .databaseId' \
      | head -1)

    if [ -z "$any_run" ]; then
      MISSING+=("$title")
      continue
    fi

    if [ -z "$run_id" ]; then
      FAILED+=("$title")
      continue
    fi

    out_dir="./artifacts/${model_dir}/rep${rep}"
    echo "[$rep/${MAX_REP}] $model → $out_dir (run $run_id)"
    mkdir -p "$out_dir"
    gh run download "$run_id" --dir "$out_dir"
    SUCCESS+=("$title")
  done
done

echo ""
echo "========================================"
echo "  Download summary"
echo "========================================"
echo "  Successful : ${#SUCCESS[@]}"
echo "  Failed runs: ${#FAILED[@]}"
echo "  Not found  : ${#MISSING[@]}"

if [ ${#FAILED[@]} -gt 0 ]; then
  echo ""
  echo "FAILED (run exists but did not succeed):"
  for t in "${FAILED[@]}"; do echo "  - $t"; done
fi

if [ ${#MISSING[@]} -gt 0 ]; then
  echo ""
  echo "MISSING (no run found — not triggered yet?):"
  for t in "${MISSING[@]}"; do echo "  - $t"; done
fi

echo ""
echo "Artifacts saved under ./artifacts/"

echo ""
echo "========================================"
echo "  Organizing into ./organized/ ..."
echo "========================================"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
bash "$SCRIPT_DIR/organize-artifacts.sh" ./artifacts ./organized
