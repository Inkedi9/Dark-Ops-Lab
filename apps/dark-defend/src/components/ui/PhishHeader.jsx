import { PhishPanel } from "./PhishPanel";

export function PhishHeader({ eyebrow, title, description, children }) {
    return (
        <PhishPanel variant="nexus" className="p-7">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    {eyebrow && (
                        <p className="font-mono text-xs uppercase tracking-[0.32em] text-blue-300">
                            {eyebrow}
                        </p>
                    )}

                    <h1 className="mt-2 text-4xl font-black uppercase tracking-[0.08em] text-white md:text-5xl">
                        {title}
                    </h1>

                    {description && (
                        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                            {description}
                        </p>
                    )}
                </div>

                {children && <div className="flex flex-wrap gap-2 font-mono">{children}</div>}
            </div>
        </PhishPanel>
    );
}
