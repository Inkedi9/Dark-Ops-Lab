import { notFound } from "next/navigation";
import GlossaryTermPage from "@/learn/pages/GlossaryTermPage";
import { glossaryTerms } from "@/learn/data/glossary";

type Props = {
    params: Promise<{ termId: string }>;
};

export function generateStaticParams() {
    return glossaryTerms.map((term) => ({ termId: term.id }));
}

export default async function Page({ params }: Props) {
    const { termId } = await params;
    const term = glossaryTerms.find((t) => t.id === termId);

    if (!term) notFound();

    return <GlossaryTermPage termId={termId} />;
}
