"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { PageContainer } from "@/components/ui/PageContainer";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Heading } from "@/components/ui/Typography";

/**
 * Chrome for one lesson: title, position, the current step, and the way on.
 *
 * Content-agnostic — it is handed a step to render and a footer to render, and
 * knows nothing about scenes, choices, or missions.
 *
 * Two accessibility jobs it does own:
 *
 * - When the step changes, focus moves to the step region. Without this, a
 *   keyboard or screen-reader user presses "Next" and stays parked on a button
 *   at the bottom of a page whose content has silently been replaced.
 * - The first render does not steal focus. Focus is only moved once the step
 *   has actually changed, so arriving on the page leaves focus where the
 *   browser put it.
 *
 * Progress is shown as position ("3 of 8"), never as a score or a streak
 * (docs/DESIGN_SYSTEM.md).
 */

export type LessonShellProps = {
  lessonTitle: string;
  /** Changes when the step changes; drives focus movement. */
  stepKey: string;
  stepNumber: number;
  stepCount: number;
  /** Content status badge, shown beside the title. */
  status?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
};

export function LessonShell({
  lessonTitle,
  stepKey,
  stepNumber,
  stepCount,
  status,
  children,
  footer,
}: LessonShellProps) {
  const stepRef = useRef<HTMLDivElement>(null);
  const lastStepKey = useRef(stepKey);

  useEffect(() => {
    if (lastStepKey.current === stepKey) return;
    lastStepKey.current = stepKey;
    stepRef.current?.focus();
  }, [stepKey]);

  return (
    <PageContainer>
      <div className="flex flex-wrap items-center gap-3">
        <Heading level={1} size="lg">
          {lessonTitle}
        </Heading>
        {status}
      </div>

      <ProgressBar
        className="mt-4"
        label="Where you are in this lesson"
        value={stepNumber}
        max={stepCount}
        tone="calm"
      />

      <div
        ref={stepRef}
        tabIndex={-1}
        // Not a live region: the step is what the page is about, and focus
        // moving here is what announces it.
        className="mt-8 outline-none"
      >
        {children}
      </div>

      {footer ? (
        <div className="mt-10 border-t border-border pt-6">{footer}</div>
      ) : null}
    </PageContainer>
  );
}
