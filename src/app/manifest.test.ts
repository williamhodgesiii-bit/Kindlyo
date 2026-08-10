import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { siteDescription, siteName } from "@/lib/seo";
import manifest from "./manifest";

const result = manifest();

describe("web app manifest", () => {
  it("declares an installable standalone app rooted at the parent-facing home", () => {
    expect(result.name).toBe(siteName);
    expect(result.short_name).toBe(siteName);
    expect(result.display).toBe("standalone");
    // Never a child learning route: an installed launch must not drop a child
    // into `/learn` without a grown-up (docs/PROFILES.md).
    expect(result.start_url).toBe("/");
    expect(result.scope).toBe("/");
    expect(result.id).toBe("/");
    expect(result.lang).toBe("en-GB");
  });

  it("reuses the vetted site description rather than fresh manifest copy", () => {
    // The shared copy is carefully hedged; authoring new manifest text is where
    // an unearned educational/clinical claim would slip in (CLAUDE.md).
    expect(result.description).toBe(siteDescription);
  });

  it("uses brand and canvas colours as literal hex", () => {
    expect(result.theme_color).toBe("#be5136");
    expect(result.background_color).toBe("#faf3e7");
  });

  it("stays in the education category only", () => {
    expect(result.categories).toEqual(["education"]);
  });

  it("does not lock orientation", () => {
    // Forcing portrait/landscape breaks mounted devices and assistive setups.
    expect(result.orientation).toBeUndefined();
  });

  it("provides an 'any' and a padded 'maskable' icon", () => {
    const purposes = (result.icons ?? []).map((icon) => icon.purpose);
    expect(purposes).toContain("any");
    expect(purposes).toContain("maskable");
  });

  it("points every icon at a file that exists under public/", () => {
    for (const icon of result.icons ?? []) {
      const path = join(process.cwd(), "public", icon.src);
      expect(existsSync(path), `${icon.src} should exist`).toBe(true);
    }
  });

  it("omits fields that would exceed the MVP or leak child data", () => {
    // Guards against a later "let's add a Continue shortcut / share to Kindlyo"
    // change landing without a deliberate safety pass. See manifest.ts.
    const record = result as Record<string, unknown>;
    expect(record.share_target).toBeUndefined();
    expect(record.shortcuts).toBeUndefined();
    expect(record.protocol_handlers).toBeUndefined();
    expect(record.screenshots).toBeUndefined();
    expect(record.related_applications).toBeUndefined();
    expect(result.prefer_related_applications).toBe(false);
  });
});
