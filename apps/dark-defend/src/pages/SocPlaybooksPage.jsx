"use client";

import SocLayout from "../components/soc/layout/SocLayout";
import PanelCard from "@dark/ui/components/PanelCard";
import AppBadge from "@dark/ui/components/AppBadge";
import AppButton from "@dark/ui/components/AppButton";
import {
    BookOpen,
    CheckCircle2,
    Lock,
    MailWarning,
    Network,
    ShieldAlert,
    UserCheck,
} from "lucide-react";

const playbooks = [
    {
        title: "Phishing Triage",
        category: "Email",
        difficulty: "Beginner",
        icon: MailWarning,
        status: "Available",
        steps: ["Inspect sender", "Check links", "Review intent", "Classify verdict"],
    },
    {
        title: "Credential Stuffing Response",
        category: "Identity",
        difficulty: "Intermediate",
        icon: UserCheck,
        status: "Available",
        steps: ["Validate login burst", "Check MFA", "Revoke sessions", "Force reset"],
    },
    {
        title: "Encoded PowerShell Investigation",
        category: "Endpoint",
        difficulty: "Intermediate",
        icon: ShieldAlert,
        status: "Available",
        steps: ["Review process tree", "Decode command", "Check parent process", "Isolate host"],
    },
    {
        title: "C2 Beaconing Containment",
        category: "Network",
        difficulty: "Advanced",
        icon: Network,
        status: "Locked",
        steps: ["Confirm interval", "Enrich domain", "Contain endpoint", "Hunt persistence"],
    },
];

function difficultyVariant(difficulty) {
    if (difficulty === "Advanced") return "danger";
    if (difficulty === "Intermediate") return "amber";
    return "blue";
}

export default function SocPlaybooksPage() {
    return (
        <SocLayout>
            <section className="mb-8">
                <div className="mb-4 flex flex-wrap gap-2">
                    <AppBadge variant="blue">Response library</AppBadge>
                    <AppBadge variant="emerald">Analyst guidance</AppBadge>
                </div>

                <h1 className="text-5xl font-black tracking-tight text-white">
                    SOC Playbooks
                </h1>

                <p className="mt-4 max-w-3xl text-slate-400">
                    Follow structured analyst response flows for common alert types:
                    phishing, identity abuse, endpoint execution and network anomalies.
                </p>
            </section>

            <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {playbooks.map((playbook) => {
                    const Icon = playbook.icon;
                    const locked = playbook.status === "Locked";

                    return (
                        <PanelCard
                            key={playbook.title}
                            variant="darkNexus"
                            accent={locked ? "none" : difficultyVariant(playbook.difficulty)}
                            hover={!locked}
                            className={locked ? "opacity-50" : ""}
                        >
                            <div className="mb-5 flex items-center justify-between">
                                <div className="grid h-12 w-12 place-items-center rounded-xl border border-blue-300/20 bg-blue-400/[0.08] text-blue-200">
                                    {locked ? <Lock size={21} /> : <Icon size={21} />}
                                </div>

                                <AppBadge variant={locked ? "default" : difficultyVariant(playbook.difficulty)}>
                                    {playbook.status}
                                </AppBadge>
                            </div>

                            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">
                                {playbook.category}
                            </p>

                            <h2 className="mt-2 text-2xl font-black text-white">
                                {playbook.title}
                            </h2>

                            <div className="mt-5 space-y-3">
                                {playbook.steps.map((step, index) => (
                                    <div
                                        key={step}
                                        className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.035] px-3 py-3"
                                    >
                                        <CheckCircle2
                                            size={16}
                                            className={locked ? "text-slate-600" : "text-blue-200"}
                                        />

                                        <span className="text-sm font-bold text-slate-300">
                                            0{index + 1}. {step}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <AppButton
                                variant={locked ? "secondary" : "primary"}
                                disabled={locked}
                                className="mt-6 w-full"
                            >
                                {locked ? "Locked" : "Open playbook"}
                            </AppButton>
                        </PanelCard>
                    );
                })}
            </section>

            <PanelCard variant="darkNexusHero" accent="blue" className="mt-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <p className="font-mono text-xs uppercase tracking-[0.35em] text-blue-200">
                            Coming next
                        </p>

                        <h2 className="mt-2 text-3xl font-black text-white">
                            Playbooks will connect directly to alerts.
                        </h2>

                        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                            Later, each alert can recommend a response playbook and generate a case report from your analyst notes.
                        </p>
                    </div>

                    <BookOpen className="h-14 w-14 text-blue-200/60" />
                </div>
            </PanelCard>
        </SocLayout>
    );
}