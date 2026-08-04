# Lesson Engine

How a lesson is stored, validated, and played. Written alongside the first
vertical slice — lesson one, "Saying hello".

Design intent for the content itself lives in `CURRICULUM_PRINCIPLES.md`; the
content model lives in `CONTENT_SCHEMA.md`. This file describes the machinery.

## Shape of it

```text
src/content/
├── modules.ts              the module outline (eight titles from MVP_SCOPE)
└── lessons/
    ├── saying-hello.ts     authored content, one file per lesson
    ├── …                   lessons 2-8
    └── index.ts            validates every lesson at import

src/features/curriculum/
├── schema.ts               the types content is authored against
├── validate.ts             runtime validation, collects all issues
├── catalog.ts              read access + the draft-visibility rule
└── fixtures.ts             a minimal valid lesson, for tests

src/features/lessons/
├── steps.ts                lesson -> ordered steps
├── lessonMachine.ts        progression rules, as a pure reducer
├── moduleProgress.ts       progress -> locked/available/in-progress/complete
├── progressStorage.ts      per-profile progress in local storage
├── useLessonRun.ts         binds the reducer to a lesson and to storage
└── useModulePath.ts        reads one child's path after mount

src/features/profiles/
├── types.ts                a nickname and an age band, nothing else
├── profileStorage.ts       local demo profiles, capped at three
└── useFamily.ts            client access to profiles and the selection

src/components/lesson/
├── LessonRunner.tsx        the profile gate, then the renderer
├── illustrations.tsx       local SVG scenes, keyed by illustrationKey
└── steps/                  one view per step kind

src/components/path/LearningPath.tsx    who is learning, and where they are
src/components/parent/ParentDashboard.tsx   profiles, missions, reset, delete
src/components/shells/LessonShell.tsx   title, progress, step region, footer
```

Pages resolve a slug through `catalog.ts` and hand a `Lesson` to
`LessonRunner`. Nothing else imports `src/content` directly.

## Progression model

`buildLessonSteps(lesson)` turns content into an ordered list of steps. The
order is the lesson structure from `CURRICULUM_PRINCIPLES.md`:

```text
scene… ─▶ principle ─▶ practice ─▶ mission ─▶ coaching ─▶ completion
```

Scene steps are derived from `lesson.scenes`, so a lesson with three story
beats and two decisions produces exactly those steps. A scene with `choices`
becomes a `choice` step; one without becomes a `scene` step. For lesson one
that is seven steps.

State is a plain object, moved by a pure reducer in `lessonMachine.ts`:

```ts
type LessonProgress = {
  stepIndex: number;
  choiceBySceneId: Record<string, string>;
  practiceOptionId: string | null;
  completedAt: string | null;
};

type LessonRunState = LessonProgress & { hydrated: boolean };
```

Transitions:

| Action     | Guard                                     | Effect                                                       |
| ---------- | ----------------------------------------- | ------------------------------------------------------------ |
| `choose`   | current step is that decision; id is real | records the choice                                           |
| `practise` | current step is the practice step         | records the option                                           |
| `next`     | `canAdvance`, and not already at the end  | `stepIndex + 1`; sets `completedAt` on arrival at completion |
| `back`     | `stepIndex > 0`                           | `stepIndex - 1`, keeping every answer                        |
| `restart`  | —                                         | back to empty progress                                       |
| `hydrate`  | not already hydrated                      | applies saved progress, or just unblocks rendering           |

`canAdvance` is false on a decision with no choice made and on the practice
step with no option picked. Everything else is read-only and always ready.
The completion step is terminal.

Deliberate choices worth keeping:

- **Back never erases an answer.** A child re-reading the story should not lose
  their place.
- **A choice can be changed while its step is on screen.** Trying another and
  reading what happens is the lesson working, not cheating.
- **`completedAt` is written once**, and the caller supplies the timestamp, so
  the reducer stays pure.
- **`hydrate` lives in the machine** rather than a `useState` beside it, so
  restoring saved progress is one transition instead of two racing updates.

## Module progression

`buildModulePath(module, getLesson, progress)` derives one child's view of the
module: every lesson as `locked`, `available`, `in-progress`, `complete`, or
`unwritten`, plus the finished count and where "Continue" should go. Pure, like
the lesson reducer, so the unlock rules live in one tested place.

The rules:

- The first written lesson is always available.
- **Completing a lesson unlocks the next one.** Nothing else does — a
  half-finished run leaves the next lesson locked.
- Complete beats in-progress: replaying a finished lesson leaves it complete,
  and finished lessons stay open. Locking a child out of a story they liked
  would be a punitive mechanic.
- A saved run counts as in-progress only if it matches the current lesson
  version. A stale run cannot be resumed, so it must not claim "Continue".
- Unwritten entries are shown as "being written" and skipped by the chain: a
  child is never locked out by our authoring backlog.

Locked rows render information, not a control. There is no button to press and
be refused, the wording is a direction ("Finish lesson 2 first") rather than a
demerit, and the state is carried in words as well as by the icon.

## Progress, per child

Progress belongs to a child profile, and one child's progress must never appear
for another. That is enforced in the store rather than in the screens: every
read and write in `progressStorage.ts` takes a `profileId` first, and the file
is nested `{ [profileId]: { [lessonId]: entry } }`.

An entry holds up to three things:

| Field           | Written by                     | Version rule                                    |
| --------------- | ------------------------------ | ----------------------------------------------- |
| `run`           | the lesson, as it is played    | strict — resumed only on an exact version match |
| `completion`    | reaching the completion step   | recorded, but survives a revision               |
| `missionStatus` | the parent, from the dashboard | none                                            |

