import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProductDetail from "@/app/components/ProductDetail";
import { getProduct, products } from "@/app/content/products";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) return { title: "Collectie — Botman Design" };

  return {
    title: `${product.nl.name} — Botman Design`,
    description: product.nl.tagline,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;

  if (!getProduct(slug)) notFound();

  return <ProductDetail slug={slug} />;
}
