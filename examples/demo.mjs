// Purpose: Demonstrate French decision evaluation with synthetic cases.
import { evaluate } from "../src/index.mjs";
import { createFakeProvider } from "../src/jev.mjs";
const p = createFakeProvider(({ state }) => ({
  model: "jev-1.13.0",
  answers: {
    decision: {
      type: "choice",
      choice: state.includes("remboursement") ? "billing" : "technical",
      probabilities: state.includes("remboursement")
        ? { billing: 0.9, technical: 0.1 }
        : { billing: 0.2, technical: 0.8 },
      confidence: 0.9,
    },
  },
  usage: { input_tokens: 30, output_tokens: 0 },
}));
const criteria = { billing: "Facturation", technical: "Incident technique" };
console.log(
  await evaluate(
    [
      {
        id: "fr-1",
        input: "Je demande un remboursement",
        label: "billing",
        criteria,
      },
      {
        id: "fr-2",
        input: "Le serveur renvoie une erreur",
        label: "technical",
        criteria,
      },
    ],
    p,
  ),
);
