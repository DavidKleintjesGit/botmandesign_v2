import type { Metadata } from "next";

import ShopOverview from "@/app/components/ShopOverview";
import { fetchProducts } from "@/app/lib/cms";

export const metadata: Metadata = {
  title: "Collectie — Botman Design",
  description: "Objecten, textiel en verlichting die Botman Design zelf in projecten gebruikt.",
};

export const dynamic = "force-dynamic";

export default async function CollectiePage() {
  const products = await fetchProducts();

  return <ShopOverview products={products} />;
}
