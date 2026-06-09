/**
 * Publication artifact placement per research question.
 * placement: "thesis" (main paper) | "appendix"
 */
export const OUTPUT_MANIFEST = {
  rq1: {
    figures: {
      mutation_score_box: {
        placement: "thesis",
        description: "Mutation score distribution by model",
      },
      validity_stack: {
        placement: "thesis",
        description: "Candidate composition (valid / invalid / identical / duplicate)",
      },
      score_vs_survivors: {
        placement: "thesis",
        description: "Mutation score vs survivor count",
      },
      edit_distance_ridge: {
        placement: "appendix",
        description: "Levenshtein edit distance distributions",
      },
      per_package_heatmap: {
        placement: "appendix",
        description: "Mutation score heatmap (model × package)",
      },
      tokens_per_valid: {
        placement: "appendix",
        description: "Token efficiency per valid mutant (log scale)",
      },
    },
    tables: {
      rq1_volume_metrics: {
        placement: "thesis",
        description: "Volume and quality metrics per model",
      },
      rq1_edit_distance: {
        placement: "appendix",
        description: "Edit distance with bootstrap confidence intervals",
      },
      rq1_per_package_breakdown: {
        placement: "appendix",
        description: "Median mutation score by package and model",
      },
    },
    stats: {
      rq1_pairwise: {
        placement: "appendix",
        description: "Pairwise Mann–Whitney tests on RQ1 metrics",
      },
    },
  },
  rq2: {
    figures: {
      jaccard_box: {
        placement: "thesis",
        description: "Jaccard overlap distribution across runs",
      },
      mutant_variability_stacked: {
        placement: "thesis",
        description: "Mutant trial variability (stable / variable / unique)",
      },
      cv_grouped_bar: {
        placement: "appendix",
        description: "Coefficient of variation for score, survivors, edit distance",
      },
      score_across_runs_line: {
        placement: "appendix",
        description: "Mutation score drift across runs",
      },
      within_model_jaccard_heatmap: {
        placement: "appendix",
        description: "Run-vs-run Jaccard overlap heatmaps",
      },
      forest_plot: {
        placement: "appendix",
        description: "Mutation score forest plot with bootstrap CI",
      },
    },
    tables: {
      rq2_consistency: {
        placement: "thesis",
        description: "Cross-run consistency metrics per model",
      },
      rq2_per_package_consistency: {
        placement: "appendix",
        description: "Per-package consistency breakdown",
      },
    },
    stats: {
      rq2_pairwise: {
        placement: "appendix",
        description: "Pairwise Mann–Whitney tests on consistency metrics",
      },
      rq2_bootstrap_ci: {
        placement: "appendix",
        description: "Bootstrap confidence intervals for RQ2 metrics",
      },
    },
  },
  rq3: {
    figures: {
      llm_comparison_boxplot: {
        placement: "thesis",
        description: "Equivalent mutant rate by model",
      },
      llm_means_errorbar: {
        placement: "thesis",
        description: "Mean equivalence rate with error bars",
      },
      effective_survivors: {
        placement: "thesis",
        description: "Equivalent vs behavioral-change survivors",
      },
      llm_package_heatmap: {
        placement: "appendix",
        description: "Equivalence rate heatmap (model × package)",
      },
      package_complexity_scatter: {
        placement: "appendix",
        description: "Package size vs equivalence rate",
      },
      score_vs_equiv_rate: {
        placement: "appendix",
        description: "Mutation score vs equivalence rate",
      },
    },
    tables: {
      rq3_main_results: {
        placement: "thesis",
        description: "Equivalent mutant rates per model",
      },
      rq3_statistical_tests: {
        placement: "appendix",
        description: "Pairwise statistical tests between models",
      },
    },
    stats: {},
  },
  rq4: {
    figures: {
      pareto_frontier: {
        placement: "thesis",
        description: "Pareto frontier (cost vs mutation score)",
      },
      cost_per_nonequiv_bar: {
        placement: "thesis",
        description: "Cost per non-equivalent survivor (log scale)",
      },
      cost_composition: {
        placement: "appendix",
        description: "Input vs output token cost composition",
      },
      cost_vs_jaccard: {
        placement: "appendix",
        description: "Cost vs cross-run consistency (Jaccard)",
      },
    },
    tables: {
      rq4_cost: {
        placement: "thesis",
        description: "Cost metrics per model",
      },
      rq4_pareto: {
        placement: "thesis",
        description: "Pareto-optimal models",
      },
    },
    stats: {
      rq4_correlations: {
        placement: "appendix",
        description: "Correlations between cost and quality metrics",
      },
    },
  },
  rq5: {
    figures: {
      category_violins: {
        placement: "thesis",
        description: "Open-weight vs API-only metric distributions",
      },
      effect_size_forest: {
        placement: "thesis",
        description: "Cliff's delta effect sizes between categories",
      },
    },
    tables: {
      rq5_category_summary: {
        placement: "thesis",
        description: "Category-level summary statistics",
      },
      rq5_pairwise_effect: {
        placement: "thesis",
        description: "Mann–Whitney comparisons with effect sizes",
      },
    },
    stats: {
      rq5_category_tests: {
        placement: "appendix",
        description: "Detailed category statistical tests",
      },
    },
  },
};
