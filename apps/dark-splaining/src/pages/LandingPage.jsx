import AppBadge from "@dark/ui/components/AppBadge";
import AppButton from "@dark/ui/components/AppButton";
import PanelCard from "@dark/ui/components/PanelCard";
import LearningLoop from "../components/marketing/LearningLoop";

const labs = ["SQL Injection", "XSS", "Access Control", "Auth flaws"];

export default function LandingPage() {
    return (
        <main className="min-h-screen overflow-hidden bg-[#05070d] text-white">
            <section className="relative isolate flex min-h-screen items-center px-6 py-10 lg:px-8">
                <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_35%_-10%,rgba(96,165,250,0.18),transparent_34%),radial-gradient(circle_at_85%_35%,rgba(168,85,247,0.16),transparent_32%),linear-gradient(to_bottom,#05070d,#020617)]" />
                <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.05] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:52px_52px]" />

                <div className="mx-auto grid w-full max-w-7xl gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
                    <div className="motion-page">
                        <AppBadge variant="emerald">
                            Safe mocked cybersecurity labs
                        </AppBadge>

                        <h1 className="mt-8 max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.06em] md:text-7xl">
                            <span className="block bg-gradient-to-b from-white to-white/45 bg-clip-text text-transparent">
                                Break vulnerable code.
                            </span>
                            <span className="block bg-gradient-to-b from-blue-100 to-violet-200/55 bg-clip-text text-transparent">
                                Learn how to fix it.
                            </span>
                        </h1>

                        <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">
                            DarkSplaining teaches cyber security through guided lessons,
                            safe mock exploits, quizzes, XP, and local progress tracking.
                        </p>

                        <div className="mt-9 flex flex-wrap gap-3">
                            <AppButton to="/" variant="primary">
                                Enter DarkSplaining →
                            </AppButton>

                            <AppButton to="/tracks" variant="secondary">
                                View learning tracks
                            </AppButton>
                        </div>

                        <div className="mt-10 flex flex-wrap gap-2">
                            {labs.map((lab) => (
                                <AppBadge key={lab} variant="slate">
                                    {lab}
                                </AppBadge>
                            ))}
                        </div>
                    </div>

                    <div className="relative motion-page">
                        <div className="absolute -inset-8 rounded-[3rem] bg-gradient-to-br from-blue-500/15 via-violet-500/10 to-transparent blur-3xl" />

                        <PanelCard variant="hero" accent="blue" className="relative p-4 md:p-5">
                            <div className="bg-[#020409] p-5 font-mono ring-1 ring-blue-300/[0.18]">
                                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-[0.32em] text-blue-300">
                                            first.mission
                                        </p>
                                        <h2 className="mt-2 text-2xl font-black text-white">
                                            Bypass the login
                                        </h2>
                                    </div>

                                    <AppBadge variant="emerald">Safe lab</AppBadge>
                                </div>

                                <div className="mt-5 space-y-4">
                                    <div className="bg-black/70 p-4 ring-1 ring-white/[0.08]">
                                        <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">
                                            user.input
                                        </p>
                                        <p className="mt-2 text-sm text-violet-200">
                                            ' OR '1'='1
                                        </p>
                                    </div>

                                    <div className="bg-black/70 p-4 ring-1 ring-blue-300/[0.18]">
                                        <p className="text-[10px] uppercase tracking-[0.24em] text-blue-300">
                                            generated.query
                                        </p>
                                        <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-xs leading-6 text-slate-300">
                                            {`SELECT * FROM users
WHERE username = '' OR '1'='1'
AND password = 'anything';`}
                                        </pre>
                                    </div>

                                    <div className="bg-emerald-300/[0.08] p-4 ring-1 ring-emerald-300/[0.22]">
                                        <p className="text-sm font-bold text-emerald-200">
                                            ✓ Vulnerability understood
                                        </p>
                                        <p className="mt-2 text-sm leading-6 text-slate-400">
                                            Next step: compare it with parameterized queries and learn the fix.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </PanelCard>

                        <div className="relative pb-20 absolute -bottom-20 -left-10 z-20 hidden bg-slate-950/90 p-5 ring-1 ring-white/[0.08] backdrop-blur-xl md:block">
                            <div className="absolute -bottom-10 -left-10 z-20 hidden w-[30rem] md:block">
                                <LearningLoop />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
