import type { HTMLAttributes, ReactNode } from "react";

export default function AppBadge(
    props: {
        children?: ReactNode;
        variant?: string;
        className?: string;
    } & HTMLAttributes<HTMLSpanElement>
): JSX.Element;
