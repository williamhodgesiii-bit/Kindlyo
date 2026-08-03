# User Journeys

These journeys describe the primary paths through the MVP. They are derived from
`PRODUCT_BRIEF.md`, `MVP_SCOPE.md`, and `ARCHITECTURE.md`. They are not a
complete interaction specification; they define the happy paths and the most
important edge cases the MVP must handle.

## Actors

- **Parent / guardian** — owns the account, pays, and supervises.
- **Child (ages 5–9)** — the learner, who acts only within a parent-controlled
  session. Children never authenticate independently.

## Journey 1: Prospective parent evaluates Kindlyo

**Goal:** Understand what Kindlyo is and decide whether to sign up.

1. Parent lands on the marketing homepage.
2. Parent reads the product explanation and core promise.
3. Parent tries the sample interactive scenario without an account.
4. Parent reviews the privacy and safety explanation.
5. Parent sees a pricing placeholder.
6. Parent joins the waitlist or creates an account.

**Success:** Parent creates an account or joins the waitlist.
**Key edge cases:** Sample scenario works with no account; leaving mid-sample
loses nothing sensitive.

## Journey 2: Parent onboarding and first child profile

**Goal:** Get set up and ready to hand a first lesson to a child.

1. Parent signs in.
2. Parent completes a short onboarding.
3. Parent creates a child profile (nickname and age band only — no legal name,
   no birth date).
4. Parent may create up to three child profiles.
5. Parent is shown how to start the first lesson and what the offline mission is.

**Success:** At least one child profile exists and the first lesson is reachable.
**Key edge cases:** Attempting a fourth profile is blocked with a clear message;
onboarding can be resumed if interrupted.

## Journey 3: Child completes a lesson (parent-supervised)

**Goal:** The child works through one lesson end to end.

1. Parent selects the child profile.
2. Child sees the learning path and opens the next available lesson.
3. Child moves through the lesson: story → choice → consequence/feedback →
   principle → guided practice.
4. Child reaches the completion celebration.
5. The lesson's offline mission is presented for the parent and child.
6. Progress is saved, including the lesson version completed.

**Success:** Lesson is marked complete and progress persists.
**Key edge cases:** Closing mid-lesson resumes at the correct scene; draft
lessons never appear in the path; feedback never shames the child.

## Journey 4: Offline mission and return visit

**Goal:** Practice the skill in the real world, then come back.

1. Parent views the suggested offline mission and the parent coaching prompt.
2. Family completes the mission away from the screen.
3. Parent returns and marks the mission complete.
4. On the next visit, the learning path continues from the correct point, with
   review surfaced when appropriate.

**Success:** Mission is recorded and the next session resumes correctly.
**Key edge cases:** A mission can be skipped without blocking progress; returning
after a long gap still resumes at the right place.

## Journey 5: Parent reviews progress

**Goal:** See what the child has done and what to do next.

1. Parent opens the parent dashboard.
2. Dashboard shows completed lessons, current position, and mission status.
3. Dashboard surfaces the next suggested offline mission.

**Success:** Parent can see the completed lesson and mission at a glance.
**Key edge cases:** Empty state is handled clearly for a new profile; the
dashboard stays calm and low-pressure (no streak shaming or rankings).

## Journey 6: Data control

**Goal:** Parent stays in control of family data.

1. Parent opens account settings.
2. Parent can delete a child profile, delete lesson progress, delete the
   account, or request a data export.

**Success:** Each action completes with clear confirmation and correct scoping.
**Key edge cases:** Deletion requires confirmation; a parent can only ever act on
their own family's data.

## Cross-cutting requirements

- Every protected screen verifies family membership server-side.
- Every screen handles loading, empty, and error states.
- Every interaction is keyboard operable and respects reduced-motion.
- No journey exposes a child to advertising, public profiles, or messaging.
