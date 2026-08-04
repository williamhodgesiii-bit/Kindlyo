import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

/**
 * Loading placeholder.
 *
 * The bars themselves are `aria-hidden`: reading out a row of grey boxes helps
 * nobody. A single `role="status"` sibling announces that something is
 * loading, once.
 *
 * The pulse uses Tailwind's `animate-pulse`. The global reduced-motion block in
 * globals.css already collapses its duration, so it settles to a static tint
 * for anyone who has asked for less movement - no per-component media query.
 */

export type SkeletonVariant = "text" | "block" | "circle";

const variants = {
  text: "h-4 rounded-md",
  block: "h-24 rounded-lg",
  circle: "h-11 w-11 shrink-0 rounded-full",
} satisfies Record<SkeletonVariant, string>;

/**
 * Width is decided here rather than in the variant map so that a `w-*` class
 * is only ever emitted once. Two competing width utilities on one element are
 * resolved by stylesheet order, not by the order `cn` receives them.
 */
function widthFor(
  variant: SkeletonVariant,
  index: number,
  count: number,
): string {
  if (variant === "circle") return "";
  // A short last line reads as a paragraph rather than a table.
  if (variant === "text" && count > 1 && index === count - 1) return "w-3/5";
  return "w-full";
}

export type SkeletonProps = ComponentPropsWithoutRef<"div"> & {
  variant?: SkeletonVariant;
  lines?: number;
  loadingLabel?: string;
};

export function Skeleton({
  variant = "text",
  lines = 1,
  loadingLabel = "Loading",
  className,
  ...rest
}: SkeletonProps) {
  const count = variant === "text" ? Math.max(1, lines) : 1;

  return (
    <div
      className={cn(variant === "circle" ? "" : "w-full", className)}
      {...rest}
    >
      <span role="status" className="sr-only">
        {loadingLabel}
      </span>
      <div aria-hidden="true" className="flex flex-col gap-2">
        {Array.from({ length: count }, (_, index) => (
          <span
            key={index}
            className={cn(
              "block animate-pulse bg-surface-muted",
              variants[variant],
              widthFor(variant, index, count),
            )}
          />
        ))}
      </div>
    </div>
  );
}
