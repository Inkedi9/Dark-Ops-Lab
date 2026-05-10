import { Link } from "react-router-dom";
import { lessons } from "../data/lessons";
import LessonCard from "../components/learning/LessonCard";
import PanelCard from "@dark/ui/components/PanelCard";
import CyberConsole from "@dark/ui/components/CyberConsole";
import SectionHeader from "@dark/ui/components/SectionHeader";
import AppBadge from "@dark/ui/components/AppBadge";
import AppButton from "@dark/ui/components/AppButton";
import { tracks } from "../data/tracks";
import { useLessonProgress } from "../hooks/useLessonProgress";
import QuizCard from "../components/quiz/QuizCard";
import TrackCompletionBadge from "../components/tracks/TrackCompletionBadge";
import { radius, spacing, typography } from "../styles/ui";
import HeroTitle from "@dark/ui/components/HeroTitle";
import {
    ArrowRight,
    BrainCircuit,
    CheckCircle2,
    Code2,
    FlaskConical,
    GraduationCap,
    ShieldCheck,
} from "lucide-react";

const learningSteps = [
    {
        number: "01",
        title: "Understand the concept",
        description:
            "Start with a clear explanation of the security issue, without unnecessary jargon.",
    },
    {
        number: "02",
        title: "See the risk",
        description:
            "Connect the concept to a realistic example so you understand why it matters.",
    },
    {
        number: "03",
        title: "Practice safely",
        description:
            "Use small mocked exercises to test your understanding without touching real systems.",
    },
];

const homeQuiz = {
    eyebrow: "SQL Injection",
    title: "Test yourself. Track progress.",
    question: "What makes this query vulnerable?",
    options: [
        "Missing WHERE clause",
        "String concatenation with user input",
        "Invalid syntax",
    ],
    correctAnswer: "String concatenation with user input",
    explanation: "Correct! User input is directly concatenated.",
};

const learningPaths = [
    {
        icon: GraduationCap,
        label: "Beginner",
        title: "Start with web security",
        description:
            "Follow guided tracks that explain attacks in plain language before you touch a lab.",
        to: "/tracks",
        accent: "emerald",
    },
    {
        icon: Code2,
        label: "Builder",
        title: "Learn how to fix flaws",
        description:
            "Compare vulnerable code with safer patterns so the lesson sticks in real projects.",
        to: "/lessons",
        accent: "blue",
    },
    {
        icon: FlaskConical,
        label: "Challenger",
        title: "Practice labs and quizzes",
        description:
            "Use safe mocked exercises and quick checks to build confidence step by step.",
        to: "/resources",
        accent: "violet",
    },
];

const domains = [
    {
        label: "WEB",
        title: "Web Security",
        description: "SQL injection, XSS, auth flaws and secure coding basics.",
        accent: "blue",
    },
    {
        label: "IDENTITY",
        title: "Identity & MFA",
        description: "OAuth, SSO, MFA fatigue, passkeys and account protection.",
        accent: "violet",
    },
    {
        label: "SOC",
        title: "Detection & Triage",
        description: "Alerts, indicators, incident response and analyst thinking.",
        accent: "emerald",
    },
];

