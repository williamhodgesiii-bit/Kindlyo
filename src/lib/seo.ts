import type { Metadata } from "next";
import { env } from "@/lib/env";

/**
 * Page metadata for the public site.
 *
 * Every marketing page builds its `metadata` export from `pageMetadata`, which
 * is the whole consistency mechanism: canonical URL, Open Graph, and Twitter
 * card all come from one place, so a new page cannot quietly ship without them.
 *
 * Absolute URLs are built from `NEXT_PUBLIC_APP_URL`. That value is validated in
 * `src/lib/env.ts` and defaults to `http://localhost:3000`, so a fresh clone
 * still produces well-formed metadata — but a deployment that leaves it unset
 * will publish localhost canonicals, which is why `.env.example` calls it out.
 */

export const siteName = "Kindlyo";

export const siteDescription =
  "Kindlyo helps children ages 5 to 9 practise kindness, communication, and social confidence through short story-based lessons and real-world missions they try offline with a grown-up.";

const base = env.NEXT_PUBLIC_APP_URL.replace(/\/+$/, "");

/** Leading slash, no trailing slash, except the root which is exactly "/". */
function normalizePath(path: string): string {
  const withLeadingSlash = path.startsWith("/") ? path : `/${path}`;
  const trimmed = withLeadingSlash.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}

export function absoluteUrl(path: string): string {
  const normalized = normalizePath(path);
  return normalized === "/" ? `${base}/` : `${base}${normalized}`;
}

export type PageMetadataInput = {
  /** Runs through the root layout's "%s | Kindlyo" template. */
  title: string;
  /**
   * The complete `<title>`, bypassing the template. The homepage uses this so
   * it does not render as "Kindlyo | Kindlyo".
   */
  absoluteTitle?: string;
  description: string;
  /** Route path, e.g. "/how-it-works". */
  path: string;
};

export function pageMetadata({
  title,
  absoluteTitle,
  description,
  path,
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const socialTitle = absoluteTitle ?? `${title} | ${siteName}`;

  return {
    title: absoluteTitle === undefined ? title : { absolute: absoluteTitle },
    description,
    alternates: { canonical: url },
    openGraph: {
      title: socialTitle,
      description,
      url,
      siteName,
      locale: "en_GB",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
    },
  };
}
