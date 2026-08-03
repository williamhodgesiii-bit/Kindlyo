# Prompt 09 — Database

## Goal

Model and persist the domain entities with strict access scoping. Corresponds to
Roadmap Phases 3–4.

## Read first

- `docs/ARCHITECTURE.md` (data entities, authorization principles)
- `docs/CONTENT_SCHEMA.md`
- `docs/PRIVACY_AND_SAFETY.md`

## Task

1. Define schema and migrations for: User, Family, FamilyMembership,
   ChildProfile, Module, Lesson, LessonVersion, LessonProgress,
   MissionCompletion, Subscription, AnalyticsEvent.
2. Enforce row-level access scoping so a parent can only reach their family's
   data.
3. Store published lesson content immutably and version revisions.
4. Support deletion and data export (child profile, progress, account).

## Constraints

- Never trust identifiers supplied by the browser.
- Separate database resources and secrets per environment.
- Store age bands, not exact birth dates; nicknames, not legal names.

## Definition of done

- Migrations run cleanly on a fresh database.
- Access scoping verified by authorization tests.
- Deletion and export paths work end to end.
- Lint, typecheck, tests, and build pass.
