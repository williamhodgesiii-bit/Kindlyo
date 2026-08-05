import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "@/components/auth/AuthCard";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Reset your password",
};

const linkClass =
  "font-medium text-brand-primary-strong underline underline-offset-2 hover:no-underline";

/**
 * Start a password reset. Enter an address, and a link is sent if it has an
 * account — the page says the same thing either way.
 */
export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="Reset your password"
      intro="Enter your email address and we'll send a link to set a new password."
      footer={
        <>
          Remembered it?{" "}
          <Link href="/login" className={linkClass}>
            Back to sign in
          </Link>
          .
        </>
      }
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}
