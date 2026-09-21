// Purpose: Describe labeled French decision cases and evaluation reports.
import type { JevProvider } from "./jev.mjs";
export type EvaluationCase = {
  id: string;
  input: unknown;
  label: string;
  criteria: Record<string, string>;
  instructions?: string;
};
export function brier(
  probabilities: Record<string, number>,
  label: string,
  labels: string[],
): number;
export function calibrationBins(rows: any[], count?: number): any[];
export function evaluate(
  cases: EvaluationCase[],
  provider: JevProvider,
  options?: { minConfidence?: number },
): Promise<any>;
export function compareReports(
  before: any,
  after: any,
): { accuracyDelta: number; coverageDelta: number; brierDelta: number };
export function runCli(
  argv: string[],
  io?: { log(value: string): void },
): Promise<void>;
