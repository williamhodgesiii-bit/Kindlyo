import {
  skillAreaLabels,
  skillAreas,
  type SkillArea,
} from "@/features/curriculum/schema";

/**
 * Public descriptions of the six skill areas.
 *
 * The areas and their labels come from the curriculum schema rather than being
 * retyped here, and the descriptions are keyed by the same union with
 * `satisfies Record<SkillArea, string>` — so adding a seventh area to the
 * curriculum fails the typecheck until somebody writes what to say about it in
 * public. That is the intended friction.
 *
 * These describe areas of *practice*, never traits of a child, for the reason
 * given in `schema.ts`: there is no "polite" or "confident" area and there must
 * not be one.
 */

export const skillAreaDescriptions = {
  greeting:
    "Letting somebody know they have been noticed — with words, a wave, a nod, or a sign.",
  introducing:
    "Saying who you are, and giving the other person something easy to answer.",
  including:
    "Reading a group that is already busy, and finding a way in that works for everybody.",
  listening:
    "Staying with what somebody is saying, and showing it, without having to sit still or stare.",
  ending:
    "Leaving a conversation kindly, instead of drifting away or waiting to be released.",
  review:
    "Putting the pieces together in a longer situation, and trying it for real away from the screen.",
} satisfies Record<SkillArea, string>;

export type PublicSkill = {
  area: SkillArea;
  label: string;
  description: string;
};

export const publicSkills: readonly PublicSkill[] = skillAreas.map((area) => ({
  area,
  label: skillAreaLabels[area],
  description: skillAreaDescriptions[area],
}));
