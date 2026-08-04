"use client";

import { useEffect } from "react";
import { ParentAppShell } from "@/components/shells/ParentAppShell";
import { ErrorState } from "@/components/ui/ErrorState";
import { PageContainer } from "@/components/ui/PageContainer";
import { Heading } from "@/components/ui/Typography";

/**
 * Route-level error boundary.
 *
 * Shows a calm, non-technical message and offers a retry. The raw error is
 * logged for developers but never rendered, so internal details do not leak to
 * users.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Replaced by real error monitoring in the hardening slice.
    console.error(error);
  }, [error]);

  return (
    <ParentAppShell>
      <PageContainer>
        <div className="max-w-xl">
          <Heading level={1}>Something went wrong</Heading>
          <ErrorState
            live
            className="mt-6"
            headingLevel={2}
            title="We could not load this page"
            description="This one is on us, not on you. You can try again, and your progress is safe."
            onRetry={reset}
          />
        </div>
      </PageContainer>
    </ParentAppShell>
  );
}
