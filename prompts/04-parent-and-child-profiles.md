# Prompt 04 — Parent and Child Profiles

## Goal

Let a parent create a family and manage child profiles behind their account.
Corresponds to Roadmap Phase 3.

## Read first

- `docs/ARCHITECTURE.md` (data entities, authorization principles)
- `docs/PRIVACY_AND_SAFETY.md`
- `docs/USER_JOURNEYS.md` (Journey 2)

## Task

1. Implement family creation tied to the authenticated parent.
2. Allow creating up to three child profiles per family.
3. Store nicknames and age bands only — no legal names, no birth dates.
4. Build the child profile selection screen behind the parent account.
5. Enforce authorization: a parent can only see and edit their own family.

## Constraints

- Never trust a family or child identifier supplied by the browser.
- Scope every query to the authenticated parent.
- Handle the limit of three profiles with a clear message.
- Children never authenticate independently.

## Definition of done

- Parent can create, select, and manage child profiles within limits.
- Authorization tests prove cross-family and cross-profile access is blocked.
- Loading, empty, and error states handled.
- Lint, typecheck, tests, and build pass.
