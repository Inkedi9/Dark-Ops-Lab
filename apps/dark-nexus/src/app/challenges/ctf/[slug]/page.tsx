import { notFound } from "next/navigation";
import { getAllMiniCtfs, getMiniCtfBySlug } from "@/challenges/ctf/registry";
import { CtfRunner } from "@/challenges/components/ctf/CtfRunner";

type Props = {
    params: Promise<{
        slug: string;
    }>;
};

export function generateStaticParams() {
    return getAllMiniCtfs().map((ctf) => ({
        slug: ctf.slug,
    }));
}

export default async function CtfDetailPage({ params }: Props) {
    const { slug } = await params;
    const ctf = getMiniCtfBySlug(slug);

    if (!ctf) {
        notFound();
    }

    return <CtfRunner slug={slug} />;
}
