import type { Metadata } from "next";

import ServicesOverview from "@/app/components/ServicesOverview";

export const metadata: Metadata = {
  title: "Services — Botman Design",
  description:
    "Van Style Consult tot Home Couture: de studio services van Botman Design, van eerste concept tot eindstyling.",
};

export default function ServicesPage() {
  return <ServicesOverview />;
}
