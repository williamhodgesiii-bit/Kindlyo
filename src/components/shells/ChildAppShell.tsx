import Link from "next/link";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/SiteFooter";

/**
 * Chrome for the child-facing learning area.
 *
 * Quieter than the adult shell on purpose: a wordmark, one way back out, and
 * nothing else competing with the lesson. docs/DESIGN_SYSTEM.md asks for calm
 * over dense navigation, and a child working through a scenario should not be
 * offered a menu of somewhere else to be.
 *
 * The "For parents" link is the deliberate exception - an adult sitting beside
 * the child needs a way into their own area, and it keeps the exit visible
 * rather than hidden behind a gesture.
 *
 * Body text sits one step larger here (`text-lg`) for the 5-9 age range.
 */

export type ChildAppShellProps = {
  children: ReactNode;
};

export function ChildAppShell({ children }: ChildAppShellProps) {
  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center text-xl font-bold text-brand-primary-strong"
          >
            Kindlyo
          </Link>
          <Link
            href="/parent"
            className="inline-flex items-center rounded-md px-3 py-2 font-medium text-text-secondary hover:bg-surface-muted hover:text-text-primary"
          >
            For parents
          </Link>
        </div>
      </header>
      <main id="main-content" className="flex-1 text-lg">
        {children}
      </main>
      {/* No footer links here: see the `navigation` note in SiteFooter. */}
      <SiteFooter navigation={false} />
    </div>
  );
}
