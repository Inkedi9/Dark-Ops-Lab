type Props = {
    query: string;
};

export default function QueryPreview({ query }: Props) {
    return (
        <div className="rounded-2xl border border-slate-800 bg-[#05070d] p-6">
            <p className="mb-4 font-mono text-sm uppercase tracking-[0.3em] text-blue-300">
                Generated Query
            </p>

            <pre className="rounded-xl bg-black p-5 font-mono text-sm text-blue-100">
                {query}
            </pre>
        </div>
    );
}