import Header from "../components/Header";
import { PhishLayout } from "@/components/ui/PhishLayout";
import { PhishHeader } from "@/components/ui/PhishHeader";
import { PhishPanel } from "@/components/ui/PhishPanel";
import { PhishBadge } from "@/components/ui/PhishBadge";

export default function About() {
    return (
        <>
            <Header />

            <PhishLayout>
                <PhishHeader
                    eyebrow="CyberOps Ecosystem"
                    title="About DarkDefend"
                    description="DarkDefend trains human-layer defense through phishing simulation, SOC alert triage and personal security posture assessment."
                >
                    <PhishBadge tone="blue">Training Platform</PhishBadge>
                    <PhishBadge tone="green">Human Layer</PhishBadge>
                    <PhishBadge tone="slate">Detection Ready</PhishBadge>
                </PhishHeader>

                <div className="mt-8 space-y-6">

                    {/* INTRO */}
                    <PhishPanel>
                        <p className="leading-8 text-slate-300">
                            DarkDefend is a phishing detection training simulator built to
                            improve user awareness and analyst decision-making through
                            realistic email scenarios, scoring logic, and guided feedback.
                        </p>
                    </PhishPanel>

                    {/* GOALS */}
                    <PhishPanel variant="card">
                        <h2 className="text-2xl font-black text-white">Project Goals</h2>

                        <ul className="mt-4 space-y-3 text-slate-300">
                            <li>• Train users to identify phishing indicators and red flags</li>
                            <li>• Simulate real-world inbox investigation workflows</li>
                            <li>• Improve decision-making under uncertainty</li>
                            <li>• Bridge human detection with SOC alert pipelines</li>
                        </ul>
                    </PhishPanel>

                    {/* FEATURES */}
                    <PhishPanel variant="card">
                        <h2 className="text-2xl font-black text-white">Core Features</h2>

                        <ul className="mt-4 space-y-3 text-slate-300">
                            <li>• Interactive phishing scenarios with realistic email content</li>
                            <li>• Red flag analysis (domain, links, tone, intent)</li>
                            <li>• Scoring engine with accuracy and detection metrics</li>
                            <li>• Analyst-style decision workflow (Legitimate / Suspicious / Phishing)</li>
                            <li>• Results dashboard with performance breakdown</li>
                        </ul>
                    </PhishPanel>

                    {/* ECOSYSTEM */}
                    <PhishPanel variant="glow">
                        <h2 className="text-2xl font-black text-white">Dark Ecosystem Integration</h2>

                        <p className="mt-4 leading-8 text-slate-300">
                            DarkDefend connects defensive training with the wider Dark Ecosystem:
                        </p>

                        <ul className="mt-4 space-y-3 text-slate-300">
                            <li>• DarkNexus orchestrates progression and next actions</li>
                            <li>• DarkChallenges trains offensive intuition in safe simulations</li>
                            <li>• SOC Mode teaches alert triage and defensive investigation</li>
                            <li>• Security Check measures personal defense posture</li>
                        </ul>

                        <p className="mt-4 text-sm text-slate-400">
                            → The long-term goal is to connect phishing detections, SOC alerts and user posture into one defensive learning loop.
                        </p>
                    </PhishPanel>

                    {/* VISION */}
                    <PhishPanel>
                        <h2 className="text-2xl font-black text-white">Vision</h2>

                        <p className="mt-4 leading-8 text-slate-300">
                            DarkDefend connects human-layer defense with SOC investigation and personal security posture,
                            creating a unified defensive training experience inside the Dark Ecosystem.
                        </p>
                    </PhishPanel>

                </div>
            </PhishLayout>
        </>
    );
}
