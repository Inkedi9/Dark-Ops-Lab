export type ChallengePack = {
    id: string;
    title: string;
    description: string;
    challenges: string[]; // slugs
};

export const challengePacks: ChallengePack[] = [
    {
        id: "web-basics",
        title: "Web Exploitation — Entry",
        description: "Initial foothold through basic web vulnerabilities.",
        challenges: [
            "sql-injection-login",
            "reflected-xss",
        ],
    },
    {
        id: "web-advanced",
        title: "Web Exploitation — Advanced",
        description: "Persistent attacks and blind exploitation techniques.",
        challenges: [
            "stored-xss",
            "blind-sqli",
            "time-based-blind-sqli",
        ],
    },
    {
        id: "auth-chain",
        title: "Authentication Attacks",
        description: "Chaining weaknesses to escalate privileges.",
        challenges: [
            "auth-bypass-token",
        ],
    },
    {
        id: "server-side",
        title: "Server-side Exploitation",
        description: "Abuse backend execution paths and unsafe system interactions.",
        challenges: ["command-injection"],
    },
];

export function getPackProgress(
    pack: ChallengePack,
    solvedIds: string[]
) {
    const solved = pack.challenges.filter((slug) =>
        solvedIds.includes(slug)
    ).length;

    return {
        total: pack.challenges.length,
        solved,
        completion: Math.round((solved / pack.challenges.length) * 100),
    };
}

export function isPackUnlocked(packIndex: number, packsProgress: number[]) {
    if (packIndex === 0) return true;

    const previousPackCompletion = packsProgress[packIndex - 1];

    return previousPackCompletion === 100;
}