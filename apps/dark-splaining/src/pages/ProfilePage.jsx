import { useEffect, useMemo, useState } from "react";
import { lessons } from "../data/lessons";
import { tracks } from "../data/tracks";
import { useLessonProgress } from "../hooks/useLessonProgress";
import { useXp } from "../hooks/useXp";
import { getTrackProgress } from "../utils/trackProgress";
import { getEarnedBadges } from "../utils/badges";
import BadgesPanel from "../components/gamification/BadgesPanel";
import CertificateCard from "../components/certificates/CertificateCard";
import PanelCard from "@dark/ui/components/PanelCard";
import SectionHeader from "@dark/ui/components/SectionHeader";
import AppButton from "@dark/ui/components/AppButton";
import AppBadge from "@dark/ui/components/AppBadge";
import { radius, spacing, typography } from "../styles/ui";

export default function ProfilePage() {
    const [confirmReset, setConfirmReset] = useState(false);
    const [showResetToast, setShowResetToast] = useState(false);

    const { xp, level, resetXp } = useXp();
    const { getLessonStatus, isQuizCompleted, resetProgress } = useLessonProgress();

    const availableLessons = lessons.filter((lesson) => lesson.status !== "Coming soon");
    const completedLessons = availableLessons.filter(
        (lesson) => getLessonStatus(lesson.id) === "completed"
    );

    const badges = getEarnedBadges({ getLessonStatus, isQuizCompleted });
    const earnedBadges = badges.filter((badge) => badge.earned);

    const progressPercent =
        availableLessons.length > 0
            ? Math.round((completedLessons.length / availableLessons.length) * 100)
            : 0;

    const skillPassport = useMemo(() => {
        const completedSkillSet = new Set();

        completedLessons.forEach((lesson) => {
            lesson.experience?.skills?.forEach((skill) => completedSkillSet.add(skill));
        });

        return [...completedSkillSet];
    }, [completedLessons]);

    useEffect(() => {
        if (!confirmReset) return;

        const timeoutId = window.setTimeout(() => {
            setConfirmReset(false);
        }, 3500);

        return () => window.clearTimeout(timeoutId);
    }, [confirmReset]);

    function handleResetLocalData() {
        if (!confirmReset) {
            setConfirmReset(true);
            return;
        }

        resetProgress();
        resetXp();
        setConfirmReset(false);
        setShowResetToast(true);

        window.setTimeout(() => {
            setShowResetToast(false);
        }, 2400);
    }

    const stats = [
        { label: "Level", value: level, helper: "Local learner level", accent: "blue" },
        { label: "XP", value: xp, helper: "Earned from exercises", accent: "emerald" },
        {
            label: "Lessons",
            value: `${completedLessons.length}/${availableLessons.length}`,
            helper: "Completed modules",
            accent: "blue",
        },
        {
            label: "Badges",
            value: `${earnedBadges.length}/${badges.length}`,
            helper: "Unlocked achievements",
            accent: "violet",
        },
    ];

    return (
        <div className={spacing.page}>
            <PanelCard variant="nexusHero" className="mb-10 p-7 md:p-10">
                <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:items-start">
                    <div>
                        <div className="flex flex-wrap gap-3">
                            <AppBadge variant="emerald">Learner profile</AppBadge>
                            <AppBadge variant="slate">Local portfolio credential</AppBadge>
                        </div>

                        <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-tight text-white md:text-6xl">
                            Your DarkSplaining security profile.
                        </h1>

                        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                            A local portfolio-style profile showing XP, completed lessons,
                            earned badges, track certificates and validated security skills.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <AppButton to="/tracks" variant="nexus">
                                Continue roadmap →
                            </AppButton>

                            <AppButton to="/certificates/fundamentals" variant="secondary">
                                View certificate
                            </AppButton>
                        </div>
                    </div>

                    <div className="bg-black/45 rounded p-6 ring-1 ring-white/[0.08]">
                        <div className="flex items-center justify-between">
                            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">
                                credential.level
                            </p>

                            <AppBadge variant="emerald">Active</AppBadge>
                        </div>

                        <div className="mt-6 flex items-end gap-4">
                            <p className="text-7xl font-black tracking-tight text-white">
                                {level}
                            </p>

                            <div className="pb-3">
                                <p className="font-mono text-xs uppercase tracking-[0.22em] text-emerald-300">
                                    level
                                </p>
                                <p className="mt-1 text-sm text-slate-400">
                                    {xp} XP earned
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-950/80 ring-1 ring-white/[0.05]">
                            <div
                                className="progress-glow h-full rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.45)] transition-all duration-700 ease-out"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>

                        <p className="mt-3 font-mono text-xs text-slate-500">
                            {progressPercent}% learning completion
                        </p>
                    </div>
                </div>
            </PanelCard>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => (
                    <PanelCard
                        key={stat.label}
                        variant="elevated"
                        accent={stat.accent}
                        hover
                        className="p-5"
                    >
                        <p className={`${typography.meta} text-slate-500`}>
                            {stat.label}
                        </p>

                        <p className="mt-3 text-4xl font-black text-white">
                            {stat.value}
                        </p>

                        <p className="mt-2 text-sm text-slate-500">{stat.helper}</p>
                    </PanelCard>
                ))}
            </section>

            <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_380px]">
                <PanelCard variant="nexus" accent="emerald" className="p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                            <AppBadge variant="emerald">Skill passport</AppBadge>

                            <h2 className={`mt-4 ${typography.cardTitle}`}>
                                Validated security skills
                            </h2>

                            <p className={`mt-3 ${typography.body}`}>
                                Skills are collected from completed lessons and mapped to your
                                learning progress.
                            </p>
                        </div>

                        <AppBadge variant="slate">
                            {skillPassport.length} skills
                        </AppBadge>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-2">
                        {skillPassport.length > 0 ? (
                            skillPassport.map((skill) => (
                                <AppBadge key={skill} variant="slate">
                                    {skill}
                                </AppBadge>
                            ))
                        ) : (
                            <p className="text-sm text-slate-500">
                                Complete lessons to unlock validated skills.
                            </p>
                        )}
                    </div>
                </PanelCard>

                <PanelCard variant="elevated" accent="blue" className="p-6">
                    <AppBadge variant="blue">Portfolio signal</AppBadge>

                    <h2 className={`mt-4 ${typography.cardTitle}`}>
                        Frontend-only learning system.
                    </h2>

                    <p className={`mt-4 ${typography.body}`}>
                        This profile demonstrates product thinking: local progress,
                        gamification, certificates, badges and skill mapping without a backend.
                    </p>

                    <div className={`mt-5 ${radius.card} bg-slate-950/40 p-4 ring-1 ring-white/[0.06]`}>
                        <p className={`${typography.meta} text-slate-500`}>
                            Stored locally
                        </p>

                        <div className="mt-3 grid gap-2 text-sm text-slate-400">
                            <p>• Lesson progress</p>
                            <p>• Quiz completion</p>
                            <p>• Exercise completion</p>
                            <p>• XP and level</p>
                            <p>• Onboarding state</p>
                        </div>
                    </div>
                </PanelCard>
            </section>

            <section className="mt-10">
                <BadgesPanel badges={badges} />
            </section>

            <section className="mt-10">
                <SectionHeader
                    eyebrow="Certificates"
                    title="Track completion rewards"
                    description="Certificates unlock when a full track is completed."
                    accent="violet"
                />

                <div className="grid gap-5 lg:grid-cols-3">
                    {tracks
                        .filter((track) => track.certificate)
                        .map((track) => {
                            const progress = getTrackProgress(track, getLessonStatus);

                            return (
                                <CertificateCard
                                    key={track.id}
                                    track={track}
                                    isUnlocked={progress.isCompleted}
                                    compact
                                />
                            );
                        })}
                </div>
            </section>

            <section className="mt-10">
                <PanelCard variant="danger" accent="danger" className="p-6">
                    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                        <div>
                            <AppBadge variant="amber">Local data</AppBadge>

                            <h2 className={`mt-4 ${typography.cardTitle}`}>
                                Reset demo progress.
                            </h2>

                            <p className={`mt-4 max-w-2xl ${typography.body}`}>
                                This clears local lesson progress and XP from this browser.
                                It does not affect any remote account because no backend is
                                connected yet.
                            </p>

                            {confirmReset && (
                                <p className="mt-3 text-xs leading-5 text-red-200/80">
                                    Click again within a few seconds to confirm.
                                </p>
                            )}
                        </div>

                        <AppButton
                            type="button"
                            onClick={handleResetLocalData}
                            variant={confirmReset ? "danger" : "secondary"}
                            className="md:min-w-56"
                        >
                            {confirmReset ? "Confirm reset" : "Reset local data"}
                        </AppButton>
                    </div>
                </PanelCard>
            </section>

            {showResetToast && (
                <div className="motion-reward fixed bottom-6 right-6 z-50">
                    <PanelCard variant="elevated" accent="emerald" className="px-5 py-4">
                        <AppBadge variant="emerald">Local data reset</AppBadge>

                        <p className="mt-3 text-sm text-slate-300">
                            Progress and XP have been cleared.
                        </p>
                    </PanelCard>
                </div>
            )}
        </div>
    );
}
