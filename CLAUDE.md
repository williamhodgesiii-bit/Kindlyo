# CLAUDE.md

## Product

This repository contains Little Learner's Club, a responsive learning platform
that teaches children ages 5–9 social confidence, kindness, manners,
communication, and
context-aware etiquette.

The paying and account-owning user is the parent or guardian.

Children do not create independent accounts.

## Current product stage

We are building an MVP.

The MVP must prove one central hypothesis:

Parents and children will repeatedly use short, scenario-based lessons and
real-world missions to practice social skills.

Do not expand the scope beyond the approved MVP without explicit instruction.

## Product principles

1. Teach confidence and consideration, not obedience.
2. Explain why a behavior helps other people.
3. Recognize that etiquette varies by culture and context.
4. Politeness never overrides safety, consent, accessibility, or bodily autonomy.
5. Avoid shame, punishment, public rankings, and moral scoring.
6. Prefer realistic situations over abstract quizzes.
7. Every lesson should connect to an offline behavior.
8. Parent participation should be useful but lightweight.

## Target audience

Primary learner:

- Children ages 5–9

Primary customer:

- Parents and guardians

Future users, but not part of the initial MVP:

- Tweens
- Teens
- Adults
- Schools
- Employers

## MVP restrictions

Do not add any of the following unless explicitly approved:

- Public child profiles
- Child-to-child messaging
- Social feeds
- Public leaderboards
- Advertising
- Third-party advertising SDKs
- Behavioral advertising
- AI chat companions
- AI-generated published curriculum
- Facial recognition
- Voiceprint identification
- Precise location collection
- Contact-list access
- Separate child login credentials
- Native mobile applications
- School administration features
- Adult curriculum
- Multiple languages

## Technical expectations

- Use TypeScript with strict mode.
- Prefer simple, boring, maintainable architecture.
- Use accessible semantic HTML.
- Ensure keyboard navigation.
- Support reduced-motion preferences.
- Use responsive layouts.
- Avoid unnecessary dependencies.
- Validate all external input.
- Keep server-only secrets out of client code.
- Write tests for critical behavior.
- Run lint, typecheck, tests, and production build before declaring completion.
- Never claim a task is complete when checks are failing.
- Do not silently change product requirements.

## Session workflow

Handle the branch bookkeeping yourself; the user should not have to ask.

- At the start of a session, run `scripts/day.sh start` to move onto that day's
  `claude/YYYY-MM-DD` branch. If the session begins on a different branch with
  work already on it, say so and confirm before switching.
- Commit and push as you go with `scripts/day.sh save "message"`.
- When the user says they are finished for the day, or asks to ship or release,
  run `scripts/day.sh ship`. It runs every check before merging to `main` and
  stops if any fail. Never bypass it with `SKIP_CHECKS=1` unless asked.
- Do not push directly to `main` by hand. `ship` is the only route.

See `docs/DAILY_WORKFLOW.md` for the full description.

`scripts/day.sh start` always fetches `origin/$MAIN_BRANCH` before branching.
Never hand-run `git checkout -b <branch> main` from whatever the local `main`
ref happens to point at — if it hasn't been fetched recently it can be stale
and missing files a later commit added, `.claude/agents/` included. Losing
those files mid-session has deregistered the custom agents below for the
rest of a session before; always fetch `origin/main` first if you branch by
hand instead of through the script.

## Custom agents

Five project-specific agents live in `.claude/agents/`. Use them — don't do
their job inline in the main session:

- **kindlyo-planner** — turns a plain-English goal into a vertical slice
  before any code changes: acceptance criteria, affected files, risks. Use
  it for steps 3–7 of the working process below on anything nontrivial.
- **child-learning-researcher** — pedagogy and lesson-design research (age
  5–9 appropriateness, story and choice design, spaced review). Use it
  before authoring or changing curriculum content.
- **safety-skeptic** — adversarial review of privacy/COPPA, consent,
  cultural assumptions, accessibility, shame/obedience framing, moral
  scoring, and MVP scope creep. Use it on anything privacy-relevant,
  safety-relevant, or curriculum-touching, before calling the work done.
- **story-motion-reviewer** — reviews story and motion changes (narrative,
  characters, dialogue, animation) for overstimulation, manipulative
  rewards, and reduced-motion support. Use it on any content or animation
  change.
- **qa-gate** — runs the required checks (lint, format:check, typecheck,
  test, test:e2e, build) and reports pass/fail. It cannot edit, fix, or
  bypass anything. Use it instead of running checks by hand at step 10 below
  and before declaring a task complete.

If a task genuinely fits none of the five, say so and proceed directly —
don't force a fit. Otherwise, default to the matching agent rather than
doing its job yourself.

## Working process

For every substantial task:

1. Read the relevant files in `/docs`.
2. Inspect the existing implementation.
3. Enter planning mode before editing; for anything nontrivial, run it
   through `kindlyo-planner` first.
4. State assumptions.
5. Identify affected files.
6. Identify risks and privacy implications; get a `safety-skeptic` pass on
   anything privacy- or safety-relevant.
7. Create a small implementation plan.
8. Implement one coherent vertical slice.
9. Add or update tests.
10. Run verification through the `qa-gate` agent rather than by hand.
11. Summarize changes and unresolved issues.

## Design expectations

The experience should feel:

- Warm
- Calm
- Welcoming
- Modern
- Encouraging
- Playful without feeling overstimulating
- Child-friendly without alienating adults

Avoid copying the branding, characters, layouts, sounds, or proprietary
interaction patterns of existing educational products.

## Content status

All curriculum content is draft content until reviewed by qualified humans.

Use visible internal metadata to identify:

- Draft content
- Reviewed content
- Published content

Never imply professional, psychological, educational, or clinical validation
unless it has actually occurred.

## Definition of done

A feature is complete only when:

- Acceptance criteria are met.
- Error states are handled.
- Loading and empty states are handled.
- Accessibility has been considered.
- Tests cover critical behavior.
- Verification (lint, typecheck, tests, production build) was run through
  the `qa-gate` agent, not by hand, and it reports GREEN.
- Privacy- or safety-relevant changes, and any curriculum change, carry a
  `safety-skeptic` pass.
- Documentation is updated where appropriate.
