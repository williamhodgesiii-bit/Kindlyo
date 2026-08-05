import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

/**
 * Typography primitives.
 *
 * `Heading` deliberately separates the semantic level from the visual size.
 * docs/DESIGN_SYSTEM.md requires semantic headings, which in practice means a
 * page must never skip from `h1` to `h3` just because the smaller size looked
 * right. Passing `level` and `size` independently removes that temptation.
 */

export type HeadingLevel = 1 | 2 | 3 | 4;
export type HeadingSize = "sm" | "md" | "lg" | "xl" | "display";
export type TextSize = "sm" | "base" | "lg";
export type TextTone = "primary" | "secondary";

const headingSizes = {
  sm: "text-lg font-semibold",
  md: "text-xl font-bold",
  lg: "text-2xl font-bold",
  xl: "text-3xl font-bold tracking-tight",
  display: "text-4xl font-bold tracking-tight sm:text-5xl",
} satisfies Record<HeadingSize, string>;

/** The size a heading takes when the caller does not choose one. */
const defaultSizeForLevel = {
  1: "xl",
  2: "lg",
  3: "md",
  4: "sm",
} satisfies Record<HeadingLevel, HeadingSize>;

const nextLevels = {
  1: 2,
  2: 3,
  3: 4,
  4: 4,
} satisfies Record<HeadingLevel, HeadingLevel>;

/**
 * One level deeper, stopping at `h4`.
 *
 * For components that render a heading and a sub-heading and are embedded at a
 * depth their author does not know — a lesson step shown inside a marketing
 * section sits lower than the same step shown on its own page. Lets a caller
 * pass one `headingLevel` instead of two that could be set inconsistently.
 */
export function nextHeadingLevel(level: HeadingLevel): HeadingLevel {
  return nextLevels[level];
}

export type HeadingProps = ComponentPropsWithoutRef<"h2"> & {
  level: HeadingLevel;
  size?: HeadingSize;
};

export function Heading({
  level,
  size,
  className,
  children,
  ...rest
}: HeadingProps) {
  const Tag = `h${level}` as const;
  const resolved = size ?? defaultSizeForLevel[level];

  return (
    <Tag className={cn(headingSizes[resolved], className)} {...rest}>
      {children}
    </Tag>
  );
}

const textSizes = {
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
} satisfies Record<TextSize, string>;

const textTones = {
  primary: "text-text-primary",
  secondary: "text-text-secondary",
} satisfies Record<TextTone, string>;

export type TextProps = ComponentPropsWithoutRef<"p"> & {
  size?: TextSize;
  tone?: TextTone;
  as?: "p" | "span" | "div";
};

export function Text({
  size = "base",
  tone = "primary",
  as: Tag = "p",
  className,
  children,
  ...rest
}: TextProps) {
  return (
    <Tag className={cn(textSizes[size], textTones[tone], className)} {...rest}>
      {children}
    </Tag>
  );
}
