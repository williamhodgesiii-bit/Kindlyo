# CLAUDE.md

## Product

This repository contains Kindlyo, a responsive learning platform that teaches
children ages 5–9 social confidence, kindness, manners, communication, and
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

## Working process

For every substantial task:

1. Read the relevant files in `/docs`.
2. Inspect the existing implementation.
3. Enter planning mode before editing.
4. State assumptions.
5. Identify affected files.
6. Identify risks and privacy implications.
7. Create a small implementation plan.
8. Implement one coherent vertical slice.
9. Add or update tests.
10. Run verification commands.
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
- Lint passes.
- Typecheck passes.
- Tests pass.
- Production build passes.
- Documentation is updated where appropriate.
