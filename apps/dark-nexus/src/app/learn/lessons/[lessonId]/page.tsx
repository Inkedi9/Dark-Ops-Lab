import { notFound } from "next/navigation";
import LessonPage from "@/learn/pages/LessonPage";
import { lessons } from "@/learn/data/lessons";

type Props = {
    params: Promise<{ lessonId: string }>;
};

export function generateStaticParams() {
    return lessons
        .filter((l) => l.status !== "Coming soon")
        .map((l) => ({ lessonId: l.id }));
}

export default async function Page({ params }: Props) {
    const { lessonId } = await params;
    const lesson = lessons.find((l) => l.id === lessonId);

    if (!lesson) notFound();

    return <LessonPage lessonId={lessonId} />;
}
