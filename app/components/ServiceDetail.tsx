"use client";

import Image from "next/image";
import Link from "next/link";

import SiteHeader from "./SiteHeader";
import Footer from "./Footer";
import { useLanguage } from "./LanguageProvider";
import { getService } from "@/app/content/services";

const detailCopy = {
  en: {
    allServices: "All services",
    whyLabel: "Why this service",
    howLabel: "How it works",
    inquire: "Inquire",
  },
  nl: {
    allServices: "Alle services",
    whyLabel: "Waarom deze service",
    howLabel: "Hoe het werkt",
    inquire: "Aanvragen",
  },
};

const serif = { fontFamily: "var(--font-cormorant-garamond), serif" } as const;
const sans = { fontFamily: "var(--font-montserrat)" } as const;

export default function ServiceDetail({ slug }: { slug: string }) {
  const { language } = useLanguage();
  const service = getService(slug);

  if (!service) return null;

  const copy = detailCopy[language];
  const content = service[language];

  return (
    <div style={{ backgroundColor: "var(--color-cedar)" }}>
      <SiteHeader />

      {/* HERO — beeldvullend met het verloop naar cedar, zoals de header op de homepage */}
      <header className="relative h-screen w-full overflow-hidden">
        <Image
          src={service.heroImage}
          alt={content.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-20 h-64"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0))" }}
        />

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-96"
          style={{
            background:
              "linear-gradient(to top, var(--color-cedar) 0%, rgba(103, 92, 83, 0.9) 30%, rgba(103, 92, 83, 0.5) 60%, rgba(103, 92, 83, 0) 100%)",
          }}
        />

        <div className="absolute inset-x-0 bottom-0 z-30 pb-20 md:pb-28">
          <div className="container mx-auto px-4 text-center md:px-8">
            <p
              className="mb-6 text-sm uppercase md:text-base"
              style={{ ...sans, color: "var(--color-champagne)" }}
            >
              {service.number} &mdash; Service
            </p>

            <h1
              className="mb-6 text-4xl font-light uppercase tracking-wider md:text-5xl"
              style={{ ...serif, letterSpacing: "0.15em", color: "var(--color-champagne)" }}
            >
              {content.name}
            </h1>

            <p
              className="mx-auto max-w-2xl text-lg leading-relaxed md:text-xl"
              style={{ ...serif, color: "var(--color-almond)" }}
            >
              {content.tagline}
            </p>
          </div>
        </div>
      </header>

      {/* INTRO EN PRIJS */}
      <section className="w-full py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col gap-12 md:flex-row md:items-start md:gap-20">
            <div className="space-y-6 md:w-2/3">
              <p
                className="text-lg leading-relaxed md:text-xl"
                style={{ ...serif, color: "var(--color-almond)" }}
              >
                {content.introOne}
              </p>
              <p
                className="text-lg leading-relaxed md:text-xl"
                style={{ ...serif, color: "var(--color-almond)" }}
              >
                {content.introTwo}
              </p>
            </div>

            <div className="flex flex-col items-start gap-4 md:w-1/3 md:items-center md:text-center">
              <p
                className="text-3xl font-light md:text-4xl"
                style={{ ...serif, color: "var(--color-champagne)" }}
              >
                {content.price}
              </p>
              <p
                className="text-[11px] uppercase tracking-wider md:text-xs"
                style={{ ...sans, letterSpacing: "0.15em", color: "var(--color-almond)" }}
              >
                {content.priceUnit}
              </p>

              <Link
                href="/contact"
                className="mt-4 inline-block rounded-full border px-5 py-2.5 text-sm font-light uppercase tracking-wider transition-all duration-300 hover:opacity-90"
                style={{
                  ...sans,
                  letterSpacing: "0.15em",
                  backgroundColor: "var(--color-champagne)",
                  borderColor: "var(--color-champagne)",
                  color: "var(--color-cedar)",
                }}
              >
                {copy.inquire}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* REDENEN — vier kolommen met dunne scheidingslijnen, als de dienstenrij op de homepage */}
      <section className="w-full pb-20 md:pb-28">
        <div className="container mx-auto px-4 md:px-8">
          <p
            className="mb-10 text-center text-sm uppercase md:mb-14 md:text-base"
            style={{ ...sans, color: "var(--color-champagne)" }}
          >
            {copy.whyLabel}
          </p>

          <div className="flex flex-col gap-10 md:flex-row md:items-stretch md:gap-0">
            {content.reasons.map((reason, index) => (
              <div key={reason.n} className="flex flex-col md:flex-1 md:flex-row">
                <div className="flex flex-col items-center px-0 text-center md:flex-1 md:px-6">
                  <p
                    className="mb-5 text-2xl font-light"
                    style={{ ...serif, color: "var(--color-champagne)", opacity: 0.8 }}
                  >
                    {reason.n}
                  </p>
                  <p
                    className="text-base leading-relaxed md:text-lg"
                    style={{ ...serif, color: "var(--color-almond)" }}
                  >
                    {reason.text}
                  </p>
                </div>

                {index < content.reasons.length - 1 && (
                  <div className="hidden md:flex md:flex-shrink-0 md:items-center md:self-stretch">
                    <div
                      className="h-28 w-px"
                      style={{ backgroundColor: "var(--color-almond)", opacity: 0.5 }}
                      aria-hidden
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STAPPEN */}
      <section className="w-full pb-20 md:pb-28">
        <div className="container mx-auto px-4 md:px-8">
          <p
            className="mb-12 text-center text-sm uppercase md:mb-20 md:text-base"
            style={{ ...sans, color: "var(--color-champagne)" }}
          >
            {copy.howLabel}
          </p>

          <div className="flex flex-col gap-16 md:gap-28">
            {content.steps.map((step, index) => (
              <article key={step.title} className="flex flex-col gap-8 md:flex-row md:items-center md:gap-16">
                <div className={`md:w-1/2 ${index % 2 === 0 ? "" : "md:order-2"}`}>
                  <div className="relative overflow-hidden rounded-lg" style={{ aspectRatio: "4 / 3" }}>
                    <Image
                      src={step.img}
                      alt={step.title}
                      fill
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                    <div
                      className="pointer-events-none absolute inset-0 rounded-lg border"
                      style={{ borderColor: "rgba(182, 163, 144, 0.4)" }}
                    />
                  </div>
                </div>

                <div className={`md:w-1/2 ${index % 2 === 0 ? "" : "md:order-1"}`}>
                  <p
                    className="mb-4 text-sm uppercase"
                    style={{ ...sans, color: "var(--color-champagne)", opacity: 0.7 }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h2
                    className="mb-6 text-2xl font-light uppercase tracking-wider md:text-3xl"
                    style={{ ...serif, letterSpacing: "0.1em", color: "var(--color-champagne)" }}
                  >
                    {step.title}
                  </h2>
                  <p
                    className="text-base leading-relaxed md:text-lg"
                    style={{ ...serif, color: "var(--color-almond)" }}
                  >
                    {step.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section
        className="w-full py-20 md:py-28"
        style={{ borderTop: "1px solid rgba(182, 163, 144, 0.25)" }}
      >
        <div className="container mx-auto px-4 text-center md:px-8">
          <p
            className="mx-auto mb-6 max-w-3xl text-xl font-light leading-relaxed md:text-2xl"
            style={{ ...serif, color: "var(--color-champagne)" }}
          >
            {content.quote}
          </p>
          <p
            className="text-[11px] uppercase tracking-wider md:text-xs"
            style={{ ...sans, letterSpacing: "0.15em", color: "var(--color-almond)" }}
          >
            {content.quoteAttr}
          </p>

          <Link
            href="/services"
            className="mt-12 inline-block rounded-full border px-5 py-2.5 text-sm font-light uppercase tracking-wider transition-all duration-300 hover:opacity-90"
            style={{
              ...sans,
              letterSpacing: "0.15em",
              backgroundColor: "transparent",
              borderColor: "var(--color-almond)",
              color: "var(--color-champagne)",
            }}
          >
            &larr; {copy.allServices}
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
