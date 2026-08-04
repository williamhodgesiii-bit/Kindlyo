import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Heading, type HeadingLevel, Text } from "./Typography";

/**
 * "There is nothing here yet" - said calmly.
 *
 * `headingLevel` is caller-controlled so an empty state can sit anywhere in a
 * page outline without skipping a level.
 */

export type EmptyStateProps = {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  icon?: ReactNode;
  headingLevel?: HeadingLevel;
  className?: string;
};

export function EmptyState({
  title,
  description,
  action,
  icon,
  headingLevel = 2,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-surface-muted p-6",
        className,
      )}
    >
      {icon ? (
        <span
          aria-hidden="true"
          className="mb-3 inline-flex text-text-secondary"
        >
          {icon}
        </span>
      ) : null}
      <Heading level={headingLevel} size="sm">
        {title}
      </Heading>
      {description ? (
        <Text tone="secondary" className="mt-2">
          {description}
        </Text>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
