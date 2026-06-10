/**
 * Publication artifact placement per research question.
 * placement: "publication" (main paper) | "appendix"
 */
export const OUTPUT_MANIFEST = {
  rq1: {
    figures: {
      mutation_score_box: {
        placement: "publication",
        description: "Mutation score distribution by model",
      },
      validity_stack: {
        placement: "publication",
        description: "Candidate composition (valid / invalid / identical / duplicate)",
      },
      score_vs_survivors: {
        placement: "publication",
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
        placement: "publication",
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
        placement: "publication",
        description: "Jaccard overlap distribution across runs",
      },
      mutant_variability_stacked: {
        placement: "publication",
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
        placement: "publication",
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
        placement: "publication",
        description: "Equivalent mutant rate by model",
      },
      llm_means_errorbar: {
        placement: "publication",
        description: "Mean equivalence rate with error bars",
      },
      effective_survivors: {
        placement: "publication",
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
        placement: "publication",
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
        placement: "publication",
        description: "Pareto frontier (cost vs mutation score)",
      },
      cost_per_nonequiv_bar: {
        placement: "publication",
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
      tier_cost_efficiency: {
        placement: "publication",
        description: "Within-provider tier cost efficiency (cheap vs premium)",
      },
    },
    tables: {
      rq4_cost: {
        placement: "publication",
        description: "Cost metrics per model",
      },
      rq4_pareto: {
        placement: "publication",
        description: "Pareto-optimal models",
      },
      rq4_tier_comparison: {
        placement: "publication",
        description: "Within-provider cheap vs premium tier comparison",
      },
    },
    stats: {
      rq4_correlations: {
        placement: "appendix",
        description: "Correlations between cost and quality metrics",
      },
      tier_paired_deltas: {
        placement: "appendix",
        description: "Paired package deltas for tier comparison (cheap − premium)",
      },
      tier_wilcoxon: {
        placement: "appendix",
        description: "Wilcoxon signed-rank tests on tier paired deltas",
      },
    },
  },
  rq5: {
    figures: {
      category_violins: {
        placement: "publication",
        description: "Open-weight vs API-only metric distributions",
      },
      effect_size_forest: {
        placement: "publication",
        description: "Cliff's delta effect sizes between categories",
      },
    },
    tables: {
      rq5_category_summary: {
        placement: "publication",
        description: "Category-level summary statistics",
      },
      rq5_pairwise_effect: {
        placement: "publication",
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
