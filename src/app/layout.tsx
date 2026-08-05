import type { Metadata, Viewport } from "next";
import { SkipLink } from "@/components/SkipLink";
import { absoluteUrl, siteDescription, siteName } from "@/lib/seo";
import "@/styles/globals.css";

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
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <SkipLink />
        {children}
      </body>
    </html>
  );
}
