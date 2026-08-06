# Billing & subscriptions

The web subscription foundation: how a family pays, how their access is decided,
and why it is built the way it is. The paying user is always the parent or
guardian (docs/AUTH.md); children never see any of this.

> **Not launched yet.** This is a foundation. It must not be switched on until
> families have tested the learning experience. When billing is unconfigured the
> app runs exactly as before — everyone is on the free plan and the membership
> page says memberships are not available. Turning it on is four environment
> variables (below), nothing more.

## Product model

- **Free introductory access** — the free lessons are always open, with or
  without a membership.
- **One paid family membership** — covers the whole household, not per child
  (docs/PRODUCT_BRIEF.md).
- **Two cadences** — a monthly plan and an annual plan, the same membership
  billed either way.
- **One subscription per family** — an active membership is never double-bought.

No child-directed purchasing, no paid virtual currency, no advertising — the
subscription is the entire business model (docs/PRIVACY_AND_SAFETY.md).

## Shape of the code

The same seam pattern as auth (decision 033) and family data (decision 034): a
port with a real adapter and an offline stand-in, chosen by configuration, with a
service as the sole authorization boundary.

```text
src/features/subscriptions/          domain (pure, mostly client-safe)
├── types.ts              SubscriptionStatus, plan, Subscription, BillingState
├── subscription.ts       the state machine: mapStripeStatus, hasPaidAccess, describeBilling
├── plans.ts              the plan catalogue and Price-ID mapping
├── events.ts             the slice of Stripe payloads we read
├── webhookSignature.ts   HMAC-SHA256 signature verification (Node crypto)
├── gateway.ts            the BillingGateway port (outbound: checkout, portal)
├── stripeGateway.ts      the real Stripe adapter (fetch)
└── config.ts             billingMode(), price map, gateway selection

src/server/subscriptions/            server (authorization + persistence)
├── store.ts              the SubscriptionStore port
├── memoryStore.ts        offline stand-in
├── postgresStore.ts      the real adapter, on Supabase
├── index.ts              getSubscriptionStore() — chosen by configuration
├── webhook.ts            applyStripeEvent() — the inbound state machine + idempotency
├── service.ts            BillingService — the authorization boundary
└── devSimulator.ts       synthesises Stripe events for offline test mode

src/app/api/billing/**     GET state, checkout, portal, webhook, dev-activate
src/app/parent/billing/    the membership page (server) + BillingPanel (client)
```

## Data-model changes

`supabase/migrations/0002_subscriptions.sql` adds two tables. Card data is never
among them — it stays inside Stripe.

| Table                      | Holds                                                        |
| -------------------------- | ------------------------------------------------------------ |
| `family_subscriptions`     | one row per family: status, plan, period end, Stripe ids     |
| `processed_webhook_events` | one row per applied Stripe event id — the idempotency ledger |

`family_subscriptions.family_id` is `unique` (one subscription per family) and
cascades on family deletion. `status` and `plan` are `check`-constrained to the
same closed sets the app validates, so hand-written SQL cannot widen them. The
Stripe customer and subscription ids are `unique` — each belongs to one family —
and the customer id is indexed, because a webhook without family metadata
resolves the family by customer. RLS ties `family_subscriptions` to the caller's
family through `family_memberships`, exactly like the other family-owned tables;
`processed_webhook_events` has RLS on with no policy, so only the service role
(server-only bookkeeping) can touch it.

`BillingState` is the browser-facing projection (`toBillingState`): status, plan,
`hasPaidAccess`, `cancelAtPeriodEnd`, and `currentPeriodEnd` — **never** the
Stripe identifiers, and entitlement is always recomputed on the server.

## Subscription state machine

Internal statuses are a small closed set, mapped from Stripe's larger one by
`mapStripeStatus`:

| Internal   | From Stripe                                   | Paid access?    |
| ---------- | --------------------------------------------- | --------------- |
| `free`     | no record; `incomplete`, `incomplete_expired` | no              |
| `trialing` | `trialing`                                    | **yes**         |
| `active`   | `active`                                      | **yes**         |
| `past_due` | `past_due`                                    | **yes** (grace) |
| `canceled` | `canceled`, `unpaid`, `paused`                | no              |

