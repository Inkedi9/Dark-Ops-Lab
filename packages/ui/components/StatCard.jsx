import PanelCard from "./PanelCard";

export default function StatCard({ icon: Icon, label, value, tone = "blue" }) {
    const iconClass = tone === "emerald" ? "text-emerald-300" : "text-blue-200";

    return (
        <PanelCard variant="darkNexus" accent={tone === "emerald" ? "emerald" : "blue"} hover className="p-5">
            <div className="mb-4 flex items-center justify-between">
                <p className="font-mono text-xs uppercase tracking-widest text-slate-500">
                    {label}
                </p>
                {Icon && <Icon size={18} className={iconClass} />}
            </div>

            <p className="text-3xl font-black text-white">{value}</p>
        </PanelCard>
    );
}