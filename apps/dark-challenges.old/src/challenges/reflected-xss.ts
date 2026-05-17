import type {
    ChallengeDefinition,
    ChallengeInput,
    ChallengeResult,
} from "@/engine/types";

function getComment(input: ChallengeInput) {
    return String(input.comment ?? "");
}

function buildPreview(input: ChallengeInput) {
    const comment = getComment(input);

    return `<div class="comment">
  ${comment}
</div>`;
}

const validXssPatterns = [
    /<script[\s\S]*?>[\s\S]*?alert\s*\(/i,
    /<img[\s\S]*?onerror\s*=/i,
    /<svg[\s\S]*?onload\s*=/i,
    /javascript:/i,
];

function hasValidXss(input: ChallengeInput) {
    const comment = getComment(input);

    return validXssPatterns.some((pattern) => pattern.test(comment));
}

export const reflectedXssChallenge: ChallengeDefinition = {
    id: "xss-001",
    slug: "reflected-xss",
    title: "Reflected XSS",
    category: "Client-side",
    difficulty: "beginner",
    estimatedMinutes: 20,
    objective:
        "Inject markup into a reflected comment preview and trigger script execution in the simulated browser.",
    successCondition:
        "The simulated browser detects executable client-side code in the reflected output.",
    sandboxType: "browser",
    fields: [
        {
            name: "comment",
            label: "Comment",
            placeholder: "Write something that changes the preview...",
            type: "textarea",
        },
    ],
    relatedLessons: [
        {
            title: "Cross-Site Scripting",
            description: "Review how unsafe rendering can execute scripts.",
            href: "/lessons/cross-site-scripting",
        },
    ],

    exploitFeedback: {
        title: "User input executed in the browser",
        summary:
            "The application rendered untrusted input as HTML, allowing script execution.",
        brokenAssumption:
            "The application assumed displayed user content was harmless.",
        impact:
            "An attacker can execute JavaScript in another user's browser context.",
        defensiveFix:
            "Escape output by default and sanitize any HTML that must be rendered.",
    },

    hints: [
        {
            id: "hint-1",
            title: "Watch the reflection",
            content: "Your input is rendered back into the page preview.",
            penalty: 150,
        },
        {
            id: "hint-2",
            title: "HTML can become behavior",
            content: "Some HTML attributes can execute JavaScript when an event fires.",
            penalty: 150,
        },
        {
            id: "hint-3",
            title: "Look for execution",
            content:
                "The goal is not just to display text. The goal is to make the browser execute something.",
            penalty: 150,
        },
    ],
    getPreview(input) {
        return buildPreview(input);
    },
    evaluate(input): ChallengeResult {
        const preview = buildPreview(input);

        if (hasValidXss(input)) {
            return {
                success: true,
                message: "Script execution detected.",
                logs: [
                    { level: "info", message: "input received" },
                    { level: "info", message: "comment reflected into preview" },
                    { level: "warning", message: "html parser accepted injected markup" },
                    { level: "success", message: "script execution detected" },
                    { level: "success", message: "challenge solved" },
                ],
                metadata: {
                    preview,
                },
            };
        }

        return {
            success: false,
            message: "No script execution detected.",
            logs: [
                { level: "info", message: "input received" },
                { level: "info", message: "comment reflected into preview" },
                { level: "error", message: "no executable client-side behavior found" },
                { level: "error", message: "challenge failed" },
            ],
            metadata: {
                preview,
            },
        };
    },
};