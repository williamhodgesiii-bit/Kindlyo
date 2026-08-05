# Changelog

A record of what reached `main`, one section per shipping day. Each entry is
written by `scripts/day.sh ship`, which lists the commits merged that day and
the commit the day shipped from, so a day's exact state stays recoverable after
its branch is deleted. Shipping days are also tagged `ship/YYYY-MM-DD` where the
host allows it — see `docs/DAILY_WORKFLOW.md`.

Newest first.

<!-- new-entries-below -->

## 2026-08-05

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
