"use client";

import Image from "next/image";
import Link from "next/link";

import Footer from "./Footer";
import { useLanguage } from "./LanguageProvider";
import type { Service } from "@/app/content/services";

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

export default function ServiceDetail({
  slug,
  services,
}: {
  slug: string;
  services: Record<string, Service>;
}) {
  const { language } = useLanguage();
  const service = services[slug];

  if (!service) return null;

  const copy = detailCopy[language];
  const content = service[language];

  return (
    <div>
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
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0))",
          }}
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
            <p className="t-label t-label--sterk mb-6">
              {service.number} &mdash; Service
            </p>

            <h1 className="t-kop mb-6">{content.name}</h1>

            <p className="t-tekst mx-auto max-w-2xl">{content.tagline}</p>
          </div>
        </div>
      </header>

      {/* INTRO EN PRIJS */}
      <section className="w-full py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col gap-12 md:flex-row md:items-start md:gap-20">
            <div className="space-y-6 md:w-2/3">
              <p className="t-tekst">{content.introOne}</p>
              {content.introTwo && (
                <p className="t-tekst">{content.introTwo}</p>
              )}
            </div>

            <div className="flex flex-col items-start gap-4 md:w-1/3 md:items-center md:text-center">
              <p className="t-tekst">{content.price}</p>

              <Link
                href="/contact"
                className="t-label mt-4 inline-block rounded-full border px-5 py-2.5 transition-all duration-300 hover:opacity-90"
                style={{
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
      {content.reasons && content.reasons.length > 0 && (
        <section className="w-full pb-20 md:pb-28">
          <div className="container mx-auto px-4 md:px-8">
            <p className="t-label t-label--sterk mb-10 md:mb-14">
              {copy.whyLabel}
            </p>

            <div className="flex flex-col gap-10 md:flex-row md:items-stretch md:gap-0">
              {content.reasons!.map((reason, index) => (
                <div
                  key={reason.n}
                  className="flex flex-col md:flex-1 md:flex-row"
                >
                  <div className="flex flex-col items-center px-0 text-center md:flex-1 md:px-6">
                    <p className="t-tekst mb-5">{reason.n}</p>
                    <p className="t-tekst">{reason.text}</p>
                  </div>

                  {index < content.reasons!.length - 1 && (
                    <div className="hidden md:flex md:flex-shrink-0 md:items-center md:self-stretch">
                      <div
                        className="h-28 w-px"
                        style={{
                          backgroundColor: "var(--color-almond)",
                          opacity: 0.5,
                        }}
                        aria-hidden
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* STAPPEN */}
      {content.steps && content.steps.length > 0 && (
        <section className="w-full pb-20 md:pb-28">
          <div className="container mx-auto px-4 md:px-8">
            <p className="t-label t-label--sterk mb-12 md:mb-20">
              {copy.howLabel}
            </p>

            <div className="flex flex-col gap-16 md:gap-28">
              {content.steps!.map((step, index) => (
                <article
                  key={step.title}
                  className="flex flex-col gap-8 md:flex-row md:items-center md:gap-16"
                >
                  <div
                    className={`md:w-1/2 ${index % 2 === 0 ? "" : "md:order-2"}`}
                  >
                    <div
                      className="relative overflow-hidden rounded-lg"
                      style={{ aspectRatio: "4 / 3" }}
                    >
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

                  <div
                    className={`md:w-1/2 ${index % 2 === 0 ? "" : "md:order-1"}`}
                  >
                    <p className="t-label t-label--sterk mb-4">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h2 className="t-kop mb-6">{step.title}</h2>
                    <p className="t-tekst">{step.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* QUOTE */}
      {content.quote && (
        <section
          className="w-full py-20 md:py-28"
          style={{ borderTop: "1px solid rgba(182, 163, 144, 0.25)" }}
        >
          <div className="container mx-auto px-4 text-center md:px-8">
            <p className="t-tekst mx-auto mb-6 max-w-3xl">{content.quote}</p>
            <p className="t-label">{content.quoteAttr}</p>

            <Link
              href="/services"
              className="t-label mt-12 inline-block rounded-full border px-5 py-2.5 transition-all duration-300 hover:opacity-90"
              style={{
                backgroundColor: "transparent",
                borderColor: "var(--color-almond)",
                color: "var(--color-champagne)",
              }}
            >
              &larr; {copy.allServices}
            </Link>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
