import { notFound } from "next/navigation";
import { WarzoneRunner } from "@/components/warzone/WarzoneRunner";
import { getAllWarzones, getWarzoneBySlug } from "@/warzone/registry";

type Props = {
    params: Promise<{
        slug: string;
    }>;
};

export function generateStaticParams() {
    return getAllWarzones().map((warzone) => ({
        slug: warzone.slug,
    }));
}

export default async function WarzoneDetailPage({ params }: Props) {
    const { slug } = await params;
    const warzone = getWarzoneBySlug(slug);

    if (!warzone) {
        notFound();
    }

    return <WarzoneRunner slug={slug} />;
}