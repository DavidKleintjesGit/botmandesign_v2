import type { Metadata } from "next";

import ProjectsOverview from "@/app/components/ProjectsOverview";
import { fetchProjects } from "@/app/lib/cms";

export const metadata: Metadata = {
  title: "Projecten — concept 2 — Botman Design",
  description: "Hetzelfde werk, anders getoond: een tweede manier om een project te laten zien.",
};

export const dynamic = "force-dynamic";

/*
 * Hetzelfde overzicht als concept 1, maar de kaarten wijzen naar de andere
 * projectweergave. Zo kun je beide concepten van begin tot eind doorlopen.
 */
export default async function ConceptTweeOverzicht() {
  const projects = await fetchProjects();

  return <ProjectsOverview projects={projects} basis="/concept-2" />;
}
