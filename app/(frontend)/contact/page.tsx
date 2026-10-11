import type { Metadata } from "next";

import ContactPageContent from "@/app/components/ContactPageContent";
import { fetchServices } from "@/app/lib/cms";

export const metadata: Metadata = {
  title: "Contact — Botman Design",
  description: "Een goed interieur begint met een goed gesprek. Stuur Botman Design een bericht.",
};

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  // De onderwerpen in het formulier zijn de diensten uit het beheer.
  const services = await fetchServices();

  return <ContactPageContent services={services} />;
}
