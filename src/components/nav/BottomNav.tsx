"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { HomeIcon, MapIcon, PersonIcon } from "@/components/ui/icons";

/**
 * The child learning area's bottom navigation: Clubhouse · Map · Me.
 *
 * Three destinations, each an icon AND a label — never icon-only, because
 * docs/design/DESIGN.md §5 forbids controls that carry meaning by shape alone.
 * The active item is the only accent moment: it fills with the module accent
 * (docs/design/COMPONENT_STATES.md §03/§02) and also carries `aria-current`, so
 * the current place is conveyed by colour, a label, and a state — not colour
 * alone.
 *
 * Pinned to the bottom of the viewport (`sticky`) so a child can always find
 * their way back, and sitting above the shell's small footer at rest. Every
 * target clears the 44px floor with >= space-2 between (DESIGN.md §4).
 */

type NavItem = {
  href: string;
  label: string;
  icon: ReactNode;
  /** Whether this item owns the given path. Explicit so "/learn" does not also
   *  light up on "/learn/map". */
  match: (pathname: string) => boolean;
};

const items: readonly NavItem[] = [
  {
    href: "/learn",
    label: "Clubhouse",
    icon: <HomeIcon />,
    match: (p) => p === "/learn" || p.startsWith("/learn/lesson"),
  },
  {
    href: "/learn/map",
    label: "Map",
    icon: <MapIcon />,
    match: (p) => p === "/learn/map" || p.startsWith("/learn/map/"),
  },
  {
    href: "/learn/me",
    label: "Me",
    icon: <PersonIcon />,
    match: (p) => p === "/learn/me" || p.startsWith("/learn/me/"),
  },
];

export function BottomNav() {
  const pathname = usePathname() ?? "";

  return (
    <nav
      aria-label="Learning area"
      className="sticky bottom-0 z-10 border-t border-border bg-surface"
    >
      <ul className="mx-auto flex max-w-5xl items-stretch gap-2 px-2 py-1.5">
        {items.map((item) => {
          const active = item.match(pathname);
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-11 flex-col items-center justify-center gap-1 rounded-md px-2 py-1.5 text-center text-xs font-semibold transition-colors",
                  active
                    ? "bg-module-accent/15 text-module-accent-strong"
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
