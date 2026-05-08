import type {
    ChallengeDefinition,
    ChallengeInput,
    ChallengeResult,
} from "@/engine/types";

const STORAGE_KEY = "dc_stored_xss_comments";

function getComment(input: ChallengeInput) {
    return String(input.comment ?? "");
}

function getStoredComments(): string[] {
    if (typeof window === "undefined") return [];

    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    } catch {
        return [];
    }
}

function saveStoredComments(comments: string[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
}

function hasXss(comment: string) {
    return /<script[\s\S]*?>|onerror\s*=|onload\s*=|javascript:/i.test(comment);
}

function buildPreview() {
    return getStoredComments()
        .map(
            (comment, index) => `<article class="comment">
  <strong>guest_${index + 1}</strong>
  <p>${comment}</p>
</article>`
        )
        .join("\n\n");
}

export const storedXssChallenge: ChallengeDefinition = {
    id: "xss-002",
    slug: "stored-xss",
    title: "Stored XSS",
    category: "Client-side",
    difficulty: "intermediate",
    estimatedMinutes: 25,
    objective:
        "Inject a payload that is stored and executes when the comment feed is rendered again.",
    successCondition:
        "The stored comment triggers script execution in the simulated browser.",
    sandboxType: "browser",
    fields: [
        {
            name: "comment",
            label: "Comment",
            placeholder: "Leave a persistent comment...",
            type: "textarea",
        },
    ],
    hints: [
        {
            id: "stored-xss-h1",
            title: "Persistence",
            content: "The input is not only reflected. It is stored.",
            penalty: 150,
        },
        {
            id: "stored-xss-h2",
            title: "Render context",
            content: "Stored content becomes dangerous when rendered as HTML.",
            penalty: 150,
        },
        {
            id: "stored-xss-h3",
            title: "Trigger later",
            content: "The payload should execute when the comment feed is displayed.",
            penalty: 150,
        },
    ],
    getPreview() {
        return buildPreview();
    },
    reset() {
        if (typeof window === "undefined") return;
        localStorage.removeItem(STORAGE_KEY);
    },
    evaluate(input): ChallengeResult {
        const comment = getComment(input);
        const comments = getStoredComments();

        if (!comment.trim()) {
            return {
                success: false,
                message: "Empty comment rejected.",
                logs: [
                    { level: "error", message: "empty input rejected" },
                    { level: "error", message: "nothing stored" },
                ],
            };
        }

        const nextComments = [...comments, comment];
        saveStoredComments(nextComments);

        if (hasXss(comment)) {
            return {
                success: true,
                message: "Stored XSS executed.",
                logs: [
                    { level: "info", message: "comment submitted" },
                    { level: "info", message: "comment stored in fake database" },
                    { level: "warning", message: "stored markup rendered into feed" },
                    { level: "success", message: "script execution detected" },
                    { level: "success", message: "challenge solved" },
                ],
                metadata: {
                    preview: buildPreview(),
                },
            };
        }

        return {
            success: false,
            message: "Comment stored but no execution detected.",
            logs: [
                { level: "info", message: "comment submitted" },
                { level: "info", message: "comment stored in fake database" },
                { level: "error", message: "feed rendered without script execution" },
            ],
            metadata: {
                preview: buildPreview(),
            },
        };
    },
};