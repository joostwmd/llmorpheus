# Workspace (agent handoffs)

Intermediate artifacts between agents. **Not** final thesis prose — that lives in `thesis/draft/`.

## Flow

```
Literature → workspace/literature/rqX_notes.md
Data       → workspace/analysis/rqX_summary.md
Synthesis  → workspace/synthesis/rqX_logic.md  (reads literature + analysis)
Critique   → workspace/critique/               (reads synthesis; draft mode also reads draft/)
Writing    → thesis/draft/                       (reads workspace + context)
```

## Templates

### `literature/rqX_notes.md`

```markdown
# RQX — Literature notes

## Sources consulted
- slug: … | citation: … | sections read: …

## Findings relevant to this RQ
- …

## Gaps in our library
- …

## Suggested citations for Writing
- …
```

### `analysis/rqX_summary.md`

```markdown
# RQX — Analysis summary

## Headline findings (claim-ready bullets)
-

## Evidence
- CSV/figure: `thesis/rqX/output/publication/…`

## Caveats
-

## Open questions
-
```

### `synthesis/rqX_logic.md`

```markdown
# RQX — Synthesis

## Answer to the RQ (1–2 sentences)

## Evidence from our data

## What the literature says

## Tension / gap between ours and prior work

## Suggested narrative for Writing (ordered bullets)
```

### `critique/rqX_argument_review.md`

```markdown
# RQX — Argument critique

## Verdict
proceed_with_caveats | revise_before_writing | blocked

## Strong claims

## Weak / overclaimed

## Reviewer questions (prioritized)

## Suggested caveats for Writing

## Route back
- [ ] Synthesis  [ ] Data  [ ] Literature
```

Stub files exist for RQ0–RQ5 in each subfolder. Replace `<!-- TODO -->` when an agent runs.
