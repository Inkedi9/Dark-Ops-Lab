type ScoreParams = {
    difficulty: "beginner" | "intermediate" | "advanced";
    attempts: number;
    hintsUsed: number;
    elapsedSeconds: number;
};

function getBaseScore(difficulty: ScoreParams["difficulty"]) {
    if (difficulty === "beginner") return 500;
    if (difficulty === "intermediate") return 1000;
    if (difficulty === "advanced") return 2000;
    return 1000;
}

export function calculateScore({
    difficulty,
    attempts,
    hintsUsed,
    elapsedSeconds,
}: ScoreParams) {
    const base = getBaseScore(difficulty);

    const attemptPenalty = attempts * 40;
    const hintPenalty = hintsUsed * 120;
    const timePenalty = Math.floor(elapsedSeconds / 10) * 5;

    let score = base - attemptPenalty - hintPenalty - timePenalty;

    // Bonus
    if (attempts <= 2) score += 150;
    if (hintsUsed === 0) score += 200;
    if (elapsedSeconds < 60) score += 150;

    return Math.max(100, score);
}