```text
                     checkout completed
   free ─────────────────────────────────────▶ trialing / active
    ▲                                              │      │
    │                                    payment   │      │ cancel at period end
    │                                    fails ─────┤      │ (stays active until period end)
    │                                              ▼      ▼
    │                                          past_due   active (cancelAtPeriodEnd=true)
    │                                          │   ▲          │
    │                       payment recovers ──┘   └── fails  │ period ends
    │                                                         ▼
    └───────────────  subscription deleted / dunning exhausted ──▶ canceled ──▶ free
```

Two deliberate rules:

- **Past-due keeps access.** A failed card must not lock a child out mid-lesson
  (docs/CURRICULUM_PRINCIPLES.md: no punishment). Access is held through Stripe's
  dunning window; when Stripe gives up, the subscription becomes `canceled`/
  `unpaid` and access ends then.
- **Cancel-at-period-end is not "cancelled".** Stripe keeps the subscription
  `active` until the period actually elapses, and so do we — the flag only
  changes the message ("your membership is ending" with the date), not access.

The inbound half (`applyStripeEvent`) is store-driven and free of any network
call, so every transition above is unit-tested against the in-memory store in
`src/server/subscriptions/webhook.test.ts`.

## Webhook events required

Verified in the route, then applied by `applyStripeEvent`:

| Event                           | Effect                                                                         |
| ------------------------------- | ------------------------------------------------------------------------------ |
| `checkout.session.completed`    | link the Stripe customer to the family (from `client_reference_id` / metadata) |
| `customer.subscription.created` | persist status, plan, period end, `cancel_at_period_end`                       |
| `customer.subscription.updated` | the same — covers trial→active, →past_due, cancel-toggle, plan change          |
| `customer.subscription.deleted` | status → `canceled`; access ends                                               |
| `invoice.payment_failed`        | active/trialing → `past_due` (never resurrects canceled)                       |
| `invoice.payment_succeeded`     | past_due → `active` (recovery)                                                 |

A family is resolved from the subscription's `family_id` metadata (which we set
on the Checkout Session and on `subscription_data`), or failing that from the
stored customer mapping — **never** from anything the browser sent. Unhandled
event types are acknowledged and ignored.

## Security properties

- **Signatures are verified before anything is trusted.** The webhook route
  reads the raw body, checks the `Stripe-Signature` HMAC against the signing
  secret with a constant-time compare and a timestamp tolerance, and only then
  parses (`webhookSignature.ts`, `webhookSignature.test.ts`).
- **Idempotent.** Each event id is recorded before it is applied, so a Stripe
  redelivery is a no-op. If application fails, the marker is released so a
  genuine retry is not mistaken for a duplicate.
- **Browser state is never trusted.** Entitlement is recomputed server-side on
  every read; the client receives a display projection only.
- **No card data, ever.** All card entry happens on Stripe Checkout and the
  Billing Portal. This app stores none.
- **Secrets are server-only.** The secret key, webhook secret, and price ids are
  non-`NEXT_PUBLIC`; env validation rejects a secret key placed in the public
  publishable slot.

## Failure scenarios

| Scenario                                   | What happens                                                                                                    |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| Card declines after activation             | `invoice.payment_failed` → `past_due`; access held; the page asks the parent to update their card in the portal |
| Card never recovers                        | Stripe dunning ends → `customer.subscription.deleted` → `canceled` → free                                       |
| Parent cancels                             | portal sets `cancel_at_period_end`; access until period end; then deleted → free                                |
| Webhook delivered twice / out of order     | idempotency ledger drops the duplicate; latest event wins                                                       |
| Webhook fails mid-apply                    | marker released, 500 returned, Stripe retries                                                                   |
| Forged / unsigned webhook                  | signature check fails → 400, nothing applied                                                                    |
| Checkout abandoned                         | no webhook fires; family stays free; return page says nothing was charged                                       |
| Parent already subscribed clicks subscribe | service returns `already-subscribed` (409); no second Checkout                                                  |
| Billing unconfigured in production         | mode `unavailable`; everyone free; checkout/portal 503; webhook 503                                             |
| Stripe API/network error during checkout   | the route surfaces a generic failure; nothing is persisted                                                      |

