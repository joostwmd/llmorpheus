import * as ss from "simple-statistics";

export function median(values) {
  const nums = values.filter(Number.isFinite);
  if (!nums.length) return null;
  return ss.median(nums);
}

export function mean(values) {
  const nums = values.filter(Number.isFinite);
  if (!nums.length) return null;
  return ss.mean(nums);
}

export function stdDev(values) {
  const nums = values.filter(Number.isFinite);
  if (nums.length < 2) return nums.length ? 0 : null;
  return ss.standardDeviation(nums);
}

export function coefficientOfVariation(values) {
  const m = mean(values);
  const s = stdDev(values);
  if (m == null || s == null || m === 0) return null;
  return (s / Math.abs(m)) * 100;
}

export function iqr(values) {
  const nums = values.filter(Number.isFinite).sort((a, b) => a - b);
  if (!nums.length) return { q1: null, q3: null };
  return { q1: ss.quantile(nums, 0.25), q3: ss.quantile(nums, 0.75) };
}

export function bootstrapCi(successes, total, { nBootstrap = 2000, alpha = 0.05, seed = 42 } = {}) {
  if (!total) return [0, 0];
  let rng = seed;
  const rand = () => {
    rng = (rng * 1664525 + 1013904223) % 4294967296;
    return rng / 4294967296;
  };
  const rates = [];
  for (let i = 0; i < nBootstrap; i++) {
    let s = 0;
    for (let j = 0; j < total; j++) {
      if (rand() < successes / total) s++;
    }
    rates.push((s / total) * 100);
  }
  rates.sort((a, b) => a - b);
  const lo = rates[Math.floor((alpha / 2) * nBootstrap)];
  const hi = rates[Math.floor((1 - alpha / 2) * nBootstrap)];
  return [lo, hi];
}

/** Mann-Whitney U (two-sided) with rank-biserial effect size */
export function mannWhitneyU(sampleA, sampleB) {
  const a = sampleA.filter(Number.isFinite);
  const b = sampleB.filter(Number.isFinite);
  if (!a.length || !b.length) return { u: null, pValue: null, effectSize: null };

  const combined = [...a.map((v) => ({ v, g: 0 })), ...b.map((v) => ({ v, g: 1 }))].sort(
    (x, y) => x.v - y.v
  );
  let rank = 1;
  for (let i = 0; i < combined.length; ) {
    let j = i;
    while (j < combined.length && combined[j].v === combined[i].v) j++;
    const avgRank = (rank + rank + (j - i) - 1) / 2;
    for (let k = i; k < j; k++) combined[k].rank = avgRank;
    rank += j - i;
    i = j;
  }
  const rA = combined.filter((x) => x.g === 0).reduce((s, x) => s + x.rank, 0);
  const n1 = a.length;
  const n2 = b.length;
  const u1 = rA - (n1 * (n1 + 1)) / 2;
  const u2 = n1 * n2 - u1;
  const u = Math.min(u1, u2);
  const effectSize = 1 - (2 * u) / (n1 * n2);

  // Normal approximation for p-value
  const mu = (n1 * n2) / 2;
  const sigma = Math.sqrt((n1 * n2 * (n1 + n2 + 1)) / 12);
  const z = sigma ? (u - mu) / sigma : 0;
  const pValue = 2 * (1 - normalCdf(Math.abs(z)));

  return { u, pValue, effectSize };
}

function normalCdf(z) {
  return 0.5 * (1 + erf(z / Math.SQRT2));
}

function erf(x) {
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const t = 1 / (1 + p * x);
  const y = 1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return sign * y;
}

export function jaccard(setA, setB) {
  const inter = new Set([...setA].filter((x) => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return union.size ? inter.size / union.size : 0;
}

export function formatPct(v, digits = 2) {
  if (v == null || !Number.isFinite(v)) return "—";
  return `${v.toFixed(digits)}%`;
}

export function formatNum(v, digits = 2) {
  if (v == null || !Number.isFinite(v)) return "—";
  return v.toFixed(digits);
}

export function formatIqr(med, q1, q3, digits = 2) {
  if (med == null) return "—";
  if (q1 == null || q3 == null) return formatNum(med, digits);
  return `${formatNum(med, digits)} [${formatNum(q1, digits)}, ${formatNum(q3, digits)}]`;
}
