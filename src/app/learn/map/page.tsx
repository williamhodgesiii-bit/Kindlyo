import type { Metadata } from "next";
import { NeighborhoodMap } from "@/components/map/NeighborhoodMap";

export const metadata: Metadata = {
  title: "Map",
};

/**
 * The neighborhood map (COMPONENT_STATES.md §03). A thin server page: the map
 * reads the selected profile's progress from local storage for this phase, so
 * the work happens in the client component after hydration.
 */
export default function NeighborhoodMapPage() {
  return <NeighborhoodMap />;
}
