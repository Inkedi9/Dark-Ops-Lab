"use client";

import { useMemo, useState } from "react";
import { Bot, Send, X, Sparkles } from "lucide-react";

type Message = {
    role: "user" | "assistant";
    text: string;
};

const quickQuestions = [
    "Que dois-je faire maintenant ?",
    "Explique-moi le chemin Learn → Practice → Defend",
    "Pourquoi commencer par SQL Injection ?",
    "Comment fonctionne l’XP ?",
];

function getMockAnswer(question: string) {
    const q = question.toLowerCase();

    if (q.includes("maintenant") || q.includes("faire")) {
        return "Ta prochaine action recommandée est SQL Injection Basics. Tu apprends d’abord le concept, puis tu débloques Login Bypass dans Practice, puis la simulation défense correspondante.";
    }

    if (q.includes("learn") || q.includes("practice") || q.includes("defend")) {
        return "Le flow Dark Ecosystem est simple : Learn te donne le concept, Practice te fait l’exploiter dans un lab sécurisé, Defend t’apprend à reconnaître et réduire le même risque côté défense.";
    }

    if (q.includes("sql")) {
        return "SQL Injection est un excellent premier chemin parce qu’il connecte directement formulaire, base de données, authentification, exploitation et correction défensive.";
    }

    if (q.includes("xp")) {
        return "L’XP représente ta progression opérateur. Chaque leçon, mission et simulation défense augmente ton niveau et débloque de nouvelles routes.";
    }

    return "Je peux te guider dans DarkNexus : choisir ta prochaine action, comprendre une route, expliquer un concept ou t’aider à décider entre Learn, Practice et Defend.";
}

export default function NexusAIButton() {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            text: "Bienvenue opérateur. Je peux t’aider à comprendre quoi faire ensuite dans DarkNexus.",
        },
    ]);

    const canSend = useMemo(() => input.trim().length > 0, [input]);

    function sendMessage(text?: string) {
        const value = (text ?? input).trim();
        if (!value) return;

        setMessages((prev) => [
            ...prev,
            { role: "user", text: value },
            { role: "assistant", text: getMockAnswer(value) },
        ]);

        setInput("");
    }

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-2xl border border-blue-300/30 bg-blue-400/10 text-blue-100 shadow-[0_0_34px_rgba(0,229,255,.22)] backdrop-blur-xl transition hover:scale-105 hover:bg-blue-400/20"
            >
                <Bot size={24} />
            </button>

            {open && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm">
                    <div className="absolute bottom-6 right-6 flex h-[620px] w-[min(440px,calc(100vw-3rem))] flex-col overflow-hidden rounded-3xl border border-blue-300/20 bg-[#05070A]/95 shadow-[0_0_60px_rgba(0,229,255,.18)]">
                        <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
                            <div className="flex items-center gap-3">
                                <div className="grid h-10 w-10 place-items-center rounded-xl border border-blue-300/25 bg-blue-400/[0.08] text-blue-200">
                                    <Sparkles size={20} />
                                </div>
                                <div>
                                    <p className="font-mono text-xs font-black uppercase tracking-[0.3em] text-blue-200">
                                        Nexus AI
                                    </p>
                                    <h3 className="font-black text-white">Operator Guide</h3>
                                </div>
                            </div>

                            <button
                                onClick={() => setOpen(false)}
                                className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-2 text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={
                                        message.role === "user"
                                            ? "ml-auto max-w-[85%] rounded-2xl border border-blue-300/20 bg-blue-400/[0.08] px-4 py-3 text-sm leading-6 text-blue-50"
                                            : "mr-auto max-w-[85%] rounded-2xl border border-white/[0.07] bg-white/[0.04] px-4 py-3 text-sm leading-6 text-slate-300"
                                    }
                                >
                                    {message.text}
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-white/[0.07] p-4">
                            <div className="mb-3 flex flex-wrap gap-2">
                                {quickQuestions.map((question) => (
                                    <button
                                        key={question}
                                        onClick={() => sendMessage(question)}
                                        className="rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-1 text-xs font-semibold text-slate-300 transition hover:border-blue-300/25 hover:text-white"
                                    >
                                        {question}
                                    </button>
                                ))}
                            </div>

                            <div className="flex gap-2">
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") sendMessage();
                                    }}
                                    placeholder="Pose une question à Nexus..."
                                    className="min-w-0 flex-1 rounded-xl border border-white/[0.08] bg-black/35 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-300/40"
                                />

                                <button
                                    onClick={() => sendMessage()}
                                    disabled={!canSend}
                                    className="grid h-12 w-12 place-items-center rounded-xl border border-blue-300/25 bg-blue-400/10 text-blue-100 transition hover:bg-blue-400/20 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}