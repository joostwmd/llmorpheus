/**
 * Duplicate run-1 datasets to simulate additional runs for pipeline testing.
 * @param {import('./artifacts.js').Dataset[]} datasets
 * @param {number} targetRuns
 * @param {{ realOnly?: boolean }} [opts]
 * @returns {import('./artifacts.js').Dataset[]}
 */
export function simulateRuns(datasets, targetRuns, opts = {}) {
  if (opts.realOnly || targetRuns <= 1) {
    return datasets.filter((d) => d.run === 1 || !d.simulated);
  }

  const run1 = datasets.filter((d) => d.run === 1 && !d.simulated);
  const otherReal = datasets.filter((d) => d.run !== 1 && !d.simulated);
  const byKey = new Map(otherReal.map((d) => [`${d.model}:${d.run}:${d.package}`, d]));

  const out = [...datasets.filter((d) => !d.simulated)];

  for (let run = 1; run <= targetRuns; run++) {
    for (const base of run1) {
      const key = `${base.model}:${run}:${base.package}`;
      if (byKey.has(key)) continue;
      if (run === 1) continue;
      out.push({
        ...base,
        run,
        runLabel: `run${run}`,
        simulated: true,
      });
    }
  }

  return out.sort((a, b) =>
    `${a.model}:${a.run}:${a.package}`.localeCompare(`${b.model}:${b.run}:${b.package}`)
  );
}

/**
 * Group datasets by model+package across runs.
 * @param {import('./artifacts.js').Dataset[]} datasets
 */
export function groupByModelPackage(datasets) {
  const groups = new Map();
  for (const d of datasets) {
    const key = `${d.model}::${d.package}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(d);
  }
  for (const arr of groups.values()) {
    arr.sort((a, b) => a.run - b.run);
  }
  return groups;
}

/**
 * Aggregate numeric values across runs (median + IQR).
 */
export function aggregateAcrossRuns(values) {
  const nums = values.filter((v) => Number.isFinite(v)).sort((a, b) => a - b);
  if (!nums.length) return { median: null, q1: null, q3: null, mean: null, std: null, n: 0 };
  const n = nums.length;
  const median = percentile(nums, 0.5);
  const q1 = percentile(nums, 0.25);
  const q3 = percentile(nums, 0.75);
  const mean = nums.reduce((a, b) => a + b, 0) / n;
  const variance = nums.reduce((a, b) => a + (b - mean) ** 2, 0) / n;
  return { median, q1, q3, mean, std: Math.sqrt(variance), n };
}

function percentile(sorted, p) {
  if (!sorted.length) return null;
  const idx = (sorted.length - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
}
