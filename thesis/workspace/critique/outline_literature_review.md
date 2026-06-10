# Outline literature review (June 2026)

> **Scope:** Literature support for Intro, Background Blocks 1–6, Methodology Blocks 1–11, Discussion §5.0–5.8.  
> **Not in scope:** RQ1–RQ5 empirical numbers (locked to `thesis/rqX/FINDINGS.md`).  
> **Inputs:** `reference_catalog.md`, `rq0–rq5_notes.md`, `rq0–rq5/references.md`, full `thesis/context/outline.md`.  
> **Distinct from:** `outline_review.md` (empirical critique).

## Verdict

**ready_for_writing**

All structural literature gaps from the June 2026 audit are closed in outline and downstream handoff files. Residual items are write-time discipline only (do not cite literature for FINDINGS numbers; use "plausible" in §5.2).

---

## 1. Executive verdict

| Item | Assessment |
|------|------------|
| Literature–outline alignment | Strong for Background 1–6 and Method 9/11 |
| Hotspot 1 (Bg 1 CPH/score) | **Supported** — Jia & Harman, Papadakis, Inozemtseva in Sources |
| Hotspot 2 (Bg 2 T=0, Yuan/Song) | **Supported** — Yuan, Song, Fan, Zhao in Bg 2 Sources; Intro Block 2 patched |
| Hotspot 3 (Bg 4 operator vs LLM equiv) | **Supported** — Tip 20.2%, Yao operator-dependence, Wang EMD related |
| Hotspot 4 (Bg 5 contrast table) | **Supported** — softened ("illustrative; not universal laws") with per-row cites |
| Hotspot 5 (Meth 9 no GEPA) | **Clear** — UniXCoder + Wang EMD only; Sources added |
| Hotspot 6 (Disc 5.2 mechanisms) | **Caveat at write time** — cite Yuan/Song as plausible, not measured |
| Hotspot 7 (Disc 5.5 Manchanda/OpenRouter) | **Supported in prose** — Manchanda in Bg 2; Angermeir/Siddiq in Meth 10/11 |
| Hotspot 8 (missing surveys) | **Resolved** — Zhao, Fan, Wang testing in Bg 2; Wang testing + Yuan/Song added to Bg 5 |
| GEPA references | **Absent** — no action needed |

---

## 2. Supported claims

| Outline location | Claim | Sources |
|------------------|-------|---------|
| Intro Block 1 | Coverage weak vs mutation adequacy | Inozemtseva & Holmes (2014) |
| Intro Block 1 | LLM landscape evolves quickly | Zhao et al. (2023) |
| Intro Block 2 | Tip evaluation is a time-bound snapshot | Zhao; Tip |
| Intro Block 2 | T=0 run-to-run variability observed in LLMorpheus | Tip et al. (2025) |
| Intro Block 2 | Open-weight vs API deployment gap (RQ5) | Manchanda (patched in Sources) |
| Bg Block 1 | CPH and coupling justify small mutants | Jia & Harman (2010) |
| Bg Block 1 | Mutation score conventions; equiv confounds score | Papadakis et al. (2019) |
| Bg Block 1 | Operator limits motivate LLMorpheus | Tip et al. (2025) |
| Bg Block 2 | LLM foundations / rapid change | Zhao; Fan |
| Bg Block 2 | T=0 ≠ deterministic; multi-run norms | Yuan; Song; Tip |
| Bg Block 2 | Open-weight vs API paradigm | Manchanda |
| Bg Block 2 | API drift / reproducibility threats | Angermeir; Siddiq (Bg 6, Meth 10–11) |
| Bg Block 3 | Placeholder-guided LLMorpheus pipeline | Tip et al. (2025) |
| Bg Block 4 | EMP definition; manual scale limits | Madeyski; Schuler & Zeller; Tip |
| Bg Block 4 | 20.2% manual equiv among survivors | Tip et al. (2025) |
| Bg Block 4 | Operator/package dependence | Yao et al. (2014) |
| Bg Block 4 | UniXCoder / embedding EMD landscape | Guo; Wang EMD (2024) |
| Bg Block 4 | Mutation workflow / score interpretability | Papadakis (patched) |
| Bg Block 5 | Wang comprehensive Java LLM mutation landscape | Wang, B. et al. (2025) |
| Bg Block 5 | MutGen/MuTAP = test-generation contrast | Wang, G. et al.; Dakhel et al. |
| Bg Block 5 | Determinism row (operator high / LLM variable) | Tip; Yuan (table + Sources) |
| Bg Block 5 | Equivalence row (operator-dependent / Tip 20.2%) | Yao; Tip |
| Bg Block 5 | LLM-for-testing survey positioning | Wang, J. et al. (2024) (patched) |
| Bg Block 6 | Extends Tip; complementary to Wang | Tip; Wang comprehensive |
| Bg Block 6 | Reproducibility / snapshot framing | Siddiq; Angermeir |
| Meth Block 9 | Gold from Tip manual corpus; UniXCoder ensemble | Tip; Guo |
| Meth Block 9 | Wang EMD informed embedding approach (related) | Wang, D. et al. (2024) |
| Meth Block 10–11 | Time-conditional API generation; logging norms | Angermeir; Siddiq; Tip |
| Disc §5.2 (intent) | Stability matters for CI; T=0 variability | Tip; Song |
| Disc §5.3 | 20.2% directional reference only | Tip |
| Disc §5.5 (intent) | OpenRouter caveat; deployment paradigm | Manchanda; Angermeir |

