import type { Metadata } from "next";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageContainer } from "@/components/ui/PageContainer";
import { Heading, Text } from "@/components/ui/Typography";

export const metadata: Metadata = {
  title: "For parents",
};

/**
 * Placeholder parent route.
 *
 * The real dashboard, child profiles, and settings arrive with accounts and
 * persistence. This exists so the shell and navigation are testable now.
 */
export default function ParentPage() {
  return (
    <PageContainer>
      <Heading level={1}>For parents</Heading>
      <Text size="lg" tone="secondary" className="mt-4 max-w-2xl">
        This is where you will see how your child is getting on and which
        real-world mission to try next.
      </Text>

      <EmptyState
        className="mt-8"
        title="Not built yet"
        description="Accounts, child profiles, and progress are still to come. Nothing is collected or stored at this stage."
      />
    </PageContainer>
  );
}
