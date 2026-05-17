"use client";

import { useMemo, useState } from "react";
import ExerciseHelpPanel from "../shared/ExerciseHelpPanel";
import ExerciseShell from "../shared/ExerciseShell";
import TerminalExercisePanel from "../shared/TerminalExercisePanel";

const users = [
    { username: "admin", password: "admin123", role: "administrator" },
    { username: "alice", password: "password", role: "student" },
];

const payloads = [
    {
        label: "valid_user",
        username: "alice",
        password: "password",
    },
    {
        label: "wrong_password",
        username: "alice",
        password: "wrong-password",
    },
    {
        label: "sqli_bypass",
        username: "' OR '1'='1",
        password: "anything",
    },
];

function buildUnsafeQuery(username, password) {
    return `SELECT * FROM users WHERE username = '${username}' AND password = '${password}';`;
}

function buildSafeQuery() {
    return "SELECT * FROM users WHERE username = ? AND password = ?;";
}

function simulateUnsafeLogin(username, password) {
    const looksInjected =
        username.includes("' OR '1'='1") ||
        password.includes("' OR '1'='1") ||
        username.includes(" OR ") ||
        password.includes(" OR ");

    if (looksInjected) {
        return {
            success: true,
            method: "injection",
            user: users[0],
            message: "ACCESS GRANTED // query logic bypassed",
            insight:
                "The input modified the WHERE clause, so the database returned a valid user without valid credentials.",
        };
    }

    const user = users.find(
        (item) => item.username === username && item.password === password
    );

    return {
        success: Boolean(user),
        method: user ? "normal" : "failed",
        user,
        message: user
            ? "ACCESS GRANTED // valid credentials"
            : "ACCESS DENIED // credentials rejected",
        insight: user
            ? "The login worked because the credentials matched a real mocked user."
            : "The login failed because the username/password pair did not match.",
    };
}

function simulateSafeLogin(username, password) {
    const user = users.find(
        (item) => item.username === username && item.password === password
    );

    return {
        success: Boolean(user),
        method: user ? "normal" : "failed",
        user,
        message: user
            ? "ACCESS GRANTED // valid credentials"
            : "ACCESS DENIED // input treated as data",
        insight: user
            ? "Parameterized logic still allows valid credentials."
            : "The injected-looking input was handled as plain data, not SQL logic.",
    };
}

