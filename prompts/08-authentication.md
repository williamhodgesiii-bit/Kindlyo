# Prompt 08 — Authentication

## Goal

Let parents securely sign up, sign in, and access protected routes. Corresponds
to Roadmap Phase 3.

## Read first

- `docs/ARCHITECTURE.md` (authorization principles)
- `docs/PRIVACY_AND_SAFETY.md`

## Task

1. Implement parent sign-up and sign-in (Supabase auth or equivalent).
2. Manage sessions securely.
3. Protect parent, onboarding, and learn routes behind authentication.
4. Provide account recovery for the parent.

## Constraints

- Only parents authenticate; children never have credentials.
- Keep server-only secrets out of client code.
- Validate all external input.
- Do not collect more personal data than needed.

## Definition of done

- Sign-up, sign-in, sign-out, and recovery work.
- Unauthenticated users cannot reach protected routes.
- Authorization tests cover protected-route access.
- Lint, typecheck, tests, and build pass.
