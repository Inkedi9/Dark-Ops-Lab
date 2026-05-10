import type { ReactNode } from "react";

export default function SectionHeader(props: {
    eyebrow?: string;
    title?: string;
    description?: string;
    action?: ReactNode;
    accent?: string;
    mode?: string;
    className?: string;
}): JSX.Element;
