import { skillAreaLabels, type SkillArea } from "@/features/curriculum/schema";

/**
 * Public descriptions of the six Meeting People skill areas.
 *
 * Deliberately only the flagship module's six areas — not the whole `SkillArea`
 * union. The other neighborhood worlds (2–12) are authored but still draft, and
 * the marketing site stays narrow on purpose ("one module done properly"): it
 * describes what has actually shipped, not the whole map. The learning area and
 * the parent dashboard use the full union; this public list does not grow with
 * it. When a world is ready to be advertised, add its area here on purpose.
 *
 * The labels still come from the schema rather than being retyped, and the keys
 * are pinned to the Meeting People subset with `satisfies`, so a typo or a
 * removed area is still caught.
 *
 * These describe areas of *practice*, never traits of a child, for the reason
 * given in `schema.ts`: there is no "polite" or "confident" area and there must
 * not be one.
 */

const meetingPeopleAreas = [
  "greeting",
  "introducing",
  "including",
  "listening",
  "ending",
  "review",
] as const satisfies readonly SkillArea[];

type MeetingPeopleArea = (typeof meetingPeopleAreas)[number];

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
} satisfies Record<MeetingPeopleArea, string>;

export type PublicSkill = {
  area: SkillArea;
  label: string;
  description: string;
};

export const publicSkills: readonly PublicSkill[] = meetingPeopleAreas.map(
  (area) => ({
    area,
    label: skillAreaLabels[area],
    description: skillAreaDescriptions[area],
  }),
);
