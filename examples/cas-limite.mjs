// Cas limite : les écarts entre deux campagnes sont calculés localement.
import assert from "node:assert/strict";
import { compareReports } from "../src/index.mjs";

const resultat = compareReports(
  { accuracy: 0.6, coverage: 1, meanBrier: 0.2 },
  { accuracy: 0.8, coverage: 0.9, meanBrier: 0.1 },
);
assert.ok(Math.abs(resultat.accuracyDelta - 0.2) < Number.EPSILON);
assert.ok(Math.abs(resultat.brierDelta + 0.1) < Number.EPSILON);
console.log(JSON.stringify(resultat, null, 2));
