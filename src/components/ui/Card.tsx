import type { ElementType, HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/**
 * A surface, and nothing more.
 *
 * Card carries no heading, no title prop, and no curriculum vocabulary. The
 * richer cards (ProfileCard, MissionCard) compose this one, which keeps their
 * appearance consistent without teaching Card about lessons or profiles
 * (docs/DECISIONS.md, record 004).
 */

export type CardPadding = "none" | "sm" | "md";
export type CardElevation = "flat" | "soft";

const paddings = {
  none: "",
  sm: "p-4",
  md: "p-6",
} satisfies Record<CardPadding, string>;

const elevations = {
  flat: "",
  soft: "shadow-soft",
} satisfies Record<CardElevation, string>;

export type CardElement = "div" | "article" | "section" | "li";

export type CardProps = HTMLAttributes<HTMLElement> & {
  as?: CardElement;
  padding?: CardPadding;
  elevation?: CardElevation;
};

export function Card({
  as = "div",
  padding = "md",
  elevation = "flat",
  className,
  children,
  ...rest
}: CardProps) {
  const Tag: ElementType = as;

  return (
    <Tag
      className={cn(
        "rounded-lg border border-border bg-surface",
        paddings[padding],
        elevations[elevation],
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
