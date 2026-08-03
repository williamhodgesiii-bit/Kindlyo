# Prompt 01 — Project Foundation

## Goal

Stand up the application shell and tooling so every later prompt can build on a
verified foundation. Corresponds to Roadmap Phase 1.

## Read first

- `CLAUDE.md`
- `docs/ARCHITECTURE.md`
- `docs/TESTING_STRATEGY.md`

## Task

1. Initialize the Next.js + TypeScript (strict) application.
2. Add Tailwind CSS.
3. Configure linting and formatting.
4. Configure Vitest and React Testing Library for unit/component tests.
5. Configure Playwright for end-to-end tests.
6. Wire up the scripts referenced across the docs:
   `lint`, `typecheck`, `test`, `test:e2e`, `build`.
7. Create the source structure from `ARCHITECTURE.md`
   (`app/`, `components/`, `features/`, `lib/`, `server/`, `styles/`, `content/`).
8. Add continuous integration that runs the required checks.
9. Add a minimal placeholder application shell that renders.

## Constraints

- Keep dependencies minimal and boring.
- Keep server-only secrets out of client code.
- Separate config for local, preview, and production environments.

## Definition of done

- All scripts run.
- Lint, typecheck, tests, and production build pass.
- CI runs the required checks on pull requests.
- Docs updated where appropriate.
