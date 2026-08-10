import Link from "next/link";
import type { ReactNode } from "react";
import { BottomNav } from "@/components/nav/BottomNav";
import { ParentAreaExit } from "@/components/nav/ParentAreaExit";
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
 * There is exactly one way out, and it is gated: an adult sitting beside the
 * child reaches their own area through the "Ask a grown-up" parental gate
 * (ParentAreaExit; docs/design/ACCESSIBILITY.md). The child area otherwise holds
 * no link to account, billing, settings, or the open web — even the wordmark
 * goes to the Clubhouse rather than out to the marketing site (§4 "Safe return").
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
            href="/learn"
            className="inline-flex items-center gap-2 text-xl font-bold text-brand-primary-strong"
          >
            <span
              aria-hidden="true"
              className="grid h-8 w-8 place-items-center rounded-lg bg-brand-primary-strong text-on-brand"
            >
              <svg viewBox="0 0 64 64" className="h-5 w-5" fill="currentColor">
                <path d="M32 50C22 42.5 14 36.4 14 28.4 14 22.6 18.4 18 23.9 18c3.2 0 6.2 1.6 8.1 4.1 1.9-2.5 4.9-4.1 8.1-4.1 5.5 0 9.9 4.6 9.9 10.4 0 8-8 14.1-18 21.6Z" />
              </svg>
            </span>
            Little Learner&apos;s Club
          </Link>
          <ParentAreaExit
            label="For parents"
            className="inline-flex items-center rounded-md px-3 py-2 font-medium text-text-secondary hover:bg-surface-muted hover:text-text-primary"
          />
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
