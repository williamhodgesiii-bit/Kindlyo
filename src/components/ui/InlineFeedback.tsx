import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";
import {
  AlertIcon,
  BalanceIcon,
  CompassIcon,
  HeartIcon,
  InfoIcon,
} from "./icons";

/**
 * Inline feedback.
 *
 * Chosen over a toast deliberately: feedback in a lesson should stay on screen
 * next to the thing it is about, not slide away on a timer while a six-year-old
 * is still reading it.
 *
 * The first three tones mirror `consequenceType` in docs/CONTENT_SCHEMA.md
 * exactly. There is no "correct" or "incorrect" tone and there must never be
 * one: docs/CURRICULUM_PRINCIPLES.md rules out scoring a child's choice, and
 * the default titles are observations about the situation rather than verdicts
 * on the reader.
 *
 * Every tone renders an icon AND a text title, so the meaning never depends on
 * colour (docs/DESIGN_SYSTEM.md).
 */

export type FeedbackTone =
  "helpful" | "mixed" | "needs-context" | "neutral" | "problem";

type ToneConfig = {
  defaultTitle: string;
  icon: ReactNode;
  surface: string;
  accent: string;
};

const tones = {
  helpful: {
    defaultTitle: "That helps",
    icon: <HeartIcon />,
    surface: "border-success/30 bg-success/5",
    accent: "text-success-strong",
  },
  mixed: {
    defaultTitle: "It could go either way",
    icon: <BalanceIcon />,
    surface: "border-warning/30 bg-warning/5",
    accent: "text-warning-strong",
  },
  "needs-context": {
    defaultTitle: "It depends on the situation",
    icon: <CompassIcon />,
    surface: "border-brand-secondary/30 bg-brand-secondary/5",
    accent: "text-brand-secondary-strong",
  },
  neutral: {
    defaultTitle: "Something to know",
    icon: <InfoIcon />,
    surface: "border-border bg-surface-muted",
    accent: "text-text-secondary",
  },
  problem: {
    defaultTitle: "That did not work",
    icon: <AlertIcon />,
    surface: "border-danger/30 bg-danger/5",
    accent: "text-danger",
  },
} satisfies Record<FeedbackTone, ToneConfig>;

export type InlineFeedbackProps = Omit<
  ComponentPropsWithoutRef<"div">,
  "title"
> & {
  tone: FeedbackTone;
  title?: string;
  children: ReactNode;
};

export function InlineFeedback({
  tone,
  title,
  className,
  children,
  ...rest
}: InlineFeedbackProps) {
  const config = tones[tone];
  const isProblem = tone === "problem";

  return (
    <div
      // A problem needs interrupting; a lesson consequence does not.
      role={isProblem ? "alert" : "status"}
      aria-live={isProblem ? "assertive" : "polite"}
      className={cn(
        "flex items-start gap-3 rounded-lg border p-4",
        config.surface,
        className,
      )}
      {...rest}
    >
      <span aria-hidden="true" className={cn("mt-0.5", config.accent)}>
        {config.icon}
      </span>
      <div className="min-w-0">
        <p className={cn("font-semibold", config.accent)}>
          {title ?? config.defaultTitle}
        </p>
        <div className="mt-1 text-text-primary">{children}</div>
      </div>
    </div>
  );
}
