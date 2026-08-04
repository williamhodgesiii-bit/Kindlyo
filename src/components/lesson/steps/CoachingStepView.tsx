import { ParentInsightCard } from "@/components/ui/ParentInsightCard";
import { Heading, Text } from "@/components/ui/Typography";
import type { ParentCoaching } from "@/features/curriculum/schema";

/**
 * The parent coaching prompt.
 *
 * Kept inside the lesson rather than hidden in a dashboard, because the adult
 * we most want to reach is the one already sitting beside the child. The
 * child-facing line above it says plainly who this part is for, so nobody has
 * to work it out.
 */
export function CoachingStepView({ coaching }: { coaching: ParentCoaching }) {
  return (
    <section>
      <Heading level={2}>One thing for your grown-up</Heading>
      <Text tone="secondary" className="mt-3 max-w-prose">
        This bit is for whoever is with you. You can read it together, or skip
        ahead.
      </Text>

      <ParentInsightCard
        className="mt-6"
        headingLevel={3}
        title={coaching.title}
        body={coaching.prompt}
        points={coaching.tryThis}
      />
    </section>
  );
}
