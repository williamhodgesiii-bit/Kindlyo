# Prompt 11 — Quality and Security

## Goal

Harden the MVP for accessibility, security, and privacy. Corresponds to Roadmap
Phase 7.

## Read first

- `docs/TESTING_STRATEGY.md`
- `docs/PRIVACY_AND_SAFETY.md`
- `docs/DESIGN_SYSTEM.md` (accessibility requirements)

## Task

1. Run an accessibility audit across the core flows and fix issues.
2. Review authorization coverage: cross-family, cross-profile, unauthenticated,
   and draft-lesson access.
3. Review input validation and secret handling.
4. Confirm the end-to-end critical flow from `TESTING_STRATEGY.md` is covered.
5. Add error monitoring and confirm error, loading, and empty states everywhere.

## Constraints

- No third-party tracking or advertising.
- Validate all external input; keep secrets server-side.
- Preserve safety-first curriculum behavior.

## Definition of done

- Accessibility issues on core flows resolved.
- Authorization tests pass for all four cases.
- Critical end-to-end flow is green.
- Lint, typecheck, tests, and build pass.
