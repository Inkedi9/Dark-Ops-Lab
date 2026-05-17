export default function StatCard({ title, value, color = "text-white" }) {
    return (
        <div className="rounded-2xl border border-blue-400/20 bg-black/30 p-5 shadow-[0_0_24px_rgba(0,229,255,0.05)] backdrop-blur-xl transition hover:-translate-y-1 hover:border-blue-300/40">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">{title}</p>
            <p className={`mt-3 text-3xl font-black ${color}`}>{value}</p>
        </div>
    );
}
