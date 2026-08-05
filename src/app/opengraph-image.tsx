import { ImageResponse } from "next/og";
import { siteName } from "@/lib/seo";

/**
 * The social-preview placeholder.
 *
 * Drawn here rather than committed as a file so it stays in step with the
 * design tokens and needs no image tooling. `next/og` ships with Next, so this
 * costs no dependency.
 *
 * Placeholder is the right word: it is type on the brand background, with no
 * illustration and no claim on it. A real card is a design task, and inventing
 * one here would mean inventing marketing language to fill it.
 *
 * Colours are literal hex rather than `var(--color-*)` because this renders
 * outside the document, where the stylesheet does not exist. They are copied
 * from `src/styles/tokens.css` and noted there as the two that are duplicated.
 */

export const alt =
  "Kindlyo — kindness is a skill, confidence takes practice. Social skills for children ages 5 to 9.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#fffaf2",
        color: "#2f2925",
        padding: "80px",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "18px",
            backgroundColor: "#d96f52",
          }}
        />
        <div style={{ fontSize: 40, fontWeight: 700, color: "#b0492f" }}>
          {siteName}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.1 }}>
          Kindness is a skill.
        </div>
        <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.1 }}>
          Confidence takes practice.
        </div>
      </div>

      <div style={{ fontSize: 32, color: "#6f655e" }}>
        Short, story-based social-skills lessons for children ages 5 to 9.
      </div>
    </div>,
    size,
  );
}
