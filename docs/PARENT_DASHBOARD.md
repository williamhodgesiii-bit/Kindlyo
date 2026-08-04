# Parent Dashboard

What a parent sees, and the lines it must not cross. Profiles are covered in
`PROFILES.md`; the lesson machinery in `LESSON_ENGINE.md`.

## The five questions

The dashboard exists to answer five things, and deliberately nothing else.
`src/features/lessons/childDashboard.ts` derives all of them in one pure
function so the screen only lays them out.

| Question                            | Answered by          | Shown as              |
| ----------------------------------- | -------------------- | --------------------- |
| What has my child practised?        | `path`, `skillAreas` | Progress, Skill areas |
| What should we practise next?       | `path.resume`        | "Next up"             |
| Which offline mission is active?    | `activeMission`      | Current mission       |
| Where did they want more context?   | `talkingPoints`      | Worth talking about   |
| When did my child last use the app? | `lastActiveAt`       | "Last used"           |

## The vocabulary

Four words, and no others:

- **Practised** — the lesson was finished
- **Exploring** — the lesson is part-way through
- **Ready to review** — every lesson in a skill area has been through once
- **Not started yet** — nothing here has been opened

There is no score, no grade, no percentage, no streak, no ranking, and no word
about a child's character. `docs/CURRICULUM_PRINCIPLES.md` rules out moral
scoring, and a dashboard is exactly where it would creep back in — so the type
`PracticeStatus` is a closed union with nowhere to put "good", and there is no
numeric field that means "how well".

Nor does anything claim an outcome. "Practised saying hello" is a fact about a
lesson. "Is more confident" would be a claim we have no basis for, and we do not
make it (CLAUDE.md, "Content status"). Skill areas carry a line saying they
describe the lessons, not the child.

Unit tests assert the absence of the banned vocabulary, and an end-to-end test
scans the rendered page for it.

## "Worth talking about"

The only panel that looks back at what a child chose. It lists moments where
they picked a `needs_context` option — a choice that works in some situations
and not others.

It is framed as a conversation, never a correction. The panel says outright
that these are not wrong answers, shows what the child chose, and offers the
lesson's own question to ask. `helpful` and `mixed` choices are not listed at
all: the lesson already explained those, and a list of everything a child
picked would read as surveillance.

Choices come from the saved run and are version-strict, like resuming: a run
recorded against different content no longer describes the scenes the lesson
has, so it is skipped rather than shown against the wrong question.

## One child at a time

The child selector is a tablist at the top, and only the selected child's
panels render. Two reasons:

1. Five questions answered well about one child beats five answered vaguely
   about three.
2. A screen showing every child's numbers side by side is how a dashboard
   becomes a league table. There is no sibling comparison anywhere here, and an
   end-to-end test asserts only one progress bar is ever on the page.

**The selector is local component state, not the `/learn` profile selection.** A
parent glancing at how Ben got on must not silently change who the tablet
thinks is learning. A test covers exactly that.

## Activity timestamps

`LessonProgressEntry.updatedAt` records the last thing the _child_ did on a
lesson. A parent marking a mission does not move it — "when did my child last
use the app" should not be answered by the parent's own visit. Replaying a
finished lesson does move it, while leaving the original completion alone:
a visit is not a new achievement, but it is still a visit.

Shown as plain language ("today", "3 days ago", "a while ago") rather than a
timestamp. The wording tops out at "a while ago" on purpose — no "you have not
practised in three weeks", nothing that reads as a telling-off.

## Skill areas

`Lesson.skillArea` groups the eight lessons into six areas for the summary.
It is a closed union of _practice areas_, never traits: there is no "polite" or
"confident" member and there must not be, because that would turn a summary of
what was practised into a report card on who somebody is.

| Area          | Lessons                                 |
| ------------- | --------------------------------------- |
| `greeting`    | Saying hello                            |
| `introducing` | Introducing yourself, Remembering names |
| `including`   | Meeting someone new, Joining a group    |
| `listening`   | Listening while someone speaks          |
| `ending`      | Leaving a conversation                  |
| `review`      | Review and real-world challenge         |

## States

- **No profiles** — the "Add a child" empty state.
- **Profile with no activity** — a named empty state saying what will appear
  here, with a link into the learning area. No nagging, no "should".
- **Loading** — a skeleton, because progress is only knowable after hydration.

## Accessibility and responsiveness

Checked end-to-end, since jsdom has no layout engine:

- One `h1`, and a heading outline that never skips a level.
- The child selector is a labelled `tablist` with `aria-selected` maintained.
- Every control has an accessible name; several are set explicitly because the
  visible label repeats across panels.
- Every touch target clears 44×44.
- No horizontal scroll at 375, 768, or 1280 pixels, and every panel reachable
  on a phone.
