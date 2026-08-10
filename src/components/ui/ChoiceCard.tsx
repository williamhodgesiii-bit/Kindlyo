import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { CheckIcon } from "./icons";

/**
 * A tappable choice in a scenario, and the list that holds them.
 *
 * Buttons rather than radios. A lesson choice is "pick this and see how it
 * lands", not a form field to be revised before submitting, so native button
 * activation and plain Tab order are the honest model - and there is no roving
 * tabindex to get subtly wrong.
 *
 * There is deliberately NO `correct` or `incorrect` prop, and none may be
 * added. docs/CURRICULUM_PRINCIPLES.md rules out marking a child's choice right
 * or wrong; the outcome of a choice is described by InlineFeedback in the
 * neutral helpful/mixed/needs-context vocabulary instead.
 *
 * Selection is conveyed by `aria-pressed` and a check icon as well as colour,
 * because nothing here may depend on colour alone.
 */

export type ChoiceListProps = ComponentPropsWithoutRef<"ul"> & {
  label: string;
};

export function ChoiceList({
  label,
  className,
  children,
  ...rest
}: ChoiceListProps) {
  return (
    <ul
      aria-label={label}
      className={cn("grid gap-3 sm:grid-cols-2", className)}
      {...rest}
    >
      {children}
    </ul>
  );
}

export type ChoiceCardProps = ComponentPropsWithoutRef<"button"> & {
  label: string;
  description?: string;
  selected?: boolean;
  media?: ReactNode;
};

export function ChoiceCard({
  label,
  description,
  selected = false,
  media,
  className,
  type = "button",
  ...rest
}: ChoiceCardProps) {
  return (
    <li className="contents">
      <button
        type={type}
        aria-pressed={selected}
        className={cn(
          "flex min-h-11 w-full items-start gap-3 rounded-lg border-2 p-4",
          "llc-press text-left",
          "disabled:cursor-not-allowed disabled:opacity-60",
          selected
            ? "border-brand-secondary bg-brand-secondary/10"
            : "border-border bg-surface hover:bg-surface-muted",
          "disabled:hover:bg-surface",
          className,
        )}
        {...rest}
      >
        {media ? (
          <span aria-hidden="true" className="shrink-0">
            {media}
          </span>
        ) : null}
        <span className="min-w-0 flex-1">
          <span className="block font-semibold text-text-primary">{label}</span>
          {description ? (
            <span className="mt-1 block text-text-secondary">
              {description}
            </span>
          ) : null}
        </span>
        {selected ? (
          <span
            aria-hidden="true"
            className="shrink-0 text-brand-secondary-strong"
          >
            <CheckIcon />
          </span>
        ) : null}
      </button>
    </li>
  );
}
