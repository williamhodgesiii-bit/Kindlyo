import { Card } from "@/components/ui/Card";
import { Heading, Text } from "@/components/ui/Typography";
import type { FaqEntry } from "@/content/marketing/faq";
import type { HeadingLevel } from "@/components/ui/Typography";

/**
 * The questions list, as native disclosures.
 *
 * `<details>` and `<summary>` rather than a hand-built accordion: the browser
 * already gives keyboard operation, the expanded state, and the correct
 * announcement, and it keeps this a server component with no JavaScript at all.
 * With scripting unavailable every answer is still reachable.
 *
 * The heading lives inside the `<summary>` so the questions appear in a screen
 * reader's heading list, which is how somebody scanning for one answer finds it.
 *
 * The marker rotation is a transform, so the global reduced-motion rule in
 * `src/styles/globals.css` collapses it without this component knowing.
 */

export type FaqProps = {
  entries: readonly FaqEntry[];
  /** The level of each question. Defaults to sitting under a section `h2`. */
  headingLevel?: HeadingLevel;
  className?: string;
};

export function Faq({ entries, headingLevel = 3, className }: FaqProps) {
  return (
    <ul className={className}>
      {entries.map((entry) => (
        <li key={entry.id} className="mt-4 first:mt-0">
          <Card as="div" padding="none">
            <details className="group">
              <summary className="flex cursor-pointer items-center justify-between gap-4 rounded-lg px-6 py-4 hover:bg-surface-muted">
                <Heading level={headingLevel} size="sm">
                  {entry.question}
                </Heading>
                <span
                  aria-hidden="true"
                  className="shrink-0 text-brand-primary-strong transition-transform group-open:rotate-45"
                >
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="h-5 w-5"
                  >
                    <path d="M10 4v12M4 10h12" />
                  </svg>
                </span>
              </summary>
              <Text tone="secondary" className="max-w-prose px-6 pb-5">
                {entry.answer}
              </Text>
            </details>
          </Card>
        </li>
      ))}
    </ul>
  );
}
