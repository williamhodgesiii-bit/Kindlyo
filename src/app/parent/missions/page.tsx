import type { Metadata } from "next";
import { ParentSurface } from "@/components/nav/ParentSurface";
import { PageContainer } from "@/components/ui/PageContainer";
import { Heading, Text } from "@/components/ui/Typography";

export const metadata: Metadata = {
  title: "Missions",
};

/**
 * Placeholder for the parent Missions section (COMPONENT_STATES.md §4). The
 * current-mission view and its "mark practised together" flow are built in step
 * 7; this stub keeps the Missions destination reachable from the parent nav.
 */
export default function MissionsPage() {
  return (
    <ParentSurface>
      <PageContainer>
        <Heading level={1}>Missions</Heading>
        <Text tone="secondary" className="mt-4 max-w-prose">
          This week&rsquo;s real-world mission and a prompt for afterwards will
          live here. This section is being built.
        </Text>
      </PageContainer>
    </ParentSurface>
  );
}
