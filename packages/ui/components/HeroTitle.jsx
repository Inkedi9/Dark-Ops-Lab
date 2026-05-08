export default function HeroTitle({ children, highlight }) {
    return (
        <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-tight">
            {children}
            {highlight && (
                <span className="block bg-gradient-to-b from-blue-100 via-blue-200 to-slate-500 bg-clip-text text-transparent">
                    {highlight}
                </span>
            )}
        </h1>
    );
}