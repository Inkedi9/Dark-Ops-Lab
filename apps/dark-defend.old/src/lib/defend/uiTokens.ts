export const defendTones = {
    blue: {
        border: "border-blue-300/18",
        bg: "bg-blue-400/[0.055]",
        text: "text-blue-200",
        glow: "shadow-[0_0_24px_rgba(96,165,250,0.055)]",
    },
    violet: {
        border: "border-indigo-300/18",
        bg: "bg-indigo-400/[0.055]",
        text: "text-indigo-200",
        glow: "shadow-[0_0_24px_rgba(129,140,248,0.055)]",
    },
    emerald: {
        border: "border-emerald-300/18",
        bg: "bg-emerald-400/[0.055]",
        text: "text-emerald-200",
        glow: "shadow-[0_0_24px_rgba(52,211,153,0.045)]",
    },
    amber: {
        border: "border-amber-300/18",
        bg: "bg-amber-400/[0.055]",
        text: "text-amber-200",
        glow: "shadow-[0_0_24px_rgba(251,191,36,0.045)]",
    },
    red: {
        border: "border-red-300/18",
        bg: "bg-red-400/[0.055]",
        text: "text-red-200",
        glow: "shadow-[0_0_24px_rgba(248,113,113,0.045)]",
    },
    slate: {
        border: "border-slate-300/12",
        bg: "bg-slate-400/[0.035]",
        text: "text-slate-300",
        glow: "shadow-[0_0_24px_rgba(148,163,184,0.035)]",
    },
};

export const toneAliases = {
    default: "slate",
    danger: "red",
    threat: "red",
    green: "emerald",
    success: "emerald",
    orange: "amber",
    warning: "amber",
    teal: "blue",
};

export type DefendToneName = keyof typeof defendTones | keyof typeof toneAliases;

export function getDefendTone(tone: DefendToneName | string = "slate") {
    const normalized = toneAliases[tone] || tone;
    return defendTones[normalized] || defendTones.slate;
}

export function toneClass(tone: DefendToneName | string = "slate") {
    const selected = getDefendTone(tone);
    return `${selected.border} ${selected.bg} ${selected.text} ${selected.glow}`;
}

export function compactSpacing(enabled: boolean) {
    return enabled
        ? {
              section: "mb-5",
              panel: "p-4",
              card: "p-3",
              gap: "gap-3",
              stack: "space-y-3",
              header: "mb-4",
          }
        : {
              section: "mb-8",
              panel: "p-6",
              card: "p-4",
              gap: "gap-5",
              stack: "space-y-5",
              header: "mb-6",
          };
}
