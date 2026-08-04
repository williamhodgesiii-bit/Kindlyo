"use client";

import { useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageContainer } from "@/components/ui/PageContainer";
import { Heading, Text } from "@/components/ui/Typography";
import type { Family } from "@/features/profiles/useFamily";
import { maxProfiles } from "@/features/profiles/types";
import { ProfileForm } from "./ProfileForm";
import { PrototypeStorageNotice } from "./PrototypeStorageNotice";

/**
 * The parent's first run: welcome, what we do and do not collect, and the
 * first child profile.
 *
 * Editorial rather than chirpy — this is the adult surface, and the adult is
 * deciding whether to trust us with something about their child. Long measure,
 * generous spacing, full sentences, and the privacy position stated plainly on
 * the way in rather than linked to from a footer.
 *
 * Three steps, and the third is real work: onboarding finishes by creating a
 * profile, not by clicking "Done" on a tour. A parent who wants out can skip
 * to the dashboard at any point — an onboarding you cannot leave is a dark
 * pattern, and this one has nothing to protect.
 */

type Step = "welcome" | "how-it-works" | "first-profile";

const steps: readonly Step[] = ["welcome", "how-it-works", "first-profile"];

export function ParentOnboarding({ family }: { family: Family }) {
  const [step, setStep] = useState<Step>("welcome");
  const stepNumber = steps.indexOf(step) + 1;

  return (
    <PageContainer width="narrow">
      <Text tone="secondary" size="sm">
        Step {stepNumber} of {steps.length}
      </Text>

      {step === "welcome" ? (
        <section>
          <Heading level={1} size="display" className="mt-3">
            Welcome to Kindlyo
          </Heading>
          <Text size="lg" className="mt-6 max-w-prose">
            Kindlyo helps children between five and nine practise the small
            social moments that are easy to find hard — saying hello, joining
            in, listening, leaving a conversation kindly.
          </Text>
          <Text size="lg" className="mt-4 max-w-prose">
            Lessons are short. Each one ends with something to try away from the
            screen, and a line or two for you about how to help. You stay the
            account holder throughout: children never sign in, and never have an
            account of their own.
          </Text>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button size="lg" onClick={() => setStep("how-it-works")}>
              Get started
            </Button>
            <Button variant="quiet" size="lg" onClick={family.finishOnboarding}>
              Skip for now
            </Button>
          </div>
        </section>
      ) : null}

      {step === "how-it-works" ? (
        <section>
          <Heading level={1} className="mt-3">
            What we ask for, and what we do not
          </Heading>
          <Text size="lg" className="mt-6 max-w-prose">
            A child profile is a nickname and an age band. That is the whole of
            it.
          </Text>

          <Card elevation="soft" className="mt-8">
            <Heading level={2} size="sm">
              We never ask a child for
            </Heading>
            <ul className="mt-3 grid gap-2">
              {[
                "An email address",
                "A full legal name",
                "An exact birthday",
                "A password or login of their own",
                "A photograph",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-brand-primary"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          <PrototypeStorageNotice className="mt-6" />

          <div className="mt-10 flex flex-wrap gap-3">
            <Button size="lg" onClick={() => setStep("first-profile")}>
              Add your first child
            </Button>
            <Button
              variant="quiet"
              size="lg"
              onClick={() => setStep("welcome")}
            >
              Back
            </Button>
          </div>
        </section>
      ) : null}

      {step === "first-profile" ? (
        <section>
          <Heading level={1} className="mt-3">
            Who is learning?
          </Heading>
          <Text size="lg" className="mt-6 max-w-prose">
            You can add up to {maxProfiles} children, and change any of this
            later.
          </Text>

          <div className="mt-8">
            <ProfileForm
              submitLabel="Create profile"
              hint="A first name or nickname — whatever your child would recognise as theirs."
              onSubmit={(draft) => {
                const result = family.create(draft);
                if (!result.ok) {
                  return {
                    ok: false,
                    reason:
                      result.reason === "limit"
                        ? `You can have up to ${maxProfiles} profiles.`
                        : "Please enter a nickname.",
                  };
                }
                family.finishOnboarding();
                return { ok: true };
              }}
            />
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="quiet" onClick={() => setStep("how-it-works")}>
              Back
            </Button>
            <ButtonLink variant="quiet" href="/">
              Not now
            </ButtonLink>
          </div>
        </section>
      ) : null}
    </PageContainer>
  );
}
