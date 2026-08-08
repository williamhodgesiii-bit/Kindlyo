import { describe, expect, it } from "vitest";
import manifest from "./manifest";
import { siteDescription, siteName } from "@/lib/seo";

/**
 * The manifest is static config, so the test guards the things that would break
 * installability or reintroduce a risk the safety pass ruled out — not every
 * field.
 */
describe("web app manifest", () => {
  const result = manifest();

  it("identifies the app with the shared site name and description", () => {
    expect(result.name).toBe(siteName);
    expect(result.short_name).toBe(siteName);
    // Reused from @/lib/seo so it can never drift from the rest of the site.
    expect(result.description).toBe(siteDescription);
  });

  it("launches from the public root with no tracking params", () => {
    expect(result.start_url).toBe("/");
    expect(result.scope).toBe("/");
    // A query string here would be an attribution/tracking leak.
    expect(result.start_url).not.toContain("?");
  });

  it("keeps a back affordance for young children", () => {
    // minimal-ui, never standalone: ages 5–9 must not be trapped chrome-less.
    expect(result.display).toBe("minimal-ui");
  });

  it("uses the canvas cream for a seamless splash", () => {
    expect(result.background_color).toBe("#faf3e7");
    expect(result.theme_color).toBe("#faf3e7");
  });

  it("ships install icons including a maskable pair", () => {
    const icons = result.icons ?? [];
    const has = (src: string, purpose?: string) =>
      icons.some(
        (icon) =>
          icon.src === src && (purpose ? icon.purpose === purpose : true),
      );

    expect(has("/icons/icon-192.png")).toBe(true);
    expect(has("/icons/icon-512.png")).toBe(true);
    expect(has("/icons/maskable-192.png", "maskable")).toBe(true);
    expect(has("/icons/maskable-512.png", "maskable")).toBe(true);

    // Every icon path is root-relative, so none can bake in a localhost origin.
    for (const icon of icons) {
      expect(icon.src.startsWith("/")).toBe(true);
    }
  });

  it("makes no native-app or app-store claim", () => {
    // Native apps are out of the MVP; these fields would imply a store presence
    // or a content rating we have not earned.
    const record = result as Record<string, unknown>;
    expect(record.related_applications).toBeUndefined();
    expect(record.prefer_related_applications).toBeUndefined();
    expect(record.iarc_rating_id).toBeUndefined();
    // No shortcuts: one would be an ungated one-tap route into the child area.
    expect(record.shortcuts).toBeUndefined();
  });
});
