"use client";

import Image from "next/image";
import Link from "next/link";

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

// Zelfde grond als het overzicht: champagne, met zwart en cedar erop.
/*
 * De collectie staat op champagne in plaats van cedar, zodat de winkel zich
 * onderscheidt van de rest van de site. Op die lichte grond is zwart de
 * koptekst (16,4:1) en cedar de zachtere laag eronder (5,1:1) — precies de rol
 * die het merkblad cedar geeft: tekst op een lichte achtergrond.
 */
const SURFACE = "var(--color-champagne)";
const INK = "var(--color-black)";
const INK_SOFT = "var(--color-cedar)";
const LINE = "rgba(103, 92, 83, 0.25)";

export default function ProductDetail({
  slug,
  products,
}: {
  slug: string;
  products: Product[];
}) {
  const { language } = useLanguage();
  const product = products.find((item) => item.slug === slug);

  if (!product) return null;

  const copy = detailCopy[language];
  const content = product[language];
  const soldOut = isSoldOut(product);

  const related = products.filter((p) => p.slug !== product.slug).slice(0, 3);

  return (
    <div>
      <section className="w-full pt-40 pb-20 md:pt-52 md:pb-28">
        <div className="container mx-auto px-4 md:px-8">
          <Link href="/collectie" className="t-label mb-10 inline-block">
            &larr; {copy.back}
          </Link>

          <div className="flex flex-col gap-12 md:flex-row md:gap-20">
            {/* Beeld */}
            <div className="md:w-1/2">
              <div
                className="relative overflow-hidden rounded-lg"
                style={{ aspectRatio: "4 / 5" }}
              >
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(ellipse 58% 42% at 50% 60%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 70%)",
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
              <p className="t-label mb-4">
                {categoryLabels[product.category][language]}
              </p>

              <h1 className="t-kop mb-5">{content.name}</h1>

              <p className="t-tekst mb-8">{content.description}</p>

              <p className="t-tekst mb-2">
                {formatPrice(product.priceCents, language)}
              </p>

              {!soldOut && product.stock !== null && product.stock <= 3 && (
                <p className="t-label mb-6">
                  {product.stock === 1
                    ? copy.lastOne
                    : copy.fewLeft(product.stock)}
                </p>
              )}

              {/*
                Afrekenen kan pas zodra er een winkelmand en een betaalprovider
                achter zitten. Tot die tijd leidt de knop naar contact, zodat
                niemand op een knop drukt die niets doet.
              */}
              <Link
                href={`/contact?product=${product.slug}`}
                className="t-label mb-10 inline-block self-start rounded-full border px-6 py-3 transition-all duration-300 hover:opacity-90"
                style={{
                  backgroundColor: soldOut ? "transparent" : INK,
                  borderColor: soldOut ? "rgba(103, 92, 83, 0.4)" : INK,
                  color: soldOut ? INK : SURFACE,
                }}
              >
                {soldOut ? copy.notify : copy.addToCart}
              </Link>

              <div style={{ borderTop: `1px solid ${LINE}` }} className="pt-8">
                <p className="t-label mb-5">{copy.specs}</p>

                <dl className="flex flex-col gap-3">
                  {content.specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="flex justify-between gap-6"
                    >
                      <dt className="t-tekst">{spec.label}</dt>
                      <dd className="t-tekst">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section
          className="w-full pb-24 md:pb-32"
          style={{ borderTop: `1px solid ${LINE}` }}
        >
          <div className="container mx-auto px-4 pt-20 md:px-8 md:pt-28">
            <p className="t-label mb-10">{copy.alsoInteresting}</p>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/collectie/${item.slug}`}
                  className="group block text-center"
                >
                  <div
                    className="relative mb-4 overflow-hidden rounded-lg"
                    style={{ aspectRatio: "4 / 5" }}
                  >
                    <Image
                      src={item.images[0]}
                      alt={item[language].name}
                      fill
                      loading="lazy"
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-contain p-6 transition-transform duration-700 group-hover:scale-[1.05]"
                    />
                  </div>
                  <h3 className="t-label mb-1">{item[language].name}</h3>
                  <p className="t-tekst">
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
