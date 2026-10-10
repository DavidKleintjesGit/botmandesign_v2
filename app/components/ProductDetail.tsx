"use client";

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
} from "@/app/content/products";

const detailCopy = {
  nl: {
    back: "Alle producten",
    addToCart: "In winkelmand",
    soldOut: "Uitverkocht",
    notify: "Houd mij op de hoogte",
    specs: "Details",
    alsoInteresting: "Ook mooi hierbij",
    lastOne: "Nog één op voorraad",
    fewLeft: (n: number) => `Nog ${n} op voorraad`,
  },
  en: {
    back: "All products",
    addToCart: "Add to cart",
    soldOut: "Sold out",
    notify: "Notify me",
    specs: "Details",
    alsoInteresting: "Goes well with",
    lastOne: "One left in stock",
    fewLeft: (n: number) => `${n} left in stock`,
  },
};

const serif = { fontFamily: "var(--font-cormorant-garamond), serif" } as const;
const sans = { fontFamily: "var(--font-montserrat)" } as const;

export default function ProductDetail({ slug, products }: { slug: string; products: Product[] }) {
  const { language } = useLanguage();
  const product = products.find((item) => item.slug === slug);

  if (!product) return null;

  const copy = detailCopy[language];
  const content = product[language];
  const soldOut = isSoldOut(product);

  const related = products.filter((p) => p.slug !== product.slug).slice(0, 3);

  return (
    <div style={{ backgroundColor: "var(--color-cedar)" }}>
      <SiteHeader />

      <section className="w-full pt-40 pb-20 md:pt-52 md:pb-28">
        <div className="container mx-auto px-4 md:px-8">
          <Link
            href="/collectie"
            className="mb-10 inline-block text-xs uppercase"
            style={{ ...sans, letterSpacing: "0.15em", color: "var(--color-almond)" }}
          >
            &larr; {copy.back}
          </Link>

          <div className="flex flex-col gap-12 md:flex-row md:gap-20">
            {/* Beeld */}
            <div className="md:w-1/2">
              <div className="relative overflow-hidden rounded-lg" style={{ aspectRatio: "4 / 5" }}>
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(ellipse 58% 42% at 50% 60%, rgba(182,163,144,0.18) 0%, rgba(182,163,144,0) 70%)",
                  }}
                />
                <Image
                  src={product.images[0]}
                  alt={content.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain p-10"
                />
              </div>
            </div>

            {/* Gegevens */}
            <div className="flex flex-col md:w-1/2">
              <p
                className="mb-4 text-xs uppercase"
                style={{ ...sans, letterSpacing: "0.2em", color: "var(--color-almond)" }}
              >
                {categoryLabels[product.category][language]}
              </p>

              <h1
                className="mb-5 text-3xl font-light uppercase tracking-wider md:text-4xl"
                style={{ ...serif, letterSpacing: "0.12em", color: "var(--color-champagne)" }}
              >
                {content.name}
              </h1>

              <p className="mb-8 text-lg leading-relaxed md:text-xl" style={{ ...serif, color: "var(--color-almond)" }}>
                {content.description}
              </p>

              <p className="mb-2 text-2xl md:text-3xl" style={{ ...serif, color: "var(--color-champagne)" }}>
                {formatPrice(product.priceCents, language)}
              </p>

              {!soldOut && product.stock !== null && product.stock <= 3 && (
                <p
                  className="mb-6 text-xs uppercase"
                  style={{ ...sans, letterSpacing: "0.15em", color: "var(--color-almond)" }}
                >
                  {product.stock === 1 ? copy.lastOne : copy.fewLeft(product.stock)}
                </p>
              )}

              {/*
                Afrekenen kan pas zodra er een winkelmand en een betaalprovider
                achter zitten. Tot die tijd leidt de knop naar contact, zodat
                niemand op een knop drukt die niets doet.
              */}
              <Link
                href={`/contact?product=${product.slug}`}
                className="mb-10 inline-block self-start rounded-full border px-6 py-3 text-sm font-light uppercase tracking-wider transition-all duration-300 hover:opacity-90"
                style={{
                  ...sans,
                  letterSpacing: "0.15em",
                  backgroundColor: soldOut ? "transparent" : "var(--color-champagne)",
                  borderColor: soldOut ? "var(--color-almond)" : "var(--color-champagne)",
                  color: soldOut ? "var(--color-champagne)" : "var(--color-cedar)",
                }}
              >
                {soldOut ? copy.notify : copy.addToCart}
              </Link>

              <div style={{ borderTop: "1px solid rgba(182, 163, 144, 0.25)" }} className="pt-8">
                <p
                  className="mb-5 text-xs uppercase"
                  style={{ ...sans, letterSpacing: "0.2em", color: "var(--color-champagne)" }}
                >
                  {copy.specs}
                </p>

                <dl className="flex flex-col gap-3">
                  {content.specs.map((spec) => (
                    <div key={spec.label} className="flex justify-between gap-6">
                      <dt className="text-base" style={{ ...serif, color: "var(--color-almond)" }}>
                        {spec.label}
                      </dt>
                      <dd className="text-right text-base" style={{ ...serif, color: "var(--color-champagne)" }}>
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="w-full pb-24 md:pb-32" style={{ borderTop: "1px solid rgba(182, 163, 144, 0.25)" }}>
          <div className="container mx-auto px-4 pt-20 md:px-8 md:pt-28">
            <p
              className="mb-10 text-sm uppercase md:text-base"
              style={{ ...sans, color: "var(--color-champagne)" }}
            >
              {copy.alsoInteresting}
            </p>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              {related.map((item) => (
                <Link key={item.slug} href={`/collectie/${item.slug}`} className="group block text-center">
                  <div className="relative mb-4 overflow-hidden rounded-lg" style={{ aspectRatio: "4 / 5" }}>
                    <Image
                      src={item.images[0]}
                      alt={item[language].name}
                      fill
                      loading="lazy"
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-contain p-6 transition-transform duration-700 group-hover:scale-[1.05]"
                    />
                  </div>
                  <h3
                    className="mb-1 text-lg font-light uppercase tracking-wider"
                    style={{ ...serif, letterSpacing: "0.1em", color: "var(--color-champagne)" }}
                  >
                    {item[language].name}
                  </h3>
                  <p className="text-base" style={{ ...serif, color: "var(--color-almond)" }}>
                    {formatPrice(item.priceCents, language)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
