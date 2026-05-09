export default function SectionHeader({
    eyebrow,
    title,
    description,
    actions,
}) {
    return (
        <header className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
                {eyebrow && (
                    <p className="font-mono text-xs font-bold uppercase tracking-[0.26em] text-blue-200">
                        {eyebrow}
                    </p>
                )}

                {title && (
                    <h1 className="mt-2 text-3xl font-black tracking-tight text-white md:text-5xl">
                        {title}
                    </h1>
                )}

                {description && (
                    <p className="mt-3 text-sm leading-6 text-slate-400 md:text-base">
                        {description}
                    </p>
                )}
            </div>

            {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
        </header>
    );
}
