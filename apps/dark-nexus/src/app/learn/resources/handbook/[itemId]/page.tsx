import { notFound } from "next/navigation";
import HandbookItemPage from "@/learn/pages/HandbookItemPage";
import { handbookSections, getHandbookItemById } from "@/learn/data/handbook";

type Props = {
    params: Promise<{ itemId: string }>;
};

export function generateStaticParams() {
    return handbookSections.flatMap((section) =>
        section.items.map((item: { id: string }) => ({ itemId: item.id }))
    );
}

export default async function Page({ params }: Props) {
    const { itemId } = await params;
    const item = getHandbookItemById(itemId);

    if (!item) notFound();

    return <HandbookItemPage itemId={itemId} />;
}
