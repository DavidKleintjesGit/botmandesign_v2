import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ServiceDetail from "@/app/components/ServiceDetail";
import { getService, serviceSlugs } from "@/app/content/services";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) return { title: "Service — Botman Design" };

  return {
    title: `${service.nl.name} — Botman Design`,
    description: service.nl.tagline,
  };
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;

  if (!getService(slug)) notFound();

  return <ServiceDetail slug={slug} />;
}
