"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import {
  FlagIcon,
  PersonIcon,
  ProgressIcon,
  SparkIcon,
} from "@/components/ui/icons";

/**
 * The parent area's section navigation: Progress · Missions · Skills · Account
 * (docs/design/COMPONENT_STATES.md §4).
 *
 * One element, two shapes: a pinned bottom bar on phones and a left rail from
 * `tablet` up, where the dashboard becomes two columns. The parent register is
 * quieter than the child's, so the active item carries the brand accent rather
 * than a module colour — always alongside a label and `aria-current`, never
 * colour alone.
 *
 * Onboarding is deliberately nav-free (§4 "noNav"): this renders only around the
 * dashboard and its sibling sections, via ParentSurface — never around the
 * welcome flow.
 */

type NavItem = {
  href: string;
  label: string;
  icon: ReactNode;
  match: (pathname: string) => boolean;
};

const items: readonly NavItem[] = [
  {
    href: "/parent",
    label: "Progress",
    icon: <ProgressIcon />,
    match: (p) => p === "/parent",
  },
  {
    href: "/parent/missions",
    label: "Missions",
    icon: <FlagIcon />,
    match: (p) => p.startsWith("/parent/missions"),
  },
  {
    href: "/parent/skills",
    label: "Skills",
    icon: <SparkIcon />,
    match: (p) => p.startsWith("/parent/skills"),
  },
  {
    href: "/parent/account",
    label: "Account",
    icon: <PersonIcon />,
    // Membership/billing lives under the account section too.
    match: (p) =>
      p.startsWith("/parent/account") || p.startsWith("/parent/billing"),
  },
];

export function ParentNav() {
  const pathname = usePathname() ?? "";

  return (
    <nav
      aria-label="Parent sections"
      className={cn(
        // Phone: a pinned bottom bar.
        "fixed inset-x-0 bottom-0 z-20 border-t border-border bg-surface",
        // Tablet: a static left rail beside the content.
        "tablet:static tablet:z-auto tablet:w-56 tablet:shrink-0 tablet:self-start tablet:rounded-lg tablet:border",
      )}
    >
      <ul className="flex items-stretch justify-around gap-1 px-2 py-1.5 tablet:flex-col tablet:justify-start tablet:gap-1 tablet:p-2">
        {items.map((item) => {
          const active = item.match(pathname);
          return (
            <li key={item.href} className="flex-1 tablet:flex-none">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-11 flex-col items-center justify-center gap-1 rounded-md px-2 py-1.5 text-center text-xs font-semibold transition-colors",
                  "tablet:flex-row tablet:justify-start tablet:gap-3 tablet:px-3 tablet:py-2.5 tablet:text-left tablet:text-sm",
                  active
                    ? "bg-brand-primary/10 text-brand-primary-strong"
                    : "text-text-secondary hover:bg-surface-muted hover:text-text-primary",
                )}
              >
                <span aria-hidden="true">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
