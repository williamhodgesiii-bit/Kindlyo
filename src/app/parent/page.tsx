import type { Metadata } from "next";
import { ParentDashboard } from "@/components/parent/ParentDashboard";

export const metadata: Metadata = {
  title: "For parents",
};

/**
 * The parent area.
 *
 * A thin server page: profiles and progress live in local storage for this
 * phase, so the work happens in the client component after hydration. Accounts
 * and a database arrive in a later slice, at which point this page starts
 * loading a family server-side instead.
 */
export default function ParentPage() {
  return <ParentDashboard />;
}
