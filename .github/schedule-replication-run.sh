#!/usr/bin/env bash
# Schedule RQ0 live replication run (CodeLlama 34B — original LLMorpheus paper model)
#
# Usage:
#   .github/schedule-replication-run.sh [rep_number]
#
# Examples:
#   .github/schedule-replication-run.sh       # Schedule rep 1
#
# For zero-cost validation, prefer local replay — see thesis/rq0/replication.md Phase 1.
# This script triggers a live OpenRouter run to validate CI + API end-to-end.

set -euo pipefail

REP_NUMBER="${1:-1}"
PACKAGES="thesis-six.json"
WORKFLOW="openrouter-exp.yml"
MODEL="meta-llama/codellama-34b-instruct"
TEMPLATE="template-full"
SYSTEM_PROMPT="SystemPrompt-MutationTestingExpert"
TEMPERATURE="0.0"
MAX_TOKENS="250"

echo "========================================"
echo "  RQ0 Replication Run Scheduler"
echo "========================================"
echo "Model: $MODEL"
echo "Replication: $REP_NUMBER"
echo "Packages: $PACKAGES"
echo ""
echo "Compare results to paper Table 3 — see thesis/rq0/replication.md"
echo ""

read -p "Continue with scheduling? (y/N): " -r
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Cancelled."
  exit 0
fi

echo ""
echo "Scheduling: $MODEL | rep $REP_NUMBER"

if gh workflow run "$WORKFLOW" \
    --field replication="$REP_NUMBER" \
    --field packages="$PACKAGES" \
    --field template="$TEMPLATE" \
    --field systemPrompt="$SYSTEM_PROMPT" \
    --field temperature="$TEMPERATURE" \
    --field model="$MODEL" \
    --field maxTokensInCompletion="$MAX_TOKENS" \
    --field benchmarkMode="true"; then
  echo "✅ Scheduled: $MODEL | rep $REP_NUMBER | $PACKAGES"
else
  echo "❌ Failed to schedule. Check GitHub Actions manually."
  exit 1
fi

echo ""
echo "Next steps:"
echo "1. Monitor at: https://github.com/$(gh repo view --json owner,name -q '.owner.login + "/" + .name')/actions"
echo "2. Download: .github/download-run.sh \"$MODEL\" $REP_NUMBER"
