import type { ReactNode } from "react";

export type PageHeaderBadge = {
    label: string;
    variant?: string;
};

export default function PageHeader(props: {
    eyebrow?: string;
    title?: string;
    highlight?: string;
    description?: string;
    action?: ReactNode;
    accent?: string;
    variant?: string;
    mode?: string;
    badges?: PageHeaderBadge[];
}): JSX.Element;
