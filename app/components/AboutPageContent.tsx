"use client";

import Image from "next/image";
import Link from "next/link";

import SiteHeader from "./SiteHeader";
import Footer from "./Footer";
import { useLanguage } from "./LanguageProvider";
import { aboutCopy } from "@/app/content/about";

const serif = { fontFamily: "var(--font-cormorant-garamond), serif" } as const;
const sans = { fontFamily: "var(--font-montserrat)" } as const;

/** De biografie van Bas: portret links, verhaal rechts, in de opmaak van de site. */
export default function AboutPageContent() {
  const { language } = useLanguage();
  const copy = aboutCopy[language];

  return (
    <div style={{ backgroundColor: "var(--color-cedar)" }}>
      <SiteHeader />

      <section className="w-full pt-40 pb-16 md:pt-52 md:pb-24">
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
            </h1>

            <p
              className="max-w-md text-lg leading-relaxed md:text-xl"
              style={{ ...serif, color: "var(--color-almond)" }}
            >
              {copy.lead}
            </p>
          </div>
        </div>
      </section>

      <section className="w-full pb-24 md:pb-32">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col gap-12 md:flex-row md:gap-20">
            <div className="md:w-2/5">
              <div className="relative overflow-hidden rounded-lg" style={{ aspectRatio: "4 / 5" }}>
                <Image
                  src="/images/DSC08890.jpg"
                  alt="Bas Botman"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover object-bottom"
                  quality={90}
                />
                <div
                  className="pointer-events-none absolute inset-0 rounded-lg border"
                  style={{ borderColor: "rgba(182, 163, 144, 0.4)" }}
                />
              </div>
            </div>

            <div className="flex flex-col md:w-3/5">
              <div className="space-y-6">
                {copy.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 40)}
                    className="text-lg leading-relaxed md:text-xl"
                    style={{ ...serif, color: "var(--color-almond)" }}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-12 flex flex-wrap gap-4">
                <Link
                  href="/services"
                  className="inline-block rounded-full border px-5 py-2.5 text-sm font-light uppercase tracking-wider transition-all duration-300 hover:opacity-90"
                  style={{
                    ...sans,
                    letterSpacing: "0.15em",
                    backgroundColor: "var(--color-champagne)",
                    borderColor: "var(--color-champagne)",
                    color: "var(--color-cedar)",
                  }}
                >
                  {copy.servicesLink}
                </Link>

                <Link
                  href="/contact"
                  className="inline-block rounded-full border px-5 py-2.5 text-sm font-light uppercase tracking-wider transition-all duration-300 hover:opacity-90"
                  style={{
                    ...sans,
                    letterSpacing: "0.15em",
                    backgroundColor: "transparent",
                    borderColor: "var(--color-almond)",
                    color: "var(--color-champagne)",
                  }}
                >
                  {copy.contactLink}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
