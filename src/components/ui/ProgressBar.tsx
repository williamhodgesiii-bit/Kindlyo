import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

/**
 * Progress through a set of steps.
 *
 * Shows a visible count ("3 of 8") alongside the bar, so progress is never
 * communicated by fill width or colour alone.
 *
 * Framed as position, not performance. docs/DESIGN_SYSTEM.md rules out streak
 * pressure and casino-style reward mechanics, so there is no percentage
 * celebration, no streak counter, and no "you are behind" affordance here.
 */

export type ProgressTone = "brand" | "calm";

const tones = {
  brand: "bg-brand-primary",
  calm: "bg-brand-secondary",
} satisfies Record<ProgressTone, string>;

export type ProgressBarProps = ComponentPropsWithoutRef<"div"> & {
  value: number;
  max: number;
  label: string;
  showCount?: boolean;
  tone?: ProgressTone;
};

export function ProgressBar({
  value,
  max,
  label,
  showCount = true,
  tone = "brand",
  className,
  ...rest
}: ProgressBarProps) {
  // A malformed value should never render a bar wider than its track or a
  // negative aria-valuenow.
  const safeMax = max > 0 ? max : 1;
  const safeValue = Math.min(Math.max(value, 0), safeMax);
  const percent = (safeValue / safeMax) * 100;
  const valueText = `${safeValue} of ${safeMax}`;

  return (
    <div className={cn("w-full", className)} {...rest}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="font-semibold text-text-primary">{label}</span>
        {showCount ? (
          <span className="text-sm text-text-secondary">{valueText}</span>
        ) : null}
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={safeValue}
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-valuetext={valueText}
        className="mt-2 h-3 w-full overflow-hidden rounded-full bg-surface-muted"
      >
        <span
          aria-hidden="true"
          className={cn("block h-full rounded-full", tones[tone])}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
