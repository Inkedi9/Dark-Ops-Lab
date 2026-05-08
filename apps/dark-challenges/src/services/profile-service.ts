import { getAllProgress } from "@/store/progress-store";
import { getGlobalProgress } from "@/store/global-progress";
import { getAllChallenges } from "@/challenges/registry";
import { getAllCtfProgress } from "@/store/ctf-progress-store";
import { getAllMiniCtfs } from "@/ctf/registry";
import { getAllWarzoneProgress } from "@/store/warzone-progress-store";
import { getAllWarzones } from "@/warzone/registry";

export type UserProfile = {
    id: string;
    username: string;
    totalXp: number;
    level: number;
    rank: string;
    solvedCount: number;
    totalChallenges: number;
    completion: number;
    totalAttempts: number;
    totalHints: number;
    badges: ProfileBadge[];
};

export type ProfileBadge = {
    id: string;
    title: string;
    description: string;
    unlocked: boolean;
};

export function getLocalUserProfile(): UserProfile {
    const progress = getAllProgress();
    const global = getGlobalProgress();
    const challenges = getAllChallenges();
    const ctfProgress = getAllCtfProgress();
    const ctfs = getAllMiniCtfs();
    const warzoneProgress = getAllWarzoneProgress();
    const warzones = getAllWarzones();

    const solvedCount = progress.filter((item) => item.solved).length;
    const totalChallenges = challenges.length;

    const completion =
        totalChallenges === 0
            ? 0
            : Math.round((solvedCount / totalChallenges) * 100);

    const totalAttempts = progress.reduce((sum, item) => sum + item.attempts, 0);
    const totalHints = progress.reduce((sum, item) => sum + item.hintsUsed, 0);

    const badges: ProfileBadge[] = [
        {
            id: "first-breach",
            title: "First Breach",
            description: "Complete your first mission.",
            unlocked: solvedCount >= 1,
        },
        {
            id: "injection-initiate",
            title: "Injection Initiate",
            description: "Complete at least one injection challenge.",
            unlocked: progress.some((item) => item.challengeId.includes("sqli")),
        },
        {
            id: "client-side-operator",
            title: "Client-Side Operator",
            description: "Complete at least one XSS challenge.",
            unlocked: progress.some((item) => item.challengeId.includes("xss")),
        },
        {
            id: "no-hand-holding",
            title: "No Hand-Holding",
            description: "Complete 3 missions.",
            unlocked: solvedCount >= 3,
        },
        ...ctfs.map((ctf) => {
            const completed = ctfProgress.some(
                (progress) => progress.ctfId === ctf.id && progress.completed
            );

            return {
                id: `ctf-${ctf.id}`,
                title: ctf.badge,
                description: `Complete the CTF operation: ${ctf.title}.`,
                unlocked: completed,
            };
        }),
        ...warzones.map((warzone) => {
            const completed = warzoneProgress.some(
                (item) => item.warzoneId === warzone.id && item.completed
            );

            return {
                id: `warzone-${warzone.id}`,
                title: warzone.badge,
                description: `Clear the warzone simulation: ${warzone.title}.`,
                unlocked: completed,
            };
        }),
    ];

    return {
        id: "local-user",
        username: "Anonymous Operator",
        totalXp: global.totalXp,
        level: global.level,
        rank: global.rank,
        solvedCount,
        totalChallenges,
        completion,
        totalAttempts,
        totalHints,
        badges,
    };
}