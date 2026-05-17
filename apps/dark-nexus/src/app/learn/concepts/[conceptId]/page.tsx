import ConceptDetailPage from "@/learn/pages/ConceptDetailPage";

type Props = {
    params: Promise<{ conceptId: string }>;
};

export default async function Page({ params }: Props) {
    const { conceptId } = await params;
    return <ConceptDetailPage conceptId={conceptId} />;
}
