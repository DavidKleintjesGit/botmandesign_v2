"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

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

/*
 * De collectie staat op champagne in plaats van cedar, zodat de winkel zich
 * onderscheidt van de rest van de site. Op die lichte grond is zwart de
 * koptekst (16,4:1) en cedar de zachtere laag eronder (5,1:1) — precies de rol
 * die het merkblad cedar geeft: tekst op een lichte achtergrond.
 */
const SURFACE = "var(--color-champagne)";
const INK = "var(--color-black)";
const INK_SOFT = "var(--color-cedar)";

export default function ShopOverview({ products }: { products: Product[] }) {
  const { language } = useLanguage();
  const copy = shopCopy[language];

  const [active, setActive] = useState<ProductCategory | "all">("all");

  const categories = Array.from(new Set(products.map((p) => p.category)));
  const shown =
    active === "all" ? products : products.filter((p) => p.category === active);

  return (
    <div>
      <section className="w-full pt-40 pb-12 md:pt-52 md:pb-16">
        <div className="container mx-auto px-4 md:px-8">
          <p className="t-label mb-6">{copy.label}</p>

          <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
            <h1 className="t-kop">
              {copy.title}
              <br />
              <span style={{ color: INK_SOFT }}>{copy.titleAccent}</span>
            </h1>

            <p className="t-tekst max-w-md">{copy.intro}</p>
          </div>
        </div>
      </section>

      {/* Filter op categorie */}
      <section className="w-full pb-12">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-wrap gap-3">
            <CategoryButton
              label={copy.all}
              active={active === "all"}
              onClick={() => setActive("all")}
            />
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
              <ProductCard
                key={product.slug}
                product={product}
                soldOutLabel={copy.soldOut}
              />
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
      className="t-label cursor-pointer rounded-full border px-5 py-2 transition-all duration-300"
      style={{
        backgroundColor: active ? INK : "transparent",
        borderColor: active ? INK : "rgba(103, 92, 83, 0.4)",
        color: active ? SURFACE : INK,
      }}
    >
      {label}
    </button>
  );
}

function ProductCard({
  product,
  soldOutLabel,
}: {
  product: Product;
  soldOutLabel: string;
}) {
  const { language } = useLanguage();
  const content = product[language];
  const soldOut = isSoldOut(product);

  return (
    // Tekst gecentreerd onder het object; links uitgelijnd leest scheef
    // naast een beeld dat zelf in het midden staat.
    <Link
      href={`/collectie/${product.slug}`}
      className="group block text-center"
    >
      {/*
        De artikelen staan als uitgeknipt object op het cedar in plaats van in
        een omlijnde kaart. Een zachte gloed eronder geeft ze grond, zodat ze
        zweven in plaats van te plakken.
      */}
      <div
        className="relative mb-5 overflow-hidden rounded-lg"
        style={{ aspectRatio: "4 / 5" }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 58% 42% at 50% 62%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 70%)",
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
            className="t-label absolute left-4 top-4 rounded-full px-3 py-1.5"
            style={{
              backgroundColor: INK_SOFT,
              color: SURFACE,
            }}
          >
            {soldOutLabel}
          </div>
        )}
      </div>

      <h2 className="t-titel mb-2">{content.name}</h2>

      <p className="t-tekst mb-3">{content.tagline}</p>

      <p className="t-tekst">{formatPrice(product.priceCents, language)}</p>
    </Link>
  );
}
