# Prompt 10 — Payments

## Goal

Add family subscriptions and entitlements via Stripe. Corresponds to Roadmap
Phase 6.

## Read first

- `docs/PRODUCT_BRIEF.md` (business model)
- `docs/ARCHITECTURE.md` (Subscription entity)
- `docs/PRIVACY_AND_SAFETY.md` (subscription and auto-renewal rules)

## Task

1. Build the pricing page from the placeholder.
2. Implement Stripe checkout for a family subscription.
3. Map subscription state to entitlements that gate access.
4. Provide billing management and cancellation handling.
5. Emit subscription analytics events (`subscription.checkout_started`,
   `subscription.activated`, `subscription.cancelled`).

## Constraints

- Never store raw payment card data.
- Keep Stripe secrets server-side only.
- Handle webhook verification and idempotency.
- No purchases directed at children.

## Definition of done

- A parent can subscribe, manage billing, and cancel.
- Entitlements correctly gate access on state changes.
- Tests cover subscription-state helpers.
- Lint, typecheck, tests, and build pass.
