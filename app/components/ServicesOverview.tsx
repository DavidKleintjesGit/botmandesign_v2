"use client";

import Image from "next/image";
import Link from "next/link";

import Footer from "./Footer";
import PageIntro from "./PageIntro";
import { useLanguage } from "./LanguageProvider";
import type { Service } from "@/app/content/services";

const overviewCopy = {
  en: {
    label: "STUDIO SERVICES",
    title: "Studio services",
    intro:
      "We offer a comprehensive, tailored approach to interior design — guiding our clients from first concept to the final layer of styling.",
    more: "More information",
  },
  nl: {
    label: "STUDIO SERVICES",
    title: "Studio services",
    intro:
      "Wij bieden een uitgebreide, op maat gemaakte aanpak voor interieurontwerp — die onze klanten begeleidt van eerste concept tot de laatste laag styling.",
    more: "Meer informatie",
  },
};

/*
 * De drie services, elk als een blok met beeld en tekst om en om. De typografie
 * volgt de dienstensectie op de homepage: champagne kop, almond lopende tekst,
 * de prijs in Cormorant en een omlijnde pil als doorklik.
 */
export default function ServicesOverview({
  services,
}: {
  services: Record<string, Service>;
}) {
  const { language } = useLanguage();
  const copy = overviewCopy[language];
  const entries = Object.entries(services);

  return (
    <div>
      <PageIntro label={copy.label} title={copy.title} intro={copy.intro} />

      <section className="w-full pb-24 md:pb-32">
        <div className="container mx-auto flex flex-col gap-20 px-4 md:gap-32 md:px-8">
          {entries.map(([slug, service], index) => {
            const content = service[language];
            const imageLeft = index % 2 === 0;

            return (
              <article
                key={slug}
                className="flex flex-col gap-10 md:flex-row md:items-center md:gap-16"
              >
                <div className={`md:w-1/2 ${imageLeft ? "" : "md:order-2"}`}>
                  <div
                    className="relative overflow-hidden rounded-lg"
                    style={{ aspectRatio: "4 / 5" }}
                  >
                    <Image
                      src={service.cardImage}
                      alt={content.name}
                      fill
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
                  className={`flex flex-col md:w-1/2 ${imageLeft ? "" : "md:order-1"}`}
                >
                  <p className="t-label t-label--sterk mb-5">
                    {service.number}
                  </p>

                  <h2 className="t-kop mb-6">{content.name}</h2>

                  <p className="t-tekst t-tekst--sterk mb-6">
                    {content.tagline}
                  </p>

                  <div className="mb-10 space-y-4">
                    <p className="t-tekst">{content.introOne}</p>
                    <p className="t-tekst">{content.introTwo}</p>
                  </div>

                  <div className="flex flex-col items-start gap-4">
                    <p className="t-tekst t-tekst--sterk">{content.price}</p>

                    <Link
                      href={`/services/${slug}`}
                      className="t-label inline-block rounded-full border px-5 py-2.5 transition-all duration-300 hover:opacity-90"
                      style={{
                        fontFamily: "var(--font-montserrat)",
                        letterSpacing: "0.15em",
                        backgroundColor: "var(--color-champagne)",
                        borderColor: "var(--color-champagne)",
                        color: "var(--color-cedar)",
                      }}
                    >
                      {copy.more}
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
}
