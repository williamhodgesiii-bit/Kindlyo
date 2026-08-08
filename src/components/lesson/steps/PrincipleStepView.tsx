import { Card } from "@/components/ui/Card";
import {
  Heading,
  nextHeadingLevel,
  Text,
  type HeadingLevel,
  type HeadingSize,
} from "@/components/ui/Typography";
import type { LessonPrinciple } from "@/features/curriculum/schema";

/**
 * Why the behaviour helps somebody else, plus the qualifiers.
 *
 * Read for a child of 5–9, this screen was a wall of text: a bold title, an
 * equally weighted explanatory paragraph, and a tight bulleted list all
 * competing at once. Young working memory holds only a few things at a time,
 * and extra visible material actively suppresses learning at this age (Cowan
 * 2010; Mayer's coherence principle). So the presentation now carries a clear
 * hierarchy rather than a flat block:
 *
 * - the `title` is the one idea to hold on to — the hero of the screen;
 * - the `body` (why it helps) is calm, secondary elaboration beneath it;
 * - the qualifiers stay a breathable, plainly readable list.
 *
 * The points list is not decoration: it is where context, consent, and safety
 * live, and it is why this is an explanation rather than a rule
 * (docs/CURRICULUM_PRINCIPLES.md, "Content philosophy"). So every point stays
 * fully visible, in source order, at equal weight — never collapsed behind a
 * tap, truncated, reordered, or singled out by colour. The markers are
 * decorative and identical; all meaning stays in the words. The screen carries
 * no motif particle or per-row reveal, so it never borrows the completion
 * screen's celebratory language for an explanation.
 */
export function PrincipleStepView({
  principle,
  headingLevel = 2,
}: {
  principle: LessonPrinciple;
  /** Defaults to a lesson page's `h2`; deeper when embedded in a section. */
  headingLevel?: HeadingLevel;
}) {
  // On the lesson page this heading is the screen's own `h2`, so it can be the
  // visual hero. When embedded deeper (the marketing sample renders it at
  // `h3`, below the section's own `h2`), keep the level's default size so it
  // does not shout over its surroundings.
  const titleSize: HeadingSize | undefined =
    headingLevel === 2 ? "xl" : undefined;

  return (
    <section className="llc-principle-enter">
      <Heading level={headingLevel} size={titleSize} className="max-w-prose">
        {principle.title}
      </Heading>
      <Text
        size="lg"
        tone="secondary"
        className="mt-4 max-w-prose leading-relaxed"
      >
        {principle.body}
      </Text>

      <Card elevation="soft" className="mt-8">
        <Heading level={nextHeadingLevel(headingLevel)} size="sm">
          Worth remembering
        </Heading>
        <ul className="mt-4 grid gap-4">
          {principle.points.map((point) => (
            <li key={point} className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-brand-primary"
              />
              <Text as="span" className="max-w-prose leading-relaxed">
                {point}
              </Text>
            </li>
          ))}
        </ul>
      </Card>
    </section>
  );
}
