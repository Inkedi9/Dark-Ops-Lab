import { createElement } from "react";
import { Link } from "react-router-dom";
import { Inbox } from "lucide-react";
import AppButton from "@dark/ui/components/AppButton";

export default function EmptyState({
    icon = Inbox,
    title,
    description,
    actionLabel,
    actionTo,
}) {
    return (
        <div className="rounded-xl border border-slate-300/12 bg-slate-400/[0.035] p-5 text-center shadow-[0_0_24px_rgba(96,165,250,0.035)]">
            <div className="mx-auto grid h-11 w-11 place-items-center rounded-lg border border-blue-300/18 bg-blue-400/[0.055] text-blue-200">
                {createElement(icon, { className: "h-5 w-5" })}
            </div>

            {title && (
                <h3 className="mt-3 text-lg font-black text-white">
                    {title}
                </h3>
            )}

            {description && (
                <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-400">
                    {description}
                </p>
            )}

            {actionLabel && actionTo && (
                <Link to={actionTo} className="mt-4 inline-flex">
                    <AppButton variant="secondary">{actionLabel}</AppButton>
                </Link>
            )}
        </div>
    );
}
