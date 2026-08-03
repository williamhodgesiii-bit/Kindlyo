# Prompt 02 — Design System

## Goal

Implement the design tokens and the base component set. Corresponds to Roadmap
Phase 1.

## Read first

- `docs/DESIGN_SYSTEM.md`
- `CLAUDE.md` (design expectations, accessibility)

## Task

1. Implement the design tokens from `DESIGN_SYSTEM.md` as replaceable tokens.
2. Set up typography using one highly readable sans-serif family.
3. Build the initial component set: Button, Icon button, Card, Progress
   indicator, Choice card, Dialog, Toast, Avatar, Profile selector, Lesson
   shell, Story panel, Mission card, Parent insight card, Empty state, Error
   state, Skeleton loader.
4. Provide loading, empty, and error states as first-class variants.
5. Add component tests for interaction and keyboard operation.

## Constraints

- Meet the accessibility requirements: 44x44 targets, visible focus, keyboard
  support, semantic headings, sufficient contrast, reduced-motion support, and
  no information conveyed by color alone.
- Warm, calm, child-friendly without alienating adults.
- Do not imitate the branding or interaction patterns of existing products.

## Definition of done

- Components render across screen sizes.
- Accessibility requirements verified.
- Tests, lint, typecheck, and build pass.
