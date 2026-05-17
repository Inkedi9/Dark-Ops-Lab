"use client";

import { useState } from "react";
import { assistantTips } from "../../data/assistantTips";
import { trackAssistantTips } from "../../data/trackAssistantTips";
import PanelCard from "@dark/ui/components/PanelCard";
import AppBadge from "@dark/ui/components/AppBadge";

const fallbackTip = {
    title: "Need help?",
    prompts: [
        {
            label: "Explain it simply",
            answer:
                "DarkSplaining uses short explanations, visual breakdowns and safe mocked exercises to help you understand cyber security concepts clearly.",
        },
    ],
};

export default function DarkAssistant({ lessonId, trackId }) {
    const assistantData =
        trackAssistantTips[trackId] || assistantTips[lessonId] || fallbackTip;

    const [selectedPrompt, setSelectedPrompt] = useState(
        assistantData.prompts[0]
    );
    const [copied, setCopied] = useState(false);

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(selectedPrompt.answer);
            setCopied(true);

            window.setTimeout(() => {
                setCopied(false);
            }, 1400);
        } catch {
            setCopied(false);
        }
    }

    return (
        <PanelCard variant="featured" accent="blue" className="p-5">
            <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-blue-300/[0.10] font-mono text-sm font-bold text-blue-200 shadow-[0_0_24px_rgba(96,165,250,0.14)] ring-1 ring-blue-300/[0.22]">
                    DS
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <p className="font-mono text-xs uppercase tracking-[0.25em] text-blue-300">
                                DarkSplaining Assistant
                            </p>

                            <h3 className="mt-2 text-lg font-extrabold tracking-tight text-white">
                                {assistantData.title}
                            </h3>
                        </div>

                        <AppBadge variant="emerald">Mock AI</AppBadge>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                        {assistantData.prompts.map((prompt) => {
                            const isActive = selectedPrompt.label === prompt.label;

                            return (
                                <button
                                    key={prompt.label}
                                    type="button"
                                    onClick={() => {
                                        setSelectedPrompt(prompt);
                                        setCopied(false);
                                    }}
                                    className={`rounded-lg px-3 py-2 text-xs font-bold transition ${isActive
                                        ? "bg-blue-300/[0.13] text-blue-100 ring-1 ring-blue-300/[0.28]"
                                        : "bg-white/[0.025] text-slate-400 ring-1 ring-white/[0.05] hover:bg-white/[0.055] hover:text-slate-200"
                                        }`}
                                >
                                    {prompt.label}
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-5 rounded-3xl bg-slate-950/55 p-4 ring-1 ring-white/[0.06]">
                        <div className="mb-3 flex items-center justify-between gap-3">
                            <p className="font-mono text-xs text-slate-500">
                                assistant.response
                            </p>

                            <button
                                type="button"
                                onClick={handleCopy}
                                className="rounded-full bg-white/[0.035] px-3 py-1.5 font-mono text-xs text-slate-400 ring-1 ring-white/[0.06] transition hover:text-blue-200 hover:ring-blue-300/[0.22]"
                            >
                                {copied ? "Copied" : "Copy tip"}
                            </button>
                        </div>

                        <div className="rounded-2xl bg-blue-300/[0.035] p-4 ring-1 ring-blue-300/[0.10]">
                            <p className="text-sm leading-6 text-slate-300">
                                {selectedPrompt.answer}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </PanelCard>
    );
}
