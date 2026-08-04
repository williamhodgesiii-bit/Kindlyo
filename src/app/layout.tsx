import type { Metadata, Viewport } from "next";
import { SkipLink } from "@/components/SkipLink";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "Kindlyo",
    template: "%s | Kindlyo",
  },
  description:
    "Kindlyo helps children ages 5 to 9 practice kindness, communication, and social confidence through short stories and real-world missions.",
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
