import type { Metadata } from "next";
import { PageContainer } from "@/components/ui/PageContainer";
import { Heading, Text } from "@/components/ui/Typography";

export const metadata: Metadata = {
  title: "Me",
};

/**
 * Placeholder for the child's own area ("Me"). The badges and practised-lesson
 * keepsakes that live here are built in a later step; this stub keeps the Me
 * destination in the bottom nav reachable.
 */
export default function MePage() {
  return (
    <PageContainer>
      <Heading level={1}>Me</Heading>
      <Text size="lg" tone="secondary" className="mt-4 max-w-prose">
        The things you have practised and the garden you have grown will show up
        here soon.
      </Text>
    </PageContainer>
  );
}
