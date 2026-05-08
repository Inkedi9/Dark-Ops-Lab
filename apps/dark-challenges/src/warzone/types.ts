export type WarzoneLog = {
    level: "info" | "success" | "warning" | "error";
    message: string;
};

export type WarzoneState = {
    stage: "recon" | "initial-access" | "privilege-escalation" | "exfiltration" | "complete";
    objectivesCompleted: string[];
    flagParts: string[];
};

export type WarzoneActionResult = {
    success: boolean;
    message: string;
    logs: WarzoneLog[];
    nextState?: Partial<WarzoneState>;
};

export type Warzone = {
    id: string;
    slug: string;
    title: string;
    description: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    timeLimitSeconds: number;
    rewardXp: number;
    badge: string;
    objectives: {
        id: string;
        title: string;
        description: string;
    }[];
    initialState: WarzoneState;
    evaluateAction: (input: string, state: WarzoneState) => WarzoneActionResult;
};