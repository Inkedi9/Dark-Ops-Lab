import { StatusBadge } from "@/components/dc-ui/StatusBadge";

type FakeBrowserProps = {
    preview: string;
    solved: boolean;
};

export function FakeBrowser({ preview, solved }: FakeBrowserProps) {
    return (
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#0b101a]">
            <div className="flex items-center gap-2 border-b border-slate-800 bg-[#05070d] px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-red-400/70" />
                <span className="h-3 w-3 rounded-full bg-amber-300/70" />
                <span className="h-3 w-3 rounded-full bg-green-300/70" />

                <div className="ml-4 flex-1 rounded-lg border border-slate-800 bg-black px-3 py-2 font-mono text-xs text-slate-400">
                    https://target.local/comments
                </div>

                <StatusBadge variant={solved ? "danger" : "neutral"}>
                    {solved ? "script detected" : "rendering"}
                </StatusBadge>
            </div>

            <div className="bg-white p-6 text-black">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                                Target Application
                            </p>
                            <h3 className="mt-1 text-xl font-black text-slate-900">
                                Public Comment Feed
                            </h3>
                        </div>

                        <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-bold text-slate-600">
                            guest mode
                        </span>
                    </div>

                    <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
                        {preview ? (
                            <div
                                className="prose prose-sm max-w-none font-mono"
                                dangerouslySetInnerHTML={{ __html: preview }}
                            />
                        ) : (
                            <p className="text-sm text-slate-400">
                                No comments stored yet.
                            </p>
                        )}
                    </div>

                    {solved && (
                        <div className="mt-4 rounded-lg border border-red-300 bg-red-50 p-4">
                            <p className="font-mono text-sm font-bold text-red-700">
                                ⚠ JavaScript executed from stored content.
                            </p>
                            <p className="mt-1 text-xs text-red-600">
                                Persistent client-side execution detected in comment feed.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}