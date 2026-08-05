import Link from "next/link";
import { BetaBadge } from "@/components/marketing/BetaBadge";
import { ButtonLink } from "@/components/ui/Button";

/**
 * Site header with the primary navigation landmark.
 *
 * Shared by the marketing pages and the parent area, which is why there is one
 * of it: the app shells own exactly one `banner` between them, and a second
 * header for marketing would mean two landmark sets to keep correct (see the
 * note in `ParentAppShell`).
 *
 * The narrow-viewport menu is a native `<details>` disclosure rather than a
 * scripted one. The browser already provides the toggle, the keyboard
 * behaviour, and the expanded-state announcement; it keeps this a server
 * component; and with scripting unavailable every page is still reachable.
 *
 * The links are therefore in the markup twice — once as a row for `md` and up,
 * once inside the disclosure below it — which is the usual cost of a
 * CSS-only responsive menu. Both live inside a single `<nav>` so there is still
 * exactly one navigation landmark, and only one copy is ever displayed, so only
 * one is ever in the accessibility tree.
 */

const navigation = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/curriculum", label: "Curriculum" },
  { href: "/for-parents", label: "For parents" },
  { href: "/safety", label: "Safety" },
  { href: "/pricing", label: "Pricing" },
] as const;

const linkClass =
  "inline-flex items-center rounded-md px-3 py-2 font-medium text-text-secondary hover:bg-surface-muted hover:text-text-primary";

function NavigationList({ className }: { className?: string }) {
  return (
    <ul className={className}>
      {navigation.map((item) => (
        <li key={item.href}>
          <Link href={item.href} className={linkClass}>
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export type SiteHeaderVariant = "marketing" | "app";

export function SiteHeader({
  variant = "marketing",
}: {
  /**
   * "marketing" (default) offers the sign-in and waitlist calls to action;
   * "app" hides them, because a signed-in parent needs neither — the sign-out
   * control lives in the parent account bar instead.
   */
  variant?: SiteHeaderVariant;
} = {}) {
  const showAuthCtas = variant === "marketing";

  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center text-xl font-bold text-brand-primary-strong"
          >
            Kindlyo
          </Link>
          <BetaBadge />
        </div>

        <div className="flex items-center gap-2">
          <nav aria-label="Main" className="flex items-center">
            <NavigationList className="hidden flex-wrap items-center gap-1 md:flex" />

            <details className="relative md:hidden">
              <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-md px-3 py-2 font-medium text-text-secondary hover:bg-surface-muted hover:text-text-primary">
                Menu
                <span aria-hidden="true">
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="h-5 w-5"
                  >
                    <path d="M3 6h14M3 10h14M3 14h14" />
                  </svg>
                </span>
              </summary>
              {/* Opens rightward from the summary. `right-0` would anchor the
                  panel's right edge to the button and push it off the left of
                  a 375px screen, because the button sits at the start of the
                  row rather than the end. */}
              <NavigationList className="absolute left-0 z-10 mt-2 grid w-56 gap-1 rounded-lg border border-border bg-surface p-2 shadow-lifted" />
            </details>
          </nav>

          {showAuthCtas ? (
            <>
              {/* Layout (responsive visibility) is the caller's job, so the
                  button keeps its own display and a wrapper hides it on the
                  narrowest screens where the waitlist CTA already fills the
                  row. */}
              <span className="hidden sm:inline-block">
                <ButtonLink href="/login" variant="quiet">
                  Sign in
                </ButtonLink>
              </span>

              <ButtonLink href="/waitlist">Join the waitlist</ButtonLink>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}
