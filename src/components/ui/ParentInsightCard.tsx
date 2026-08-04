import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Heading, type HeadingLevel, Text } from "./Typography";

/**
 * Something for the adult, inside a child's screen.
 *
 * Visually distinct from the lesson around it — a sand tint and an eyebrow
 * label — so a child scanning the page can tell at a glance that this part is
 * not addressed to them, and a parent reading over their shoulder can find it
 * without hunting.
 *
 * Kept short by design. Parent participation should be useful but lightweight
 * (CLAUDE.md, principle 8), so this holds a paragraph and a few concrete
 * suggestions, never a lecture.
 */

export type ParentInsightCardProps = {
  title: string;
  body: ReactNode;
  /** Short, concrete suggestions. Rendered as a list when present. */
  points?: readonly string[];
  eyebrow?: string;
  action?: ReactNode;
  headingLevel?: HeadingLevel;
  className?: string;
};

export function ParentInsightCard({
  title,
  body,
  points,
  eyebrow = "For grown-ups",
  action,
  headingLevel = 2,
  className,
}: ParentInsightCardProps) {
  return (
    <section
      className={cn(
        "rounded-lg border border-border bg-tint-sand p-6",
        className,
      )}
    >
      <p className="text-sm font-semibold tracking-wide text-text-secondary uppercase">
        {eyebrow}
      </p>
      <Heading level={headingLevel} size="md" className="mt-2">
        {title}
      </Heading>
      <Text as="div" className="mt-3 max-w-prose">
        {body}
      </Text>
      {points && points.length > 0 ? (
        <ul className="mt-4 grid gap-3">
          {points.map((point) => (
            <li key={point} className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-brand-secondary"
              />
              <span className="max-w-prose">{point}</span>
            </li>
          ))}
        </ul>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </section>
  );
}
