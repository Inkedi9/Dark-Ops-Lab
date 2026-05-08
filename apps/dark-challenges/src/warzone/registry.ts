import { productionBreachWarzone } from "./production-breach";

export const warzones = [productionBreachWarzone];

export function getAllWarzones() {
    return warzones;
}

export function getWarzoneBySlug(slug: string) {
    return warzones.find((warzone) => warzone.slug === slug) ?? null;
}