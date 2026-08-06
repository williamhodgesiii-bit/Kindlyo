import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BillingPanel } from "@/components/parent/BillingPanel";
import { InlineFeedback } from "@/components/ui/InlineFeedback";
import { PageContainer } from "@/components/ui/PageContainer";
import { Heading, Text } from "@/components/ui/Typography";
import { billingMode } from "@/features/subscriptions/config";
import { PLAN_DEFINITIONS } from "@/features/subscriptions/plans";
import {
  describeBilling,
  type BillingTone,
} from "@/features/subscriptions/subscription";
import { getSessionUser } from "@/features/auth/session";
import { getBillingService } from "@/server/subscriptions/service";

export const metadata: Metadata = {
  title: "Family membership",
};

export const dynamic = "force-dynamic";

/** BillingTone → the InlineFeedback tone that carries the right colour and icon. */
const TONE_TO_FEEDBACK = {
  positive: "helpful",
  neutral: "neutral",
  attention: "mixed",
} as const satisfies Record<BillingTone, "helpful" | "neutral" | "mixed">;

type ReturnNotice = {
  tone: "helpful" | "neutral";
  title: string;
  body: string;
};

function returnNoticeFor(status: string | undefined): ReturnNotice | null {
  if (status === "success") {
    return {
      tone: "helpful",
      title: "Thank you",
      body: "Your membership is being set up and will appear here in a moment. There is nothing else you need to do.",
    };
  }
  if (status === "canceled") {
    return {
      tone: "neutral",
      title: "No changes made",
      body: "You left checkout before finishing, and nothing was charged. You can pick a plan whenever you are ready.",
    };
  }
  return null;
}

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const user = await getSessionUser();
  if (user === null) redirect("/login?redirectTo=/parent/billing");

  const [{ status }, state] = await Promise.all([
    searchParams,
    getBillingService().getBilling(user),
  ]);

  const mode = billingMode();
  const description = describeBilling(state);
  const notice = returnNoticeFor(status);

  return (
    <PageContainer>
      <div className="mx-auto max-w-2xl">
        <Heading level={1} size="xl">
          Family membership
        </Heading>
        <Text size="lg" tone="secondary" className="mt-4">
          One subscription covers your whole household. The free introductory
          lessons are always open; a membership unlocks the full library.
        </Text>

        {notice !== null ? (
          <InlineFeedback
            tone={notice.tone}
            title={notice.title}
            className="mt-8"
          >
            {notice.body}
          </InlineFeedback>
        ) : null}

        <div className="mt-8">
          <InlineFeedback
            tone={TONE_TO_FEEDBACK[description.tone]}
            title={description.title}
          >
            {description.body}
          </InlineFeedback>
        </div>

        <div className="mt-8">
          <BillingPanel state={state} mode={mode} plans={PLAN_DEFINITIONS} />
        </div>
      </div>
    </PageContainer>
  );
}
