# Changelog

A record of what reached `main`, one section per shipping day. Each entry is
written by `scripts/day.sh ship`, which lists the commits merged that day and
the commit the day shipped from, so a day's exact state stays recoverable after
its branch is deleted. Shipping days are also tagged `ship/YYYY-MM-DD` where the
host allows it — see `docs/DAILY_WORKFLOW.md`.

Newest first.

<!-- new-entries-below -->

## 2026-08-06

- feat(design): system states — loading, resume, recoverable error (handoff step 6)
- Shipped from `fe2a495` (`claude/step-4-lesson-runner-p4qtf9`)
- test(e2e): isolate the shell footer spec with its own parent
- feat(design): character rig & Glim (handoff step 5)
- Shipped from `3ae03f8` (`claude/step-4-lesson-runner-p4qtf9`)
- feat(design): lesson runner — scene stage & celebration (handoff step 4)
- Shipped from `be3642d` (`claude/step-4-lesson-runner-p4qtf9`)
- chore(design): add Little Learner's Club design handoff bundle
- feat(design): port Little Learner's Club design tokens (handoff step 1)
- feat(design): shell & navigation + self-hosted fonts (handoff step 2)
- feat(design): neighborhood map (handoff step 3)
- Shipped from `98b73cc` (`claude/little-learners-design-impl-e0rxsx`)
- Add Stripe web subscription foundation
- Shipped from `bb27862` (`claude/stripe-subscription-foundation-anoec3`)

## 2026-08-05

- Migrate family and progress data from local storage to PostgreSQL
- Shipped from `0c3d839` (`claude/database-migration-postgres-6395pe`)
- Add real parent authentication (Supabase Auth) with route gating
- Shipped from `6623b9b` (`claude/parent-authentication-k2e8bx`)
- Build the public marketing site
- Shipped from `2c26d22` (`claude/kindlyo-marketing-site-z87nm4`)

## 2026-08-04

- Make the release marker survive hosts that refuse tags
- Shipped from `a85225a` (`claude/lesson-engine-vertical-slice-kv7bi3`)
- Build the parent dashboard around five questions
- Add the parent onboarding and child-profile prototype flow
- Add the local progress system for the Meeting People module
- Build the lesson-engine vertical slice with lesson one
- Add the Kindlyo design system and component gallery
- Keep next dev from rewriting CLAUDE.md on every run

## 2026-08-03

- Scaffold Kindlyo repository structure and documentation
- Add technical foundation and application shell
- Add daily branch workflow, changelog, and stale branch cleanup
- Push main before tagging so a restricted tag cannot block a release
- Allow tag pushes and branch deletion from hosted sessions via a GH_PAT token
