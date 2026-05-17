const actorProfiles = {
    phishing: {
        label: "PX",
        name: "Phish Operator",
        style: "from-red-400/25 to-orange-400/10 text-red-100 border-red-300/20",
    },
    bec: {
        label: "BC",
        name: "BEC Actor",
        style: "from-amber-400/25 to-red-400/10 text-amber-100 border-amber-300/20",
    },
    credential: {
        label: "CR",
        name: "Credential Harvester",
        style: "from-violet-400/25 to-blue-400/10 text-violet-100 border-violet-300/20",
    },
    malware: {
        label: "MW",
        name: "Malware Dropper",
        style: "from-red-500/25 to-slate-400/10 text-red-100 border-red-300/20",
    },
    default: {
        label: "TA",
        name: "Threat Actor",
        style: "from-slate-400/20 to-blue-400/10 text-slate-100 border-white/10",
    },
};

function getActorType(email) {
    const text = [
        email?.category,
        email?.attackTechnique,
        email?.tactic,
        email?.subject,
    ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

    if (text.includes("business email") || text.includes("bec") || text.includes("invoice")) {
        return "bec";
    }

    if (text.includes("credential") || text.includes("oauth") || text.includes("mfa")) {
        return "credential";
    }

    if (text.includes("malware") || text.includes("attachment") || text.includes("macro")) {
        return "malware";
    }

    if (email?.type === "phishing") {
        return "phishing";
    }

    return "default";
}

export default function ThreatActorAvatar({ email }) {
    const actorType = getActorType(email);
    const actor = actorProfiles[actorType];

    return (
        <div className="flex items-center gap-3 rounded-2xl border border-red-300/10 bg-red-400/[0.035] p-3">
            <div
                className={[
                    "grid h-11 w-11 shrink-0 place-items-center rounded-xl border bg-gradient-to-br font-mono text-xs font-black shadow-[inset_0_0_18px_rgba(255,255,255,.035)]",
                    actor.style,
                ].join(" ")}
            >
                {actor.label}
            </div>

            <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-red-300">
                    Suspected Actor
                </p>
                <p className="text-sm font-bold text-white">
                    {email?.type === "phishing" ? actor.name : "No hostile actor"}
                </p>
            </div>
        </div>
    );
}