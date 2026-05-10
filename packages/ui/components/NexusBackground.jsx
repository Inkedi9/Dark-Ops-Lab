export default function NexusBackground() {
    return (
        <>
            {/* Base gradient */}
            <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.08),transparent_28%),radial-gradient(circle_at_80%_40%,rgba(99,102,241,0.10),transparent_32%),linear-gradient(to_bottom,#040507,#020308)]" />

            {/* DarkSplaining ambient wash */}
            <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_28%_0%,rgba(96,165,250,0.18),transparent_34%),radial-gradient(circle_at_82%_20%,rgba(129,140,248,0.15),transparent_32%),radial-gradient(circle_at_52%_95%,rgba(16,185,129,0.08),transparent_38%),linear-gradient(to_bottom,rgba(8,13,26,0.12),rgba(5,9,19,0.72))]" />

            {/* Grid */}
            <div className="pointer-events-none fixed inset-0 z-0 opacity-25 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:54px_54px]" />

            {/* DarkSplaining blue grid */}
            <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.16]">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(96,165,250,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(96,165,250,0.15)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(circle_at_center,black,transparent_84%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.08),rgba(5,9,19,0.74))]" />
            </div>

            {/* Scanline */}
            <div className="pointer-events-none fixed inset-x-0 top-0 z-0 h-px nexus-scanline bg-gradient-to-r from-transparent via-blue-300/50 to-fuchsia-300/30 shadow-[0_0_24px_rgba(96,165,250,.35)]" />
        </>
    );
}
