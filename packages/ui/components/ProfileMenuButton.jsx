import { useEffect, useRef, useState } from "react";

function DefaultLink({ to, href, children, ...props }) {
    return (
        <a href={href || to} {...props}>
            {children}
        </a>
    );
}

function UserIcon({ className = "" }) {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className={className}
            fill="none"
        >
            <path
                d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
                stroke="currentColor"
                strokeWidth="1.8"
            />
            <path
                d="M4.75 20a7.25 7.25 0 0 1 14.5 0"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
            />
        </svg>
    );
}

function ResetIcon({ className = "" }) {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className={className}
            fill="none"
        >
            <path
                d="M4 7v5h5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M5.6 12A7 7 0 1 0 7.5 6.6L4 10"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export default function ProfileMenuButton({
    profile,
    profileHref = "/profile",
    onLogout,
    LinkComponent,
    label = "View profile",
    logoutLabel = "Reset / logout",
    className = "",
}) {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);
    const Link = LinkComponent || DefaultLink;
    const profileLinkProps = LinkComponent
        ? { to: profileHref }
        : { href: profileHref };

    const username = profile?.username || "Local Operator";
    const level = profile?.level ?? 1;
    const rank = profile?.rank || "ROOKIE";

    useEffect(() => {
        function handlePointerDown(event) {
            if (!menuRef.current?.contains(event.target)) {
                setOpen(false);
            }
        }

        function handleKeyDown(event) {
            if (event.key === "Escape") {
                setOpen(false);
            }
        }

        document.addEventListener("pointerdown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <div ref={menuRef} className={`relative ${className}`}>
            <button
                type="button"
                onClick={() => setOpen((current) => !current)}
                aria-label="Open profile menu"
                aria-expanded={open}
                className="group grid h-10 w-10 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-slate-100 shadow-[0_10px_28px_rgba(0,0,0,0.22)] transition hover:border-blue-300/35 hover:bg-white/[0.08] hover:text-blue-100"
            >
                <UserIcon className="h-5 w-5 transition-transform group-hover:scale-110" />
            </button>

            {open && (
                <div className="absolute right-0 z-50 mt-3 w-64 overflow-hidden rounded-2xl border border-blue-400/20 bg-slate-950/95 shadow-[0_0_34px_rgba(96,165,250,.16),0_20px_70px_rgba(0,0,0,.45)] ring-1 ring-white/[0.06] backdrop-blur-xl">
                    <div className="border-b border-blue-400/10 px-4 py-3">
                        <p className="truncate font-semibold text-white">{username}</p>
                        <p className="mt-1 font-mono text-xs uppercase tracking-[0.18em] text-blue-300">
                            LVL {level} • {rank}
                        </p>
                    </div>

                    <Link
                        {...profileLinkProps}
                        onClick={() => setOpen(false)}
                        className="block px-4 py-3 text-sm font-bold text-slate-300 transition hover:bg-blue-400/10 hover:text-white"
                    >
                        {label}
                    </Link>

                    {onLogout && (
                        <button
                            type="button"
                            onClick={() => {
                                setOpen(false);
                                onLogout();
                            }}
                            className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-bold text-red-300 transition hover:bg-red-400/10 hover:text-red-200"
                        >
                            <ResetIcon className="h-4 w-4" />
                            {logoutLabel}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
