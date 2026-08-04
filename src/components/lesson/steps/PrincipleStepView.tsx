import { Card } from "@/components/ui/Card";
import { Heading, Text } from "@/components/ui/Typography";
import type { LessonPrinciple } from "@/features/curriculum/schema";

/**
 * Why the behaviour helps somebody else, plus the qualifiers.
 *
 * The points list is not decoration: it is where context, consent, and safety
 * live, and it is why this is an explanation rather than a rule
 * (docs/CURRICULUM_PRINCIPLES.md, "Content philosophy").
 */
export function PrincipleStepView({
  principle,
}: {
  principle: LessonPrinciple;
}) {
  return (
    <section>
      <Heading level={2}>{principle.title}</Heading>
      <Text size="lg" className="mt-3 max-w-prose">
        {principle.body}
      </Text>

      <Card elevation="soft" className="mt-6">
        <Heading level={3} size="sm">
          Worth remembering
        </Heading>
        <ul className="mt-3 grid gap-3">
          {principle.points.map((point) => (
            <li key={point} className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-brand-primary"
              />
              <span className="max-w-prose">{point}</span>
            </li>
          ))}
        </ul>
      </Card>
    </section>
  );
}
