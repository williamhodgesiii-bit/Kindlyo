import { describe, expect, it } from "vitest";
import { absoluteUrl, pageMetadata, siteName } from "./seo";

describe("absoluteUrl", () => {
  it("returns an absolute URL for the root", () => {
    expect(absoluteUrl("/")).toMatch(/^https?:\/\/[^/]+\/$/);
  });

  it("returns an absolute URL for a nested path", () => {
    expect(absoluteUrl("/how-it-works")).toMatch(
      /^https?:\/\/[^/]+\/how-it-works$/,
    );
  });

  it("tolerates a missing leading slash", () => {
    expect(absoluteUrl("pricing")).toBe(absoluteUrl("/pricing"));
  });

  it("does not leave a trailing slash on a page path", () => {
    expect(absoluteUrl("/safety/")).toBe(absoluteUrl("/safety"));
  });
});

describe("pageMetadata", () => {
  const input = {
    title: "How it works",
    description: "A Kindlyo lesson takes about five minutes.",
    path: "/how-it-works",
  };

  it("sets a canonical URL", () => {
    expect(pageMetadata(input).alternates?.canonical).toBe(
      absoluteUrl("/how-it-works"),
    );
  });

  it("passes the title through the root template by default", () => {
    // A plain string is what lets the layout's "%s | Kindlyo" template apply.
    expect(pageMetadata(input).title).toBe("How it works");
  });

  it("lets the homepage bypass the template", () => {
    const metadata = pageMetadata({
      ...input,
      absoluteTitle: "Kindlyo — social skills for children ages 5 to 9",
    });

    expect(metadata.title).toEqual({
      absolute: "Kindlyo — social skills for children ages 5 to 9",
    });
  });

  it("gives social previews a title that names the product", () => {
    const openGraph = pageMetadata(input).openGraph;

    expect(openGraph?.title).toBe(`How it works | ${siteName}`);
    expect(openGraph && "url" in openGraph && openGraph.url).toBe(
      absoluteUrl("/how-it-works"),
    );
  });

  it("asks for a large social card", () => {
    const twitter = pageMetadata(input).twitter;

    expect(twitter && "card" in twitter && twitter.card).toBe(
      "summary_large_image",
    );
  });
});
