import type { Metadata } from "next";
import { ParentSurface } from "@/components/nav/ParentSurface";
import { PageContainer } from "@/components/ui/PageContainer";
import { Heading, Text } from "@/components/ui/Typography";

export const metadata: Metadata = {
  title: "Skills",
};

/**
 * Placeholder for the parent Skills section (COMPONENT_STATES.md §4). The skill
 * areas with their status chips — describing lessons, never the child — are
 * built in step 7; this stub keeps the Skills destination reachable.
 */
export default function SkillsPage() {
  return (
    <ParentSurface>
      <PageContainer>
        <Heading level={1}>Skills</Heading>
        <Text tone="secondary" className="mt-4 max-w-prose">
          The skill areas your child has been exploring will show up here,
          described by the lessons rather than as a score. This section is being
          built.
        </Text>
      </PageContainer>
    </ParentSurface>
  );
}
