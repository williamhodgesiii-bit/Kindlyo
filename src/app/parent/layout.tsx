import type { ReactNode } from "react";
import { ParentAppShell } from "@/components/shells/ParentAppShell";

/** The parent area runs inside the adult-facing chrome. */
export default function ParentLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <ParentAppShell>{children}</ParentAppShell>;
}
