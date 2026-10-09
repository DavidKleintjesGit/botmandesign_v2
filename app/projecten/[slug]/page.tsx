import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProjectDetail from "@/app/components/ProjectDetail";
import { getProject, projects } from "@/app/content/projects";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) return { title: "Project — Botman Design" };

  return {
    title: `${project.title} — Botman Design`,
    description: project.nl.intro,
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) notFound();

  return <ProjectDetail slug={slug} />;
}
