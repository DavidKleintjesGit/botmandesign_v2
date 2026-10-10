import type { Metadata } from "next";

import ContactPageContent from "@/app/components/ContactPageContent";

export const metadata: Metadata = {
  title: "Contact — Botman Design",
  description: "Een goed interieur begint met een goed gesprek. Stuur Botman Design een bericht.",
};

export default function ContactPage() {
  return <ContactPageContent />;
}
