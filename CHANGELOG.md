# Changelog

A record of what reached `main`, one section per shipping day. Each entry is
written by `scripts/day.sh ship`, which lists the commits merged that day and
the commit the day shipped from, so a day's exact state stays recoverable after
its branch is deleted. Shipping days are also tagged `ship/YYYY-MM-DD` where the
host allows it — see `docs/DAILY_WORKFLOW.md`.

Newest first.

<!-- new-entries-below -->

## 2026-08-10

- Add tactile press-squish to choice cards (MOTION.md touch feedback)
- Simplify 'Saying hello' copy for ages 5-9; add safety-spine guard test
- Harden 'Saying hello' safety spine per review: unconditional refusal, salience ordering, direction-pinning guard test
- Affirm waving equally with speaking ('That helps') so silent greetings never read as lesser
- Bring lesson characters to life: opt-in idle breathe/blink + one-shot greeting reaction on the rig
- Reconcile dashboard with new design (waiting is the it-depends talking point) + put idle motion on tokens with rest-between-breaths
- Drive the waiting choice in the dashboard e2e so the talking-point still appears
- Shipped from `3632e37` (`claude/ios-app-development-tbfap6`)
- content(meeting-people): draft rehearsal cues for the rest of module 1
- content(meeting-people): revise rehearsal cues per safety + story-motion review
- Shipped from `4dfad57` (`claude/routine-todo-approvals-f9dxdh`)

## 2026-08-09

- refactor(lesson): retire the parallel scene-drawing system
- Shipped from `95d63c9` (`claude/routine-todo-approvals-f9dxdh`)
- feat(pwa): make Kindlyo installable — manifest, generated icons, no service worker
- feat(lesson): scenes look like their place — scene archetypes
- feat(child): build the "Me" page — a keepsake garden of practised lessons
- feat(lesson): add an authored per-option rehearsal cue to the practice step
- feat(lesson): give the explanation step a clear hierarchy and honest reduced-motion
- feat(marketing): add a warm, decorative hero illustration to the homepage
- feat(lesson): give the offline mission three clear beats and a decorative scene
- docs(decisions): renumber merged PWA/scenes/practice decisions to 043/044/045
- Shipped from `9c334ee` (`claude/routine-todo-approvals-f9dxdh`)

## 2026-08-07

- ci(ship): run e2e by default and serialize the suite (close decision 041's gap)
- Shipped from `88b4b3d` (`claude/e2e-required-in-ship`)
- feat(content): author worlds 2–12 and connect the neighborhood (handoff step 8)
- Shipped from `bb4af64` (`claude/learners-club-content-pass-quwpym`)
- Add project-specific Claude Code agent definitions
- Shipped from `c04b67a` (`claude/2026-08-07`)
- feat(design): parent Missions & Skills sections — finish step 7
- Shipped from `f9cbadc` (`claude/next-design-step-crrz43`)
- feat(design): parent account — data export & account deletion (handoff step 7)
- Shipped from `6c3b4ed` (`claude/next-design-step-crrz43`)
- feat(design): "Ask a grown-up" parental gate & safe return (handoff step 7)
- Shipped from `857bbab` (`claude/next-design-step-crrz43`)

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
