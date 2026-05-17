import PanelCard from "@dark/ui/components/PanelCard";
import AppBadge from "@dark/ui/components/AppBadge";

function formatConcept(concept) {
    return String(concept)
        .split("-")
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
}

export default function RelatedConcepts({ concepts = [] }) {
    if (!concepts.length) return null;

    return (
        <PanelCard variant="darkOps" accent="blue" className="p-5">
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-blue-300">
                Related concepts
            </p>

            <div className="flex flex-wrap gap-2">
                {concepts.map((concept) => (
                    <AppBadge key={concept} variant="blue">
                        {formatConcept(concept)}
                    </AppBadge>
                ))}
            </div>
        </PanelCard>
    );
}