## Customer-facing states

`describeBilling` is the single source of the copy for each state (warm, never
punitive), rendered on `/parent/billing`:

- **Free** — "You are on the free plan." Neutral; invites, does not pressure.
- **Trialing / Active** — positive, with the renewal or trial-end date.
- **Ending** (active + cancel-at-period-end) — attention; keeps access until the
  named date, then free.
- **Past due** — attention; "Update your card … nothing is locked yet."
- **Canceled** — neutral; "You are back on the free plan."

Returning from Checkout, `?status=success` shows a thank-you (the membership
appears once the webhook lands) and `?status=canceled` reassures that nothing was
charged.

## Entitlement checks

`hasPaidAccess` (statuses `trialing` / `active` / `past_due`) is the one
entitlement rule. `BillingService.hasAccess(user)` resolves it server-side for a
signed-in parent. It is deliberately **not** wired to lock the learning area yet:
the free introductory lessons stay open, and this foundation must not gate real
use until families have tested it. When a premium surface is introduced, it calls
`hasAccess` on the server — never a value from the browser.

## Local testing procedure

### Offline (default, no Stripe)

Nothing to configure. With billing unconfigured in `local`, the membership page
runs in **dev test mode**: `/parent/billing` shows simulate controls that drive
the real dispatcher (`devSimulator.ts` → `applyStripeEvent`), so you can walk a
family through active, past-due, and cancelled — and watch entitlement and the
customer-facing copy respond — with no Stripe and no card. The simulator route is
gated to the dev server with billing off and can never run deployed.

### Against real Stripe (test mode)

1. In the Stripe dashboard (test mode) create a Product with a monthly and an
   annual recurring Price; copy the two Price IDs.
2. In `.env.local` set `STRIPE_SECRET_KEY` (test `sk_test_…`),
   `STRIPE_PRICE_ID_MONTHLY`, `STRIPE_PRICE_ID_ANNUAL`, and — for the webhook —
   `STRIPE_WEBHOOK_SECRET`. Optionally set `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
3. Forward webhooks locally: `stripe listen --forward-to
localhost:3000/api/billing/webhook`, and use the `whsec_…` it prints as
   `STRIPE_WEBHOOK_SECRET`.
4. Subscribe with Stripe's test card `4242 4242 4242 4242`. Exercise decline and
   recovery with `4000 0000 0000 0341`, and cancel from the Billing Portal.

Use **separate** Stripe keys per environment (docs/ARCHITECTURE.md); never a live
key in local or preview.

## Environment variables

| Variable                             | Client-safe | Rule                                          |
| ------------------------------------ | ----------- | --------------------------------------------- |
| `STRIPE_SECRET_KEY`                  | no          | server-only; enables the gateway              |
| `STRIPE_WEBHOOK_SECRET`              | no          | server-only; required to accept webhooks      |
| `STRIPE_PRICE_ID_MONTHLY`            | no          | server-only; the monthly plan's Stripe Price  |
| `STRIPE_PRICE_ID_ANNUAL`             | no          | server-only; the annual plan's Stripe Price   |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | yes         | optional; must be a `pk_` key, never a secret |

Billing is "configured" only when the four server values are all present; then
`billingMode()` is `live`. Missing in `local` → `dev`; missing when deployed →
`unavailable`. Unlike auth and the database, billing is optional even in
production, because the flow is intentionally not launched.

## Not in this slice

Analytics events for subscription lifecycle (`subscription.checkout_started`,
`subscription.activated`, `subscription.cancelled` in docs/ANALYTICS.md) and
hard entitlement gating of premium surfaces are deliberately left for when the
feature is launched, to keep this foundation from changing how the app behaves
for the families currently testing it.
