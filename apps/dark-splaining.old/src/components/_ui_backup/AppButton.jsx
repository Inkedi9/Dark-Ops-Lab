import { Link } from "react-router-dom";
import { radius } from "../../styles/ui";

const shapes = {
    default: radius.control,
    sharp: "rounded-md",
};

const variants = {
    primary:
        "bg-blue-300/[0.10] text-blue-100 ring-1 ring-blue-300/[0.22] shadow-[0_0_22px_rgba(96,165,250,0.08)] hover:bg-blue-300/[0.16] hover:ring-blue-300/[0.34] hover:text-blue-50",

    secondary:
        "bg-white/[0.045] text-slate-200 ring-1 ring-white/[0.07] hover:bg-white/[0.075] hover:ring-white/[0.12]",

    violet:
        "bg-violet-300/[0.10] text-violet-100 ring-1 ring-violet-300/[0.22] shadow-[0_0_22px_rgba(168,85,247,0.08)] hover:bg-violet-300/[0.16] hover:ring-violet-300/[0.34] hover:text-violet-50",

    emerald:
        "bg-emerald-300/[0.10] text-emerald-100 ring-1 ring-emerald-300/[0.22] shadow-[0_0_22px_rgba(16,185,129,0.08)] hover:bg-emerald-300/[0.16] hover:ring-emerald-300/[0.34] hover:text-emerald-50",

    ghost:
        "bg-white/[0.025] text-slate-300 ring-1 ring-white/[0.05] hover:bg-white/[0.055] hover:text-blue-200 hover:ring-blue-300/[0.18]",

    danger:
        "bg-red-300/[0.10] text-red-200 ring-1 ring-red-300/[0.22] hover:bg-red-300/[0.16] hover:ring-red-300/[0.32]",

    nexus:
        "bg-blue-300/[0.08] text-blue-100 ring-1 ring-blue-300/[0.24] shadow-[0_0_24px_rgba(0,229,255,.10)] hover:bg-blue-300/[0.14] hover:ring-blue-300/[0.38] hover:shadow-[0_0_34px_rgba(0,229,255,.18)]",

    nexusGreen:
        "bg-emerald-300/[0.08] text-emerald-100 ring-1 ring-emerald-300/[0.24] shadow-[0_0_24px_rgba(57,255,20,.10)] hover:bg-emerald-300/[0.14] hover:ring-emerald-300/[0.38] hover:shadow-[0_0_34px_rgba(57,255,20,.16)]",
};

export default function AppButton({
    to,
    children,
    variant = "primary",
    shape = "default",
    className = "",
    ...props
}) {
    const baseClass =
        `inline-flex items-center justify-center ${shapes[shape]} px-5 py-3 text-sm font-extrabold transition duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070b16]`;

    const finalClass = `${baseClass} ${variants[variant]} ${className}`;

    if (to) {
        return (
            <Link to={to} className={finalClass}>
                {children}
            </Link>
        );
    }

    return (
        <button type="button" className={finalClass} {...props}>
            {children}
        </button>
    );
}
