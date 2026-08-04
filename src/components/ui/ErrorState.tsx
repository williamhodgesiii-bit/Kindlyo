import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Button } from "./Button";
import { AlertIcon } from "./icons";
import { Heading, type HeadingLevel, Text } from "./Typography";

/**
 * Something went wrong, and it is not the reader's fault.
 *
 * `live` controls whether the whole block is an alert. A statically rendered
 * error page should not fire an alert on every navigation; an error that
 * appears in response to an action should. Defaults to off.
 */

export type ErrorStateProps = {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  headingLevel?: HeadingLevel;
  onRetry?: () => void;
  retryLabel?: string;
  live?: boolean;
  className?: string;
};

export function ErrorState({
  title,
  description,
  action,
  headingLevel = 2,
  onRetry,
  retryLabel = "Try again",
  live = false,
  className,
}: ErrorStateProps) {
  return (
    <div
      role={live ? "alert" : undefined}
      className={cn(
        "rounded-lg border border-border bg-surface p-6",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <span aria-hidden="true" className="mt-0.5 text-danger">
          <AlertIcon />
        </span>
        <div className="min-w-0">
          <Heading level={headingLevel} size="sm">
            {title}
          </Heading>
          {description ? (
            <Text tone="secondary" className="mt-2">
              {description}
            </Text>
          ) : null}
          {onRetry || action ? (
            <div className="mt-4 flex flex-wrap gap-3">
              {onRetry ? (
                <Button variant="primary" onClick={onRetry}>
                  {retryLabel}
                </Button>
              ) : null}
              {action}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
