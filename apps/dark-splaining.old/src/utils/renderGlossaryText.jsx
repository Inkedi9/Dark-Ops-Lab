import GlossaryTooltip from "../components/learning/shared/GlossaryTooltip";

export function renderGlossaryText(text, glossaryLinks = []) {
    if (!text || glossaryLinks.length === 0) {
        return text;
    }

    const sortedLinks = [...glossaryLinks].sort(
        (a, b) => b.label.length - a.label.length
    );

    const pattern = new RegExp(
        `(${sortedLinks
            .map((link) => escapeRegExp(link.label))
            .join("|")})`,
        "gi"
    );

    const parts = text.split(pattern);

    return parts.map((part, index) => {
        const matchedLink = sortedLinks.find(
            (link) => link.label.toLowerCase() === part.toLowerCase()
        );

        if (!matchedLink) {
            return part;
        }

        return (
            <GlossaryTooltip key={`${part}-${index}`} termId={matchedLink.termId}>
                {part}
            </GlossaryTooltip>
        );
    });
}

function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
