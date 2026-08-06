import { Card } from "@/components/ui/Card";
import {
  Heading,
  nextHeadingLevel,
  Text,
  type HeadingLevel,
} from "@/components/ui/Typography";
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
  headingLevel = 2,
}: {
  principle: LessonPrinciple;
  /** Defaults to a lesson page's `h2`; deeper when embedded in a section. */
  headingLevel?: HeadingLevel;
}) {
  return (
    <section className="llc-principle-enter">
      <Heading level={headingLevel}>{principle.title}</Heading>
      <Text size="lg" className="mt-3 max-w-prose">
        {principle.body}
      </Text>

      <Card elevation="soft" className="mt-6">
        <Heading level={nextHeadingLevel(headingLevel)} size="sm">
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