export default function HomePage() {
    const featuredLessons = lessons.filter((lesson) => lesson.featured);

    const stats = [
        { label: "Lessons", value: lessons.length },
        {
            label: "Categories",
            value: new Set(lessons.map((lesson) => lesson.category)).size,
        },
        { label: "Frontend safe", value: "100%" },
    ];

    const { getLessonStatus } = useLessonProgress();

    const featuredTracks = tracks.filter(
        (track) => track.status !== "Coming soon"
    );

    function getTrackProgress(track) {
        const trackLessons = track.lessonIds
            .map((lessonId) => lessons.find((lesson) => lesson.id === lessonId))
            .filter(Boolean)
            .filter((lesson) => lesson.status !== "Coming soon");

        const completedCount = trackLessons.filter(
            (lesson) => getLessonStatus(lesson.id) === "completed"
        ).length;

        const percent =
            trackLessons.length > 0
                ? Math.round((completedCount / trackLessons.length) * 100)
                : 0;

        return {
            completedCount,
            total: trackLessons.length,
            percent,
        };
    }

    return (
        <>
            <section className="relative grid gap-10 overflow-hidden py-14 md:grid-cols-[1.1fr_0.9fr] md:items-center md:py-20">
                <div className="pointer-events-none absolute inset-0 -z-10">
                    <div className="absolute left-1/3 top-[-10%] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[120px]" />
                    <div className="absolute right-0 top-[20%] h-[400px] w-[400px] rounded-full bg-violet-500/10 blur-[120px]" />
                    <div className="absolute bottom-0 left-[10%] h-[260px] w-[260px] rounded-full bg-emerald-500/10 blur-[100px]" />
                </div>

                <div className="relative z-10 max-w-4xl">
                    <AppBadge variant="emerald" className="mb-6">
                        <span className="mr-2 h-1.5 w-1.5 rounded-full bg-emerald-300" />
                        DARK UI • INTERACTIVE CYBER • SAFE MOCKED LABS
                    </AppBadge>

                    <div className="font-mono text-xs uppercase tracking-[0.35em] text-violet-300/90">
                        Interactive cyber learning
                    </div>

                    <HeroTitle highlight="before someone else does.">
                        Break your own code •
                    </HeroTitle>

                    <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
                        Understand vulnerabilities, exploit them safely, and learn how to fix them
                        through interactive mocked labs.
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                        <AppBadge variant="blue">guided tracks</AppBadge>
                        <AppBadge variant="violet">mocked exploits</AppBadge>
                        <AppBadge variant="emerald">fix-first mindset</AppBadge>
                    </div>

                    <div className="mt-9 flex flex-wrap gap-3">
                        <AppButton to="/tracks" variant="violet">
                            Start learning
                            <ArrowRight className="ml-1 h-4 w-4" />
                        </AppButton>

                        <AppButton to="/resources" variant="secondary">
                            Explore resources
                        </AppButton>

                        <AppButton to="/command-basics" variant="secondary">
                            Practice command basics
                        </AppButton>
                    </div>
                </div>

                <div className="relative z-10">
                    <div className="absolute -inset-6 rounded-[2rem] bg-blue-400/10 blur-3xl" />
                    <div className="relative">
                        <CyberConsole />
                    </div>
                </div>
            </section>

            <section className="pb-12">
                <div className="grid gap-4 md:grid-cols-3">
                    {[
                        {
                            icon: BrainCircuit,
                            title: "Understand attacks",
                            description:
                                "Learn how vulnerabilities, phishing and identity attacks actually work.",
                            accent: "blue",
                        },
                        {
                            icon: ShieldCheck,
                            title: "Think like a defender",
                            description:
                                "See how analysts detect, triage and respond to modern threats.",
                            accent: "emerald",
                        },
                        {
                            icon: FlaskConical,
                            title: "Practice safely",
                            description:
                                "Everything runs in mocked and educational environments only.",
                            accent: "violet",
                        },
                    ].map((item) => (
                        <PanelCard
                            key={item.title}
                            variant="subtle"
                            accent={item.accent}
                            hover
                            className="p-5"
                        >
                            <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-blue-200">
                                <item.icon className="h-5 w-5" />
                            </div>

                            <h3 className="text-lg font-bold text-white">
                                {item.title}
                            </h3>

                            <p className="mt-3 text-sm leading-6 text-slate-400">
                                {item.description}
                            </p>
                        </PanelCard>
                    ))}
                </div>
            </section>

            <section className="pb-12">
                <div className="grid gap-4 sm:grid-cols-3">
                    {stats.map((stat) => (
                        <PanelCard
                            key={stat.label}
                            variant="subtle"
                            accent="blue"
                            hover
                            className="p-5"
                        >
                            <p className={`${typography.meta} text-slate-500`}>
                                {stat.label}
                            </p>

                            <p className="mt-3 text-3xl font-extrabold tracking-tight text-white">
                                {stat.value}
                            </p>
                        </PanelCard>
                    ))}
                </div>
            </section>

            <section className="pb-12">
                <SectionHeader
                    eyebrow="Choose your path"
                    title="Pick the route that fits today"
                    accent="violet"
                    action={
                        <Link
                            to="/tracks"
                            className="text-sm font-bold text-violet-300 transition hover:text-violet-200"
                        >
                            Browse all paths →
                        </Link>
                    }
                />

                <div className="grid gap-4 md:grid-cols-3">
                    {learningPaths.map((path) => (
                        <PanelCard
                            key={path.title}
                            variant="elevated"
                            accent={path.accent}
                            hover
                            className="p-5"
                        >
                            <div className="mb-5 flex items-start justify-between gap-4">
                                <div className="grid h-12 w-12 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-blue-200">
                                    <path.icon className="h-5 w-5" />
                                </div>

                                <AppBadge variant={path.accent}>
                                    {path.label}
                                </AppBadge>
                            </div>

                            <h3 className="text-xl font-extrabold tracking-tight text-white">
                                {path.title}
                            </h3>

                            <p className="mt-3 text-sm leading-6 text-slate-400">
                                {path.description}
                            </p>

                            <AppButton to={path.to} variant="secondary" className="mt-5">
                                Open path
                                <ArrowRight className="ml-1 h-4 w-4" />
                            </AppButton>
                        </PanelCard>
                    ))}
                </div>
            </section>

            <section id="how-it-works" className="scroll-mt-24 pb-12">
                <SectionHeader
                    eyebrow="How lessons work"
                    title="Learn one concept at a time"
                    accent="emerald"
                    action={
                        <Link
                            to="/lessons"
                            className="text-sm font-bold text-emerald-300 transition hover:text-emerald-200"
                        >
                            View lesson library →
                        </Link>
                    }
                />

                <div className="grid gap-4 md:grid-cols-3">
                    {learningSteps.map((step) => (
                        <PanelCard
                            key={step.number}
                            variant="default"
                            accent="emerald"
                            hover
                            className="p-5"
                        >
                            <span className="font-mono text-xs text-emerald-300">
                                STEP {step.number}
                            </span>

                            <h3 className={`mt-4 ${typography.smallCardTitle}`}>
                                {step.title}
                            </h3>

                            <p className={`mt-3 ${typography.body}`}>
                                {step.description}
                            </p>
                        </PanelCard>
                    ))}
                </div>
            </section>

            <section className="pb-12">
                <div className={`mt-10 overflow-hidden ${radius.hero} border border-white/10 bg-slate-950/60 ${spacing.card} shadow-2xl shadow-black/30 backdrop-blur`}>
                    <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-center">
                        <div>
                            <div className="mb-4 flex flex-wrap gap-2">
                                <AppBadge variant="emerald">Your first mission</AppBadge>
                                <AppBadge variant="blue">Beginner friendly</AppBadge>
                            </div>

                            <h2 className={`mt-4 ${typography.heroTitle}`}>
                                Bypass the login. Then secure it.
                            </h2>

                            <p className={`mt-5 ${typography.bodyLarge}`}>
                                Start with SQL Injection: test a fake login form, see the
                                unsafe query, exploit it safely, then compare it with a
                                parameterized version.
                            </p>

                            <Link
                                to="/tracks"
                                className="mt-7 inline-flex rounded-2xl bg-white px-5 py-3 text-sm font-extrabold text-slate-950 transition hover:bg-slate-200"
                            >
                                Try the first lab →
                            </Link>
                        </div>

                        <div className={`${radius.panel} border border-white/10 bg-black/30 p-4 font-mono text-sm text-slate-300`}>
                            <div className="mb-3 flex items-center justify-between gap-3">
                                <p className="text-slate-500">Mock query</p>
                                <span className="rounded-lg border border-red-300/20 bg-red-400/10 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-red-200">
                                    vulnerable query detected
                                </span>
                            </div>
                            <pre className="mt-3 overflow-x-auto whitespace-pre-wrap text-blue-200">
                                {`SELECT * FROM users 
                                WHERE username = '' OR '1'='1' 
                                AND password = 'anything';`}
                            </pre>

                            <div className={`mt-5 ${radius.card} border border-emerald-300/20 bg-emerald-300/10 p-4`}>
                                <p className="flex items-center gap-2 text-emerald-300">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Lesson unlocked
                                </p>
                                <p className="mt-2 text-xs leading-6 text-slate-400">
                                    You found the flaw. Now learn how prepared statements stop it.
                                </p>
                            </div>

                            <div className={`mt-3 ${radius.card} border border-blue-300/20 bg-blue-300/10 p-4`}>
                                <p className="text-blue-200">Fix preview</p>
                                <p className="mt-2 text-xs leading-6 text-slate-400">
                                    Replace string concatenation with parameterized queries and validate intent before execution.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </section>

            <section className="pb-12">
                <SectionHeader
                    eyebrow="Featured tracks • guided path"
                    title="Follow a guided learning path"
                    accent="violet"
                    action={
                        <Link
                            to="/tracks"
                            className="text-sm font-bold text-violet-300 transition hover:text-violet-200"
                        >
                            View all tracks →
                        </Link>
                    }
                />

                <div className="grid gap-4 md:grid-cols-2">
                    {featuredTracks.slice(0, 2).map((track) => {
                        const progress = getTrackProgress(track);

                        return (
                            <PanelCard
                                key={track.id}
                                variant="elevated"
                                accent="violet"
                                hover
                                className="p-5"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="font-mono text-xs uppercase tracking-[0.25em] text-violet-300">
                                            Track
                                        </p>

                                        <h3 className="mt-3 text-xl font-extrabold tracking-tight text-white">
                                            {track.title}
                                        </h3>

                                        <div className="mt-3">
                                            <TrackCompletionBadge
                                                isCompleted={progress.percent === 100}
                                                compact
                                            />
                                        </div>
                                    </div>

                                    <AppBadge variant="blue">
                                        {track.level}
                                    </AppBadge>
                                </div>

                                <p className="mt-4 text-sm leading-6 text-slate-400">
                                    {track.description}
                                </p>

                                <div className="mt-5 rounded-2xl bg-slate-950/40 p-4 ring-1 ring-white/[0.06]">
                                    <div className="flex items-center justify-between">
                                        <p className={`${typography.meta} text-slate-500`}>
                                            Progress
                                        </p>

                                        <p className="font-mono text-xs text-emerald-300">
                                            {progress.completedCount}/{progress.total}
                                        </p>
                                    </div>

                                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-950/80">
                                        <div
                                            className="progress-glow h-full rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.45)] transition-all duration-700 ease-out"
                                            style={{ width: `${progress.percent}%` }}
                                        />
                                    </div>
                                </div>

                                <AppButton to="/tracks" variant="violet" className="mt-5">
                                    View track
                                </AppButton>
                            </PanelCard>
                        );
                    })}
                </div>
            </section>

            <section className="pb-12">
                <SectionHeader
                    eyebrow="Learning domains"
                    title="Explore modern cyber concepts"
                    accent="blue"
                />

                <div className="grid gap-4 md:grid-cols-3">
                    {domains.map((domain) => (
                        <PanelCard
                            key={domain.title}
                            variant="default"
                            accent={domain.accent}
                            hover
                            className="p-5"
                        >
                            <p className="font-mono text-xs uppercase tracking-[0.22em] text-slate-500">
                                {domain.label}
                            </p>

                            <h3 className="mt-3 text-lg font-bold text-white">
                                {domain.title}
                            </h3>

                            <p className="mt-3 text-sm leading-6 text-slate-400">
                                {domain.description}
                            </p>
                        </PanelCard>
                    ))}
                </div>
            </section>

            <section className="pb-12">
                <SectionHeader
                    eyebrow="Fundamentals • single lessons"
                    title="Start with the essentials"
                    accent="blue"
                    action={
                        <Link
                            to="/lessons"
                            className="text-sm font-bold text-blue-300 transition hover:text-blue-200"
                        >
                            View all lessons →
                        </Link>
                    }
                />

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {featuredLessons.map((lesson, index) => (
                        <LessonCard key={lesson.id} lesson={lesson} index={index} />
                    ))}
                </div>
            </section>

            <section className="grid gap-8 pb-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
                <QuizCard {...homeQuiz} />

                <div className="text-center lg:text-left">
                    <div className="flex flex-wrap justify-center gap-2 lg:justify-start">
                        <span className="inline-flex rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 font-mono text-xs text-slate-400">
                            04
                        </span>
                        <AppBadge variant="blue">knowledge check</AppBadge>
                    </div>

                    <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-white md:text-4xl">
                        Test yourself. Track progress.
                    </h2>

                    <p className="mt-4 text-base leading-7 text-slate-400">
                        Short quizzes after each lesson reinforce what you learned and help you
                        build confidence step by step.
                    </p>

                    <div className="mt-6 flex flex-wrap justify-center gap-3 lg:justify-start">
                        <AppButton to="/lessons" variant="secondary">
                            Browse lessons
                        </AppButton>
                        <AppButton to="/analytics" variant="blue">
                            View progress
                        </AppButton>
                    </div>
                </div>
            </section>
        </>
    );
}
