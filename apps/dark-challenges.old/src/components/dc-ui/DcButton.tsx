import Link from "next/link";
import type { ReactNode } from "react";

type DcButtonVariant = "default" | "primary" | "success" | "danger" | "ghost";

type DcButtonProps = {
    children: ReactNode;
    className?: string;
    variant?: DcButtonVariant;
    disabled?: boolean;
    onClick?: () => void;
    href?: string;
    type?: "button" | "submit";
};

const baseClass =
    "relative inline-flex items-center justify-center overflow-hidden rounded-xl px-5 py-3 text-sm font-medium transition-all duration-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-45";

const variants: Record<DcButtonVariant, string> = {
    default:
        "border border-slate-700 bg-[#0f1623] text-slate-200 hover:border-[rgba(var(--dc-accent),0.4)] hover:text-blue-200 hover:shadow-[0_0_18px_rgba(var(--dc-accent),0.1)]",

    primary:
        "border border-[rgba(var(--dc-accent),0.35)] bg-[rgba(var(--dc-accent),0.08)] text-blue-100 hover:border-[rgba(var(--dc-accent),0.5)] hover:bg-[rgba(var(--dc-accent),0.12)] hover:shadow-[0_0_18px_rgba(var(--dc-accent),0.12)]",

    success:
        "border border-green-400/30 bg-green-400/10 text-green-200 hover:border-green-300/50 hover:bg-green-400/15 hover:shadow-[0_0_18px_rgba(88,240,167,0.12)]",

    danger:
        "border border-red-400/30 bg-red-400/10 text-red-200 hover:border-red-300/50 hover:bg-red-400/15 hover:shadow-[0_0_18px_rgba(255,92,122,0.12)]",

    ghost:
        "border border-transparent bg-transparent text-slate-400 hover:border-slate-700 hover:bg-slate-900/40 hover:text-slate-200",
};

function classNames(...classes: Array<string | false | undefined>) {
    return classes.filter(Boolean).join(" ");
}

export function DcButton({
    children,
    className,
    variant = "default",
    disabled = false,
    onClick,
    href,
    type = "button",
}: DcButtonProps) {
    const finalClassName = classNames(
        baseClass,
        variants[variant],
        "active:translate-y-px",
        className
    );

    if (href) {
        return (
            <Link href={href} className={finalClassName}>
                {children}
            </Link>
        );
    }

    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={finalClassName}
        >
            {children}
        </button>
    );
}