The two version rules differ on purpose. A `run` points at a step that may have
moved, so a revision discards it. A `completion` is an achievement; a content
edit must not silently erase a child's finished lessons, or re-lock what they
had opened.

Profiles themselves live in `src/features/profiles/`: a nickname, an age band,
an id, and a created-at date — no legal name, no birthday, no photograph
(`PRIVACY_AND_SAFETY.md`). Up to three per family, enforced in the store.

## Content validation

`parseLesson` runs over every authored lesson when `src/content/lessons` is
imported — which the lesson pages do, so malformed content fails `next build`
rather than reaching a child's screen. It collects every problem at once and
reports each with a path.

TypeScript is not enough on its own. The rules that matter are curriculum
rules, not shapes:

- A decision needs **two or more** options.
- A scene with choices needs a prompt.
- A lesson needs at least one scene with a decision in it.
- A principle needs at least one context point.
- Cultural, accessibility, and safety notes are all required.
- `status` must stay `draft` until `reviewedBy` **and** `reviewedAt` are
  recorded, so the interface can never imply review that has not happened.
- `illustrationKey` must be a local key, never a URL.

## Draft visibility

`CONTENT_SCHEMA.md` requires that draft lessons not appear to normal users. All
authored content is draft, and there is no user yet — accounts arrive in a
later slice — so `canViewDraftContent()` currently returns `true` and every
lesson carries a visible `ContentStatusBadge` reading "Draft".

That function is the single place this changes. When accounts exist it becomes
a role check, and `getLessonBySlug` starts returning `undefined` for drafts,
which the route already turns into a 404 through the same path as an unknown
slug.

## Demo progress

`progressStorage.ts` keeps `{ stepIndex, choice ids, practice option id,
completedAt }` under one local-storage key, per lesson id, tagged with the
lesson version. Nothing identifying is stored: no name, no age, no free text.

It is defensive throughout, because local storage can be absent, disabled,
full, or full of something an older build wrote. Anything unreadable is
discarded and the lesson starts fresh. Progress saved against a **different
lesson version** is discarded too — the step it points at may no longer be the
step it meant.

Real progress belongs to a child profile in the database and arrives with the
persistence slice. This is scaffolding, and the storage key says so.

## Renderer

`LessonRunner` switches on `step.kind` and nothing else. There is no
`if (lesson.slug === …)` anywhere in the component tree, and there must not be:
adding lesson two means authoring content, not editing components.

Accessibility work the engine owns:

- Focus moves to the step region when the step changes — but not on first
  render, so arriving on the page does not steal focus.
- "Next" is disabled with a plain-language reason beside it ("Choose one to
  carry on"), rather than silently doing nothing.
- Illustrations are `aria-hidden` and decorative; the narration carries the
  situation. Nothing is understandable only through the picture.
- Feedback carries an icon and a text title, never colour alone.

## Edge cases handled

| Case                                        | Behaviour                                                |
| ------------------------------------------- | -------------------------------------------------------- |
| Unknown lesson slug                         | 404                                                      |
| Draft lesson, viewer may not see drafts     | 404, through the same path as unknown                    |
| Saved step index beyond the lesson          | clamped to the last step                                 |
| Saved choice id no longer in the content    | dropped; the step asks again                             |
| Saved progress from an older lesson version | discarded; lesson starts fresh                           |
| Corrupt or tampered local storage           | ignored; lesson starts fresh                             |
| Local storage disabled or full              | lesson runs, progress is simply not saved                |
| Unknown `illustrationKey`                   | neutral placeholder drawing, no error                    |
| Reload mid-lesson                           | resumes on the same step, with answers intact            |
| Before storage has been read                | skeleton, so step one never flashes                      |
| No profile selected                         | the lesson asks who is learning, and links to the picker |
| Lesson not unlocked for this child          | "Not this one yet", with the way back                    |
| Profile deleted                             | its progress goes with it; selection clears              |
| Selection pointing at a deleted profile     | resolves to nobody, never to another child               |
| More than three profiles in storage         | capped on read, so a hand edit cannot widen it           |

## Acceptance criteria

The slice is done when all of these hold, and they do:

1. Lesson one is stored as structured, typed content and validated at import.
2. A reusable renderer plays it: story scene, three choices with contextual
   feedback, principle, rehearsal, offline mission, parent coaching,
   completion.
3. No lesson-specific logic lives in any UI component.
4. Illustrations are local shapes; no remote image is requested anywhere.
5. Progress survives a reload, and cannot be resumed across a version change.
6. A decision cannot be skipped; neither can the rehearsal.
7. Nothing marks a child's choice right or wrong.
8. Draft status is visible wherever the lesson appears.
9. Unit tests cover progression, choice feedback, validation, and storage; one
   Playwright spec runs the lesson start to finish in a production build.
10. Lint, typecheck, unit tests, e2e, and `next build` all pass.

## The review activity

Lesson 8, "Review and real-world challenge", is the module's review: two
decision scenes that revisit the earlier principles inside one new story, plus
the real-world challenge as its offline mission. It uses the ordinary lesson
schema — no separate quiz machinery — which is why there is no review engine in
this directory. Spaced review across sessions (`reviewQuestionIds`, still
empty) is a later slice.

## Not in this slice

Authentication, database persistence, subscriptions, spaced review, and any
module beyond "Meeting People". Profiles and progress are local to one browser:
they are per-device, shared by anyone using it, and lost when storage is
cleared. That is acceptable for demo progress and not acceptable for real
progress — the database slice replaces both stores.
