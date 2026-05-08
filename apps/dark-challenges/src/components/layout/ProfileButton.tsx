import Link from "next/link";

export function ProfileButton() {
    return (
        <Link
            href="/profile"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-[#05070d] px-4 py-3 font-mono text-xs uppercase tracking-[0.18em] text-slate-300 transition hover:border-blue-300 hover:text-blue-200"
        >
            <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                className="text-blue-300"
            >
                <path
                    d="M12 2L4 6V12C4 17.2 7.4 21.1 12 22C16.6 21.1 20 17.2 20 12V6L12 2Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                />
                <path
                    d="M9 12L11 14L15.5 9.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
            Profile
        </Link>
    );
}