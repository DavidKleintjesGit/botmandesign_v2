"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import SiteHeader from "./SiteHeader";
import Footer from "./Footer";
import { useLanguage } from "./LanguageProvider";
import {
  categoryLabels,
  formatPrice,
  isSoldOut,
  type Product,
  type ProductCategory,
} from "@/app/content/products";

const shopCopy = {
  nl: {
    label: "COLLECTIE",
    title: "De collectie.",
    titleAccent: "Zorgvuldig gekozen.",
    intro:
      "Objecten, textiel en verlichting die we zelf in projecten gebruiken. Gekozen om een ruimte af te maken, niet om hem te vullen.",
    all: "Alles",
    soldOut: "Uitverkocht",
  },
  en: {
    label: "COLLECTION",
    title: "The collection.",
    titleAccent: "Carefully chosen.",
    intro:
      "Objects, textiles and lighting we use in our own projects. Chosen to finish a room, not to fill it.",
    all: "All",
    soldOut: "Sold out",
  },
};

const serif = { fontFamily: "var(--font-cormorant-garamond), serif" } as const;
const sans = { fontFamily: "var(--font-montserrat)" } as const;

export default function ShopOverview({ products }: { products: Product[] }) {
  const { language } = useLanguage();
  const copy = shopCopy[language];

  const [active, setActive] = useState<ProductCategory | "all">("all");

  const categories = Array.from(new Set(products.map((p) => p.category)));
  const shown = active === "all" ? products : products.filter((p) => p.category === active);

  return (
    <div style={{ backgroundColor: "var(--color-cedar)" }}>
      <SiteHeader />

      <section className="w-full pt-40 pb-12 md:pt-52 md:pb-16">
        <div className="container mx-auto px-4 md:px-8">
          <p className="mb-6 text-sm uppercase md:text-base" style={{ ...sans, color: "var(--color-champagne)" }}>
            {copy.label}
          </p>

          <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
            <h1
              className="text-3xl font-light uppercase tracking-wider md:text-4xl lg:text-5xl"
              style={{ ...serif, letterSpacing: "0.15em", color: "var(--color-champagne)" }}
            >
              {copy.title}
              <br />
              <span style={{ color: "var(--color-almond)" }}>{copy.titleAccent}</span>
            </h1>

            <p
              className="max-w-md text-lg leading-relaxed md:text-xl"
              style={{ ...serif, color: "var(--color-almond)" }}
            >
              {copy.intro}
            </p>
          </div>
        </div>
      </section>

      {/* Filter op categorie */}
      <section className="w-full pb-12">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-wrap gap-3">
            <CategoryButton label={copy.all} active={active === "all"} onClick={() => setActive("all")} />
            {categories.map((category) => (
              <CategoryButton
                key={category}
                label={categoryLabels[category][language]}
                active={active === category}
                onClick={() => setActive(category)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="w-full pb-24 md:pb-32">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((product) => (
              <ProductCard key={product.slug} product={product} soldOutLabel={copy.soldOut} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function CategoryButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer rounded-full border px-5 py-2 text-xs uppercase transition-all duration-300"
      style={{
        ...sans,
        letterSpacing: "0.15em",
        backgroundColor: active ? "var(--color-champagne)" : "transparent",
        borderColor: active ? "var(--color-champagne)" : "var(--color-almond)",
        color: active ? "var(--color-cedar)" : "var(--color-champagne)",
      }}
    >
      {label}
    </button>
  );
}

function ProductCard({ product, soldOutLabel }: { product: Product; soldOutLabel: string }) {
  const { language } = useLanguage();
  const content = product[language];
  const soldOut = isSoldOut(product);

  return (
    // Tekst gecentreerd onder het object; links uitgelijnd leest scheef
    // naast een beeld dat zelf in het midden staat.
    <Link href={`/collectie/${product.slug}`} className="group block text-center">
      {/*
        De artikelen staan als uitgeknipt object op het cedar in plaats van in
        een omlijnde kaart. Een zachte gloed eronder geeft ze grond, zodat ze
        zweven in plaats van te plakken.
      */}
      <div className="relative mb-5 overflow-hidden rounded-lg" style={{ aspectRatio: "4 / 5" }}>
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 58% 42% at 50% 62%, rgba(182,163,144,0.16) 0%, rgba(182,163,144,0) 70%)",
          }}
        />
        <Image
          src={product.images[0]}
          alt={content.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-contain p-8 transition-transform duration-700 group-hover:scale-[1.05]"
        />

        {soldOut && (
          <div
            className="absolute left-4 top-4 rounded-full px-3 py-1.5 text-[10px] uppercase"
            style={{
              ...sans,
              letterSpacing: "0.15em",
              backgroundColor: "rgba(10,9,7,0.6)",
              color: "var(--color-champagne)",
            }}
          >
            {soldOutLabel}
          </div>
        )}
      </div>

      <h2
        className="mb-2 text-xl font-light uppercase tracking-wider"
        style={{ ...serif, letterSpacing: "0.1em", color: "var(--color-champagne)" }}
      >
        {content.name}
      </h2>

      <p className="mb-3 text-base leading-relaxed" style={{ ...serif, color: "var(--color-almond)" }}>
        {content.tagline}
      </p>

      <p className="text-lg" style={{ ...serif, color: "var(--color-champagne)" }}>
        {formatPrice(product.priceCents, language)}
      </p>
    </Link>
  );
}
