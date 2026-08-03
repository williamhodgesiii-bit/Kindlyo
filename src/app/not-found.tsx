import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
};

/** Custom 404. Calm and non-blaming, in keeping with the product tone. */
export default function NotFound() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <div className="max-w-xl">
        <h1 className="text-3xl font-bold">We could not find that page</h1>
        <p className="mt-4 text-lg text-text-secondary">
          The link may be out of date, or the page may have moved. Nothing is
          wrong with your account.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center rounded-lg bg-brand-primary px-6 py-3 font-semibold text-white hover:bg-brand-primary-hover"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}
