# Testing Strategy

## Unit tests

Cover:

- Lesson progression rules
- Lesson completion calculations
- Content validation
- Access-control helpers
- Subscription-state helpers

## Component tests

Cover:

- Choice selection
- Disabled and loading states
- Progress display
- Error feedback
- Keyboard operation
- Parent mission cards

## End-to-end tests

Critical flow:

1. Parent creates an account.
2. Parent completes onboarding.
3. Parent creates a child profile.
4. Parent selects the child.
5. Child completes lesson one.
6. Progress persists.
7. Parent opens the dashboard.
8. Dashboard shows the completed lesson and mission.

## Authorization tests

Verify:

- A parent cannot access another family.
- A parent cannot access another child profile.
- Unauthenticated users cannot access protected routes.
- Draft lessons cannot be opened by normal users.

## Required checks

```bash
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
```
