#!/usr/bin/env bash
# Flatten downloaded GitHub Actions artifacts into the directory structure
# expected by the benchmark analysis scripts.
#
# Input  (from gh run download):
#   artifacts/<model_dir>/rep<N>/
#     mutants-<pkg>/          ← flat files: summary.json, mutants.json, LLMorpheusOutput.txt
#     results-<pkg>/
#       results-<pkg>/        ← inner nesting from artifact upload path
#         StrykerInfo.json, StrykerOutput.txt, mutation.*
#
# Output (expected by benchmark/ scripts):
#   organized/<model_dir>/run<N>/
#     <pkg>/
#       summary.json
#       mutants.json
#       LLMorpheusOutput.txt
#       StrykerInfo.json
#       StrykerOutput.txt
#       mutation.*
#
# Usage:
#   .github/organize-artifacts.sh                       # process all of ./artifacts/
#   .github/organize-artifacts.sh ./artifacts ./organized

set -euo pipefail

ARTIFACTS_BASE="${1:-./artifacts}"
ORGANIZED_BASE="${2:-./organized}"

if [ ! -d "$ARTIFACTS_BASE" ]; then
  echo "ERROR: artifacts directory not found: $ARTIFACTS_BASE"
  exit 1
fi

total=0
skipped=0

for model_dir in "$ARTIFACTS_BASE"/*/; do
  [ -d "$model_dir" ] || continue
  model_name=$(basename "$model_dir")

  for rep_dir in "$model_dir"rep*/; do
    [ -d "$rep_dir" ] || continue
    rep_name=$(basename "$rep_dir")                    # e.g. rep3
    rep_nr=$(echo "$rep_name" | sed 's/rep//')         # e.g. 3
    run_dir="${ORGANIZED_BASE}/${model_name}/run${rep_nr}"

    has_mutants=false
    for d in "$rep_dir"mutants-*/; do
      [ -d "$d" ] && has_mutants=true && break
    done

    if [ "$has_mutants" = false ]; then
      echo "SKIP (no mutant artifacts): $rep_dir"
      ((skipped++)) || true
      continue
    fi

    mkdir -p "$run_dir"

    # --- mutants artifacts ---------------------------------------------------
    for mutants_dir in "$rep_dir"mutants-*/; do
      [ -d "$mutants_dir" ] || continue
      pkg=$(basename "$mutants_dir" | sed 's/^mutants-//')
      pkg_out="${run_dir}/${pkg}"
      mkdir -p "$pkg_out"
      cp -r "${mutants_dir}"/. "${pkg_out}/"
    done

    # --- results artifacts ---------------------------------------------------
    for results_dir in "$rep_dir"results-*/; do
      [ -d "$results_dir" ] || continue
      pkg=$(basename "$results_dir" | sed 's/^results-//')
      pkg_out="${run_dir}/${pkg}"
      mkdir -p "$pkg_out"
      # The upload path was <pkg>/results/ which contained results-<pkg>/ inside,
      # so the downloaded artifact has one extra nesting layer.
      inner="${results_dir}results-${pkg}"
      if [ -d "$inner" ]; then
        cp -r "${inner}"/. "${pkg_out}/"
      else
        # Fallback: copy whatever is directly in the results artifact dir
        cp -r "${results_dir}"/. "${pkg_out}/"
      fi
    done

    echo "Organized: $run_dir"
    ((total++)) || true
  done
done

echo ""
echo "Done — organized $total run(s) into $ORGANIZED_BASE/"
if [ "$skipped" -gt 0 ]; then
  echo "Skipped $skipped rep dir(s) with no mutant artifacts (not yet downloaded?)."
fi
