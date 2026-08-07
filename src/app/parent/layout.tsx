import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { ParentAccountBar } from "@/components/parent/ParentAccountBar";
import { ParentAppShell } from "@/components/shells/ParentAppShell";
import { LegacyLocalDataReset } from "@/components/system/LegacyLocalDataReset";
import { getSessionUser } from "@/features/auth/session";

/**
 * The parent area runs inside the adult-facing chrome, behind a parent session.
 *
 * The middleware already gates `/parent`, but the layout checks again on the
 * server: `docs/ARCHITECTURE.md` asks every protected surface to verify for
 * itself rather than trust that something upstream did. The account bar needs
 * the signed-in email anyway, so the check pays for itself.
 *
 * `LegacyLocalDataReset` lives here (and in the `/learn` layout) rather than
 * the root layout: it only has anything to clear for a signed-in parent who
 * used the old browser-local prototype, and the root layout also wraps the
 * public marketing pages, where an anonymous visitor must leave no trace
 * (decision 032) — the reset was writing its marker key on every homepage
 * visit before this moved.
 */
export default async function ParentLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const user = await getSessionUser();
  if (user === null) redirect("/login?redirectTo=/parent");

  return (
    <ParentAppShell header="app">
      <LegacyLocalDataReset />
      <ParentAccountBar email={user.email} />
      {children}
    </ParentAppShell>
  );
}
