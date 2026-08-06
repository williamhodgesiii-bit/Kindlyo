import type { Metadata } from "next";
import { PageContainer } from "@/components/ui/PageContainer";
import { Heading, Text } from "@/components/ui/Typography";

export const metadata: Metadata = {
  title: "Map",
};

/**
 * Placeholder for the Neighborhood map (COMPONENT_STATES.md §03). The map and
 * its module worlds are built in step 3; this stub keeps the Map destination in
 * the bottom nav reachable in the meantime.
 */
export default function NeighborhoodMapPage() {
  return (
    <PageContainer>
      <Heading level={1}>Neighborhood map</Heading>
      <Text size="lg" tone="secondary" className="mt-4 max-w-prose">
        Every world lives in one neighborhood. The map is being built — for now,
        head back to the clubhouse to keep learning.
      </Text>
    </PageContainer>
  );
}
