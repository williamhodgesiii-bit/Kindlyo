import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ContentStatusBadge } from "@/components/ui/ContentStatusBadge";
import { PageContainer } from "@/components/ui/PageContainer";
import { Heading, Text } from "@/components/ui/Typography";
import { getLessonBySlug, listModules } from "@/features/curriculum/catalog";

export const metadata: Metadata = {
  title: "Learn",
};

/**
 * The learning path.
 *
 * Shows the whole module so its shape is visible, and says plainly which
 * lessons are written. A greyed-out row with no explanation is the sort of
 * thing a child reads as "you are not allowed", which is not what it means.
 *
 * Progress and profile selection arrive with accounts; today every lesson that
 * has content is open.
 */
export default function LearnPage() {
  const modules = listModules();

  return (
    <PageContainer>
      <Heading level={1}>Learn</Heading>
      <Text size="lg" tone="secondary" className="mt-4 max-w-2xl">
        Short lessons about being around other people. Each one ends with
        something to try away from the screen.
      </Text>

      {modules.map((module) => (
        <section
          key={module.id}
          aria-labelledby={`module-${module.id}`}
          className="mt-10"
        >
          <div className="flex flex-wrap items-center gap-3">
            <Heading level={2} id={`module-${module.id}`}>
              {module.title}
            </Heading>
            <ContentStatusBadge status={module.status} />
          </div>
          <Text tone="secondary" className="mt-3 max-w-2xl">
            {module.description}
          </Text>

          <ol className="mt-6 grid gap-3">
            {module.lessons.map((entry) => {
              const lesson =
                entry.slug === undefined
                  ? undefined
                  : getLessonBySlug(entry.slug);

              return (
                <Card as="li" key={entry.order} padding="sm">
                  <div className="flex flex-wrap items-center gap-4">
                    <span
                      aria-hidden="true"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-muted font-semibold text-text-secondary"
                    >
                      {entry.order}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold">
                        <span className="sr-only">Lesson {entry.order}: </span>
                        {entry.title}
                      </span>
                      <span className="mt-1 block text-sm text-text-secondary">
                        {lesson
                          ? `About ${lesson.estimatedMinutes} minutes`
                          : "Being written"}
                      </span>
                    </span>
                    {lesson ? (
                      <ButtonLink href={`/learn/lesson/${lesson.slug}`}>
                        Start
                        <span className="sr-only"> lesson {entry.order}</span>
                      </ButtonLink>
                    ) : null}
                  </div>
                </Card>
              );
            })}
          </ol>
        </section>
      ))}
    </PageContainer>
  );
}
