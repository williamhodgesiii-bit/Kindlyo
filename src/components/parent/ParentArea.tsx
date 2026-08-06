"use client";

import { ParentSurface } from "@/components/nav/ParentSurface";
import { PageContainer } from "@/components/ui/PageContainer";
import { Skeleton } from "@/components/ui/Skeleton";
import { useFamily } from "@/features/profiles/useFamily";
import { ParentDashboard } from "./ParentDashboard";
import { ParentOnboarding } from "./ParentOnboarding";

/**
 * The parent area's front door.
 *
 * One `useFamily` for the whole surface, passed down, so onboarding and the
 * dashboard cannot disagree about who exists. Which of the two shows is a
 * question about stored state, so it can only be answered after hydration —
 * hence the skeleton, rather than a flash of the welcome screen at a parent
 * who onboarded weeks ago.
 *
 * A parent who has been through onboarding never sees it again, even with no
 * profiles: they may have deleted the last one deliberately, and being handed
 * the welcome tour again would read as having lost their account.
 */
export function ParentArea() {
  const family = useFamily();

  if (!family.hydrated) {
    return (
      <PageContainer>
        <Skeleton variant="block" loadingLabel="Loading the parent area" />
        <Skeleton variant="text" lines={3} className="mt-6" />
      </PageContainer>
    );
  }

  // Onboarding is intentionally nav-free (COMPONENT_STATES §4 "noNav").
  if (!family.onboarded) return <ParentOnboarding family={family} />;

  return (
    <ParentSurface>
      <ParentDashboard family={family} />
    </ParentSurface>
  );
}
