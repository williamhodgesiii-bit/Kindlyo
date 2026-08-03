import type { Metadata } from "next";
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
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold">Learn</h1>
      <p className="mt-4 max-w-2xl text-lg text-text-secondary">
        The first module is being built. Here is what it will cover.
      </p>

      <section aria-labelledby="module-heading" className="mt-8">
        <div className="flex flex-wrap items-center gap-3">
          <h2 id="module-heading" className="text-2xl font-bold">
            {placeholderModule.title}
          </h2>
          <span className="rounded-md bg-surface-muted px-3 py-1 text-sm font-semibold text-text-secondary">
            Draft
          </span>
        </div>

        <ol className="mt-6 grid gap-3 sm:grid-cols-2">
          {placeholderModule.lessons.map((lesson) => (
            <li
              key={lesson.order}
              className="flex items-center gap-4 rounded-lg border border-border bg-surface p-4"
            >
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
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
