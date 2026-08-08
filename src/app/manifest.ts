import type { MetadataRoute } from "next";
import { siteDescription, siteName } from "@/lib/seo";
import { MARK_BACKGROUND } from "@/lib/brand-mark";

/**
 * The web app manifest — what lets a supporting browser offer "Add to Home
 * Screen" / "Install", the one piece of "Installable PWA where practical"
 * (docs/MVP_SCOPE.md) that was missing.
 *
 * Deliberately small. Decisions worth stating:
 *
 * - **No service worker, no offline caching.** Installability does not require
 *   one, and a cache of a child's progress or profile would be a second,
 *   on-device copy of children's data living outside the server authorisation
 *   boundary and outside account deletion — a privacy regression, not a
 *   feature. Offline support, if ever wanted, is its own reviewed decision.
 *   (safety-skeptic pass, this slice.)
 *
 * - **`start_url` / `scope` are the public root `/`.** `/learn` and `/parent`
 *   redirect a signed-out visitor to `/login`, so launching the installed icon
 *   there would dead-end on a login wall — confusing for a parent and more so
 *   for a child. The marketing root is public and leaks nothing. No tracking
 *   or campaign query params ride on `start_url`.
 *
 * - **`display: "minimal-ui"`, not `standalone`.** Ages 5–9 must never be
 *   trapped with no visible way back; minimal-ui keeps a browser back/refresh
 *   affordance where the platform honours it and degrades to standalone
 *   elsewhere. The child surface also carries its own bottom navigation.
 *
 * - **Omitted on purpose:** `related_applications` / `iarc_rating_id` (would
 *   imply an app-store or content-rating presence we do not have — and native
 *   apps are explicitly out of the MVP), `shortcuts` (a shortcut into `/learn`
 *   would be an ungated one-tap route into the child area), and `screenshots`
 *   (richer install UI that would need honest Draft-badged captures).
 *
 * `description` is imported from `@/lib/seo` so it cannot drift from the rest
 * of the site's metadata. Icon paths are root-relative, so — unlike the
 * canonical URLs in `seo.ts` — they never depend on `NEXT_PUBLIC_APP_URL` and
 * cannot publish a `localhost` value.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: siteName,
    short_name: siteName,
    description: siteDescription,
    lang: "en",
    dir: "ltr",
    start_url: "/",
    scope: "/",
    display: "minimal-ui",
    background_color: MARK_BACKGROUND,
    theme_color: MARK_BACKGROUND,
    categories: ["education"],
    icons: [
      {
        src: "/icon.svg",
        type: "image/svg+xml",
        sizes: "any",
        purpose: "any",
      },
      {
        src: "/icons/icon-192.png",
        type: "image/png",
        sizes: "192x192",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        type: "image/png",
        sizes: "512x512",
        purpose: "any",
      },
      {
        src: "/icons/maskable-192.png",
        type: "image/png",
        sizes: "192x192",
        purpose: "maskable",
      },
      {
        src: "/icons/maskable-512.png",
        type: "image/png",
        sizes: "512x512",
        purpose: "maskable",
      },
    ],
  };
}
