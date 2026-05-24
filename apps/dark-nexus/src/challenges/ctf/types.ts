export type CtfStepInput = Record<string, string>;

export type CtfStepResult = {
    success: boolean;
    message: string;
    logs: {
        level: "info" | "success" | "warning" | "error";
        message: string;
    }[];
    flagFragment?: string;
};

export type CtfStep = {
    id: string;
    title: string;
    objective: string;
    field: {
        name: string;
        label: string;
        placeholder: string;
        type?: "text" | "textarea";
    };
    evaluate: (input: CtfStepInput) => CtfStepResult;
};

export type MiniCtf = {
    id: string;
    slug: string;
    title: string;
    description: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    rewardXp: number;
    badge: string;
    steps: CtfStep[];
};