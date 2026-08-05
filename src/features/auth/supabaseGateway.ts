import type { SupabaseClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";
import {
  genericSignInError,
  genericSignUpError,
  genericUnexpectedError,
  toAuthErrorMessage,
} from "./errors";
import type { AuthGateway } from "./gateway";
import type { AuthActionResult, AuthCredentials, AuthUser } from "./types";

/**
 * The real gateway: Supabase Auth, email + password.
 *
 * Kept deliberately thin. Every failure is funnelled through
 * `toAuthErrorMessage`, so a provider error never reaches a parent as anything
 * other than a generic message (or the rate-limit notice). The confirmation and
 * reset emails point back at `/auth/confirm` on this deployment's own origin.
 */
export function createSupabaseGateway(supabase: SupabaseClient): AuthGateway {
  const confirmUrl = `${env.NEXT_PUBLIC_APP_URL}/auth/confirm`;

  return {
    async getUser(): Promise<AuthUser | null> {
      const { data, error } = await supabase.auth.getUser();
      if (error !== null || data.user === null) return null;
      const { id, email } = data.user;
      if (typeof email !== "string" || email === "") return null;
      return { id, email };
    },

    async signInWithPassword({
      email,
      password,
    }: AuthCredentials): Promise<AuthActionResult> {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error !== null) {
        return {
          ok: false,
          message: toAuthErrorMessage(error, genericSignInError),
        };
      }
      return { ok: true };
    },

    async signUp({
      email,
      password,
    }: AuthCredentials): Promise<AuthActionResult> {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: confirmUrl },
      });
      if (error !== null) {
        return {
          ok: false,
          message: toAuthErrorMessage(error, genericSignUpError),
        };
      }
      return { ok: true };
    },

    async requestPasswordReset(email: string): Promise<AuthActionResult> {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${confirmUrl}?next=/reset-password`,
      });
      // The caller reports success generically regardless; only a rate limit is
      // worth surfacing, which `toAuthErrorMessage` handles.
      if (error !== null) {
        return {
          ok: false,
          message: toAuthErrorMessage(error, genericUnexpectedError),
        };
      }
      return { ok: true };
    },

    async updatePassword(newPassword: string): Promise<AuthActionResult> {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error !== null) {
        return {
          ok: false,
          message: toAuthErrorMessage(error, genericUnexpectedError),
        };
      }
      return { ok: true };
    },

    async exchangeCodeForSession(code: string): Promise<AuthActionResult> {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error !== null) {
        return {
          ok: false,
          message: toAuthErrorMessage(error, genericUnexpectedError),
        };
      }
      return { ok: true };
    },

    async signOut(): Promise<void> {
      await supabase.auth.signOut();
    },
  };
}
