export default function NexusBackground() {
    return (
        <>
            {/* Base gradient */}
            <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.08),transparent_28%),radial-gradient(circle_at_80%_40%,rgba(99,102,241,0.10),transparent_32%),linear-gradient(to_bottom,#040507,#020308)]" />

            {/* Grid */}
            <div className="pointer-events-none fixed inset-0 z-0 opacity-25 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:54px_54px]" />

            {/* Scanline */}
            <div className="pointer-events-none fixed inset-x-0 top-0 z-0 h-px nexus-scanline bg-gradient-to-r from-transparent via-blue-300/50 to-fuchsia-300/30 shadow-[0_0_24px_rgba(96,165,250,.35)]" />
        </>
    );
}
