import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { PageContainer } from "@/components/ui/PageContainer";
import { Heading, Text } from "@/components/ui/Typography";

/**
 * The frame every auth screen shares: a single narrow card with an `h1`, an
 * optional line of context, the form, and a quiet footer for the links between
 * screens. Editorial and calm, matching the parent-facing voice in
 * `docs/PROFILES.md` — an adult is deciding whether to trust us, and the answer
 * to that is prose, not chrome.
 */
export function AuthCard({
  title,
  intro,
  children,
  footer,
}: {
  title: string;
  intro?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <PageContainer width="narrow">
      <Card
        as="section"
        padding="md"
        elevation="soft"
        className="mx-auto max-w-md"
      >
        <Heading level={1} size="lg">
          {title}
        </Heading>
        {intro ? (
          <Text tone="secondary" className="mt-2 max-w-prose">
            {intro}
          </Text>
        ) : null}
        <div className="mt-6">{children}</div>
        {footer ? (
          <div className="mt-6 border-t border-border pt-4 text-sm text-text-secondary">
            {footer}
          </div>
        ) : null}
      </Card>
    </PageContainer>
  );
}
