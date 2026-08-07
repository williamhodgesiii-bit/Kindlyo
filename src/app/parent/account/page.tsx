import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ParentSurface } from "@/components/nav/ParentSurface";
import { AccountPanel } from "@/components/parent/AccountPanel";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageContainer } from "@/components/ui/PageContainer";
import { Heading, Text } from "@/components/ui/Typography";
import { getSessionUser } from "@/features/auth/session";

export const metadata: Metadata = {
  title: "Account",
};

export const dynamic = "force-dynamic";

/**
 * Privacy & account (docs/design/COMPONENT_STATES.md §4/§10, §12).
 *
 * The adult-facing home for what Kindlyo holds and the controls over it: a plain
 * statement of the data and how little of it there is, the way to the
 * membership, and — in `AccountPanel` — the two rights parents are owed, data
 * export and account deletion (docs/PRIVACY_AND_SAFETY.md).
 *
 * The layout already gates `/parent`, but this re-checks the session on the
 * server, the way every protected surface here does (docs/ARCHITECTURE.md).
 */
export default async function AccountPage() {
  const user = await getSessionUser();
  if (user === null) redirect("/login?redirectTo=/parent/account");

  return (
    <ParentSurface>
      <PageContainer>
        <Heading level={1}>Account</Heading>
        <Text size="lg" tone="secondary" className="mt-4 max-w-prose">
          What Kindlyo keeps, your membership, and the controls over your data.
        </Text>

        <Card className="mt-10">
          <Heading level={2} size="sm">
            Your privacy
          </Heading>
          <Text tone="secondary" className="mt-2 max-w-prose">
            We keep the minimum to run the service: your email, each
            child&rsquo;s nickname and age band, and what they have practised.
            Children never sign in and never give us their name or birthday. We
            use only first-party analytics to improve the lessons — no
            advertising, no third-party trackers, and nothing is ever sold.
          </Text>
          <div className="mt-4 flex flex-wrap gap-4">
            <Link href="/privacy" className="font-semibold underline">
              Privacy policy
            </Link>
            <Link href="/safety" className="font-semibold underline">
              Safety
            </Link>
          </div>
        </Card>

        <Card className="mt-8">
          <Heading level={2} size="sm">
            Membership
          </Heading>
          <Text tone="secondary" className="mt-2 max-w-prose">
            One subscription covers your whole household. Manage your plan,
            update your card, or cancel from the membership page.
          </Text>
          <ButtonLink
            href="/parent/billing"
            variant="secondary"
            className="mt-4"
          >
            Go to membership
          </ButtonLink>
        </Card>

        <AccountPanel />
      </PageContainer>
    </ParentSurface>
  );
}
