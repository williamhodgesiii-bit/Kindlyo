import type { MetadataRoute } from "next";
import { siteDescription, siteName } from "@/lib/seo";

/**
 * The web app manifest, served at `/manifest.webmanifest`. Next links it from
 * the document automatically, which — together with the `appleWebApp` metadata
 * in the root layout and the icons under `public/icons` — is what lets a parent
 * install Kindlyo or add it to a home screen (docs/MVP_SCOPE.md, "Installable
 * PWA where practical").
 *
 * Deliberately minimal. This slice makes the app installable and nothing more:
 *
 * - No service worker / offline cache. A cache of authenticated pages or child
 *   progress would persist family data on the device, outliving the parent's
 *   deletion controls (docs/PRIVACY_AND_SAFETY.md) and risking cross-account
 *   leakage on a shared family tablet. Offline is its own reviewed slice.
 * - No `share_target`, `shortcuts`, `protocol_handlers`, `screenshots`, or
 *   native `related_applications`. Each is scope beyond the MVP and a data or
 *   claim surface we do not want (a shortcut cannot carry a child's nickname
 *   into the OS UI if there are no shortcuts). `manifest.test.ts` locks their
 *   absence so a well-meaning later change has to be deliberate.
 *
 * `start_url` and `scope` are `/` — the parent-facing marketing home, never a
 * child learning session, so an installed launch cannot drop a child straight
 * into `/learn` without a grown-up (docs/PROFILES.md).
 *
 * `theme_color` and `background_color` are literal hex copied from
 * src/styles/tokens.css (brand `#be5136`, canvas `#faf3e7`); a manifest cannot
 * read CSS custom properties, so keep them in sync, the same duplication caveat
 * noted in `src/app/opengraph-image.tsx`.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: siteName,
    short_name: siteName,
    description: siteDescription,
    start_url: "/",
    scope: "/",
    display: "standalone",
    theme_color: "#be5136",
    background_color: "#faf3e7",
    lang: "en-GB",
    dir: "ltr",
    categories: ["education"],
    prefer_related_applications: false,
    icons: [
      {
        src: "/icons/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icons/maskable.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
