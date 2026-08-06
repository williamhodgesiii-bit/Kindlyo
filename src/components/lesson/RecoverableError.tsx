import { GlimBubble } from "@/components/character/GlimBubble";
import { Button, ButtonLink } from "@/components/ui/Button";
import { PageContainer } from "@/components/ui/PageContainer";
import { Heading, Text } from "@/components/ui/Typography";

/**
 * A recoverable error in the child area (docs/design/COMPONENT_STATES.md §15).
 *
 * Calm, and never the reader's fault. Glim wonders at it, the wording carries
 * no blame, and place is preserved: "Try again" retries, "Back to the
 * clubhouse" leaves gently. It is a `role=alert` **only because it follows a
 * user action** — and deliberately avoids the child app's forbidden error
 * grammar: no big ✕, no red flood, no shake or flash (the danger red is a
 * parent-area colour, DESIGN.md §2). Fatal errors route to a separate boundary.
 */

export type RecoverableErrorProps = {
  onRetry: () => void;
};

export function RecoverableError({ onRetry }: RecoverableErrorProps) {
  return (
    <PageContainer width="narrow">
      <div
        role="alert"
        className="llc-card-enter flex flex-col items-center gap-4 text-center"
      >
        <GlimBubble state="wonder_tilt" />
        <Heading level={1} size="lg">
          That part didn’t load
        </Heading>
        <Text size="lg" className="max-w-prose">
          Nothing you did caused this, and nothing is lost. Let’s try that part
          again.
        </Text>
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <Button size="lg" onClick={onRetry}>
            Try again
          </Button>
          <ButtonLink href="/learn" variant="secondary" size="lg">
            Back to the clubhouse
          </ButtonLink>
        </div>
      </div>
    </PageContainer>
  );
}
