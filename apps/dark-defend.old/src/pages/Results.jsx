import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { getFinalStats } from "../utils/scoring";
import { phishingPath, scenarios } from "@/data/scenarios";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    CartesianGrid,
} from "recharts";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { PhishLayout } from "@/components/ui/PhishLayout";
import { PhishHeader } from "@/components/ui/PhishHeader";
import { PhishPanel } from "@/components/ui/PhishPanel";
import { PhishBadge } from "@/components/ui/PhishBadge";
import { PhishButton } from "@/components/ui/PhishButton";
import { PhishMetric } from "@/components/ui/PhishMetric";
import { getDarkProfile } from "@/lib/defend/defendProgressService";

function getUserLevel(accuracy) {
    if (accuracy >= 90) return "SOC Ready";
    if (accuracy >= 75) return "Advanced";
    if (accuracy >= 50) return "Intermediate";
    return "Beginner";
}

export default function Results() {
    const [profile, setProfile] = useState(null);
    const storedResults =
        JSON.parse(localStorage.getItem("phishscope-results")) || [];

    const stats = getFinalStats(storedResults);
    const analystCalls = storedResults.filter((result) => result.mode === "analyst").length;
    const perfectCalls = storedResults.filter((result) => result.score >= 100).length;
    const socEscalations = storedResults.filter((result) => result.escalatedToSoc || result.incidentId).length;

    const reasoningCount = storedResults.filter((result) =>
        result.analystReasoning?.trim()
    ).length;

    const confidenceBreakdown = {
        low: storedResults.filter((result) => result.confidence === "low").length,
        medium: storedResults.filter((result) => result.confidence === "medium").length,
        high: storedResults.filter((result) => result.confidence === "high").length,
    };
    const chartData = [
        { name: "Phishing Caught", value: stats.phishingCaught },
        { name: "False Positives", value: stats.falsePositives },
        { name: "False Negatives", value: stats.falseNegatives },
    ];
    const pathBreakdown = phishingPath.map((path) => {
        const scenarioIds = scenarios
            .filter((scenario) => scenario.pathId === path.id)
            .map((scenario) => scenario.id);
        const pathResults = storedResults.filter((result) =>
            scenarioIds.includes(result.scenarioId)
        );
        const correct = pathResults.filter((result) => result.isCorrect).length;

        return {
            ...path,
            completed: pathResults.length,
            total: scenarioIds.length,
            accuracy: pathResults.length ? Math.round((correct / pathResults.length) * 100) : 0,
        };
    });

    const COLORS = ["#67e8f9", "#fbbf24", "#f87171"];
    const userLevel = getUserLevel(stats.accuracy);

    const handleReset = () => {
        localStorage.removeItem("phishscope-results");
        window.location.reload();
    };

    useEffect(() => {
        getDarkProfile().then(setProfile);
    }, []);

    return (
        <>
            <Header />

            <div>
                <PhishLayout>
                    <PhishHeader
                        eyebrow="Performance Review"
                        title="Results Dashboard"
                        description="Review phishing detection performance, scoring quality and analyst readiness across the simulation."
                    >
                        <PhishBadge tone="blue">{storedResults.length} analyzed</PhishBadge>
                        <PhishBadge tone="green">{stats.accuracy}% accuracy</PhishBadge>
                        <PhishBadge tone="slate">{userLevel}</PhishBadge>
                        {profile && (
                            <PhishBadge tone="green">
                                {profile.rank} • LVL {profile.level}
                            </PhishBadge>
                        )}
                    </PhishHeader>

                    <div className="mt-6 flex flex-wrap justify-end gap-3">
                        <Link
                            to="/simulator"
                            className="inline-flex items-center gap-2 font-mono text-sm text-slate-400 transition hover:text-blue-300"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Simulator
                        </Link>

                        <PhishButton tone="red" onClick={handleReset}>
                            <RotateCcw className="h-4 w-4" />
                            Reset Session
                        </PhishButton>
                    </div>

                    {storedResults.length === 0 ? (
                        <PhishPanel className="mt-6">
                            <p className="text-sm text-slate-300">
                                No simulation results found yet. Complete at least one email analysis
                                in the simulator to generate your dashboard.
                            </p>
                        </PhishPanel>
                    ) : (
                        <div className="mt-6 space-y-6">
                            <PhishPanel variant="glow">
                                <p className="font-mono text-xs uppercase tracking-[0.25em] text-blue-300">
                                    Performance Level
                                </p>
                                <h2 className="mt-3 text-4xl font-black text-white">
                                    {userLevel}
                                </h2>
                                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                                    You analyzed {storedResults.length} email
                                    {storedResults.length > 1 ? "s" : ""} with an overall accuracy of{" "}
                                    <span className="font-bold text-blue-300">{stats.accuracy}%</span>.
                                </p>
                            </PhishPanel>

                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                <PhishMetric label="Total Score" value={stats.totalScore} tone="blue" />
                                <PhishMetric label="Accuracy" value={`${stats.accuracy}%`} tone="green" />
                                <PhishMetric label="Emails Analyzed" value={storedResults.length} tone="slate" />
                                {profile && (
                                    <PhishMetric label="DarkNexus XP" value={profile.xp} tone="green" />
                                )}
                                <PhishMetric label="Analyst Calls" value={analystCalls} tone="blue" />
                                <PhishMetric label="Perfect Calls" value={perfectCalls} tone="green" />
                                <PhishMetric label="Phishing Caught" value={stats.phishingCaught} tone="red" />
                                <PhishMetric label="False Positives" value={stats.falsePositives} tone="amber" />
                                <PhishMetric label="False Negatives" value={stats.falseNegatives} tone="red" />
                                <PhishMetric label="SOC Escalations" value={socEscalations} tone="red" />
                                <PhishMetric label="Reasoned Decisions" value={reasoningCount} tone="blue" />
                                <PhishMetric label="High Confidence" value={confidenceBreakdown.high} tone="green" />
                            </div>

                            <div className="grid gap-6 xl:grid-cols-2">
                                <PhishPanel variant="card">
                                    <h3 className="mb-4 text-xl font-black text-white">
                                        Detection Signals
                                    </h3>

                                    <ResponsiveContainer width="100%" height={260}>
                                        <BarChart data={chartData}>
                                            <CartesianGrid stroke="rgba(148,163,184,0.10)" strokeDasharray="3 3" />
                                            <XAxis dataKey="name" stroke="rgba(148,163,184,0.55)" tick={{ fontSize: 11 }} />
                                            <YAxis stroke="rgba(148,163,184,0.55)" tick={{ fontSize: 11 }} />
                                            <Tooltip
                                                contentStyle={{
                                                    background: "#05070a",
                                                    border: "1px solid rgba(0,229,255,0.22)",
                                                    borderRadius: "12px",
                                                    color: "#e2e8f0",
                                                    boxShadow: "0 18px 45px rgba(0,0,0,0.45)",
                                                }}
                                            />
                                            <Bar dataKey="value" radius={[8, 8, 4, 4]} barSize={34}>
                                                {chartData.map((entry, index) => (
                                                    <Cell key={entry.name} fill={COLORS[index]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </PhishPanel>

                                <PhishPanel variant="card">
                                    <h3 className="mb-4 text-xl font-black text-white">
                                        Decision Quality
                                    </h3>

                                    <ResponsiveContainer width="100%" height={260}>
                                        <PieChart>
                                            <Pie
                                                data={chartData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={58}
                                                outerRadius={92}
                                                paddingAngle={4}
                                                dataKey="value"
                                            >
                                                {chartData.map((entry, index) => (
                                                    <Cell key={entry.name} fill={COLORS[index]} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{
                                                    background: "#05070a",
                                                    border: "1px solid rgba(0,229,255,0.22)",
                                                    borderRadius: "12px",
                                                    color: "#e2e8f0",
                                                    boxShadow: "0 18px 45px rgba(0,0,0,0.45)",
                                                }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </PhishPanel>

                                <PhishPanel variant="card">
                                    <p className="font-mono text-xs uppercase tracking-[0.22em] text-blue-300">
                                        Analyst Workflow
                                    </p>

                                    <h3 className="mt-2 text-2xl font-black text-white">
                                        Decision Discipline
                                    </h3>

                                    <div className="mt-5 grid gap-4 md:grid-cols-3">
                                        <WorkflowTile label="Low confidence" value={confidenceBreakdown.low} tone="slate" />
                                        <WorkflowTile label="Medium confidence" value={confidenceBreakdown.medium} tone="amber" />
                                        <WorkflowTile label="High confidence" value={confidenceBreakdown.high} tone="green" />
                                    </div>

                                    <p className="mt-5 text-sm leading-7 text-slate-400">
                                        Strong analysts do not only classify correctly — they document reasoning, manage confidence, and escalate uncertain artifacts into the SOC workflow.
                                    </p>
                                </PhishPanel>
                            </div>

                            <PhishPanel variant="card">
                                <p className="font-mono text-xs uppercase tracking-[0.22em] text-blue-300">
                                    Phishing Defense Path
                                </p>
                                <h3 className="mt-2 text-2xl font-black text-white">
                                    Skill Breakdown
                                </h3>

                                <div className="mt-5 grid gap-3 md:grid-cols-5">
                                    {pathBreakdown.map((path) => (
                                        <div
                                            key={path.id}
                                            className="rounded-2xl border border-blue-400/15 bg-black/25 p-4"
                                        >
                                            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-blue-300">
                                                {path.label}
                                            </p>
                                            <h4 className="mt-2 font-bold text-white">{path.title}</h4>
                                            <p className="mt-3 text-3xl font-black text-white">
                                                {path.accuracy}%
                                            </p>
                                            <p className="mt-1 font-mono text-xs text-slate-500">
                                                {path.completed}/{path.total} analyzed
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </PhishPanel>

                            <PhishPanel>
                                <p className="font-mono text-xs uppercase tracking-[0.22em] text-blue-300">
                                    Quick Assessment
                                </p>
                                <h3 className="mt-2 text-2xl font-black text-white">
                                    Analyst Feedback
                                </h3>
                                <p className="mt-4 leading-8 text-slate-300">
                                    {stats.accuracy >= 90 &&
                                        "Excellent performance. You consistently identified suspicious patterns and made strong classification decisions."}
                                    {stats.accuracy >= 75 &&
                                        stats.accuracy < 90 &&
                                        "Strong performance overall. You are catching most phishing attempts, but there is still room to improve precision on more subtle emails."}
                                    {stats.accuracy >= 50 &&
                                        stats.accuracy < 75 &&
                                        "Good foundation. You can identify many obvious phishing attempts, but some legitimate and borderline scenarios still need closer analysis."}
                                    {stats.accuracy < 50 &&
                                        "You are at the beginning of the learning curve. Focus on sender domains, urgent language, suspicious links, and credential requests."}
                                </p>
                            </PhishPanel>
                        </div>
                    )}
                </PhishLayout>

            </div>

        </>
    );
}

function WorkflowTile({ label, value, tone = "blue" }) {
    const tones = {
        blue: "border-blue-300/15 bg-blue-400/[0.055] text-blue-200",
        green: "border-emerald-300/15 bg-emerald-400/[0.055] text-emerald-200",
        amber: "border-amber-300/15 bg-amber-400/[0.055] text-amber-200",
        red: "border-red-300/15 bg-red-400/[0.055] text-red-200",
        slate: "border-white/[0.07] bg-white/[0.035] text-slate-300",
    };

    return (
        <div className={`rounded-2xl border p-4 ${tones[tone] || tones.blue}`}>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">
                {label}
            </p>

            <p className="mt-2 text-3xl font-black text-white">
                {value}
            </p>
        </div>
    );
}
