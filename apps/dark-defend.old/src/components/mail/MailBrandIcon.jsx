import microsoftIcon from "@/assets/mail-brands/microsoft.svg";
import googleIcon from "@/assets/mail-brands/google.svg";
import githubIcon from "@/assets/mail-brands/github.svg";
import docusignIcon from "@/assets/mail-brands/docusign.svg";
import oktaIcon from "@/assets/mail-brands/okta.svg";
import slackIcon from "@/assets/mail-brands/slack.svg";
import dropboxIcon from "@/assets/mail-brands/dropbox.svg";
import zoomIcon from "@/assets/mail-brands/zoom.svg";

export default function MailBrandIcon({ brand = "default", label = "EM" }) {
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
    const icons = {
        microsoft: microsoftIcon,
        google: googleIcon,
        github: githubIcon,
        docusign: docusignIcon,
        okta: oktaIcon,
        slack: slackIcon,
        dropbox: dropboxIcon,
        zoom: zoomIcon,
    };

    return (
        <div
            className={[
                "grid h-11 w-11 shrink-0 place-items-center rounded-xl border bg-gradient-to-br font-mono text-xs font-black shadow-[inset_0_0_18px_rgba(255,255,255,.035)]",
                brands[brand] || brands.default,
            ].join(" ")}
        >
            {icons[brand] ? (
                <img
                    src={icons[brand]}
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