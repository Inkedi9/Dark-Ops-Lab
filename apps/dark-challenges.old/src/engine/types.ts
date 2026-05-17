export type ChallengeDifficulty = "beginner" | "intermediate" | "advanced";

export type ChallengeInput = {
    username?: string;
    password?: string;
    [key: string]: unknown;
};

export type ChallengeLog = {
    level: "info" | "success" | "warning" | "error";
    message: string;
};

export type ChallengeResult = {
    success: boolean;
    message: string;
    logs: ChallengeLog[];
    metadata?: Record<string, unknown>;
};

export type ChallengeHint = {
    id: string;
    title: string;
    content: string;
    penalty: number;
};

export type ChallengeDefinition = {
    id: string;
    slug: string;
    title: string;
    category: string;
    difficulty: ChallengeDifficulty;
    estimatedMinutes: number;
    objective: string;
    successCondition: string;
    hints: ChallengeHint[];
    evaluate: (input: ChallengeInput) => ChallengeResult;
    getPreview?: (input: ChallengeInput) => string;
    fields: ChallengeInputField[];
    sandboxType: ChallengeSandboxType;
    sandboxMode?: "default" | "blind" | "time";
    reset?: () => void;
    relatedLessons?: {
        title: string;
        description?: string;
        href: string;
    }[];
    exploitFeedback?: {
        title: string;
        summary: string;
        brokenAssumption: string;
        impact: string;
        defensiveFix: string;
    };
};

export type ChallengeInputField = {
    name: string;
    label: string;
    placeholder?: string;
    type?: "text" | "password" | "textarea";
};

export type ChallengeSandboxType = "sql" | "browser" | "terminal";