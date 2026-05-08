import PanelCard from "@dark/ui/components/PanelCard";

export default function ConceptBlock({ title, text, children }) {
    return (
        <PanelCard variant="elevated" className="p-6">
            <h2 className="text-xl font-extrabold tracking-tight text-white">
                {title}
            </h2>

            {children ? (
                <div className="mt-4 leading-7 text-slate-300">{children}</div>
            ) : (
                <p className="mt-4 leading-7 text-slate-300">{text}</p>
            )}
        </PanelCard>
    );
}
