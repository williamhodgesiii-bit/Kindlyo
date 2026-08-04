import type { ReactNode } from "react";
import { ParentAppShell } from "@/components/shells/ParentAppShell";

/**
 * Marketing chrome.
 *
 * Uses the parent shell rather than a third one: the marketing site speaks to
 * the parent, who is the account holder and the paying customer.
 */
export default function MarketingLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <ParentAppShell>{children}</ParentAppShell>;
}
