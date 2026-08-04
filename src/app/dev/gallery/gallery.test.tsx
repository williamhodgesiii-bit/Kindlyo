import { describe, expect, it, vi } from "vitest";
import { isDevRouteEnabled } from "@/lib/devOnly";
import GalleryPage from "./page";

/**
 * The gallery is a development tool, so the thing worth testing is that it
 * refuses to answer anywhere else. Rendering the page itself would mostly
 * assert that JSX renders JSX.
 *
 * The gate is mocked rather than stubbing NODE_ENV: stubbing it flips React's
 * package resolution to the production JSX runtime mid-test, and every
 * component that builds an element at module scope then fails on a missing
 * `jsxDEV`. `isDevRouteEnabled` is covered directly in src/lib/devOnly.test.ts.
 *
 * Named gallery.test.tsx rather than page.test.tsx: the basename `page` is
 * meaningful to the App Router, and a file that looks like a route but is not
 * one is a trap for the next reader.
 */

vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

vi.mock("@/lib/devOnly", () => ({
  isDevRouteEnabled: vi.fn(),
}));

const mockedGate = vi.mocked(isDevRouteEnabled);

describe("gallery route", () => {
  it("refuses to render outside development", () => {
    mockedGate.mockReturnValue(false);
    expect(() => GalleryPage()).toThrow("NEXT_NOT_FOUND");
  });

  it("renders while developing", () => {
    mockedGate.mockReturnValue(true);
    expect(() => GalleryPage()).not.toThrow();
  });
});
