import { radius } from "../styles/ui";

const shapes = {
    default: radius.control,
    sharp: radius.sharp,
    terminal: radius.terminal,
};

const variants = {
    default: "border border-white/[0.1] bg-white/[0.04] text-white hover:bg-white/[0.08]",

    primary:
        "bg-gradient-to-b from-blue-400/[0.12] to-blue-400/[0.06] text-blue-100 ring-1 ring-blue-400/[0.18] backdrop-blur-md shadow-[0_6px_30px_rgba(96,165,250,0.08)] hover:from-blue-400/[0.18] hover:to-blue-400/[0.10] hover:ring-blue-400/[0.28]",
    secondary:
        "bg-white/[0.04] text-slate-200 ring-1 ring-white/[0.06] backdrop-blur-md hover:bg-white/[0.07]",
    emerald:
        "bg-emerald-300/[0.10] text-emerald-100 ring-1 ring-emerald-300/[0.18] hover:bg-emerald-300/[0.16]",
    danger:
        "bg-red-300/[0.10] text-red-200 ring-1 ring-red-300/[0.18] hover:bg-red-300/[0.16]",
    ghost:
        "bg-transparent text-slate-300 hover:text-blue-200 hover:bg-white/[0.04]",
    nexus:
        "bg-blue-300/[0.08] text-blue-100 ring-1 ring-blue-300/[0.18] hover:bg-blue-300/[0.14]",

    nexusGreen:
        "bg-emerald-300/[0.08] text-emerald-100 ring-1 ring-emerald-300/[0.18] hover:bg-emerald-300/[0.14]",
};

export default function AppButton({
    href,
    to,
    children,
    variant = "default",
    shape = "default",
    className = "",
    ...props
}) {
    const baseClass = `inline-flex items-center justify-center ${shapes[shape] ?? shapes.default} px-5 py-3 text-sm font-extrabold transition duration-300 ease-out hover:-translate-y-[1px] active:translate-y-0 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070b16]`;

    const finalClass = `${baseClass} ${variants[variant] ?? variants.default} ${className}`;

    const targetHref = href ?? to;

    if (targetHref) {
        return (
            <a href={targetHref} className={finalClass} {...props}>
                {children}
            </a>
        );
    }

    return (
        <button type="button" className={finalClass} {...props}>
            {children}
        </button>
    );
}