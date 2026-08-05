/**
 * The offline development auth gateway.
 *
 * Backed by `localSession` (a signed cookie), it satisfies `AuthGateway` well
 * enough to sign in, sign out, and gate routes with no Supabase project. It
 * accepts any well-formed credentials because there is no credential store to
 * check them against — that is the honest shape of a dev stand-in, and it is why
 * `assertLocalAuthAllowed` keeps it out of every deployed environment.
 */

import { env } from "@/lib/env";
import type { AuthGateway } from "./gateway";
import {
  assertLocalAuthAllowed,
  localUserId,
  signSession,
  toAuthUser,
  verifySession,
} from "./localSession";
import type { AuthActionResult, AuthCredentials, AuthUser } from "./types";

export const SESSION_COOKIE_NAME = "kindlyo.local.session";

/**
 * A minimal cookie surface, so the gateway does not care whether it is writing
 * to a Next route-handler cookie store or anywhere else.
 */
export type SessionCookieStore = {
  get(name: string): string | undefined;
  set(name: string, value: string): void;
  remove(name: string): void;
};

const ok: AuthActionResult = { ok: true };

export function createLocalGateway(store: SessionCookieStore): AuthGateway {
  assertLocalAuthAllowed(env.APP_ENV);

  async function establishSession(email: string): Promise<void> {
    const user: AuthUser = { id: localUserId(email), email };
    store.set(SESSION_COOKIE_NAME, await signSession(user));
  }

  return {
    async getUser(): Promise<AuthUser | null> {
      const session = await verifySession(store.get(SESSION_COOKIE_NAME));
      return session === null ? null : toAuthUser(session);
    },

    async signInWithPassword({
      email,
    }: AuthCredentials): Promise<AuthActionResult> {
      await establishSession(email);
      return ok;
    },

    async signUp({ email }: AuthCredentials): Promise<AuthActionResult> {
      // No email confirmation offline: sign the new parent straight in.
      await establishSession(email);
      return ok;
    },

    async requestPasswordReset(): Promise<AuthActionResult> {
      // Nothing is emailed offline; report success without saying so.
      return ok;
    },

    async updatePassword(): Promise<AuthActionResult> {
      return ok;
    },

    async exchangeCodeForSession(): Promise<AuthActionResult> {
      return ok;
    },

    async signOut(): Promise<void> {
      store.remove(SESSION_COOKIE_NAME);
    },
  };
}
