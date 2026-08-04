import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

/**
 * Horizontal page gutter and measure.
 *
 * Replaces the `mx-auto max-w-5xl px-4 py-12` string that was copied into
 * every page. Keeping it in one place is also what keeps the small-viewport
 * no-horizontal-scroll guarantee in e2e/shell.spec.ts true across new pages.
 */

export type PageWidth = "narrow" | "default" | "wide";

const widths = {
  narrow: "max-w-2xl",
  default: "max-w-5xl",
  wide: "max-w-7xl",
} satisfies Record<PageWidth, string>;

export type PageContainerProps = ComponentPropsWithoutRef<"div"> & {
  width?: PageWidth;
  as?: "div" | "section";
};

export function PageContainer({
  width = "default",
  as: Tag = "div",
  className,
  children,
  ...rest
}: PageContainerProps) {
  return (
    <Tag
      className={cn("mx-auto w-full px-4 py-12", widths[width], className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}
