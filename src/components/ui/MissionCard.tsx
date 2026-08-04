import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Card } from "./Card";
import { CheckIcon, SparkIcon } from "./icons";
import { Heading, type HeadingLevel, Text } from "./Typography";

/**
 * An offline mission - one small thing to try together away from the screen.
 *
 * Status is rendered as an icon plus a word, never a bare coloured dot, and
 * the default vocabulary is descriptive rather than congratulatory. There are
 * no points, badges, or streaks here, and there should not be
 * (docs/DESIGN_SYSTEM.md, CLAUDE.md product principle 5).
 *
 * Content-agnostic: title, description, and action all come from the caller.
 */

export type MissionStatus = "suggested" | "in-progress" | "done";

type StatusConfig = { defaultLabel: string; icon: ReactNode; accent: string };

const statuses = {
  suggested: {
    defaultLabel: "Suggested",
    icon: <SparkIcon className="h-4 w-4 shrink-0" />,
    accent: "text-warning-strong",
  },
  "in-progress": {
    defaultLabel: "Trying it",
    icon: <SparkIcon className="h-4 w-4 shrink-0" />,
    accent: "text-brand-secondary-strong",
  },
  done: {
    defaultLabel: "Done",
    icon: <CheckIcon className="h-4 w-4 shrink-0" />,
    accent: "text-success-strong",
  },
} satisfies Record<MissionStatus, StatusConfig>;

export type MissionCardProps = {
  title: string;
  description: ReactNode;
  status?: MissionStatus;
  statusLabel?: string;
  action?: ReactNode;
  headingLevel?: HeadingLevel;
  className?: string;
};

export function MissionCard({
  title,
  description,
  status,
  statusLabel,
  action,
  headingLevel = 3,
  className,
}: MissionCardProps) {
  const config = status ? statuses[status] : undefined;

  return (
    <Card elevation="soft" className={className}>
      {config ? (
        <p
          className={cn(
            "mb-2 inline-flex items-center gap-1.5 text-sm font-semibold",
            config.accent,
          )}
        >
          <span aria-hidden="true" className="inline-flex">
            {config.icon}
          </span>
          {statusLabel ?? config.defaultLabel}
        </p>
      ) : null}
      <Heading level={headingLevel} size="sm">
        {title}
      </Heading>
      <Text tone="secondary" as="div" className="mt-2">
        {description}
      </Text>
      {action ? <div className="mt-4">{action}</div> : null}
    </Card>
  );
}
