import { notFound } from "next/navigation";
import ChallengeRunner from "@/components/challenge/ChallengeRunner";
import { getAllChallenges, getChallengeBySlug } from "@/challenges/registry";

type Props = {
    params: Promise<{
        slug: string;
    }>;
};

export function generateStaticParams() {
    return getAllChallenges().map((challenge) => ({
        slug: challenge.slug,
    }));
}

export default async function ChallengePage({ params }: Props) {
    const { slug } = await params;

    const challenge = getChallengeBySlug(slug);

    if (!challenge) {
        notFound();
    }

    return <ChallengeRunner slug={slug} />;
}