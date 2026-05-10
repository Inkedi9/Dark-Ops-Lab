"use client";

import Link from "next/link";
import ProfileMenuButton from "@dark/ui/components/ProfileMenuButton";
import { getLocalUserProfile } from "@/services/profile-service";
import type { ReactNode } from "react";

function NextProfileLink({
    to,
    children,
    ...props
}: {
    to: string;
    children: ReactNode;
    className?: string;
    onClick?: () => void;
}) {
    return (
        <Link href={to} {...props}>
            {children}
        </Link>
    );
}

export function ProfileButton() {
    const profile = getLocalUserProfile();

    function handleLogout() {
        const confirmed = window.confirm("Reset local offensive profile?");
        if (!confirmed) return;

        localStorage.removeItem("dc_global_progress");
        localStorage.removeItem("darkchallenges:progress");
        localStorage.removeItem("darkchallenges:ctf-progress");
        localStorage.removeItem("darkchallenges:warzone-progress");
        window.location.assign("/");
    }

    return (
        <ProfileMenuButton
            profile={{
                username: profile.username,
                level: profile.level,
                rank: profile.rank.toUpperCase(),
            }}
            profileHref="/profile"
            LinkComponent={NextProfileLink}
            onLogout={handleLogout}
        />
    );
}
