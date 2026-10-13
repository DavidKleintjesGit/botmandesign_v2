import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProjectMosaic from "@/app/components/ProjectMosaic";
import { fetchProjects } from "@/app/lib/cms";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = (await fetchProjects()).find((item) => item.slug === slug);

  if (!project) return { title: "Project — Botman Design" };

  return { title: `${project.title} — Botman Design`, description: project.nl.intro };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const projects = await fetchProjects();

  if (!projects.some((item) => item.slug === slug)) notFound();

  return <ProjectMosaic slug={slug} projects={projects} />;
}
