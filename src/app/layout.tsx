import type { Metadata, Viewport } from "next";
import { Source_Sans_3, Source_Serif_4 } from "next/font/google";
import { SkipLink } from "@/components/SkipLink";
import { absoluteUrl, siteDescription, siteName } from "@/lib/seo";
import "@/styles/globals.css";

/**
 * The two Storybook Geometry families (docs/design/DESIGN.md §3), self-hosted
 * by next/font so no request ever leaves for a third party — a hard
 * requirement for a children's product. Each exposes a CSS variable that
 * src/styles/tokens.css feeds into `--llc-type-display` / `--llc-type-body`.
 *
 * Serif is the voice of the story and ships weight 600 only; sans is
 * everything functional (400/600, plus 700 reserved for chips <= 12px).
 */
const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-source-serif",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-source-sans",
  display: "swap",
});

/**
 * `metadataBase` is what makes the relative image path in `openGraph` resolve
 * to an absolute URL, which social previews require. It comes from
 * `NEXT_PUBLIC_APP_URL`, so a deployment that leaves that unset will publish
 * localhost URLs — see `.env.example`.
 */
export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl("/")),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: siteName,
    // Not "black-translucent": that draws content under the iOS status bar and
    // causes contrast/overlap trouble at the top of the screen.
    statusBarStyle: "default",
  },
  icons: {
    // The document favicon stays src/app/icon.svg (auto-linked by Next). This
    // is the opaque home-screen icon iOS uses when the app is added.
    apple: "/icons/icon.svg",
  },
  openGraph: {
    type: "website",
    siteName,
    locale: "en_GB",
    title: siteName,
    description: siteDescription,
    url: absoluteUrl("/"),
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Tints the browser/OS UI around an installed window. Literal hex mirroring
  // the manifest `theme_color` (brand `#be5136` in src/styles/tokens.css),
  // since neither a manifest nor viewport metadata can read CSS variables.
  themeColor: "#be5136",
};

/**
 * Root layout: the document, and the skip link that must precede everything.
 *
 * The header, main, and footer landmarks belong to the app shells
 * (ChildAppShell, ParentAppShell) rather than here, so that the child and
 * parent surfaces can have genuinely different chrome without ever nesting two
 * banners or two mains on one page.
 */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${sourceSerif.variable} ${sourceSans.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        <SkipLink />
        {children}
      </body>
    </html>
  );
}
