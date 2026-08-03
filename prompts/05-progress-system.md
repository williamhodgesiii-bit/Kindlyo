# Prompt 05 — Progress System

## Goal

Persist learning progress and drive the learning path, resume behavior, and
review scheduling. Corresponds to Roadmap Phase 4.

## Read first

- `docs/ARCHITECTURE.md` (LessonProgress, MissionCompletion)
- `docs/CONTENT_SCHEMA.md`
- `docs/USER_JOURNEYS.md` (Journeys 3 and 4)

## Task

1. Persist lesson progress per child profile, including the lesson version.
2. Build the learning path that reflects completed and available lessons.
3. Implement resume-from-correct-point behavior across sessions.
4. Record offline mission completion.
5. Implement basic spaced review scheduling.

## Constraints

- Progress belongs to a child profile within a family; scope all access.
- Draft lessons never appear in the path.
- Keep the experience calm — no streak pressure or public ranking.

## Definition of done

- Progress persists and resumes correctly after leaving and returning.
- Mission completion is recorded and reflected in the path.
- Unit tests cover progression and completion calculations.
- Lint, typecheck, tests, and build pass.
