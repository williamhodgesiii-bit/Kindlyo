import { cn } from "@/lib/cn";

/**
 * The review state of a piece of content, shown on screen.
 *
 * CLAUDE.md requires visible internal metadata identifying draft, reviewed,
 * and published content, and requires that we never imply professional review
 * that has not happened. So this is deliberately plain and always legible —
 * not a decorative dot, not a tooltip, and not hidden behind a hover.
 *
 * Muted on purpose: "draft" is information, not an error.
 */

export type ContentStatusValue = "draft" | "reviewed" | "published";

type StatusConfig = { label: string; description: string; className: string };

const statuses = {
  draft: {
    label: "Draft",
    description: "Draft content, not yet reviewed by a qualified human.",
    className: "bg-surface-muted text-text-secondary",
  },
  reviewed: {
    label: "In review",
    description: "Reviewed content, not yet published.",
    className: "bg-tint-sage text-brand-secondary-strong",
  },
  published: {
    label: "Published",
    description: "Reviewed and published content.",
    className: "bg-tint-sage text-success-strong",
  },
} satisfies Record<ContentStatusValue, StatusConfig>;

export type ContentStatusBadgeProps = {
  status: ContentStatusValue;
  /** Adds the longer explanation beside the label. */
  withDescription?: boolean;
  className?: string;
};

export function ContentStatusBadge({
  status,
  withDescription = false,
  className,
}: ContentStatusBadgeProps) {
  const config = statuses[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-md px-3 py-1 text-sm font-semibold",
        config.className,
        className,
      )}
    >
      {config.label}
      {withDescription ? (
        <span className="font-normal">{config.description}</span>
      ) : (
        <span className="sr-only">. {config.description}</span>
      )}
    </span>
  );
}
