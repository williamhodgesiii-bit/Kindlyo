import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { ChildAppShell } from "@/components/shells/ChildAppShell";
import { getSessionUser } from "@/features/auth/session";

/**
 * The learning area runs inside the calmer, child-facing chrome — and, like the
 * parent area, only from a signed-in parent's session (decision 001). The child
 * surface has no login of its own; it is reached from the parent's. The
 * middleware gates it, and this layout verifies again on the server.
 */
export default async function LearnLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const user = await getSessionUser();
  if (user === null) redirect("/login?redirectTo=/learn");

  return <ChildAppShell>{children}</ChildAppShell>;
}
