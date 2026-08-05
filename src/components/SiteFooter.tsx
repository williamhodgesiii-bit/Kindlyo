import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * Site footer.
 *
 * Carries the secondary navigation the header does not have room for: the
 * legal placeholders, and the two in-progress product surfaces. Those are
 * labelled "preview" because that is what they are — the learning area and the
 * parent area both run on prototype local storage, with no account behind them.
 *
 * `navigation` exists for the child shell, which passes `false`. A child
 * working through a scenario should not be offered a menu of somewhere else to
 * be — least of all a pricing page — so the learning area gets the notice and
 * none of the links. `ChildAppShell` and its test both depend on this.
 *
 * The draft-content notice is a product requirement: we must never imply
 * professional, psychological, educational, or clinical validation that has not
 * occurred (CLAUDE.md, "Content status").
 */

type FooterGroup = {
  heading: string;
  links: readonly { href: string; label: string }[];
};

const groups: readonly FooterGroup[] = [
  {
    heading: "Kindlyo",
    links: [
      { href: "/how-it-works", label: "How it works" },
      { href: "/curriculum", label: "Curriculum" },
      { href: "/for-parents", label: "For parents" },
      { href: "/pricing", label: "Pricing" },
      { href: "/waitlist", label: "Join the waitlist" },
    ],
  },
  {
    heading: "Trust",
    links: [
      { href: "/safety", label: "Safety and privacy" },
      { href: "/privacy", label: "Privacy policy" },
      { href: "/terms", label: "Terms of use" },
    ],
  },
  {
    heading: "Preview the product",
    links: [
      { href: "/learn", label: "Learning area preview" },
      { href: "/parent", label: "Parent area preview" },
    ],
  },
];

export type SiteFooterProps = {
  /** Set false on the child surface, which offers no onward navigation. */
  navigation?: boolean;
};

export function SiteFooter({ navigation = true }: SiteFooterProps = {}) {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-5xl px-4 py-10">
        {navigation ? (
          <nav aria-label="Footer">
            <ul className="grid gap-8 sm:grid-cols-3">
              {groups.map((group) => (
                <li key={group.heading}>
                  <h2 className="text-sm font-semibold text-text-primary">
                    {group.heading}
                  </h2>
                  <ul className="mt-3 grid gap-1">
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="inline-flex items-center text-sm text-text-secondary hover:text-text-primary"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        <div
          className={cn(
            "grid gap-2 text-sm text-text-secondary",
            navigation && "mt-10 border-t border-border pt-6",
          )}
        >
          <p>
            Kindlyo is an early-stage product in private beta. All learning
            content is draft content and has not yet been reviewed by qualified
            specialists.
          </p>
          <p>
            No advertising, no third-party advertising code, and no sale of
            personal information.
          </p>
        </div>
      </div>
    </footer>
  );
}
