import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "@/components/auth/AuthCard";
import { SignupForm } from "@/components/auth/SignupForm";
import { safeNextPath } from "@/features/auth/http";

export const metadata: Metadata = {
  title: "Create an account",
};

const linkClass =
  "font-medium text-brand-primary-strong underline underline-offset-2 hover:no-underline";

/**
 * Create a parent account. The account holder is always the grown-up; there is
 * nowhere here to create a login for a child, and there never will be
 * (decision 001).
 */
export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const raw = params.redirectTo;
  const redirectTo = safeNextPath(typeof raw === "string" ? raw : null);
  const loginHref = `/login?redirectTo=${encodeURIComponent(redirectTo)}`;

  return (
    <AuthCard
      title="Create your account"
      intro="You are the account holder. Children learn from profiles inside your account — they never sign in themselves."
      footer={
        <>
          Already have an account?{" "}
          <Link href={loginHref} className={linkClass}>
            Sign in
          </Link>
          .
        </>
      }
    >
      <SignupForm redirectTo={redirectTo} />
    </AuthCard>
  );
}
