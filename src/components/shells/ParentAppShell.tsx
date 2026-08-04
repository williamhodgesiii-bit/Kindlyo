import type { ReactNode } from "react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

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
};

export function ParentAppShell({ children }: ParentAppShellProps) {
  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <SiteHeader />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
