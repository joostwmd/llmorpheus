# Reference index

Source PDFs go in `thesis/references/input/`. Converted papers live under `thesis/references/processed/{slug}/` (`paper.md`, optional `paper.json`, `figures/`).

| Slug | Citation (APA 7) | RQs | Relevance | Path |
|------|------------------|-----|-----------|------|
| llmorpheus-paper-with-appendix-27mar2025 | Tip, F., Bell, J., & Schäfer, M. (2025). LLMorpheus: Mutation testing using large language models. *IEEE Transactions on Software Engineering*. | RQ0–RQ5 | Baseline tool and original evaluation; primary comparison target | `processed/llmorpheus-paper-with-appendix-27mar2025/paper.md` |
| comprehensive-study-on-llms-for-mutation-test | Wang, B., Chen, M., Deng, M., Lin, Y., Harman, M., Papadakis, M., & Zhang, J. M. (2025). A comprehensive study on large language models for mutation testing. | RQ1, RQ4 | Modern LLM comparison for mutation testing | `processed/comprehensive-study-on-llms-for-mutation-test/paper.md` |
| a-comprehensive-study-on-large-language-models-for-mutation-testing | (duplicate slug — prefer `comprehensive-study-on-llms-for-mutation-test`) | — | — | `processed/a-comprehensive-study-on-large-language-models-for-mutation-testing/paper.md` |
| llms-for-equivalent-mutant-detection | (see paper.md for full citation) | RQ3 | Equivalent mutant detection with LLMs | `processed/llms-for-equivalent-mutant-detection/paper.md` |
| mutation-guided-unit-test-gen-with-llms | (see paper.md for full citation) | RQ1 | LLM-guided mutation / test generation | `processed/mutation-guided-unit-test-gen-with-llms/paper.md` |
| effective-test-generation-using-pre-trained-llms | (see paper.md for full citation) | RQ1 | LLM test generation context | `processed/effective-test-generation-using-pre-trained-llms/paper.md` |
| quality-assurance-of-llm-generated-code | (see paper.md for full citation) | RQ1, RQ5 | QA of LLM-generated code | `processed/quality-assurance-of-llm-generated-code/paper.md` |

**Add a row** when converting a new PDF:

```bash
cd thesis/references
node convert.cli.js input/paper.pdf --slug short-name
```

Then append a row above with RQ tags and relevance.
