import Link from "next/link";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/learn", label: "Learn" },
  { href: "/parent", label: "For parents" },
] as const;

/**
 * Site header with the primary navigation landmark.
 *
 * Kept deliberately plain: the real component library arrives in the design
 * system slice.
 */
export function SiteHeader() {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <Link
          href="/"
          className="inline-flex items-center text-xl font-bold text-brand-primary-strong"
        >
          Kindlyo
        </Link>
        <nav aria-label="Main">
          <ul className="flex flex-wrap items-center gap-2">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex items-center rounded-md px-3 py-2 font-medium text-text-secondary hover:bg-surface-muted hover:text-text-primary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
