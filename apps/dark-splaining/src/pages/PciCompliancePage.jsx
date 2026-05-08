import { Link } from "react-router-dom";

export default function PciCompliancePage() {
    return (
        <div className="py-10">
            <Link
                to="/resources"
                className="mb-8 inline-flex font-mono text-sm text-slate-400 transition hover:text-blue-300"
            >
                ← Back to resources
            </Link>

            <article className="max-w-4xl">
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-violet-300">
                    Resource
                </p>

                <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white md:text-5xl">
                    PCI Compliance (Introduction)
                </h1>

                <p className="mt-6 max-w-3xl text-xl font-semibold leading-8 text-slate-200">
                    Basic concepts around payment security and handling sensitive card
                    data.
                </p>

                <div className="mt-10 border-l border-violet-300/30 pl-5">
                    <p className="font-mono text-xs uppercase tracking-[0.25em] text-slate-500">
                        Overview
                    </p>

                    <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
                        PCI DSS (Payment Card Industry Data Security Standard) is a set of
                        security requirements designed to protect cardholder data. It applies
                        to systems that store, process or transmit payment information.
                    </p>
                </div>

                <div className="mt-10 space-y-8">
                    <section>
                        <h2 className="text-xl font-bold text-white">
                            Why it matters
                        </h2>

                        <p className="mt-3 text-sm leading-7 text-slate-400">
                            Payment data is highly sensitive. If exposed, it can lead to fraud,
                            financial loss and legal consequences. Even simple applications
                            must handle payment flows carefully and avoid storing unnecessary
                            data.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white">
                            Key ideas (simplified)
                        </h2>

                        <ul className="mt-4 space-y-3 text-sm text-slate-400">
                            <li>• Do not store sensitive card data unless absolutely required</li>
                            <li>• Use secure payment providers when possible</li>
                            <li>• Protect data in transit with HTTPS</li>
                            <li>• Restrict access to sensitive systems</li>
                            <li>• Monitor and log access to critical data</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white">
                            In DarkSplaining
                        </h2>

                        <p className="mt-3 text-sm leading-7 text-slate-400">
                            This section will remain high-level and beginner-friendly. The goal
                            is to understand why payment security matters, not to implement
                            full compliance systems.
                        </p>
                    </section>
                </div>

                <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                    <p className="font-mono text-xs uppercase tracking-[0.25em] text-amber-300">
                        Note
                    </p>

                    <p className="mt-3 text-sm leading-7 text-slate-400">
                        This is a simplified introduction. Real PCI compliance involves
                        detailed requirements, audits and strict controls that are outside
                        the scope of this learning project.
                    </p>
                </div>
            </article>
        </div>
    );
}
