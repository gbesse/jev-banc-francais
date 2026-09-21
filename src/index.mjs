// Purpose: Evaluate closed-set model decisions with accuracy, abstention and calibration statistics.
export function brier(probabilities, label, labels) {
  return (
    labels.reduce(
      (sum, k) =>
        sum + (Number(probabilities[k] || 0) - (k === label ? 1 : 0)) ** 2,
      0,
    ) / labels.length
  );
}
export function calibrationBins(rows, count = 5) {
  const bins = Array.from({ length: count }, (_, i) => ({
    from: i / count,
    to: (i + 1) / count,
    n: 0,
    confidence: 0,
    accuracy: 0,
  }));
  for (const r of rows) {
    const i = Math.min(count - 1, Math.floor(r.confidence * count)),
      b = bins[i];
    b.n++;
    b.confidence += r.confidence;
    b.accuracy += r.correct ? 1 : 0;
  }
  return bins.map((b) => ({
    ...b,
    confidence: b.n ? b.confidence / b.n : null,
    accuracy: b.n ? b.accuracy / b.n : null,
  }));
}
export async function evaluate(cases, provider, options = {}) {
  if (!Array.isArray(cases) || !cases.length)
    throw new TypeError("cases must be non-empty");
  const min = options.minConfidence ?? 0,
    rows = [];
  for (const c of cases) {
    if (!c.id || !c.input || !c.label || !c.criteria)
      throw new TypeError("Each case needs id, input, label and criteria");
    const r = await provider.decide({
      state: c.input,
      questions: {
        decision: {
          type: "choice",
          instructions:
            c.instructions ||
            "Choose the correct label for this French-language case.",
          criteria: c.criteria,
        },
      },
    });
    const a = r.answers.decision,
      labels = Object.keys(c.criteria),
      covered = a.confidence >= min;
    rows.push({
      id: c.id,
      expected: c.label,
      predicted: a.choice,
      confidence: a.confidence,
      covered,
      correct: covered && a.choice === c.label,
      brier: brier(a.probabilities, c.label, labels),
      probabilities: a.probabilities,
    });
  }
  const covered = rows.filter((r) => r.covered);
  return {
    n: rows.length,
    coverage: covered.length / rows.length,
    accuracy: covered.length
      ? covered.filter((r) => r.correct).length / covered.length
      : null,
    meanBrier: rows.reduce((s, r) => s + r.brier, 0) / rows.length,
    calibration: calibrationBins(covered),
    rows,
  };
}
export function compareReports(a, b) {
  return {
    accuracyDelta: (b.accuracy ?? 0) - (a.accuracy ?? 0),
    coverageDelta: b.coverage - a.coverage,
    brierDelta: b.meanBrier - a.meanBrier,
  };
}
export async function runCli(argv, io = console) {
  io.log(
    JSON.stringify(
      {
        dataset: argv[0] || null,
        next: "Load labeled cases and call evaluate with each provider adapter.",
      },
      null,
      2,
    ),
  );
}
