# Prompt 03 — Lesson Engine

## Goal

Build the core learning loop that renders a lesson from structured content.
Corresponds to Roadmap Phase 2.

## Read first

- `docs/CONTENT_SCHEMA.md`
- `docs/CURRICULUM_PRINCIPLES.md`
- `docs/DESIGN_SYSTEM.md`

## Task

1. Implement the `Lesson` content model from `CONTENT_SCHEMA.md`.
2. Add content validation for lessons.
3. Build the lesson renderer that drives the standard flow: story → choice →
   consequence/feedback → principle → guided practice → completion.
4. Present the offline mission and parent coaching prompt.
5. Author one hardcoded draft lesson (from the "Meeting People" module) as data.
6. Handle resume-at-scene, loading, empty, and error states.

## Constraints

- UI renders lesson data only; no curriculum-specific logic in components.
- Feedback language follows `CURRICULUM_PRINCIPLES.md`: no shame, no moral
  scoring, safety and consent first.
- Draft content must not be reachable by normal users.
- Record the lesson version on completion.

## Definition of done

- A child can complete the sample lesson end to end.
- Content validation rejects malformed lessons.
- Tests cover progression, choice selection, and completion.
- Lint, typecheck, tests, and build pass.
