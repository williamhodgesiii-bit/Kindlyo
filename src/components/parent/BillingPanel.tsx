"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { InlineFeedback } from "@/components/ui/InlineFeedback";
import { Heading, Text } from "@/components/ui/Typography";
import type { BillingMode } from "@/features/subscriptions/config";
import type { PlanDefinition } from "@/features/subscriptions/plans";
import type { BillingState } from "@/features/subscriptions/types";

/**
 * The interactive part of the membership page.
 *
 * A client island over the server-rendered status: it only ever asks the server
 * to start a Checkout or Portal session (or, in local dev mode, to simulate a
 * webhook) and follows the URL it is given. It never computes entitlement or
 * changes a subscription itself — the server is the sole authority
 * (docs/BILLING.md). Which controls appear is decided from `mode` and the
 * server-derived `state`, so the browser cannot grant itself access by lying.
 */

type BusyKey = string | null;

const NETWORK_ERROR =
  "Something went wrong. Please check your connection and try again.";

const ERROR_COPY: Record<string, string> = {
  "not-available": "Memberships are not available right now. Please try later.",
  "already-subscribed": "Your family already has an active membership.",
  "no-subscription": "There is no membership to manage yet.",
};

function errorCopy(code: string | undefined): string {
  return (code !== undefined ? ERROR_COPY[code] : undefined) ?? NETWORK_ERROR;
}

export function BillingPanel({
  state,
  mode,
  plans,
}: {
  state: BillingState;
  mode: BillingMode;
  plans: readonly PlanDefinition[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<BusyKey>(null);
  const [error, setError] = useState<string | null>(null);

  async function redirectVia(
    key: string,
    path: string,
    body?: unknown,
  ): Promise<void> {
    setError(null);
    setBusy(key);
    try {
      const response = await fetch(path, {
        method: "POST",
        headers: body ? { "content-type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = (await response.json().catch(() => null)) as {
        url?: string;
        error?: string;
      } | null;
      if (response.ok && data?.url) {
        window.location.assign(data.url);
        return;
      }
      setError(errorCopy(data?.error));
      setBusy(null);
    } catch {
      setError(NETWORK_ERROR);
      setBusy(null);
    }
  }

  async function simulate(scenario: string): Promise<void> {
    setError(null);
    setBusy(scenario);
    try {
      const response = await fetch("/api/billing/dev-activate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ scenario }),
      });
      if (!response.ok) setError(NETWORK_ERROR);
      else router.refresh();
    } catch {
      setError(NETWORK_ERROR);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="grid gap-6">
      {error !== null ? (
        <InlineFeedback tone="problem" title="That did not work">
          {error}
        </InlineFeedback>
      ) : null}

      {mode === "unavailable" ? (
        <Card>
          <Heading level={3} size="sm">
            Memberships are not available yet
          </Heading>
          <Text tone="secondary" className="mt-2">
            The subscription flow is switched off in this environment. The free
            introductory lessons are open in the meantime.
          </Text>
        </Card>
      ) : state.hasPaidAccess ? (
        <ManageBilling
          mode={mode}
          busy={busy}
          onManage={() => redirectVia("portal", "/api/billing/portal")}
          onSimulate={simulate}
        />
      ) : (
        <ChoosePlan
          plans={plans}
          mode={mode}
          busy={busy}
          onChoose={(plan) =>
            redirectVia(`checkout-${plan}`, "/api/billing/checkout", { plan })
          }
          onSimulate={simulate}
        />
      )}

      {mode === "dev" ? (
        <Text size="sm" tone="secondary">
          Development test mode: no card is charged. These controls simulate the
          subscription states Stripe would produce.
        </Text>
      ) : null}
    </div>
  );
}

function ChoosePlan({
  plans,
  mode,
  busy,
  onChoose,
  onSimulate,
}: {
  plans: readonly PlanDefinition[];
  mode: BillingMode;
  busy: BusyKey;
  onChoose: (plan: PlanDefinition["plan"]) => void;
  onSimulate: (scenario: string) => void;
}) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {plans.map((plan) => (
        <Card as="li" key={plan.plan}>
          <Heading level={3} size="sm">
            {plan.name}
          </Heading>
          <Text tone="secondary" className="mt-2">
            {plan.blurb}
          </Text>
          <Text size="sm" tone="secondary" className="mt-2">
            The price is confirmed at checkout.
          </Text>
          <div className="mt-4">
            {mode === "dev" ? (
              <Button
                variant="primary"
                fullWidth
                isLoading={busy === `start-${plan.plan}`}
                disabled={busy !== null}
                onClick={() => onSimulate(`start-${plan.plan}`)}
              >
                Start {plan.name.toLowerCase()} (simulated)
              </Button>
            ) : (
              <Button
                variant="primary"
                fullWidth
                isLoading={busy === `checkout-${plan.plan}`}
                disabled={busy !== null}
                onClick={() => onChoose(plan.plan)}
              >
                Choose {plan.name.toLowerCase()}
              </Button>
            )}
          </div>
        </Card>
      ))}
    </ul>
  );
}

function ManageBilling({
  mode,
  busy,
  onManage,
  onSimulate,
}: {
  mode: BillingMode;
  busy: BusyKey;
  onManage: () => void;
  onSimulate: (scenario: string) => void;
}) {
  if (mode === "dev") {
    return (
      <div className="flex flex-wrap gap-3">
        <Button
          variant="secondary"
          isLoading={busy === "past-due"}
          disabled={busy !== null}
          onClick={() => onSimulate("past-due")}
        >
          Simulate a failed payment
        </Button>
        <Button
          variant="secondary"
          isLoading={busy === "cancel"}
          disabled={busy !== null}
          onClick={() => onSimulate("cancel")}
        >
          Cancel membership (simulated)
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Button
        variant="secondary"
        isLoading={busy === "portal"}
        disabled={busy !== null}
        onClick={onManage}
      >
        Manage billing
      </Button>
      <Text size="sm" tone="secondary" className="mt-3">
        Update your card, change plan, or cancel in the secure Stripe portal.
      </Text>
    </div>
  );
}
