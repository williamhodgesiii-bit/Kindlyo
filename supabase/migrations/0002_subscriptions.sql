-- Kindlyo subscriptions (decision 036).
--
-- One subscription per family, plus a ledger of processed Stripe webhook events
-- for idempotency. Card data is never stored here or anywhere in the app — it
-- stays inside Stripe Checkout and the Billing Portal. Applied with the Supabase
-- CLI (`supabase db push`), after 0001_family_persistence.sql.

-- A family's subscription. `status` is the app's own closed set (see
-- src/features/subscriptions/types.ts), mirrored as a check constraint so
-- hand-written SQL cannot widen it. The Stripe identifiers are how a webhook
-- ties an event back to a family; both are unique because a customer or
-- subscription belongs to exactly one family. `current_period_end` is what the
-- customer-facing "renews on / access until" copy is built from.
create table if not exists public.family_subscriptions (
  id                     uuid primary key default gen_random_uuid(),
  family_id              uuid not null unique references public.families (id) on delete cascade,
  stripe_customer_id     text unique,
  stripe_subscription_id text unique,
  status                 text not null default 'free'
                           check (status in ('free', 'trialing', 'active', 'past_due', 'canceled')),
  plan                   text check (plan in ('monthly', 'annual')),
  current_period_end     timestamptz,
  cancel_at_period_end   boolean not null default false,
  updated_at             timestamptz,
  created_at             timestamptz not null default now()
);

-- Webhooks resolve a family by customer when the event carries no family_id
-- metadata, so that lookup is indexed.
create index if not exists family_subscriptions_customer_idx
  on public.family_subscriptions (stripe_customer_id);

-- The idempotency ledger: one row per Stripe event id we have applied. The
-- webhook records the id before acting, so a redelivery is a no-op. Keyed by the
-- Stripe event id itself (evt_...), which is globally unique.
create table if not exists public.processed_webhook_events (
  id           text primary key,
  type         text not null,
  processed_at timestamptz not null default now()
);

-- Row-level security, the same defence-in-depth posture as the family tables.
-- The application uses the service-role key (which bypasses RLS), so the
-- service's scoping is the primary control; these policies protect any other
-- access path.
alter table public.family_subscriptions enable row level security;
alter table public.processed_webhook_events enable row level security;

-- A parent may read/write only their own family's subscription, tied through
-- family_memberships exactly as the other family-owned tables are.
create policy family_subscriptions_own on public.family_subscriptions
  for all
  using (
    family_id in (
      select family_id from public.family_memberships
      where user_id = auth.uid()::text
    )
  )
  with check (
    family_id in (
      select family_id from public.family_memberships
      where user_id = auth.uid()::text
    )
  );

-- The webhook ledger has no policy on purpose: with RLS enabled and no policy,
-- only the service role (which bypasses RLS) can touch it. It is server-only
-- bookkeeping and no client ever needs it.
