import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProductDetail from "@/app/components/ProductDetail";
import { fetchProducts } from "@/app/lib/cms";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = (await fetchProducts()).find((item) => item.slug === slug);

  if (!product) return { title: "Collectie — Botman Design" };

  return { title: `${product.nl.name} — Botman Design`, description: product.nl.tagline };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const products = await fetchProducts();

  if (!products.some((item) => item.slug === slug)) notFound();

  return <ProductDetail slug={slug} products={products} />;
}
