import type { Metadata } from "next";
import { ParentAppShell } from "@/components/shells/ParentAppShell";
import { ButtonLink } from "@/components/ui/Button";
import { PageContainer } from "@/components/ui/PageContainer";
import { Heading, Text } from "@/components/ui/Typography";

export const metadata: Metadata = {
  title: "Page not found",
};

/**
 * Custom 404. Calm and non-blaming, in keeping with the product tone.
 *
 * Renders its own shell: this page sits directly under the root layout, which
 * no longer supplies the header, main, and footer landmarks.
 */
export default function NotFound() {
  return (
    <ParentAppShell>
      <PageContainer>
        <div className="max-w-xl">
          <Heading level={1}>We could not find that page</Heading>
          <Text size="lg" tone="secondary" className="mt-4">
            The link may be out of date, or the page may have moved. Nothing is
            wrong with your account.
          </Text>
          <ButtonLink href="/" size="lg" className="mt-8">
            Go back home
          </ButtonLink>
        </div>
      </PageContainer>
    </ParentAppShell>
  );
}
