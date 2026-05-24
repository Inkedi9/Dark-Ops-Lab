"use client";

import { Component, type ReactNode } from "react";

type Props = {
    children: ReactNode;
    fallback?: ReactNode;
};

type State = {
    error: Error | null;
};

export class ErrorBoundary extends Component<Props, State> {
    state: State = { error: null };

    static getDerivedStateFromError(error: Error): State {
        return { error };
    }

    render() {
        if (this.state.error) {
            return this.props.fallback ?? <DefaultFallback error={this.state.error} />;
        }
        return this.props.children;
    }
}

function DefaultFallback({ error }: { error: Error }) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#05070A] px-6 text-slate-100">
            <div className="max-w-lg text-center">
                <p className="font-mono text-xs uppercase tracking-[0.35em] text-red-400">
                    System error
                </p>
                <h1 className="mt-4 text-4xl font-black text-white">Something crashed.</h1>
                <p className="mt-3 font-mono text-sm text-slate-500">{error.message}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-8 rounded-xl border border-slate-700 bg-white/[0.05] px-6 py-3 font-mono text-sm text-slate-300 transition hover:border-slate-500 hover:text-white"
                >
                    Reload
                </button>
            </div>
        </div>
    );
}
