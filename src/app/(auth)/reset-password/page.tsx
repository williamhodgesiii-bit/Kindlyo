import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Choose a new password",
};

/**
 * Set a new password. Arriving here directly (without a valid recovery session
 * from the emailed link) simply means the save will fail generically — the page
 * itself makes no claim about who you are.
 */
export default function ResetPasswordPage() {
  return (
    <AuthCard
      title="Choose a new password"
      intro="Pick a new password for your account. You'll be signed in once it's saved."
    >
      <ResetPasswordForm />
    </AuthCard>
  );
}
