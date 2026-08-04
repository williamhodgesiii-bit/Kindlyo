/**
 * Class name joiner.
 *
 * Hand-rolled rather than pulling in `clsx` and `tailwind-merge`: the need is
 * one line of string handling, and CLAUDE.md asks us to avoid unnecessary
 * dependencies (see also docs/DECISIONS.md, record 012).
 *
 * Important limitation: this does NOT resolve conflicting Tailwind utilities.
 * `cn("p-4", "p-6")` emits both, and which one wins is decided by their order
 * in the generated stylesheet, not by their order here. The design system
 * avoids the problem structurally instead:
 *
 * - Components own appearance (colour, radius, border, weight, focus).
 * - Callers own layout (margin, width, grid placement) - properties the
 *   components never set, so there is nothing to collide with.
 * - A caller that genuinely must override an owned property uses Tailwind's
 *   important modifier, e.g. `className="!bg-surface"`.
 */

export type ClassValue = string | false | null | undefined;

export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
