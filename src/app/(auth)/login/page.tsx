import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "@/components/auth/AuthCard";
import { LoginForm } from "@/components/auth/LoginForm";
import { safeNextPath } from "@/features/auth/http";

export const metadata: Metadata = {
  title: "Sign in",
};

const linkClass =
  "font-medium text-brand-primary-strong underline underline-offset-2 hover:no-underline";

/**
 * Sign in. `redirectTo` remembers where a signed-out visitor was headed so the
 * middleware can return them there; it is sanitised to a same-origin path before
 * it reaches the form or the sign-up link.
 */
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const raw = params.redirectTo;
  const redirectTo = safeNextPath(typeof raw === "string" ? raw : null);
  const signupHref = `/signup?redirectTo=${encodeURIComponent(redirectTo)}`;

  return (
    <AuthCard
      title="Sign in"
      intro="Welcome back. Sign in to reach your family's dashboard and lessons."
      footer={
        <>
          New to Little Learner&apos;s Club?{" "}
          <Link href={signupHref} className={linkClass}>
            Create an account
          </Link>
          .
        </>
      }
    >
      <LoginForm redirectTo={redirectTo} />
    </AuthCard>
  );
}
