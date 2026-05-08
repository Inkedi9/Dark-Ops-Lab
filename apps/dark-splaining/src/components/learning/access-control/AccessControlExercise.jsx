import { useMemo, useState } from "react";
import ExerciseHelpPanel from "../shared/ExerciseHelpPanel";
import ExerciseShell from "../shared/ExerciseShell";
import TerminalExercisePanel from "../shared/TerminalExercisePanel";

const users = [
    { id: "alice", name: "Alice", role: "Student" },
    { id: "marc", name: "Marc", role: "Student" },
    { id: "admin", name: "Admin", role: "Administrator" },
];

const resources = [
    {
        id: "invoice-1001",
        label: "Invoice #1001",
        ownerId: "alice",
        path: "/invoices/1001",
        content: "Alice course invoice — €49",
    },
    {
        id: "invoice-1002",
        label: "Invoice #1002",
        ownerId: "marc",
        path: "/invoices/1002",
        content: "Marc course invoice — €49",
    },
    {
        id: "admin-report",
        label: "Admin revenue report",
        ownerId: "admin",
        path: "/admin/reports/revenue",
        content: "Internal revenue report — restricted",
    },
];

const quickScenarios = [
    {
        label: "normal_access",
        userId: "alice",
        resourceId: "invoice-1001",
    },
    {
        label: "idor_attempt",
        userId: "alice",
        resourceId: "invoice-1002",
    },
    {
        label: "admin_area",
        userId: "alice",
        resourceId: "admin-report",
    },
];

function canAccessProtected(user, resource) {
    if (user.role === "Administrator") return true;
    return resource.ownerId === user.id;
}

function canAccessVulnerable(user, resource) {
    return Boolean(user && resource);
}

