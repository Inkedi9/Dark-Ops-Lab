import { notFound } from "next/navigation";
import CertificatePage from "@/learn/pages/CertificatePage";
import { tracks } from "@/learn/data/tracks";

type Props = {
    params: Promise<{ trackId: string }>;
};

export function generateStaticParams() {
    return tracks.map((t) => ({ trackId: t.id }));
}

export default async function Page({ params }: Props) {
    const { trackId } = await params;
    const track = tracks.find((t) => t.id === trackId);

    if (!track) notFound();

    return <CertificatePage trackId={trackId} />;
}
