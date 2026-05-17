import type { MiniCtf } from "./types";
import { adminTakeoverLoginStep } from "./challenges/admin-takeover-login";
import { adminTakeoverXssStep } from "./challenges/admin-takeover-xss";
import { adminTakeoverTokenStep } from "./challenges/admin-takeover-token";
import { adminTakeoverAdminStep } from "./challenges/admin-takeover-admin";

export const adminTakeoverCtf: MiniCtf = {
    id: "ctf-admin-takeover",
    slug: "admin-takeover",
    title: "Admin Takeover",
    description:
        "Chain SQL injection, stored XSS, token extraction and session replay to compromise the admin panel.",
    difficulty: "advanced",
    rewardXp: 5000,
    badge: "Admin Ghost",
    finalFlag: "flag{admin_takeover_token_complete}",
    steps: [
        adminTakeoverLoginStep,
        adminTakeoverXssStep,
        adminTakeoverTokenStep,
        adminTakeoverAdminStep,
    ],
};