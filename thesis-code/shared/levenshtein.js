function levenshtein(a, b) {
  const sa = String(a ?? "");
  const sb = String(b ?? "");
  if (sa === sb) return 0;
  if (!sa.length) return sb.length;
  if (!sb.length) return sa.length;

  const row = new Array(sb.length + 1);
  for (let j = 0; j <= sb.length; j++) row[j] = j;

  for (let i = 1; i <= sa.length; i++) {
    let prev = i - 1;
    row[0] = i;
    for (let j = 1; j <= sb.length; j++) {
      const temp = row[j];
      const cost = sa[i - 1] === sb[j - 1] ? 0 : 1;
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + cost);
      prev = temp;
    }
  }
  return row[sb.length];
}

export function absoluteDistance(a, b) {
  return levenshtein(a, b);
}

export function normalizedDistance(a, b) {
  const sa = String(a ?? "");
  const sb = String(b ?? "");
  const maxLen = Math.max(sa.length, sb.length, 1);
  return absoluteDistance(sa, sb) / maxLen;
}

/**
 * @param {Array<{originalCode?: string, replacement?: string, original?: string, replacement?: string}>} mutants
 */
export function distancesForMutants(mutants) {
  return mutants.map((m) => {
    const original = m.originalCode ?? m.original ?? "";
    const replacement = m.replacement ?? "";
    const abs = absoluteDistance(original, replacement);
    const maxLen = Math.max(String(original).length, String(replacement).length, 1);
    return {
      absolute: abs,
      normalized: abs / maxLen,
      originalLength: String(original).length,
      replacementLength: String(replacement).length,
    };
  });
}

export function summarizeDistances(distances) {
  if (!distances.length) {
    return { medianAbs: null, medianNorm: null, q1Abs: null, q3Abs: null, q1Norm: null, q3Norm: null, n: 0 };
  }
  const abs = distances.map((d) => d.absolute).sort((a, b) => a - b);
  const norm = distances.map((d) => d.normalized).sort((a, b) => a - b);
  return {
    medianAbs: percentile(abs, 0.5),
    medianNorm: percentile(norm, 0.5),
    q1Abs: percentile(abs, 0.25),
    q3Abs: percentile(abs, 0.75),
    q1Norm: percentile(norm, 0.25),
    q3Norm: percentile(norm, 0.75),
    n: distances.length,
  };
}

function percentile(sorted, p) {
  const idx = (sorted.length - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
}
