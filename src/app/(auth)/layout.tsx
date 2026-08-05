import type { ReactNode } from "react";
import { ParentAppShell } from "@/components/shells/ParentAppShell";

/**
 * Authentication screens are adult-facing, so they share the same chrome as the
 * marketing site and the parent area — one banner, one main, one contentinfo.
 * They sit outside `/parent`, so they stay reachable while signed out.
 */
export default function AuthLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <ParentAppShell>{children}</ParentAppShell>;
}
