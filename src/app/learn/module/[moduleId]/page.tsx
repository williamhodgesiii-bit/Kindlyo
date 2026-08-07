import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LearningPath } from "@/components/path/LearningPath";
import {
  curriculumModules,
  getModuleById,
  meetingPeopleModule,
} from "@/content/modules";

/**
 * One world's learning path.
 *
 * The neighborhood's worlds beyond Hello Garden each host a module, reached at
 * `/learn/module/<id>`. Hello Garden keeps its home at `/learn`, so its module
 * id is deliberately not served here — one URL per module.
 *
 * An unknown module id 404s through the same path as the excluded one, so the
 * URL cannot be used to probe for a world that does not exist.
 */

type PageProps = { params: Promise<{ moduleId: string }> };

export function generateStaticParams(): { moduleId: string }[] {
  return curriculumModules
    .filter((module) => module.id !== meetingPeopleModule.id)
    .map((module) => ({ moduleId: module.id }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { moduleId } = await params;
  const curriculumModule = getModuleById(moduleId);
  if (
    curriculumModule === undefined ||
    curriculumModule.id === meetingPeopleModule.id
  ) {
    return { title: "Not found" };
  }
  return { title: curriculumModule.title };
}

export default async function ModuleLearnPage({ params }: PageProps) {
  const { moduleId } = await params;
  const curriculumModule = getModuleById(moduleId);

  // Hello Garden's canonical path is `/learn`; its module route 404s.
  if (
    curriculumModule === undefined ||
    curriculumModule.id === meetingPeopleModule.id
  ) {
    notFound();
  }

  return <LearningPath module={curriculumModule} />;
}
