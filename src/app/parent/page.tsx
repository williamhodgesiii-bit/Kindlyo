import type { Metadata } from "next";
import { ParentArea } from "@/components/parent/ParentArea";

export const metadata: Metadata = {
  title: "For parents",
};

/**
 * The parent area: onboarding on a first visit, the dashboard thereafter.
 *
 * A thin server page: profiles and progress live in local prototype storage
 * for this phase, so the work happens in the client component after hydration.
 * Accounts and a database arrive in a later slice, at which point this page
 * starts loading a family server-side instead.
 */
export default function ParentPage() {
  return <ParentArea />;
}
