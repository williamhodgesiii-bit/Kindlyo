import Link from "next/link";

/**
 * Public marketing route.
 *
 * Copy is intentionally modest: we describe what the product does without
 * implying expert validation that has not happened.
 */
export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <section className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Everyday kindness, practiced together
        </h1>
        <p className="mt-6 text-lg text-text-secondary">
          Kindlyo helps children ages 5 to 9 build social confidence through
          short, story-based lessons and real-world missions they can try
          offline with you.
        </p>
        <p className="mt-4 text-lg text-text-secondary">
          Parents hold the account. Children learn alongside you, with no ads,
          no public profiles, and no messaging.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/learn"
            className="inline-flex items-center rounded-lg bg-brand-primary px-6 py-3 font-semibold text-white hover:bg-brand-primary-hover"
          >
            Preview the learning area
          </Link>
          <Link
            href="/parent"
            className="inline-flex items-center rounded-lg border border-border bg-surface px-6 py-3 font-semibold text-text-primary hover:bg-surface-muted"
          >
            For parents
          </Link>
        </div>
      </section>

      <section aria-labelledby="how-it-works" className="mt-16">
        <h2 id="how-it-works" className="text-2xl font-bold">
          How a lesson works
        </h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            {
              title: "A short story",
              body: "Your child meets a familiar everyday situation.",
            },
            {
              title: "A choice to make",
              body: "They decide what to do and see how it might land for the other person.",
            },
            {
              title: "A real-world mission",
              body: "You get one small thing to try together offline.",
            },
          ].map((step, index) => (
            <li
              key={step.title}
              className="rounded-lg border border-border bg-surface p-6"
            >
              <p className="text-sm font-semibold text-brand-secondary">
                Step {index + 1}
              </p>
              <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-text-secondary">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
