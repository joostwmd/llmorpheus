#!/usr/bin/env bash
# Schedule expensive model runs for thesis tier comparisons (single rep only)
#
# Usage:
#   .github/schedule-expensive-runs.sh [rep_number]
#
# Examples:
#   .github/schedule-expensive-runs.sh       # Schedule rep 1 for all 3 expensive models
#   .github/schedule-expensive-runs.sh 1     # Same (explicit rep 1)
#
# Models: GPT-4o, Gemini 3.5 Flash, Claude Sonnet 4.5
# Estimated total cost: ~€60–85 for all three (rep 1 each)

set -euo pipefail

REP_NUMBER="${1:-1}"
PACKAGES="thesis-six.json"
WORKFLOW="openrouter-exp.yml"
TEMPLATE="template-full"
SYSTEM_PROMPT="SystemPrompt-MutationTestingExpert"
TEMPERATURE="0.0"
MAX_TOKENS="250"

# Expensive models (€15+/run — single rep for tier comparison)
EXPENSIVE_MODELS=(
  "openai/gpt-4o"                         # €20-40/run
  "google/gemini-3.5-flash"               # €20+/run
  "anthropic/claude-sonnet-4.5"           # €15-25/run
)

echo "========================================"
echo "  Expensive Model Batch Scheduler"
echo "========================================"
echo "Replication number: $REP_NUMBER"
echo "Packages: $PACKAGES"
echo "Models: ${#EXPENSIVE_MODELS[@]} (one rep $REP_NUMBER run each)"
echo ""
echo "Estimated cost range for all ${#EXPENSIVE_MODELS[@]} models:"
echo "  Low estimate:  €60"
echo "  High estimate: €85"
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

for model in "${EXPENSIVE_MODELS[@]}"; do
  echo "Scheduling: $model | rep $REP_NUMBER"

  if gh workflow run "$WORKFLOW" \
      --field replication="$REP_NUMBER" \
      --field packages="$PACKAGES" \
      --field template="$TEMPLATE" \
      --field systemPrompt="$SYSTEM_PROMPT" \
      --field temperature="$TEMPERATURE" \
      --field model="$model" \
      --field maxTokensInCompletion="$MAX_TOKENS" \
      --field benchmarkMode="true"; then
    echo "  ✅ Scheduled: $model | rep $REP_NUMBER | $PACKAGES"
    ((SCHEDULED++))
  else
    echo "  ❌ Failed: $model | rep $REP_NUMBER | $PACKAGES"
    ((FAILED++))
  fi

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

echo "✅ All expensive runs scheduled!"
echo ""
echo "Next steps:"
echo "1. Monitor runs at: https://github.com/$(gh repo view --json owner,name -q '.owner.login + "/" + .name')/actions"
echo "2. Use .github/download-all-runs.sh to collect results when complete"
