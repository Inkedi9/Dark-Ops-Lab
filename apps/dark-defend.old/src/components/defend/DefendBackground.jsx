export default function DefendBackground() {
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {/* base */}
            <div className="absolute inset-0 bg-[#040816]" />

            {/* radial */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(96,165,250,0.08),transparent_38%)]" />

            {/* tactical grid */}
            <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(rgba(96,165,250,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(96,165,250,0.08)_1px,transparent_1px)] bg-[size:32px_32px]" />

            {/* center beam */}
            <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-blue-300/10" />

            {/* horizontal beam */}
            <div className="absolute left-0 top-1/3 h-px w-full bg-blue-300/10" />

            {/* scan glow */}
            <div className="absolute left-0 top-0 h-[420px] w-[420px] rounded-full bg-blue-400/[0.05] blur-3xl" />

            {/* bottom glow */}
            <div className="absolute bottom-0 right-0 h-[460px] w-[460px] rounded-full bg-blue-500/[0.05] blur-3xl" />

            {/* animated scanline */}
            <div className="absolute inset-x-0 top-0 h-[2px] animate-[socScan_8s_linear_infinite] bg-gradient-to-r from-transparent via-blue-300/40 to-transparent" />
        </div>
    );
}