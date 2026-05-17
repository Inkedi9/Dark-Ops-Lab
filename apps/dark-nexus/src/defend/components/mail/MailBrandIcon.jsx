const brands = {
    microsoft: "from-blue-400/30 to-indigo-400/20 text-blue-100 border-blue-300/20",
    google: "from-emerald-400/25 to-blue-400/20 text-emerald-100 border-emerald-300/20",
    okta: "from-blue-400/25 to-violet-400/20 text-blue-100 border-blue-300/20",
    slack: "from-violet-400/25 to-pink-400/20 text-violet-100 border-violet-300/20",
    github: "from-slate-300/20 to-slate-500/10 text-slate-100 border-white/10",
    docusign: "from-amber-400/25 to-blue-400/15 text-amber-100 border-amber-300/20",
    hr: "from-emerald-400/25 to-blue-400/15 text-emerald-100 border-emerald-300/20",
    default: "from-blue-400/20 to-slate-400/10 text-blue-100 border-blue-300/15",
};

const iconPaths = {
    microsoft: "/mail-brands/microsoft.svg",
    google: "/mail-brands/google.svg",
    github: "/mail-brands/github.svg",
    docusign: "/mail-brands/docusign.svg",
    okta: "/mail-brands/okta.svg",
    slack: "/mail-brands/slack.svg",
    dropbox: "/mail-brands/dropbox.svg",
    zoom: "/mail-brands/zoom.svg",
};

export default function MailBrandIcon({ brand = "default", label = "EM" }) {
    return (
        <div
            className={[
                "grid h-11 w-11 shrink-0 place-items-center rounded-xl border bg-gradient-to-br font-mono text-xs font-black shadow-[inset_0_0_18px_rgba(255,255,255,.035)]",
                brands[brand] || brands.default,
            ].join(" ")}
        >
            {iconPaths[brand] ? (
                <img
                    src={iconPaths[brand]}
                    alt={`${brand} logo`}
                    className="h-6 w-6 object-contain"
                    loading="lazy"
                />
            ) : (
                label
            )}
        </div>
    );
}
