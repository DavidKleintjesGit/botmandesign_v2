import type { Metadata } from "next";

import ServicesOverview from "@/app/components/ServicesOverview";
import { fetchServices } from "@/app/lib/cms";

export const metadata: Metadata = {
  title: "Services — Botman Design",
  description: "De studio services van Botman Design, van eerste concept tot eindstyling.",
};

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const services = await fetchServices();

  return <ServicesOverview services={services} />;
}
