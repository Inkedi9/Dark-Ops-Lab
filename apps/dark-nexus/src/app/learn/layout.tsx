import type { ReactNode } from "react";
import LearnProviders from "./learn-providers";

export default function LearnLayout({ children }: { children: ReactNode }) {
    return <LearnProviders>{children}</LearnProviders>;
}
