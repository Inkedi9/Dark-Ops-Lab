import type { MiniCtf } from "./types";
import { internalBreachReconStep } from "./challenges/internal-breach-recon";
import { internalBreachAuthStep } from "./challenges/internal-breach-auth";
import { internalBreachCommandStep } from "./challenges/internal-breach-command";

export const internalBreachCtf: MiniCtf = {
    id: "ctf-internal-breach",
    slug: "internal-breach",
    title: "Internal Breach",
    description:
        "Chain exposed diagnostics, weak credentials and internal command access to capture the final flag.",
    difficulty: "intermediate",
    rewardXp: 2500,
    badge: "Internal Breacher",
    finalFlag: "flag{internal_system_compromised}",
    steps: [
        internalBreachReconStep,
        internalBreachAuthStep,
        internalBreachCommandStep,
    ],
};