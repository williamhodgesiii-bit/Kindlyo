import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type {
  SubscriptionPlan,
  SubscriptionStatus,
} from "@/features/subscriptions/types";
import { env } from "@/lib/env";
import type { SubscriptionRecord, SubscriptionStore } from "./store";

/**
 * The real subscription store, on PostgreSQL through Supabase.
 *
 * Reached only when the database is configured. Like the PostgreSQL family
 * store, it uses the service-role key and is therefore not bound by row-level
 * security — scoping is the caller's job (the service resolves the family from
 * the parent; the webhook resolves it from Stripe's verified identifiers). It is
 * integration-level: covered by the types and the shared `SubscriptionStore`
 * interface its in-memory sibling is unit-tested against, not by offline tests,
 * because there is no database in CI.
 */

type SubscriptionRow = {
  family_id: string;
  status: string;
  plan: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  updated_at: string | null;
};

function isStatus(value: string): value is SubscriptionStatus {
  return (
    value === "free" ||
    value === "trialing" ||
    value === "active" ||
    value === "past_due" ||
    value === "canceled"
  );
}

function isPlan(value: string | null): value is SubscriptionPlan {
  return value === "monthly" || value === "annual";
}

function toRecord(row: SubscriptionRow): SubscriptionRecord {
  return {
    familyId: row.family_id,
    status: isStatus(row.status) ? row.status : "free",
    plan: isPlan(row.plan) ? row.plan : null,
    currentPeriodEnd: row.current_period_end,
    cancelAtPeriodEnd: row.cancel_at_period_end,
    stripeCustomerId: row.stripe_customer_id,
    stripeSubscriptionId: row.stripe_subscription_id,
    updatedAt: row.updated_at,
  };
}

const COLUMNS =
  "family_id, status, plan, current_period_end, cancel_at_period_end, stripe_customer_id, stripe_subscription_id, updated_at";

export function createPostgresSubscriptionStore(): SubscriptionStore {
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (url === null || key === null) {
    throw new Error("The database is not configured.");
  }

  const db: SupabaseClient = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return {
    async getByFamilyId(familyId) {
      const { data, error } = await db
        .from("family_subscriptions")
        .select(COLUMNS)
        .eq("family_id", familyId)
        .maybeSingle();
      if (error !== null) throw new Error(error.message);
      return data === null ? null : toRecord(data as SubscriptionRow);
    },

    async getByCustomerId(customerId) {
      const { data, error } = await db
        .from("family_subscriptions")
        .select(COLUMNS)
        .eq("stripe_customer_id", customerId)
        .maybeSingle();
      if (error !== null) throw new Error(error.message);
      return data === null ? null : toRecord(data as SubscriptionRow);
    },

    async upsert(record) {
      const { error } = await db.from("family_subscriptions").upsert(
        {
          family_id: record.familyId,
          status: record.status,
          plan: record.plan,
          current_period_end: record.currentPeriodEnd,
          cancel_at_period_end: record.cancelAtPeriodEnd,
          stripe_customer_id: record.stripeCustomerId,
          stripe_subscription_id: record.stripeSubscriptionId,
          updated_at: record.updatedAt ?? new Date().toISOString(),
        },
        { onConflict: "family_id" },
      );
      if (error !== null) throw new Error(error.message);
    },

    async linkCustomer(familyId, customerId) {
      // Only the customer id, so a concurrent subscription event that sets the
      // real status is never clobbered by this. On insert the row defaults to
      // the free plan.
      const { error } = await db.from("family_subscriptions").upsert(
        {
          family_id: familyId,
          stripe_customer_id: customerId,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "family_id" },
      );
      if (error !== null) throw new Error(error.message);
    },

    async markEventProcessed(eventId, type) {
      const { data, error } = await db
        .from("processed_webhook_events")
        .upsert(
          { id: eventId, type },
          { onConflict: "id", ignoreDuplicates: true },
        )
        .select("id");
      if (error !== null) throw new Error(error.message);
      // With ignoreDuplicates, a conflict returns no rows; a fresh insert returns one.
      return (data?.length ?? 0) > 0;
    },

    async unmarkEventProcessed(eventId) {
      const { error } = await db
        .from("processed_webhook_events")
        .delete()
        .eq("id", eventId);
      if (error !== null) throw new Error(error.message);
    },
  };
}
