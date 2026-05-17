export const metadata = {
    title: "DarkDefend — Dark Ops Lab",
    description: "Phishing defense training, SOC analysis and security posture assessment",
};

export default function DefendLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative min-h-screen overflow-x-hidden bg-[#05070A] text-slate-100">
            <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.10),transparent_30%),linear-gradient(to_bottom,rgba(5,7,10,0.08),rgba(2,4,9,0.64))]" />
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
