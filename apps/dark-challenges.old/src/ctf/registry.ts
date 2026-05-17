import { internalBreachCtf } from "./internal-breach";
import { adminTakeoverCtf } from "./admin-takeover";

export const miniCtfs = [internalBreachCtf, adminTakeoverCtf];

export function getAllMiniCtfs() {
    return miniCtfs;
}

export function getMiniCtfBySlug(slug: string) {
    return miniCtfs.find((ctf) => ctf.slug === slug) ?? null;
}