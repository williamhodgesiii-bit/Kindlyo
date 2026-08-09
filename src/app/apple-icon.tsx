import { ImageResponse } from "next/og";
import { MARK_BACKGROUND, heartDataUri } from "@/lib/brand-mark";

/**
 * The iOS "Add to Home Screen" icon. Next picks this file up by name and adds
 * the `apple-touch-icon` link for us.
 *
 * iOS ignores the manifest's icons and any transparency, so this is a separate,
 * fully opaque tile: the cream field plus the centred heart, held well inside
 * the corners iOS rounds off.
 */

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  const heart = Math.round(size.width * 0.62);

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
      <img width={heart} height={heart} src={heartDataUri} alt="" />
    </div>,
    size,
  );
}
