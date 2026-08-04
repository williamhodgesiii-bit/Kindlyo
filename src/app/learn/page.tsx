import type { Metadata } from "next";
import { LearningPath } from "@/components/path/LearningPath";

export const metadata: Metadata = {
  title: "Learn",
};

/**
 * The learning path.
 *
 * A thin server page: profiles and progress live in local storage for this
 * phase, so the real work happens in the client component after hydration.
 */
export default function LearnPage() {
  return <LearningPath />;
}