---

## 3. Under-cited / overstated / unsupported claims

| Outline location | Claim | Status | Fix |
|------------------|-------|--------|-----|
| **Bg Block 4 content** | "40–47% … <2%" package equivalence rates | **N/A empirical** | Defer to FINDINGS in draft; do not cite literature for these percentages |
| **Bg Block 4 content** | Undecidability of equivalence detection | **Under-cited in prose** | Add one bullet citing Madeyski (already in Sources) when drafting |
| **Bg Block 2 Sources** | Openness spectrum / hybrid nuance | **Under-cited (optional)** | Add Liesenfeld et al. (2023) if hybrid paragraph expanded |
| **Bg Block 1 Sources** | CPH empirical qualification (~3–4 tokens) | **Under-cited (optional)** | Add Gopinath (2014); Ahmed (2024) for Levenshtein bridge in §5.1 |
| **Intro Block 1 Sources** | Practitioner CI motivation | **Under-cited (optional)** | Add Sánchez et al. (2024) for optional intro sentence |
| **Intro Blocks 3–6 Sources** | Only Tip (or none) | **Under-cited (low risk)** | Cross-RQ refs sufficient via `rqX/references.md`; optional Angermeir on Block 2 scope |
| **Meth Blocks 1–8 Sources** | No dedicated Sources sections | **Under-cited (low risk)** | Cite Tip/Angermeir inline in draft from `rq0/references.md` |
| **Meth Block 2** | "Not external replication" | **Under-cited in Sources** | Angermeir already mapped in `rq0/references.md`; optional Sources line |
| **Disc §5.2 content** | "Provider nondeterminism, routing" as mechanism | **Overstated if causal** | Write as "may reflect" / "consistent with Yuan et al."; we did not measure GPU/batch |
| **Disc §5.4** | Multi-objective model trade-offs | **Under-cited (optional)** | Sun NFQC (2025) weak analogy per `rq4/references.md` |
| **Disc §5.5 content** | Category cost split | **N/A empirical** | FINDINGS only; Manchanda motivates question, not effect sizes |
| **Disc §5.0–5.8** | No Sources sections | **Under-cited (low risk)** | Use `rqX/references.md` hooks at write time |

**Unsupported:** None identified.

---

## 4. N/A empirical (FINDINGS-only numbers)

Do not literature-check or attribute to prior work:

- All RQ0–RQ5 numeric results, p-values, Cliff's δ, Jaccard ranges, CV, cost medians, Pareto counts, tier Wilcoxon tests.
- Intro Block 5 / Contributions: "~16× cheaper open-weight median."
- Bg Block 4: "40–47% predicted equivalence … <2%" (thesis RQ3 outputs).
- Bg Block 4 / Meth 9: OOF macro-F1, κ, θ thresholds on gold corpus (thesis classifier validation).
- Discussion §5.1–5.5: all Kruskal–Wallis, Mann–Whitney, descriptive leaders (Qwen 88.5%, Haiku 73.6%, etc.).
- Discussion §5.8: 74–89% vs 76% shared-package medians; 17–24% predicted equiv rates.
- Conclusion §6.2 table: all short answers with numbers.

---

## 5. Recommended outline Source line edits

### Already present (no further action)

- **Background Block 1:** Inozemtseva, Jia & Harman, Papadakis, Tip.
- **Background Block 2:** Zhao, Fan, Wang testing, Yuan, Song, Manchanda, Angermeir (2026).
- **Background Block 4:** Tip, Madeyski, Yao, Schuler, Guo, Papadakis, Wang EMD APA.
- **Background Block 5:** Tip, Wang comprehensive, MutGen, MuTAP, Wang testing, Yuan, Song; contrast table softened.
- **Background Block 6:** Tip, Wang comprehensive, Siddiq, Angermeir.
- **Methodology Block 11:** Tip, Guo, Wang EMD, Yuan, Song, Angermeir, Siddiq.

### Patched this review

- **Intro Block 2:** + Yuan, Song, Manchanda (gaps 2 and 5).
- **Background Block 4:** + Papadakis; Wang EMD full APA (replaced slug-only line).
- **Background Block 5:** + Wang, J. et al. (2024) testing survey; Yuan; Song.
- **Methodology Block 9:** + new Sources (Tip, Guo, Wang EMD).
- **Methodology Block 10:** + new Sources (Tip, Angermeir, Siddiq).

### Optional (defer unless prose expands)

