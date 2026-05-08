import { CheckCircle2 } from "lucide-react";

export default function Footer() {
    return (
        <footer className="flex flex-col gap-4 border-t border-white/[0.06] py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
            <div>
                <p className="font-semibold text-slate-300">
                    DarkNexus — Cyber learning ecosystem.
                </p>
                <p className="mt-1 flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-300" />
                    localStorage V1 • Supabase-ready architecture
                </p>
            </div>

            <a
                href="https://discord.gg/duAuwShHf"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-300/20 bg-indigo-400/[0.07] px-5 py-3 font-bold text-indigo-100 transition hover:-translate-y-[1px] hover:bg-indigo-400/[0.12]"
            >
                <DiscordIcon />
                Join Discord
            </a>
        </footer>
    );
}

function DiscordIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="h-5 w-5 fill-indigo-200"
        >
            <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.445.865-.608 1.249a18.27 18.27 0 0 0-5.487 0 12.2 12.2 0 0 0-.618-1.249.077.077 0 0 0-.079-.037A19.74 19.74 0 0 0 3.677 4.37a.07.07 0 0 0-.032.028C.534 9.046-.319 13.58.099 18.058a.082.082 0 0 0 .031.056c2.053 1.508 4.041 2.423 5.993 3.03a.078.078 0 0 0 .084-.028c.462-.63.873-1.295 1.226-1.994a.076.076 0 0 0-.042-.106 12.3 12.3 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .078-.011c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.1.246.198.373.292a.077.077 0 0 1-.007.128c-.598.342-1.22.644-1.873.891a.076.076 0 0 0-.041.107c.36.698.772 1.363 1.225 1.993a.076.076 0 0 0 .084.029c1.961-.607 3.95-1.522 6.002-3.03a.077.077 0 0 0 .031-.055c.5-5.177-.533-9.748-3.581-13.689a.06.06 0 0 0-.031-.028ZM8.02 15.331c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.211 0 2.176 1.095 2.157 2.419 0 1.333-.956 2.419-2.157 2.419Zm7.975 0c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.211 0 2.176 1.095 2.157 2.419 0 1.333-.946 2.419-2.157 2.419Z" />
        </svg>
    );
}