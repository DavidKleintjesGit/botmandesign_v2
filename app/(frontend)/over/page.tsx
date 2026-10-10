import type { Metadata } from "next";

import AboutPageContent from "@/app/components/AboutPageContent";

export const metadata: Metadata = {
  title: "Over Bas — Botman Design",
  description:
    "Van de mode naar het interieur: de achtergrond van Bas Botman en waar Botman Design voor staat.",
};

export default function OverPage() {
  return <AboutPageContent />;
}
