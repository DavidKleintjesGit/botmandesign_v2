import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ServiceDetail from "@/app/components/ServiceDetail";
import { fetchServices } from "@/app/lib/cms";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = (await fetchServices())[slug];

  if (!service) return { title: "Service — Botman Design" };

  return { title: `${service.nl.name} — Botman Design`, description: service.nl.tagline };
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const services = await fetchServices();

  if (!services[slug]) notFound();

  return <ServiceDetail slug={slug} services={services} />;
}