export default function SqlMockExercise({ onCompleteExercise }) {
    const [username, setUsername] = useState("alice");
    const [password, setPassword] = useState("password");
    const [mode, setMode] = useState("attack");
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [hasScored, setHasScored] = useState(false);

    const isAttackMode = mode === "attack";
    const query = useMemo(
        () => (isAttackMode ? buildUnsafeQuery(username, password) : buildSafeQuery()),
        [isAttackMode, username, password]
    );

    const result = isAttackMode
        ? simulateUnsafeLogin(username, password)
        : simulateSafeLogin(username, password);

    const isExploit = result.method === "injection";
    const isLearningWin = submitted && (isExploit || !isAttackMode);
    const currentStep = submitted ? 2 : username || password ? 1 : 0;

    function handleSubmit(event) {
        event.preventDefault();
        setSubmitted(true);

        if (isLearningWin && !hasScored) {
            setScore((currentScore) => currentScore + 1);
            setHasScored(true);
        }
    }

    function handleRetry() {
        setUsername("alice");
        setPassword("password");
        setMode("attack");
        setSubmitted(false);
        setHasScored(false);
    }

    function applyPayload(payload) {
        setUsername(payload.username);
        setPassword(payload.password);
        setSubmitted(false);
    }

    return (
        <ExerciseShell
            eyebrow="INJECTION.SANDBOX"
            title="SQL Injection Login Playground"
            description="Run the attack path, observe the unsafe SQL query, then switch to fix mode and prove why parameterized logic blocks the bypass."
            steps={["Choose payload", "Run simulation", "Compare fix"]}
            currentStep={currentStep}
            score={score}
            status={submitted ? (isExploit ? "warning" : result.success ? "success" : "neutral") : "neutral"}
            xpReward={10}
            isCompleted={score > 0}
            onCompleteExercise={onCompleteExercise}
            onRetry={handleRetry}
        >
            <div className="mb-5 grid gap-3 sm:grid-cols-2">
                <button
                    type="button"
                    onClick={() => {
                        setMode("attack");
                        setSubmitted(false);
                    }}
                    className={`p-4 text-left font-mono ring-1 transition ${isAttackMode
                        ? "bg-amber-300/[0.10] text-amber-200 ring-amber-300/[0.35]"
                        : "bg-black/45 text-slate-400 ring-white/[0.07] hover:text-amber-200 hover:ring-amber-300/[0.22]"
                        }`}
                >
                    <p className="text-[10px] uppercase tracking-[0.25em]">attack_mode</p>
                    <p className="mt-2 text-sm font-black text-white">Unsafe query</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                        Raw input is inserted into SQL.
                    </p>
                </button>

                <button
                    type="button"
                    onClick={() => {
                        setMode("fix");
                        setSubmitted(false);
                    }}
                    className={`p-4 text-left font-mono ring-1 transition ${!isAttackMode
                        ? "bg-emerald-300/[0.10] text-emerald-200 ring-emerald-300/[0.35]"
                        : "bg-black/45 text-slate-400 ring-white/[0.07] hover:text-emerald-200 hover:ring-emerald-300/[0.22]"
                        }`}
                >
                    <p className="text-[10px] uppercase tracking-[0.25em]">fix_mode</p>
                    <p className="mt-2 text-sm font-black text-white">Parameterized query</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                        Input is passed separately as data.
                    </p>
                </button>
            </div>

            <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
                <form onSubmit={handleSubmit} className="bg-black/55 p-5 ring-1 ring-white/[0.08]">
                    <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
                        <div>
                            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">
                                mock.login
                            </p>

                            <h3 className="mt-2 text-lg font-black text-white">
                                Try to sign in
                            </h3>
                        </div>

                        <span
                            className={`px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] ring-1 ${isAttackMode
                                ? "bg-amber-300/[0.08] text-amber-200 ring-amber-300/[0.24]"
                                : "bg-emerald-300/[0.08] text-emerald-200 ring-emerald-300/[0.24]"
                                }`}
                        >
                            {isAttackMode ? "unsafe" : "safe"}
                        </span>
                    </div>

                    <div className="mt-5 space-y-4">
                        <label className="block">
                            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500">
                                username
                            </span>

                            <input
                                value={username}
                                onChange={(event) => {
                                    setUsername(event.target.value);
                                    setSubmitted(false);
                                }}
                                className="mt-2 w-full bg-slate-950/80 px-4 py-3 font-mono text-sm text-slate-100 outline-none ring-1 ring-white/[0.08] transition placeholder:text-slate-600 focus:ring-blue-300/[0.35]"
                            />
                        </label>

                        <label className="block">
                            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500">
                                password
                            </span>

                            <input
                                value={password}
                                onChange={(event) => {
                                    setPassword(event.target.value);
                                    setSubmitted(false);
                                }}
                                className="mt-2 w-full bg-slate-950/80 px-4 py-3 font-mono text-sm text-slate-100 outline-none ring-1 ring-white/[0.08] transition placeholder:text-slate-600 focus:ring-blue-300/[0.35]"
                            />
                        </label>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                        {payloads.map((payload) => (
                            <button
                                key={payload.label}
                                type="button"
                                onClick={() => applyPayload(payload)}
                                className="bg-white/[0.035] px-3 py-2 font-mono text-[11px] text-slate-300 ring-1 ring-white/[0.07] transition hover:bg-blue-300/[0.08] hover:text-blue-200 hover:ring-blue-300/[0.24]"
                            >
                                {payload.label}
                            </button>
                        ))}
                    </div>

                    <button className="mt-5 w-full bg-blue-300/[0.10] px-5 py-3 font-mono text-sm font-black uppercase tracking-[0.12em] text-blue-100 ring-1 ring-blue-300/[0.24] transition hover:bg-blue-300/[0.16] hover:ring-blue-300/[0.35]">
                        run_simulation
                    </button>
                </form>

                <div className="space-y-4">
                    <TerminalExercisePanel
                        title={isAttackMode ? "unsafe.query" : "safe.query"}
                        status={isExploit ? "warning" : !isAttackMode ? "success" : "neutral"}
                    >
                        <pre className="overflow-x-auto whitespace-pre-wrap">
                            {query}
                        </pre>
                    </TerminalExercisePanel>

                    {submitted && (
                        <TerminalExercisePanel
                            title="sandbox.result"
                            status={isExploit ? "warning" : result.success ? "success" : "danger"}
                        >
                            <p>{result.message}</p>

                            {result.user && (
                                <div className="mt-3 border-l-2 border-current/40 pl-3">
                                    <p>user: {result.user.username}</p>
                                    <p>role: {result.user.role}</p>
                                </div>
                            )}

                            <p className="mt-3 text-slate-400">→ {result.insight}</p>
                        </TerminalExercisePanel>
                    )}
                </div>
            </div>

            <ExerciseHelpPanel
                hint="Run the SQLi bypass payload in attack mode, then switch to fix mode and run the same payload again."
                whyItMatters="SQL Injection happens when user input changes query logic. Parameterized queries keep the SQL structure fixed and treat input as data."
            />

            {submitted && (
                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                    <div className="bg-amber-300/[0.055] p-5 ring-1 ring-amber-300/[0.18]">
                        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-amber-300">
                            attack.insight
                        </p>

                        <p className="mt-4 text-sm leading-7 text-slate-300">
                            The unsafe version builds SQL by joining strings. If user input
                            contains query-like logic, the database may interpret it as part
                            of the command instead of plain data.
                        </p>
                    </div>

                    <div className="bg-emerald-300/[0.055] p-5 ring-1 ring-emerald-300/[0.18]">
                        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-emerald-300">
                            fix.pattern
                        </p>

                        <p className="mt-4 text-sm leading-7 text-slate-300">
                            Parameterized queries keep the query structure fixed. User input
                            is passed separately as values, so payload-like text cannot change
                            the SQL logic.
                        </p>
                    </div>
                </div>
            )}
        </ExerciseShell>
    );
}