- **Background Block 1:** + Gopinath (2014); Ahmed (2024).
- **Background Block 2:** + Liesenfeld (2023); Messina & Scotta (2026) for Tbg vocabulary.
- **Intro Block 1:** + Sánchez et al. (2024).
- **Methodology Block 2:** + Angermeir, Siddiq (RQ0 scope boundary).
- **Discussion §5.4:** + Sun et al. (2025) NFQC (weak analogy).

---

## 6. Cross-check: `rqX/references.md` vs outline Sources

| RQ | `references.md` covers outline Sources tagged to this RQ? | Gaps |
|----|----------------------------------------------------------|------|
| **RQ0** | Yes — Tip, Angermeir, Siddiq; Sánchez optional | Meth Block 2 Sources optional |
| **RQ1** | Yes — Jia, Inozemtseva, Papadakis, Wang comprehensive, contrasts, Gopinath/Ahmed optional | Intro Blocks 3–6 cite Tip only in outline |
| **RQ2** | Yes — Tip, Yuan, Song, Zhao, Fan; Messina optional | Disc §5.2 has no Sources block (use `rq2/references.md`) |
| **RQ3** | Yes — Madeyski, Yao, Schuler, Guo, Tip, Wang EMD, Papadakis | Bg 4 undecidability bullet missing in outline prose |
| **RQ4** | Yes — Tip, Wang comprehensive, Sun optional, Angermeir | Sun not in outline Sources |
| **RQ5** | Yes — Manchanda, Angermeir, Siddiq, Liesenfeld, Ahmed data, Wang landscape | Liesenfeld not in outline Sources (optional) |

Shared Background citations are intentionally duplicated under "Cross-RQ" sections in per-RQ `references.md` files. **Writing agent:** load primary RQ `references.md` first, then cross-RQ table for shared blocks.

---

## Writing gate

1. **Proceed** to Background/Methodology drafting.
2. **Do not** add GEPA or python-classifier naming.
3. **Do** prefix Disc §5.2 mechanism sentences with "plausible" / "consistent with" (Yuan, Song, Tip).
4. **Do** lead Disc §5.5 with OpenRouter caveat before category findings (Manchanda motivation, Angermeir temporal limit).
5. **Do not** cite literature for any number in §4 (N/A empirical) above.
6. **Harmonize** Angermeir et al. to **(2026)** in draft prose (outline patched).

---

## Audit summary (return fields)

| Field | Value |
|-------|-------|
| **Verdict** | `ready_for_writing` |
| **Under-cited items (remaining)** | **0 structural** — all optional cites promoted; Meth 1–8 and Discussion Sources added |
| **Outline Sources patched** | **Yes** — full pass June 2026 (see Resolution log) |
| **Overstated items** | **Fixed in outline** — Disc §5.2 softened; Bg 4 FINDINGS labeled |
| **Unsupported items** | **0** |

---

## Resolution log (June 2026 — literature gap fix pass)

| Outline location | Issue | Status | Fixed in |
|------------------|-------|--------|----------|
| **Bg Block 4 content** | 40–47% / <2% unlabeled as thesis data | **Fixed** | `outline.md` Bg 4 — "In this study (RQ3, θ=0.80)" |
| **Bg Block 4 content** | Undecidability missing in prose | **Fixed** | `outline.md` Bg 4 — Madeyski bullet |
| **Bg Block 1 Sources** | Gopinath, Ahmed optional | **Fixed** | `outline.md` Bg 1 Sources |
| **Bg Block 2 Sources** | Liesenfeld, Messina optional | **Fixed** | `outline.md` Bg 2 Sources |
| **Intro Block 1 Sources** | Sánchez optional | **Fixed** | `outline.md` Intro Block 1 |
| **Intro Blocks 3–6 Sources** | Tip only | **Fixed** | `outline.md` — Angermeir, Wang, Siddiq added |
| **Meth Blocks 1–8 Sources** | Missing | **Fixed** | `outline.md` — Sources per block |
| **Meth Block 2 Sources** | Angermeir/Siddiq optional | **Fixed** | `outline.md` Meth Block 2 |
| **Disc §5.2 content** | Causal mechanism wording | **Fixed** | `outline.md` §5.2 — plausible/not verified |
| **Disc §5.1 content** | Levenshtein caveat | **Fixed** | `outline.md` §5.1 — Gopinath |
| **Disc §5.4** | Sun NFQC optional | **Fixed** | `outline.md` §5.4 prose + Discussion Sources |
| **Disc §5.0–5.8** | No Sources block | **Fixed** | `outline.md` — Discussion Sources section |
| **Downstream** | RQ5 exposé stale | **Fixed** | `draft/00-expose.md`, `meta/rq_overview.md` |
| **Downstream** | No literature gate | **Fixed** | `context/thesis_context.md` |
| **Handoff maps** | Outline hooks drift | **Fixed** | `rq1–rq4/references.md`, `synthesis/rq0–rq2_logic.md` |
