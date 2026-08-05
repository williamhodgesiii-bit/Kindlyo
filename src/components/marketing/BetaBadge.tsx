import { cn } from "@/lib/cn";

/**
 * The private-beta label.
 *
 * Kindlyo is not open to the public, and `prompts/21-marketing-site.md` asks
 * for that to be clearly labelled rather than buried. It sits beside the
 * wordmark in the header, so it is on every page of the site without needing a
 * dismissible banner and the "was it dismissed?" state that comes with one.
 *
 * The `-strong` hue is used because this carries text (see the contrast note in
 * `src/styles/tokens.css`).
 */
export function BetaBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md bg-tint-sage px-2 py-1 text-xs font-semibold text-brand-secondary-strong",
        className,
      )}
    >
      Private beta
    </span>
  );
}
