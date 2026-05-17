export function PhishLayout({ children }) {
    return (
        <main className="relative z-10 mx-auto min-h-[calc(100vh-92px)] max-w-7xl px-4 py-8 md:px-8 md:py-10">
            {children}
        </main>
    );
}
