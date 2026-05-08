export default function NexusBackground() {
    return (
        <>
            {/* Base dark gradient */}
            <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_55%_25%,rgba(0,229,255,0.14),transparent_30%),radial-gradient(circle_at_80%_50%,rgba(57,255,20,0.10),transparent_28%),linear-gradient(to_bottom,#05070A,#020409)]" />

            {/* Fine grid ABOVE gradient */}
            <div className="pointer-events-none fixed inset-0 z-[1] opacity-[0.22] bg-[linear-gradient(rgba(0,229,255,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.16)_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(circle_at_center,black,transparent_85%)]" />

            {/* Large grid */}
            <div className="pointer-events-none fixed inset-0 z-[1] opacity-[0.10] bg-[linear-gradient(rgba(57,255,20,0.20)_1px,transparent_1px),linear-gradient(90deg,rgba(57,255,20,0.20)_1px,transparent_1px)] bg-[size:216px_216px] [mask-image:radial-gradient(circle_at_center,black,transparent_78%)]" />

            {/* Vignette */}
            <div className="pointer-events-none fixed inset-0 z-[2] bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.45)_100%)]" />

            {/* Scanline */}
            <div className="pointer-events-none fixed inset-x-0 top-0 z-[3] h-[2px] nexus-scanline bg-gradient-to-r from-transparent via-blue-300/70 to-emerald-300/50 shadow-[0_0_30px_rgba(0,229,255,.75)]" />
        </>
    );
}