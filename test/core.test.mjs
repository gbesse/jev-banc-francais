// Purpose: Verify scoring and coverage calculations.
import test from "node:test";
import assert from "node:assert/strict";
import { brier, evaluate, compareReports } from "../src/index.mjs";
import { createFakeProvider } from "../src/jev.mjs";
test("computes multiclass Brier score", () =>
  assert.equal(brier({ a: 1, b: 0 }, "a", ["a", "b"]), 0));
test("evaluates labeled cases", async () => {
  const p = createFakeProvider(() => ({
    model: "jev-1.13.0",
    answers: {
      decision: {
        type: "choice",
        choice: "a",
        probabilities: { a: 0.9, b: 0.1 },
        confidence: 0.9,
      },
    },
    usage: { input_tokens: 1, output_tokens: 0 },
  }));
  const r = await evaluate(
    [{ id: "1", input: "x", label: "a", criteria: { a: "A", b: "B" } }],
    p,
  );
  assert.equal(r.accuracy, 1);
});
test("compares reports", () =>
  assert.ok(
    Math.abs(
      compareReports(
        { accuracy: 0.5, coverage: 1, meanBrier: 0.2 },
        { accuracy: 0.7, coverage: 0.8, meanBrier: 0.1 },
      ).accuracyDelta - 0.2,
    ) < Number.EPSILON,
  ));
