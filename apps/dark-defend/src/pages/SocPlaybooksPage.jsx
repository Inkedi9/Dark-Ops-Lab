"use client";

import { createElement, useMemo, useState } from "react";
import {
    BookOpen,
    CheckCircle2,
    FileText,
    Filter,
    Layers,
    MailWarning,
    Network,
    ShieldAlert,
    UserCheck,
} from "lucide-react";
import SocLayout from "../components/soc/layout/SocLayout";
import PanelCard from "@dark/ui/components/PanelCard";
import AppBadge from "@dark/ui/components/AppBadge";
import AppButton from "@dark/ui/components/AppButton";
import MitreBadge from "@/components/threat/MitreBadge";
import SectionHeader from "@/components/shared/SectionHeader";
import EmptyState from "@/components/shared/EmptyState";
import { socPlaybooks } from "@/data/socPlaybooks";
import { socAlerts } from "@/data/socAlerts";
import { getIncidents, mapIncidentToSocAlert } from "@/lib/defend/incidentService";

const filters = ["All", "Email", "Identity", "Endpoint", "Network"];

const categoryIcons = {
    Email: MailWarning,
    Identity: UserCheck,
    Endpoint: ShieldAlert,
    Network: Network,
};

function severityVariant(severity) {
    if (severity === "Critical" || severity === "High") return "danger";
    if (severity === "Medium") return "amber";
    return "blue";
}

function difficultyVariant(difficulty) {
    if (difficulty === "Advanced") return "danger";
    if (difficulty === "Intermediate") return "amber";
    return "blue";
}

function normalize(value) {
    return String(value || "").toLowerCase();
}

