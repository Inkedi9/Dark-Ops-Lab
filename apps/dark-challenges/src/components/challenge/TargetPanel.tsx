type Props = {
    username: string;
    password: string;
    setUsername: (v: string) => void;
    setPassword: (v: string) => void;
    onExecute: () => void;
    disabled: boolean;
};

export default function TargetPanel({
    username,
    password,
    setUsername,
    setPassword,
    onExecute,
    disabled,
}: Props) {
    return (
        <div className="rounded-2xl border border-slate-800 bg-[#0b101a] p-6">
            <p className="mb-5 font-mono text-sm uppercase tracking-[0.3em] text-violet-300">
                Target: Auth Panel
            </p>

            <div className="space-y-4">
                <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="username"
                    className="w-full rounded-xl border border-slate-700 bg-[#05070d] px-4 py-3 font-mono"
                />

                <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="password"
                    className="w-full rounded-xl border border-slate-700 bg-[#05070d] px-4 py-3 font-mono"
                />

                <button
                    onClick={onExecute}
                    disabled={disabled}
                    className="w-full rounded-xl bg-blue-300 px-5 py-3 font-black text-black"
                >
                    EXECUTE LOGIN
                </button>
            </div>
        </div>
    );
}