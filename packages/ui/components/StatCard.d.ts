import type { ElementType, ReactNode } from "react";

export default function StatCard(props: {
    icon?: ElementType;
    label: string;
    value: ReactNode;
    tone?: string;
}): JSX.Element;
