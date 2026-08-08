import type { Metadata } from "next";
import { MeArea } from "@/components/me/MeArea";

export const metadata: Metadata = {
  title: "Me",
};

/**
 * The child's own area ("Me"): a keepsake of what they have practised and a
 * warm way back into it.
 *
 * A thin server page, like `/learn`: profiles and progress are read from the
 * family client after hydration, so the real work happens in the client
 * component. What this screen deliberately does NOT show — a score, a streak, a
 * total, a "last seen", or a replay of past choices — is documented and tested
 * in `MeArea`.
 */
export default function MePage() {
  return <MeArea />;
}
