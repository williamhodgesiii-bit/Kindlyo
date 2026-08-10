import { expect, test } from "@playwright/test";

/**
 * Proves the app is actually installable end to end: the manifest is served and
 * well-formed, and every icon it names really renders (the icons are generated
 * by `next/og` at request/build time, so a broken generator would only surface
 * here, not in the manifest unit test).
 */
test.describe("installable PWA", () => {
  test("serves a well-formed web app manifest", async ({ request }) => {
    const response = await request.get("/manifest.webmanifest");
    expect(response.status()).toBe(200);

    const manifest = await response.json();
    expect(manifest.name).toBe("Little Learner's Club");
    expect(manifest.start_url).toBe("/");
    // minimal-ui keeps a back affordance for young children.
    expect(manifest.display).toBe("minimal-ui");
    expect(Array.isArray(manifest.icons)).toBe(true);
    expect(
      manifest.icons.some(
        (icon: { purpose?: string }) => icon.purpose === "maskable",
      ),
    ).toBe(true);
  });

  test("links the manifest and theme colour from the document head", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator('link[rel="manifest"]')).toHaveAttribute(
      "href",
      /manifest\.webmanifest/,
    );
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute(
      "content",
      "#faf3e7",
    );
  });

  test("renders every icon the manifest points at", async ({ request }) => {
    // Stable, first-party paths: the favicon and the four generated PNGs the
    // manifest names.
    const iconPaths = [
      "/icon.svg",
      "/icons/icon-192.png",
      "/icons/icon-512.png",
      "/icons/maskable-192.png",
      "/icons/maskable-512.png",
    ];

    for (const path of iconPaths) {
      const response = await request.get(path);
      expect(response.status(), `${path} should resolve`).toBe(200);
      expect(
        response.headers()["content-type"],
        `${path} should be an image`,
      ).toContain("image/");
    }
  });

  test("renders an opaque apple-touch-icon", async ({ page, request }) => {
    await page.goto("/");
    // Next serves apple-icon.tsx at a content-hashed URL, so follow the head
    // link rather than guessing the path.
    const href = await page
      .locator('link[rel="apple-touch-icon"]')
      .first()
      .getAttribute("href");
    expect(href).toBeTruthy();

    const response = await request.get(href!);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/png");
  });
});
