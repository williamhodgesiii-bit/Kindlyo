import type { ReactNode } from "react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader, type SiteHeaderVariant } from "@/components/SiteHeader";

/**
 * Chrome for adult-facing surfaces: marketing and the parent area.
 *
 * The shells - not the root layout - own the banner, main, and contentinfo
 * landmarks. Each page passes through exactly one shell, so there is never
 * more than one of each landmark on a page, which is what e2e/shell.spec.ts
 * checks.
 *
 * `main` keeps `id="main-content"` because SkipLink targets it.
 */

export type ParentAppShellProps = {
  children: ReactNode;
  /**
   * "marketing" (default) keeps the sign-in/waitlist calls to action; the
   * signed-in parent area passes "app" so the header drops them in favour of
   * the account bar's sign-out control.
   */
  header?: SiteHeaderVariant;
};

export function ParentAppShell({
  children,
  header = "marketing",
}: ParentAppShellProps) {
  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <SiteHeader variant={header} />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
