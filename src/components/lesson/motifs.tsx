import type { SVGProps } from "react";

/**
 * Module motif shapes.
 *
 * Each module world carries exactly one `motif` shape (docs/design/DESIGN.md §6,
 * MODULE_WORLDS.md §3). The motif is decoration only — it drifts in a scene
 * panel and is the particle of the lesson celebration — so every shape here is
 * `aria-hidden` and coloured by `currentColor`, letting the caller theme it with
 * the module accent tokens.
 *
 * Geometry is defined once, on a 0–16 grid, and shared by `SceneStage` (drawn
 * inside the scene SVG via `motifPath`) and `CelebrationBurst` (rendered as a
 * standalone particle via `MotifShape`), so a petal is a petal in both places.
 *
 * Only Hello Garden's `petal` is exercised in the MVP; the rest resolve through
 * `default` until their worlds gain content. `petal` is the one shape that must
 * read as itself.
 */

/** Neutral rounded diamond for worlds without a bespoke shape yet. */
const DEFAULT_MOTIF = "M8 1.5L14.5 8L8 14.5L1.5 8Z";

/** Motif path data on a 16×16 grid, keyed by the `module.motif` enum. */
export const motifPaths: Record<string, string> = {
  // A soft, symmetric petal pointing up.
  petal: "M8 1C10.8 3.6 14 6.6 8 15C2 6.6 5.2 3.6 8 1Z",
  // A gentle leaf.
  leaf: "M2 14C2 6 8 2 14 2C14 10 8 14 2 14Z",
  default: DEFAULT_MOTIF,
};

/** Resolve a motif name to its path, falling back to the neutral shape. */
export function motifPath(motif: string): string {
  return motifPaths[motif] ?? DEFAULT_MOTIF;
}

export type MotifShapeProps = SVGProps<SVGSVGElement> & {
  motif: string;
  /** Rendered width and height in px; the shape is square. */
  size?: number;
};

/**
 * One motif shape as a standalone, decorative SVG. Inherits its fill from the
 * caller's text colour so a module accent token themes it.
 */
export function MotifShape({
  motif,
  size = 16,
  className,
  ...rest
}: MotifShapeProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      role="presentation"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...rest}
    >
      <path d={motifPath(motif)} fill="currentColor" />
    </svg>
  );
}
