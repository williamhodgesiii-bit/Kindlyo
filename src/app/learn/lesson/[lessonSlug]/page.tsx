import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LessonRunner } from "@/components/lesson/LessonRunner";
import { getLessonBySlug, listLessons } from "@/features/curriculum/catalog";

/**
 * One lesson.
 *
 * The page's whole job is to resolve a slug to content and hand it to the
 * renderer. An unknown slug — and a draft lesson the current viewer may not
 * see — both 404 through the same path, so the URL cannot be used to probe for
 * unreleased content.
 */

type PageProps = { params: Promise<{ lessonSlug: string }> };

export function generateStaticParams(): { lessonSlug: string }[] {
  return listLessons().map((lesson) => ({ lessonSlug: lesson.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lessonSlug } = await params;
  const lesson = getLessonBySlug(lessonSlug);
  if (lesson === undefined) return { title: "Lesson not found" };

  return {
    title: lesson.title,
    description: lesson.description,
    // Draft curriculum has no business in search results.
    ...(lesson.status === "published"
      ? {}
      : { robots: { index: false, follow: false } }),
  };
}

export default async function LessonPage({ params }: PageProps) {
  const { lessonSlug } = await params;
  const lesson = getLessonBySlug(lessonSlug);

  if (lesson === undefined) notFound();

  return <LessonRunner lesson={lesson} />;
}
