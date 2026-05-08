import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BackBar({
    href = "/",
    label = "Back",
    status = "Profile Secure ●",
    meta = "localStorage V1",
}) {
    return (
        <div className="mb-8 flex items-center justify-between rounded-2xl border border-white/[0.06] bg-black/35 px-5 py-4 shadow-[0_10px_40px_rgba(0,0,0,.4)] backdrop-blur-xl">
            <Link
                href={href}
                className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-sm font-bold text-slate-200 transition hover:bg-white/[0.08]"
            >
                <ArrowLeft size={17} />
                {label}
            </Link>

            <div className="hidden items-center gap-6 text-xs uppercase tracking-[0.18em] text-slate-400 md:flex">
                <span className="text-emerald-300">{status}</span>
                <span>{meta}</span>
            </div>
        </div>
    );
}