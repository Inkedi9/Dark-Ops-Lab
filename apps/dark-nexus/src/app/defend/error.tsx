"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function DefendError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#05070A] px-5">
            <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
                <AlertTriangle className="mx-auto mb-4 text-red-400" size={36} />
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-red-400">Defend Error</p>
                <h1 className="mt-3 text-2xl font-black text-white">Something went wrong</h1>
                <p className="mt-2 font-mono text-sm text-slate-500">
                    {error.digest ? `ref: ${error.digest}` : "An unexpected error occurred."}
                </p>
                <div className="mt-6 flex items-center justify-center gap-3">
                    <button
                        onClick={reset}
                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2 font-mono text-sm text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
                    >
                        <RotateCcw size={14} />
                        Retry
                    </button>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-xl border border-blue-400/20 bg-blue-500/10 px-4 py-2 font-mono text-sm text-blue-300 transition hover:bg-blue-500/15"
                    >
                        Back to DarkOps
                    </Link>
                </div>
            </div>
        </main>
    );
}
