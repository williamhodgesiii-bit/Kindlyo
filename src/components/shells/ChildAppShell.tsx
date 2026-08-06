import Link from "next/link";
import type { ReactNode } from "react";
import { BottomNav } from "@/components/nav/BottomNav";
import { SiteFooter } from "@/components/SiteFooter";

/**
 * Chrome for the child-facing learning area.
 *
 * A quiet header, the Clubhouse · Map · Me bottom navigation, and one way back
 * out. docs/design/COMPONENT_STATES.md gives the child area a persistent bottom
 * nav (§02); it is the only accent-carrying chrome, and it is pinned so a child
 * can always find their way home.
 *
 * `moduleId` themes the whole surface for a world: it sets `data-module`, which
 * src/styles/tokens.css maps to the five module variables (accent, tint, …).
 * Left unset, the surface uses the default Hello Garden theme — right for the
 * cross-world clubhouse and map.
 *
 * The "For parents" link is the deliberate exception: an adult sitting beside
 * the child needs a way into their own area. In step 7 this moves behind the
 * "Ask a grown-up" parental gate (docs/design/ACCESSIBILITY.md); for now it is a
 * direct link so the surfaces stay reachable.
 *
 * Body text sits one step larger here (`text-lg` = body-500) for the 5-9 age
 * range, which is the child-facing floor (DESIGN.md §3).
 */

export type ChildAppShellProps = {
  children: ReactNode;
  /** A module-world slug (e.g. "hello-garden") to theme this surface. */
  moduleId?: string;
};

export function ChildAppShell({ children, moduleId }: ChildAppShellProps) {
  return (
    <div
      className="flex min-h-screen flex-1 flex-col"
      {...(moduleId ? { "data-module": moduleId } : {})}
    >
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
      <BottomNav />
      {/* No footer links here: see the `navigation` note in SiteFooter. */}
      <SiteFooter navigation={false} />
    </div>
  );
}
