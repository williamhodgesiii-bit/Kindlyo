"use client";

import { meetingPeopleModule } from "@/content/modules";
import { neighborhoodWorlds } from "@/content/worlds";
import { getLessonBySlug } from "@/features/curriculum/catalog";
import {
  buildModulePath,
  type ModulePath,
} from "@/features/lessons/moduleProgress";
import {
  buildNeighborhood,
  type WorldSummary,
} from "@/features/lessons/neighborhood";
import { useModulePath } from "@/features/lessons/useModulePath";
import { useFamily } from "@/features/profiles/useFamily";
import { PageContainer } from "@/components/ui/PageContainer";
import { Skeleton } from "@/components/ui/Skeleton";
import { Heading, Text } from "@/components/ui/Typography";
import { MapNode } from "./MapNode";

/**
 * The neighborhood map: every world in one place, and where this child is in
 * their journey (docs/design/COMPONENT_STATES.md §03).
 *
 * Only Hello Garden has authored content, so its state comes from the child's
 * module progress; every other world reads as "a little later" — the shape of
 * the neighborhood without pretending the lessons exist. The map is browsable
 * without a chosen child: with none selected it shows the fresh-start view
 * (Hello Garden current), and its one live node links into the learning path,
 * which handles who is learning.
 *
 * A vertical trail on phones; two columns from `tablet` up. The artful 2-D map
 * and its path connectors are illustrator work (ASSET_MANIFEST.md); this is the
 * accessible, ordered-list baseline they sit on top of.
 */
export function NeighborhoodMap() {
  const family = useFamily();
  const profileId = family.selectedProfile?.id ?? null;
  const loadedPath = useModulePath(profileId);

  if (!family.hydrated) return <MapSkeleton />;
  // A child is chosen but their progress has not arrived yet: wait rather than
  // flash the fresh-start view under their name.
  if (profileId !== null && loadedPath === null) return <MapSkeleton />;

  // No child chosen: the fresh-start neighborhood (nothing completed yet).
  const helloGardenPath: ModulePath =
    loadedPath ?? buildModulePath(meetingPeopleModule, getLessonBySlug, {});

  const summaryOf = (
    world: (typeof neighborhoodWorlds)[number],
  ): WorldSummary =>
    world.moduleId === meetingPeopleModule.id
      ? {
          hasContent: helloGardenPath.lessonCount > 0,
          completed: helloGardenPath.completedCount,
          total: helloGardenPath.lessonCount,
        }
      : { hasContent: false, completed: 0, total: 0 };

  const nodes = buildNeighborhood(neighborhoodWorlds, summaryOf);
  const profile = family.selectedProfile;

  return (
    <PageContainer>
      <Heading level={1}>Neighborhood map</Heading>
      <Text size="lg" tone="secondary" className="mt-4 max-w-prose">
        {profile
          ? `Choose where to explore next, ${profile.nickname}.`
          : "Choose a world to explore. New places open up a little at a time."}
      </Text>

      <ol className="mt-8 grid gap-4 tablet:grid-cols-2">
        {nodes.map((node) => (
          <MapNode key={node.world.id} node={node} />
        ))}
      </ol>
    </PageContainer>
  );
}

function MapSkeleton() {
  return (
    <PageContainer>
      <Skeleton variant="block" loadingLabel="Loading the neighborhood map" />
      <Skeleton variant="text" lines={3} className="mt-6" />
    </PageContainer>
  );
}
