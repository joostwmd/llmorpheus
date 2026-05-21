#!/usr/bin/env bash
# Flatten downloaded GitHub Actions artifacts into the directory structure
# expected by the benchmark analysis scripts.
#
# Input  (from gh run download): one directory per rep, typically
#   artifacts/<model_dir>/rep<N>/
#     mutants-<pkg>/                ← artifact name
#       <pkg>/                      ← CI uploaded <pkg>/<pkg>/ (duplicate nest)
#         summary.json, mutants.json, prompts/, ...
#     results-<pkg>/                ← per-matrix Stryker upload
#       results-<pkg>/
#         StrykerInfo.json, StrykerOutput.txt, mutation.*
#     results/                      ← combine_output job upload (already flat per package)
#       <pkg>/
#         StrykerInfo.json, ...
#     report.md/report.md           ← gh creates a folder matching artifact name
#     table.tex/table.tex
#
# Output (expected by benchmark/ scripts):
#   organized/<model_dir>/run<N>/
#     _workflow/                    ← optional: report + LaTeX from the run (if present)
#     <pkg>/
#       summary.json, mutants.json, LLMorpheusOutput.txt, prompts/
#       StrykerInfo.json, StrykerOutput.txt, mutation.*
#
# Usage:
#   .github/organize-artifacts.sh                       # ./artifacts → ./organized
#   .github/organize-artifacts.sh ./artifacts ./organized

set -euo pipefail
shopt -s nullglob

ARTIFACTS_BASE="${1:-./artifacts}"
ORGANIZED_BASE="${2:-./organized}"

if [ ! -d "$ARTIFACTS_BASE" ]; then
  echo "ERROR: artifacts directory not found: $ARTIFACTS_BASE"
  exit 1
fi

# Resolve mutant source directory: unwrap <pkg>/ when artifact root duplicates package name (CI upload path).
mutants_flattened_source() {
  local dir="$1"
  local pkg="$2"
  if [ -d "${dir}/${pkg}" ] &&
    { [ -f "${dir}/${pkg}/summary.json" ] || [ -f "${dir}/${pkg}/mutants.json" ]; }; then
    printf '%s' "${dir}/${pkg}"
  else
    printf '%s' "$dir"
  fi
}

total=0
skipped=0

for model_dir in "$ARTIFACTS_BASE"/*/; do
  [ -d "$model_dir" ] || continue
  model_name=$(basename "$model_dir")

  for rep_dir in "$model_dir"rep*/; do
    [ -d "$rep_dir" ] || continue
    rep_name=$(basename "$rep_dir")
    rep_nr=$(echo "$rep_name" | sed 's/rep//')
    run_dir="${ORGANIZED_BASE}/${model_name}/run${rep_nr}"

    has_mutants=false
    for d in "$rep_dir"mutants-*/; do
      [ -d "$d" ] && has_mutants=true && break
    done

    if [ "$has_mutants" = false ]; then
      echo "SKIP (no mutant artifacts): $rep_dir"
      skipped=$((skipped + 1))
      continue
    fi

    rm -rf "$run_dir"
    mkdir -p "$run_dir"

    # --- run-level summaries (combine_output / generate_report) ----------------
    wf_dir="${run_dir}/_workflow"
    if [ -d "${rep_dir}report.md" ] && [ -f "${rep_dir}report.md/report.md" ]; then
      mkdir -p "$wf_dir"
      cp -f "${rep_dir}report.md/report.md" "${wf_dir}/report.md"
    fi
    if [ -d "${rep_dir}table.tex" ] && [ -f "${rep_dir}table.tex/table.tex" ]; then
      mkdir -p "$wf_dir"
      cp -f "${rep_dir}table.tex/table.tex" "${wf_dir}/table.tex"
    fi

    # --- mutants artifacts -----------------------------------------------------
    for mutants_dir in "$rep_dir"mutants-*/; do
      [ -d "$mutants_dir" ] || continue
      pkg=$(basename "$mutants_dir" | sed 's/^mutants-//')
      pkg_out="${run_dir}/${pkg}"
      mkdir -p "$pkg_out"
      src="$(mutants_flattened_source "$mutants_dir" "$pkg")"
      cp -r "${src}/." "${pkg_out}/"
    done

    # --- per-matrix results (results-<pkg>/results-<pkg>/) ----------------------
    for results_dir in "$rep_dir"results-*/; do
      [ -d "$results_dir" ] || continue
      pkg=$(basename "$results_dir" | sed 's/^results-//')
      pkg_out="${run_dir}/${pkg}"
      mkdir -p "$pkg_out"
      inner="${results_dir}results-${pkg}"
      if [ -d "$inner" ]; then
        cp -r "${inner}/." "${pkg_out}/"
      else
        cp -r "${results_dir}/." "${pkg_out}/"
      fi
    done

    # --- combined artifact "results" (flat package dirs already) -------------
    combined="${rep_dir}results"
    if [ -d "$combined" ]; then
      for pkg_dir in "$combined"/*/; do
        [ -d "$pkg_dir" ] || continue
        pkg=$(basename "$pkg_dir")
        [ "$pkg" = "*" ] && continue
        pkg_out="${run_dir}/${pkg}"
        mkdir -p "$pkg_out"
        cp -r "${pkg_dir}/." "${pkg_out}/"
      done
    fi

    # Run-level aggregates sometimes leak into combined results/*/ — remove spurious copies.
    for pkg_out_in in "$run_dir"/*/; do
      [ ! -d "$pkg_out_in" ] && continue
      base=$(basename "${pkg_out_in%/}")
      [ "$base" = "_workflow" ] && continue
      rm -f "${pkg_out_in}report.md" "${pkg_out_in}table.tex" 2>/dev/null || true
    done

    echo "Organized: $run_dir"
    total=$((total + 1))
  done
done

echo ""
echo "Done — organized $total run(s) into $ORGANIZED_BASE/"
if [ "$skipped" -gt 0 ]; then
  echo "Skipped $skipped rep dir(s) with no mutant artifacts."
fi
