import AppBadge from "@dark/ui/components/AppBadge";

const domainConfig = {
    "OWASP Top 10": {
        label: "OWASP Top 10",
        variant: "violet",
    },
    "Web Security": {
        label: "Web Security",
        variant: "blue",
    },
    Identity: {
        label: "Identity",
        variant: "blue",
    },
    Authentication: {
        label: "Authentication",
        variant: "emerald",
    },
    Authorization: {
        label: "Authorization",
        variant: "violet",
    },
    Injection: {
        label: "Injection",
        variant: "emerald",
    },
    "Access Control": {
        label: "Access Control",
        variant: "violet",
    },
    "Client-side": {
        label: "Client-side",
        variant: "violet",
    },
    "Logging & Detection": {
        label: "Logging & Detection",
        variant: "emerald",
    },
    "System Security": {
        label: "System Security",
        variant: "amber",
    },
    "Security Awareness": {
        label: "Awareness",
        variant: "amber",
    },
    "AI Security": {
        label: "AI Security",
        variant: "slate",
    },
};

export default function DomainBadge({ value, compact = false }) {
    if (!value) return null;

    const config = domainConfig[value] || {
        label: value,
        variant: "slate",
    };

    return (
        <AppBadge
            variant={config.variant}
            className={compact ? "px-2 py-0.5 text-[10px]" : ""}
        >
            {config.label}
        </AppBadge>
    );
}
