import type { Metadata } from "next";

import ProjectsOverview from "@/app/components/ProjectsOverview";

export const metadata: Metadata = {
  title: "Projecten — Botman Design",
  description: "Geselecteerd werk van Botman Design: particuliere interieurs, ontworpen rond uw leven.",
};

export default function ProjectenPage() {
  return <ProjectsOverview />;
}
