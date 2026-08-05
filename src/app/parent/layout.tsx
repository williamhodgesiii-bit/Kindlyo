import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { ParentAccountBar } from "@/components/parent/ParentAccountBar";
import { ParentAppShell } from "@/components/shells/ParentAppShell";
import { getSessionUser } from "@/features/auth/session";

/**
 * The parent area runs inside the adult-facing chrome, behind a parent session.
 *
 * The middleware already gates `/parent`, but the layout checks again on the
 * server: `docs/ARCHITECTURE.md` asks every protected surface to verify for
 * itself rather than trust that something upstream did. The account bar needs
 * the signed-in email anyway, so the check pays for itself.
 */
export default async function ParentLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const user = await getSessionUser();
  if (user === null) redirect("/login?redirectTo=/parent");

  return (
    <ParentAppShell header="app">
      <ParentAccountBar email={user.email} />
      {children}
    </ParentAppShell>
  );
}
