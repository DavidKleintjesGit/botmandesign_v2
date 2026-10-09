import type { Metadata } from "next";

import ShopOverview from "@/app/components/ShopOverview";

export const metadata: Metadata = {
  title: "Collectie — Botman Design",
  description:
    "Objecten, textiel en verlichting die Botman Design zelf in projecten gebruikt.",
};

export default function CollectiePage() {
  return <ShopOverview />;
}
