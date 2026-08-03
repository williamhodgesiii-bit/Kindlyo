# Prompt 06 — Parent Dashboard

## Goal

Give parents a calm view of progress and the next suggested offline mission.
Corresponds to Roadmap Phase 4.

## Read first

- `docs/USER_JOURNEYS.md` (Journey 5)
- `docs/DESIGN_SYSTEM.md`
- `docs/ANALYTICS.md`

## Task

1. Build the parent dashboard showing, per child: completed lessons, current
   position, and mission status.
2. Surface the next suggested offline mission and parent coaching prompt.
3. Emit the relevant first-party analytics events (e.g. `dashboard.viewed`).
4. Handle a clear empty state for a brand-new profile.

## Constraints

- No public rankings, streak shaming, or dense dashboards.
- Only first-party analytics; no full child names or free-form child speech.
- Scope all data to the authenticated parent's family.

## Definition of done

- Dashboard shows completed lessons and mission status accurately.
- Empty, loading, and error states handled.
- Component tests cover the mission cards and progress display.
- Lint, typecheck, tests, and build pass.
