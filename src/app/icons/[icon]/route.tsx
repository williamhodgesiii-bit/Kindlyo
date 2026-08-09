import { ImageResponse } from "next/og";
import { MARK_BACKGROUND, heartDataUri } from "@/lib/brand-mark";

/**
 * The PNG app icons the manifest points at, drawn from the shared heart rather
 * than committed as binary files — the same reasoning as `opengraph-image.tsx`
 * (stays in step with the mark, needs no image tooling, costs no dependency;
 * `next/og` ships with Next).
 *
 * Two purposes, two sizes each:
 *
 * - **`icon-*` ("any"):** the heart sits at ~72% of the tile, close to the
 *   edges like a normal favicon.
 * - **`maskable-*`:** Android clips maskable icons to a circle/squircle, so the
 *   heart is held inside the ~80% safe zone (heart at ~52%) and the cream tile
 *   bleeds to every edge, leaving room for the mask without ever clipping the
 *   heart.
 *
 * The cream tile is `MARK_BACKGROUND` (the canvas token), matching the
 * manifest's `background_color`, so an installed app's splash shows the icon on
 * a seamless field.
 */

const SPECS = {
  "icon-192.png": { size: 192, heartRatio: 0.72 },
  "icon-512.png": { size: 512, heartRatio: 0.72 },
  "maskable-192.png": { size: 192, heartRatio: 0.52 },
  "maskable-512.png": { size: 512, heartRatio: 0.52 },
} as const;

type IconName = keyof typeof SPECS;

/** Prerender all four icons at build time; nothing here is request-specific. */
export function generateStaticParams() {
  return Object.keys(SPECS).map((icon) => ({ icon }));
}

export const dynamicParams = false;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ icon: string }> },
) {
  const { icon } = await params;
  const spec = SPECS[icon as IconName];

  if (!spec) {
    return new Response("Not found", { status: 404 });
  }

  const heart = Math.round(spec.size * spec.heartRatio);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: MARK_BACKGROUND,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img width={heart} height={heart} src={heartDataUri} alt="" />
    </div>,
    { width: spec.size, height: spec.size },
  );
}
