# Prompt 00 — Repository Audit

## Goal

Establish an accurate picture of the repository before any building begins. This
is a read-only audit. Do not change product code.

## Read first

- `CLAUDE.md`
- All files in `docs/`

## Task

1. Inventory what currently exists in the repository.
2. Confirm the documented product scope and restrictions (`MVP_SCOPE.md`,
   `CLAUDE.md`) and note anything ambiguous.
3. Check for tooling and configuration: package manager, TypeScript, lint,
   tests, CI, environment example.
4. Identify gaps between the documented architecture (`ARCHITECTURE.md`) and the
   current state.
5. Flag any privacy or safety concerns already visible in the repo.

## Constraints

- No source changes. Reporting only.
- Do not expand scope beyond the approved MVP.

## Output

A short written report covering:

- What exists
- What is missing
- Risks and open questions
- A recommended order of work for the next prompts
