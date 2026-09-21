# How it decides

Jev Banc Français is a provider-neutral evaluation harness for closed-set French-language decisions. It reports accuracy, coverage, Brier score and calibration bins while preserving every case result.

The exact question and criteria live beside the call in [src/index.mjs](../src/index.mjs), making review and version control straightforward. Dates, identifiers, arithmetic, candidate generation, thresholds and state transitions remain code-owned. Synthetic demo probabilities are illustrative. Calibrate review thresholds on representative human labels before operational use.
