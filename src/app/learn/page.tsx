import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { PageContainer } from "@/components/ui/PageContainer";
import { Heading, Text } from "@/components/ui/Typography";
import { placeholderModule } from "@/features/curriculum/placeholder";

export const metadata: Metadata = {
  title: "Learn",
};

/**
 * Placeholder learning route.
 *
 * Lists the planned module outline so the shell has realistic structure. The
 * lesson engine, progress, and profile selection arrive in later slices.
 */
export default function LearnPage() {
  return (
    <PageContainer>
      <Heading level={1}>Learn</Heading>
      <Text size="lg" tone="secondary" className="mt-4 max-w-2xl">
        The first module is being built. Here is what it will cover.
      </Text>

      <section aria-labelledby="module-heading" className="mt-8">
        <div className="flex flex-wrap items-center gap-3">
          <Heading level={2} id="module-heading">
            {placeholderModule.title}
          </Heading>
          {/* Content status is a product requirement, not decoration
              (CLAUDE.md, "Content status"). Deliberately not alarm-coloured. */}
          <span className="rounded-md bg-surface-muted px-3 py-1 text-sm font-semibold text-text-secondary">
            Draft
          </span>
        </div>

        <ol className="mt-6 grid gap-3 sm:grid-cols-2">
          {placeholderModule.lessons.map((lesson) => (
            <Card as="li" key={lesson.order} padding="sm">
              <div className="flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-muted font-semibold text-text-secondary"
                >
                  {lesson.order}
                </span>
                <span>
                  <span className="sr-only">Lesson {lesson.order}: </span>
                  {lesson.title}
                </span>
              </div>
            </Card>
          ))}
        </ol>
      </section>
    </PageContainer>
  );
}
