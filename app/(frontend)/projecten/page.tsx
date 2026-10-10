import type { Metadata } from "next";

import ProjectsOverview from "@/app/components/ProjectsOverview";
import { fetchProjects } from "@/app/lib/cms";

export const metadata: Metadata = {
  title: "Projecten — Botman Design",
  description: "Geselecteerd werk van Botman Design: particuliere interieurs, ontworpen rond uw leven.",
};

// De inhoud komt uit het beheerpaneel, dus elke aanvraag haalt de actuele stand op.
export const dynamic = "force-dynamic";

export default async function ProjectenPage() {
  const projects = await fetchProjects();

  return <ProjectsOverview projects={projects} />;
}
