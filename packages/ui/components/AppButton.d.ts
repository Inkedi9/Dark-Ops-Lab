import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type SharedProps = {
    children?: ReactNode;
    variant?: string;
    shape?: string;
    className?: string;
    href?: string;
    to?: string;
};

export default function AppButton(
    props: SharedProps &
        AnchorHTMLAttributes<HTMLAnchorElement> &
        ButtonHTMLAttributes<HTMLButtonElement>
): JSX.Element;
