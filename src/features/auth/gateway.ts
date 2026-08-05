import type { AuthActionResult, AuthCredentials, AuthUser } from "./types";

/**
 * The authentication boundary.
 *
 * The app depends on this interface, not on Supabase directly — the same seam
 * pattern as `WaitlistSink` (decision 030). Two implementations satisfy it:
 * `supabaseGateway` (real, used whenever Supabase is configured) and
 * `localGateway` (an offline development stand-in, only permitted in the local
 * environment). Choosing between them is `getServerAuthGateway`'s job.
 *
 * Every method that can fail returns an `AuthActionResult` whose failure message
 * is already generic; callers show it verbatim without leaking whether an
 * account exists.
 */
export type AuthGateway = {
  /** The current parent, revalidated against the provider, or null. */
  getUser(): Promise<AuthUser | null>;
  signInWithPassword(credentials: AuthCredentials): Promise<AuthActionResult>;
  signUp(credentials: AuthCredentials): Promise<AuthActionResult>;
  /** Always resolves; anti-enumeration means it never says whether it sent anything. */
  requestPasswordReset(email: string): Promise<AuthActionResult>;
  /** Sets a new password for the parent in the current (recovery) session. */
  updatePassword(newPassword: string): Promise<AuthActionResult>;
  /** Exchanges an emailed one-time code for a session (Supabase only). */
  exchangeCodeForSession(code: string): Promise<AuthActionResult>;
  signOut(): Promise<void>;
};
