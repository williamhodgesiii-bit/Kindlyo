import type { ReactNode } from "react";
import { Heading, type HeadingLevel, Text } from "./Typography";

/**
 * A moment in a story: a picture, a title, and what is happening.
 *
 * Content-agnostic. It takes an illustration as a node rather than a key, so
 * nothing about the curriculum leaks into the design system
 * (docs/CONTENT_SCHEMA.md, "Rules").
 *
 * The illustration slot is decorative by contract: the narration must make
 * sense with the picture missing, because for some readers it will be.
 */

export type StoryPanelProps = {
  title: string;
  narration: ReactNode;
  illustration?: ReactNode;
  /** Extra content below the narration, such as a question. */
  children?: ReactNode;
  headingLevel?: HeadingLevel;
  headingId?: string;
  className?: string;
};

export function StoryPanel({
  title,
  narration,
  illustration,
  children,
  headingLevel = 2,
  headingId,
  className,
}: StoryPanelProps) {
  return (
    <article className={className}>
      {illustration ? (
        <div
          aria-hidden="true"
          className="overflow-hidden rounded-lg border border-border bg-surface"
        >
          {illustration}
        </div>
      ) : null}
      <Heading
        level={headingLevel}
        id={headingId}
        className={illustration ? "mt-6" : undefined}
      >
        {title}
      </Heading>
      <Text size="lg" className="mt-3 max-w-prose">
        {narration}
      </Text>
      {children ? <div className="mt-6">{children}</div> : null}
    </article>
  );
}