function alertText(alert) {
    return [
        alert.title,
        alert.category,
        alert.description,
        alert.mitre,
        ...(alert.mitreTechniques || []),
        ...(alert.signals || []),
        ...(alert.indicators || []).map((indicator) => indicator.value),
    ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
}

function getMatchCount(playbook, alerts) {
    const playbookTerms = [
        playbook.category,
        playbook.title,
        ...(playbook.recommendedFor || []),
        ...(playbook.mitreTechniques || []),
    ]
        .map(normalize)
        .filter(Boolean);

    return alerts.filter((alert) => {
        const text = alertText(alert);
        return playbookTerms.some((term) => text.includes(term));
    }).length;
}

export default function SocPlaybooksPage() {
    const [activeFilter, setActiveFilter] = useState("All");
    const generatedAlerts = useMemo(() => getIncidents().map(mapIncidentToSocAlert), []);
    const allAlerts = useMemo(() => [...generatedAlerts, ...socAlerts], [generatedAlerts]);

    const playbooksWithMatches = useMemo(
        () =>
            socPlaybooks.map((playbook) => ({
                ...playbook,
                matchCount: getMatchCount(playbook, allAlerts),
            })),
        [allAlerts]
    );

    const filteredPlaybooks = useMemo(
        () =>
            playbooksWithMatches.filter(
                (playbook) => activeFilter === "All" || playbook.category === activeFilter
            ),
        [activeFilter, playbooksWithMatches]
    );

    const [selectedId, setSelectedId] = useState(socPlaybooks[0]?.id);
    const selectedPlaybook =
        playbooksWithMatches.find((playbook) => playbook.id === selectedId) ||
        filteredPlaybooks[0] ||
        playbooksWithMatches[0];

    return (
        <SocLayout>
            <SectionHeader
                eyebrow="Response Library"
                title="SOC Playbooks"
                description="Structured response guidance for phishing, identity abuse, endpoint execution and network containment."
                actions={
                    <>
                        <AppBadge variant="blue">{socPlaybooks.length} playbooks</AppBadge>
                        <AppBadge variant="emerald">{allAlerts.length} queue signals</AppBadge>
                    </>
                }
            />

            <section className="mb-5 grid gap-4 md:grid-cols-4">
                <Stat icon={BookOpen} label="Total playbooks" value={socPlaybooks.length} />
                <Stat
                    icon={ShieldAlert}
                    label="High severity"
                    value={socPlaybooks.filter((playbook) => ["High", "Critical"].includes(playbook.severity)).length}
                />
                <Stat
                    icon={UserCheck}
                    label="Identity"
                    value={socPlaybooks.filter((playbook) => playbook.category === "Identity").length}
                />
                <Stat
                    icon={MailWarning}
                    label="Email"
                    value={socPlaybooks.filter((playbook) => playbook.category === "Email").length}
                />
            </section>

            <PanelCard variant="darkNexus" accent="blue" className="mb-5 p-4">
                <div className="flex flex-wrap items-center gap-2">
                    <div className="mr-2 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-slate-500">
                        <Filter className="h-4 w-4 text-blue-200" />
                        Filter
                    </div>
                    {filters.map((filter) => (
                        <button
                            key={filter}
                            type="button"
                            onClick={() => setActiveFilter(filter)}
                            className={[
                                "rounded-xl border px-4 py-2 text-sm font-bold transition",
                                activeFilter === filter
                                    ? "border-blue-300/28 bg-blue-400/[0.09] text-blue-100"
                                    : "border-slate-300/10 bg-slate-400/[0.035] text-slate-300 hover:border-blue-300/20 hover:text-white",
                            ].join(" ")}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </PanelCard>

            <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
                <div className="grid gap-4">
                    {filteredPlaybooks.length ? (
                        filteredPlaybooks.map((playbook) => {
                            const Icon = categoryIcons[playbook.category] || Layers;
                            const active = selectedPlaybook?.id === playbook.id;

                            return (
                                <button
                                    key={playbook.id}
                                    type="button"
                                    onClick={() => setSelectedId(playbook.id)}
                                    className="text-left"
                                >
                                    <PanelCard
                                        variant="darkNexus"
                                        accent={active ? "blue" : severityVariant(playbook.severity)}
                                        hover
                                        className={[
                                            "p-4 transition",
                                            active ? "border-blue-300/28 bg-blue-400/[0.07]" : "",
                                        ].join(" ")}
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex min-w-0 gap-3">
                                                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-blue-300/18 bg-blue-400/[0.055] text-blue-200">
                                                    <Icon size={20} />
                                                </div>

                                                <div className="min-w-0">
                                                    <div className="mb-2 flex flex-wrap gap-2">
                                                        <AppBadge variant={severityVariant(playbook.severity)}>
                                                            {playbook.severity}
                                                        </AppBadge>
                                                        <AppBadge variant={difficultyVariant(playbook.difficulty)}>
                                                            {playbook.difficulty}
                                                        </AppBadge>
                                                        <AppBadge variant="blue">{playbook.category}</AppBadge>
                                                    </div>

                                                    <h2 className="text-xl font-black text-white">
                                                        {playbook.title}
                                                    </h2>
                                                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">
                                                        {playbook.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {playbook.matchCount > 0 && (
                                                <AppBadge variant="emerald">Recommended for current queue</AppBadge>
                                            )}
                                            <AppBadge variant="default">{playbook.matchCount} matching alert{playbook.matchCount === 1 ? "" : "s"}</AppBadge>
                                        </div>
                                    </PanelCard>
                                </button>
                            );
                        })
                    ) : (
                        <EmptyState
                            icon={BookOpen}
                            title="No playbooks in this category"
                            description="Choose another category to browse available response guidance."
                        />
                    )}
                </div>

                {selectedPlaybook && (
                    <aside className="xl:sticky xl:top-8 xl:self-start">
                        <PanelCard variant="darkNexusHero" accent={severityVariant(selectedPlaybook.severity)} className="p-5">
                            <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
                                <div>
                                    <div className="mb-3 flex flex-wrap gap-2">
                                        <AppBadge variant={severityVariant(selectedPlaybook.severity)}>
                                            {selectedPlaybook.severity}
                                        </AppBadge>
                                        <AppBadge variant={difficultyVariant(selectedPlaybook.difficulty)}>
                                            {selectedPlaybook.difficulty}
                                        </AppBadge>
                                        <AppBadge variant="blue">{selectedPlaybook.category}</AppBadge>
                                    </div>

                                    <h2 className="text-3xl font-black text-white">
                                        {selectedPlaybook.title}
                                    </h2>
                                    <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
                                        {selectedPlaybook.description}
                                    </p>
                                </div>

                                {selectedPlaybook.matchCount > 0 && (
                                    <AppBadge variant="emerald">Recommended for current queue</AppBadge>
                                )}
                            </div>

                            <DetailSection title="MITRE Techniques">
                                <div className="flex flex-wrap gap-2">
                                    {selectedPlaybook.mitreTechniques.map((technique) => (
                                        <MitreBadge key={technique} technique={technique} />
                                    ))}
                                </div>
                            </DetailSection>

                            <DetailSection title="Recommended For">
                                <TagList items={selectedPlaybook.recommendedFor} />
                            </DetailSection>

                            <DetailSection title="Response Steps">
                                <div className="space-y-3">
                                    {selectedPlaybook.steps.map((step, index) => (
                                        <div
                                            key={step.title}
                                            className="rounded-xl border border-blue-300/12 bg-blue-400/[0.04] p-4"
                                        >
                                            <div className="flex gap-3">
                                                <span className="font-mono text-xs text-blue-200">
                                                    {String(index + 1).padStart(2, "0")}
                                                </span>
                                                <div>
                                                    <p className="font-black text-white">{step.title}</p>
                                                    <p className="mt-1 text-sm leading-6 text-slate-400">
                                                        {step.description}
                                                    </p>
                                                    <AppBadge variant="blue" className="mt-3">
                                                        {step.action}
                                                    </AppBadge>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </DetailSection>

                            <div className="grid gap-4 lg:grid-cols-2">
                                <DetailSection title="Containment Actions">
                                    <CheckList items={selectedPlaybook.containmentActions} />
                                </DetailSection>

                                <DetailSection title="Escalation Criteria">
                                    <CheckList items={selectedPlaybook.escalationCriteria} />
                                </DetailSection>
                            </div>

                            <DetailSection title="Report Template Preview">
                                <div className="rounded-xl border border-slate-300/10 bg-black/30 p-4">
                                    <div className="mb-3 flex items-center gap-2 text-blue-200">
                                        <FileText className="h-4 w-4" />
                                        <p className="font-mono text-[10px] uppercase tracking-[0.22em]">
                                            template.preview
                                        </p>
                                    </div>
                                    <p className="text-sm leading-6 text-slate-300">
                                        {selectedPlaybook.reportTemplate}
                                    </p>
                                </div>
                            </DetailSection>

                            <div className="mt-5 flex flex-wrap gap-3">
                                <AppButton variant="primary">Open playbook</AppButton>
                                <AppButton variant="secondary">Generate report outline</AppButton>
                            </div>
                        </PanelCard>
                    </aside>
                )}
            </section>
        </SocLayout>
    );
}

function Stat({ icon: Icon, label, value }) {
    return (
        <PanelCard variant="darkNexus" accent="blue" className="p-4">
            {createElement(Icon, { className: "mb-3 text-blue-200", size: 20 })}
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">
                {label}
            </p>
            <p className="mt-2 text-2xl font-black text-white">{value}</p>
        </PanelCard>
    );
}

function DetailSection({ title, children }) {
    return (
        <section className="mt-5">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-blue-200">
                {title}
            </p>
            {children}
        </section>
    );
}

function TagList({ items }) {
    return (
        <div className="flex flex-wrap gap-2">
            {items.map((item) => (
                <span
                    key={item}
                    className="rounded-lg border border-slate-300/10 bg-slate-400/[0.035] px-3 py-2 text-sm font-bold text-slate-300"
                >
                    {item}
                </span>
            ))}
        </div>
    );
}

function CheckList({ items }) {
    return (
        <div className="space-y-2">
            {items.map((item) => (
                <div
                    key={item}
                    className="flex gap-3 rounded-xl border border-slate-300/10 bg-slate-400/[0.035] px-3 py-2"
                >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-200" />
                    <p className="text-sm leading-6 text-slate-300">{item}</p>
                </div>
            ))}
        </div>
    );
}
