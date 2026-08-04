import type { ReactNode } from "react";
import { ChildAppShell } from "@/components/shells/ChildAppShell";

/** The learning area runs inside the calmer, child-facing chrome. */
export default function LearnLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <ChildAppShell>{children}</ChildAppShell>;
}
