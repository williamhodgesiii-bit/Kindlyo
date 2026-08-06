import type { Metadata } from "next";
import { ParentSurface } from "@/components/nav/ParentSurface";
import { PageContainer } from "@/components/ui/PageContainer";
import { Heading, Text } from "@/components/ui/Typography";

export const metadata: Metadata = {
  title: "Account",
};

/**
 * Placeholder for the parent Account section (COMPONENT_STATES.md §4/§10:
 * Privacy & account). Privacy toggles, data export, membership, and the danger
 * zone are built in step 7; this stub keeps the Account destination reachable.
 */
export default function AccountPage() {
  return (
    <ParentSurface>
      <PageContainer>
        <Heading level={1}>Account</Heading>
        <Text tone="secondary" className="mt-4 max-w-prose">
          Privacy settings, your membership, and account controls will live
          here. This section is being built.
        </Text>
      </PageContainer>
    </ParentSurface>
  );
}
