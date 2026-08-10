/**
 * The Little Learner's Club heart, shared by every generated app icon so the
 * mark lives in exactly one place.
 *
 * `src/app/icon.svg` (the favicon) draws the same coral heart on a cream tile;
 * the values here are copied from it so the installed-app icon matches the tab
 * icon a parent already sees. They are literal hex rather than `var(--color-*)`
 * because icons render in `next/og`'s `ImageResponse`, outside the document,
 * where the stylesheet does not exist — the same reason `opengraph-image.tsx`
 * inlines its colours.
 *
 * `MARK_BACKGROUND` is the canonical canvas token (`--llc-color-canvas`), so an
 * installed app's splash screen (`background_color` in the manifest) and the
 * icon tile share one cream and the launch has no seam.
 */

/** `--llc-color-canvas` — the real app background, and the PWA splash colour. */
export const MARK_BACKGROUND = "#faf3e7";

/** The tomato heart fill, matching `src/app/icon.svg`. */
export const MARK_FILL = "#e4572e";

/** The heart outline on a 64×64 grid, lifted verbatim from `icon.svg`. */
const HEART_PATH =
  "M32 50C22 42.5 14 36.4 14 28.4 14 22.6 18.4 18 23.9 18c3.2 0 6.2 1.6 8.1 4.1 1.9-2.5 4.9-4.1 8.1-4.1 5.5 0 9.9 4.6 9.9 10.4 0 8-8 14.1-18 21.6Z";

/**
 * A data-URI of the heart alone (transparent background), suitable as the
 * `src` of an `<img>` inside an `ImageResponse`. Satori rasterises SVG data
 * URIs reliably, which is why the icon routes compose a coloured `<div>` tile
 * plus this `<img>` rather than relying on inline `<path>` support.
 */
export const heartDataUri = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="${HEART_PATH}" fill="${MARK_FILL}"/></svg>`,
)}`;
