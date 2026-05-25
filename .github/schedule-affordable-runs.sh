#!/usr/bin/env bash
# Schedule affordable model runs for thesis experiments
#
# Usage:
#   .github/schedule-affordable-runs.sh [rep_number]
#
# Examples:
#   .github/schedule-affordable-runs.sh 1      # Schedule rep 1 for all 7 affordable models
#   .github/schedule-affordable-runs.sh 2      # Schedule rep 2 for all 7 affordable models  
#   .github/schedule-affordable-runs.sh 3      # Schedule rep 3 for all 7 affordable models
#
# This script triggers ONE run per affordable model for the specified replication number,
# excluding expensive models (GPT-4o, Gemini 3.5 Flash, Claude Sonnet 4.5)
# that should be run manually due to high costs.

set -euo pipefail

# Configuration
REP_NUMBER="${1:-1}"
PACKAGES="thesis-six.json"
WORKFLOW="openrouter-exp.yml"
TEMPLATE="template-full"
SYSTEM_PROMPT="SystemPrompt-MutationTestingExpert"
TEMPERATURE="0.0"

# Affordable models (cost ≤ €5/run)
AFFORDABLE_MODELS=(
  "openai/gpt-4o-mini"                    # €2-5/run
  "google/gemini-3.5-flash-8b"            # €1-3/run  
  "anthropic/claude-haiku-4.5"            # €4/run
  "meta-llama/llama-3.3-70b-instruct"     # €0.5-2/run
  "meta-llama/llama-3.1-8b-instruct"      # €0.05/run
  "qwen/qwen-2.5-coder-32b-instruct"      # €1/run
  "deepseek/deepseek-chat-v3.1"           # €0.5-2/run
)

# Expensive models (excluded from batch scheduling)
EXPENSIVE_MODELS=(
  "openai/gpt-4o"                         # €20-40/run
  "google/gemini-3.5-flash"               # €20+/run
  "anthropic/claude-sonnet-4.5"           # €15-25/run
)

echo "========================================"
echo "  Affordable Model Batch Scheduler"
echo "========================================"
echo "Replication number: $REP_NUMBER"
echo "Packages: $PACKAGES"
echo "Affordable models: ${#AFFORDABLE_MODELS[@]}"
echo "Total runs to schedule: ${#AFFORDABLE_MODELS[@]} (one rep $REP_NUMBER run per model)"
echo ""

# Cost estimation
echo "Estimated cost range for rep $REP_NUMBER:"
echo "  Low estimate:  €${#AFFORDABLE_MODELS[@]} (all models at €1/run)"
echo "  High estimate: €$(( ${#AFFORDABLE_MODELS[@]} * 5 )) (all models at €5/run)"
echo ""

# Confirmation prompt
echo "Excluded expensive models:"
for model in "${EXPENSIVE_MODELS[@]}"; do
  echo "  - $model (run manually)"
done
echo ""

read -p "Continue with scheduling? (y/N): " -r
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 0
fi

echo ""
echo "Scheduling runs..."
echo ""

SCHEDULED=0
FAILED=0

for model in "${AFFORDABLE_MODELS[@]}"; do
  echo "Scheduling: $model | rep $REP_NUMBER"
  
  # Trigger GitHub Actions workflow
  if gh workflow run "$WORKFLOW" \
      --field replication="$REP_NUMBER" \
      --field packages="$PACKAGES" \
      --field template="$TEMPLATE" \
      --field systemPrompt="$SYSTEM_PROMPT" \
      --field temperature="$TEMPERATURE" \
      --field model="$model" \
      --field benchmarkMode="true"; then
    echo "  ✅ Scheduled: $model | rep $REP_NUMBER | $PACKAGES"
    ((SCHEDULED++))
  else
    echo "  ❌ Failed: $model | rep $REP_NUMBER | $PACKAGES"
    ((FAILED++))
  fi
  
  # Rate limiting to avoid GitHub API throttling
  sleep 2
done

echo "========================================"
echo "  Scheduling Complete"
echo "========================================"
echo "Successfully scheduled: $SCHEDULED runs"
echo "Failed: $FAILED runs"
echo ""

if [ $FAILED -gt 0 ]; then
  echo "⚠️  Some runs failed to schedule. Check GitHub Actions manually."
  exit 1
fi

echo "✅ All runs scheduled successfully!"
echo ""
echo "Next steps:"
echo "1. Monitor runs at: https://github.com/$(gh repo view --json owner,name -q '.owner.login + "/" + .name')/actions"
echo "2. Manually run expensive models:"
for model in "${EXPENSIVE_MODELS[@]}"; do
  echo "   - $model"
done
echo "3. Use .github/download-all-runs.sh to collect results when complete"