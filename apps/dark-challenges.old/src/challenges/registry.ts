import type { ChallengeDefinition } from "@/engine/types";
import { sqlInjectionLoginChallenge } from "./sql-injection-login";
import { reflectedXssChallenge } from "./reflected-xss";
import { storedXssChallenge } from "./stored-xss";
import { blindSqliChallenge } from "./blind-sqli";
import { authBypassTokenChallenge } from "./auth-bypass-token";
import { timeBasedBlindSqliChallenge } from "./time-based-blind-sqli";
import { commandInjectionChallenge } from "./command-injection";

export const challenges: ChallengeDefinition[] = [
    sqlInjectionLoginChallenge,
    reflectedXssChallenge,
    storedXssChallenge,
    blindSqliChallenge,
    authBypassTokenChallenge,
    timeBasedBlindSqliChallenge,
    commandInjectionChallenge,
];

export function getChallengeBySlug(slug: string) {
    return challenges.find((challenge) => challenge.slug === slug) ?? null;
}

export function getAllChallenges() {
    return challenges;
}

export function isChallengeUnlocked(index: number, solvedCount: number) {
    return index === 0 || solvedCount >= index;
}