export default function AccessControlExercise({ onCompleteExercise }) {
    const [userId, setUserId] = useState("alice");
    const [resourceId, setResourceId] = useState("invoice-1001");
    const [mode, setMode] = useState("attack");
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [hasScored, setHasScored] = useState(false);

    const isAttackMode = mode === "attack";

    const selectedUser = users.find((user) => user.id === userId);
    const selectedResource = resources.find(
        (resource) => resource.id === resourceId
    );

    const protectedAccess = useMemo(
        () => canAccessProtected(selectedUser, selectedResource),
        [selectedUser, selectedResource]
    );

    const vulnerableAccess = useMemo(
        () => canAccessVulnerable(selectedUser, selectedResource),
        [selectedUser, selectedResource]
    );

    const isAllowed = isAttackMode ? vulnerableAccess : protectedAccess;

    const isBrokenAccess =
        isAttackMode &&
        selectedUser.role !== "Administrator" &&
        selectedResource.ownerId !== selectedUser.id;

    const isLearningWin = submitted && (isBrokenAccess || !isAttackMode);
    const currentStep = submitted ? 2 : userId && resourceId ? 1 : 0;

    function handleSubmit() {
        setSubmitted(true);

        if (isLearningWin && !hasScored) {
            setScore((currentScore) => currentScore + 1);
            setHasScored(true);
        }
    }

    function handleRetry() {
        setUserId("alice");
        setResourceId("invoice-1001");
        setMode("attack");
        setSubmitted(false);
        setHasScored(false);
    }

    function applyScenario(scenario) {
        setUserId(scenario.userId);
        setResourceId(scenario.resourceId);
        setSubmitted(false);
    }

    return (
        <ExerciseShell
            eyebrow="AUTHZ.SANDBOX"
            title="Broken Access Control Playground"
            description="Simulate an IDOR-style request. First observe the vulnerable check, then switch to fix mode and enforce ownership or role-based authorization."
            steps={["Select context", "Run access check", "Compare control"]}
            currentStep={currentStep}
            score={score}
            status={
                submitted
                    ? isBrokenAccess
                        ? "warning"
                        : isAllowed
                            ? "success"
                            : "danger"
                    : "neutral"
            }
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
                    <p className="text-[10px] uppercase tracking-[0.25em]">
                        attack_mode
                    </p>
                    <p className="mt-2 text-sm font-black text-white">
                        Vulnerable check
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                        Only checks that a user is logged in.
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
                    <p className="text-[10px] uppercase tracking-[0.25em]">
                        fix_mode
                    </p>
                    <p className="mt-2 text-sm font-black text-white">
                        Protected check
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                        Checks ownership or admin role.
                    </p>
                </button>
            </div>

            <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
                <div className="bg-black/55 p-5 ring-1 ring-white/[0.08]">
                    <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
                        <div>
                            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">
                                mock.request
                            </p>

                            <h3 className="mt-2 text-lg font-black text-white">
                                Try accessing a resource
                            </h3>
                        </div>

                        <span
                            className={`px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] ring-1 ${isAttackMode
                                ? "bg-amber-300/[0.08] text-amber-200 ring-amber-300/[0.24]"
                                : "bg-emerald-300/[0.08] text-emerald-200 ring-emerald-300/[0.24]"
                                }`}
                        >
                            {isAttackMode ? "vulnerable" : "protected"}
                        </span>
                    </div>

                    <div className="mt-5 grid gap-4">
                        <div>
                            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500">
                                session.user
                            </p>

                            <div className="grid gap-2">
                                {users.map((user) => (
                                    <button
                                        key={user.id}
                                        type="button"
                                        onClick={() => {
                                            setUserId(user.id);
                                            setSubmitted(false);
                                        }}
                                        className={`p-4 text-left ring-1 transition ${userId === user.id
                                            ? "bg-blue-300/[0.10] ring-blue-300/[0.30]"
                                            : "bg-white/[0.035] ring-white/[0.07] hover:bg-blue-300/[0.06] hover:ring-blue-300/[0.18]"
                                            }`}
                                    >
                                        <p className="font-bold text-white">
                                            {user.name}
                                        </p>
                                        <p className="mt-1 font-mono text-xs text-slate-500">
                                            {user.role}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500">
                                requested.resource
                            </p>

                            <select
                                value={resourceId}
                                onChange={(event) => {
                                    setResourceId(event.target.value);
                                    setSubmitted(false);
                                }}
                                className="w-full bg-slate-950/80 px-4 py-3 font-mono text-sm text-slate-100 outline-none ring-1 ring-white/[0.08] transition focus:ring-blue-300/[0.35]"
                            >
                                {resources.map((resource) => (
                                    <option
                                        key={resource.id}
                                        value={resource.id}
                                    >
                                        {resource.label} — {resource.path}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {quickScenarios.map((scenario) => (
                                <button
                                    key={scenario.label}
                                    type="button"
                                    onClick={() => applyScenario(scenario)}
                                    className="bg-white/[0.035] px-3 py-2 font-mono text-[11px] text-slate-300 ring-1 ring-white/[0.07] transition hover:bg-blue-300/[0.08] hover:text-blue-200 hover:ring-blue-300/[0.24]"
                                >
                                    {scenario.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="mt-5 w-full bg-blue-300/[0.10] px-5 py-3 font-mono text-sm font-black uppercase tracking-[0.12em] text-blue-100 ring-1 ring-blue-300/[0.24] transition hover:bg-blue-300/[0.16] hover:ring-blue-300/[0.35]"
                    >
                        run_access_check
                    </button>
                </div>

                <div className="space-y-4">
                    <TerminalExercisePanel title="request.preview" status="neutral">
                        <pre className="overflow-x-auto whitespace-pre-wrap">
                            {`GET ${selectedResource.path}
session.userId = "${selectedUser.id}"
session.role = "${selectedUser.role}"
resource.ownerId = "${selectedResource.ownerId}"`}
                        </pre>
                    </TerminalExercisePanel>

                    <TerminalExercisePanel
                        title="authorization.logic"
                        status={isAttackMode ? "warning" : "success"}
                    >
                        <pre className="overflow-x-auto whitespace-pre-wrap">
                            {isAttackMode
                                ? `if (session.user) {
  return resource;
}`
                                : `if (
  resource.ownerId === session.userId ||
  session.role === "Administrator"
) {
  return resource;
}`}
                        </pre>
                    </TerminalExercisePanel>

                    {submitted && (
                        <TerminalExercisePanel
                            title="sandbox.result"
                            status={
                                isBrokenAccess
                                    ? "warning"
                                    : isAllowed
                                        ? "success"
                                        : "danger"
                            }
                        >
                            <p>
                                {isAllowed
                                    ? "ACCESS_GRANTED"
                                    : "ACCESS_DENIED"}
                            </p>

                            <p className="mt-3 text-slate-400">
                                →{" "}
                                {isBrokenAccess
                                    ? "Broken access control: the app returned another user's resource because it only checked whether someone was logged in."
                                    : isAllowed
                                        ? "Access is valid because the user owns the resource or has the required role."
                                        : "Access is blocked because ownership or role did not match."}
                            </p>

                            {isAllowed && (
                                <div className="mt-4 border-l-2 border-current/40 pl-3">
                                    <p>returned.resource</p>
                                    <p className="text-slate-400">
                                        {selectedResource.content}
                                    </p>
                                </div>
                            )}
                        </TerminalExercisePanel>
                    )}
                </div>
            </div>

            <ExerciseHelpPanel
                hint="Try the IDOR attempt in attack mode, then switch to fix mode and run the same request again."
                whyItMatters="Being authenticated is not enough. Applications must check whether the current user is authorized to access the specific resource."
            />

            {submitted && (
                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                    <div className="bg-amber-300/[0.055] p-5 ring-1 ring-amber-300/[0.18]">
                        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-amber-300">
                            attack.insight
                        </p>

                        <p className="mt-4 text-sm leading-7 text-slate-300">
                            The vulnerable version only checks whether a user is logged in.
                            It does not verify whether that user owns the requested resource
                            or has a role that allows access.
                        </p>
                    </div>

                    <div className="bg-emerald-300/[0.055] p-5 ring-1 ring-emerald-300/[0.18]">
                        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-emerald-300">
                            fix.pattern
                        </p>

                        <p className="mt-4 text-sm leading-7 text-slate-300">
                            Enforce authorization in trusted application logic. Check resource
                            ownership, role, or permission before returning private data.
                        </p>
                    </div>
                </div>
            )}
        </ExerciseShell>
    );
}
