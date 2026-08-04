import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

/**
 * Button and ButtonLink.
 *
 * Two exports rather than one polymorphic component: a button that navigates
 * should be an anchor, and pretending otherwise costs keyboard users the
 * behaviour they expect (Enter vs Space, open in new tab, focus on back).
 *
 * Neither carries "use client". They render plain elements and forward props,
 * so a caller that passes `onClick` is itself the client component.
 */

export type ButtonVariant = "primary" | "secondary" | "quiet" | "danger";
export type ButtonSize = "md" | "lg";

const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg " +
  "font-semibold transition-colors disabled:cursor-not-allowed " +
  "disabled:opacity-60";

const variants = {
  // The -strong fill, not the base hue: white on `brand-primary` is 3.31:1,
  // which fails AA for anything short of large bold text.
  primary:
    "bg-brand-primary-strong text-on-brand " +
    "hover:bg-brand-primary-strong-hover " +
    "disabled:hover:bg-brand-primary-strong",
  secondary:
    "border border-border bg-surface text-text-primary " +
    "hover:bg-surface-muted disabled:hover:bg-surface",
  quiet:
    "text-text-secondary hover:bg-surface-muted hover:text-text-primary " +
    "disabled:hover:bg-transparent",
  danger:
    "bg-danger text-on-brand hover:brightness-95 " +
    "disabled:hover:brightness-100",
} satisfies Record<ButtonVariant, string>;

const sizes = {
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
} satisfies Record<ButtonSize, string>;

function buttonClasses(
  variant: ButtonVariant,
  size: ButtonSize,
  fullWidth: boolean,
  className?: string,
): string {
  return cn(
    base,
    variants[variant],
    sizes[size],
    fullWidth && "w-full",
    className,
  );
}

/** Decorative spinner. The accessible signal is `aria-busy`, not this. */
function Spinner() {
  return (
    <span
      aria-hidden="true"
      className={
        "h-4 w-4 shrink-0 animate-spin rounded-full border-2 " +
        "border-current border-t-transparent"
      }
    />
  );
}

export type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
};

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  fullWidth = false,
  disabled,
  className,
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      // The label stays in the DOM while loading, so the accessible name never
      // changes underneath a screen reader mid-interaction and the button does
      // not resize as the spinner appears.
      aria-busy={isLoading || undefined}
      disabled={disabled ?? isLoading}
      className={buttonClasses(variant, size, fullWidth, className)}
      {...rest}
    >
      {isLoading ? <Spinner /> : null}
      {children}
    </button>
  );
}

export type ButtonLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};

export function ButtonLink({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link
      className={buttonClasses(variant, size, fullWidth, className)}
      {...rest}
    >
      {children}
    </Link>
  );
}
