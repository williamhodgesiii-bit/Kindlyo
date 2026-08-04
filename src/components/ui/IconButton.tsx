import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * A button whose only visible content is an icon.
 *
 * `label` is required and `aria-label`/`children` are removed from the prop
 * type, so it is not possible to render one of these without an accessible
 * name. That is the whole point of the component existing separately from
 * Button.
 */

export type IconButtonVariant = "quiet" | "solid";

const variants = {
  quiet:
    "text-text-secondary hover:bg-surface-muted hover:text-text-primary " +
    "disabled:hover:bg-transparent",
  solid:
    "bg-brand-primary-strong text-on-brand " +
    "hover:bg-brand-primary-strong-hover",
} satisfies Record<IconButtonVariant, string>;

// ComponentProps rather than ComponentPropsWithoutRef: React 19 passes `ref`
// as an ordinary prop, and Dialog needs one to move focus to the close button.
export type IconButtonProps = Omit<
  ComponentProps<"button">,
  "aria-label" | "children"
> & {
  label: string;
  icon: ReactNode;
  variant?: IconButtonVariant;
};

export function IconButton({
  label,
  icon,
  variant = "quiet",
  className,
  type = "button",
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={cn(
        // Fixed 44x44 so the target rule holds even in a dense toolbar.
        "inline-flex h-11 w-11 shrink-0 items-center justify-center",
        "rounded-lg transition-colors disabled:cursor-not-allowed",
        "disabled:opacity-60",
        variants[variant],
        className,
      )}
      {...rest}
    >
      <span aria-hidden="true" className="inline-flex">
        {icon}
      </span>
    </button>
  );
}
