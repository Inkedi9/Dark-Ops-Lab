import type {
    ChallengeDefinition,
    ChallengeInput,
    ChallengeResult,
} from "./types";

export type RunChallengeAttemptParams = {
    challenge: ChallengeDefinition;
    input: ChallengeInput;
};

export function runChallengeAttempt(
    params: RunChallengeAttemptParams
): ChallengeResult {
    try {
        return params.challenge.evaluate(params.input);
    } catch {
        return {
            success: false,
            message: "Challenge evaluation failed.",
            logs: [
                {
                    level: "error",
                    message: "internal evaluation error",
                },
            ],
        };
    }
}