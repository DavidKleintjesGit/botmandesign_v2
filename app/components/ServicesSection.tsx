"use client";

import Image from "next/image";
import Link from "next/link";

import type { Service } from "@/app/content/services";
import { useLanguage } from "./LanguageProvider";

const sectionCopy = {
  en: { more: "More info" },
  nl: { more: "Meer info" },
};

/*
 * Dezelfde taal als de projectpagina's: rijen van rand tot rand, elk met een
 * eigen maat, en de tekst als tegel binnen die rij in plaats van ernaast.
 *
 * Hier stonden drie kolommen tekst met haarlijntjes ertussen en geen enkel
 * beeld. Dat is het tegenovergestelde van wat de rest van de site doet: je
 * komt uit beeld, krijgt een muur van woorden, en gaat weer door naar beeld.
 *
 * De maten wisselen per rij en de tekst wisselt van kant, zodat er geen twee
 * naden op één lijn liggen.
 */
const RITME = [
  { beeld: 0.64, tekst: 0.36, hoogte: "78vh", tekstLinks: false },
  { beeld: 0.58, tekst: 0.42, hoogte: "70vh", tekstLinks: true },
  { beeld: 0.68, tekst: 0.32, hoogte: "82vh", tekstLinks: false },
];

export default function ServicesSection({
  services,
}: {
  services: Record<string, Service>;
}) {
  const { language } = useLanguage();
  const copy = sectionCopy[language];

  const blokken = Object.entries(services).map(([slug, service], i) => {
    const content = service[language];
    const maat = RITME[i % RITME.length];

    return {
      slug,
      maat,
      beeld: service.cardImage,
      naam: content.name,
      regel: content.tagline,
      prijs: content.price,
    };
  });

  return (
    <section className="w-full" style={{ backgroundColor: "var(--color-cedar)" }}>
      {blokken.map((blok) => {
        const tegel = (
          <div
            className="flex w-full flex-col justify-center gap-5 px-[clamp(20px,3vw,48px)] py-14 md:h-[var(--hoog)] md:w-[var(--tekst)] md:py-10"
            style={{ "--tekst": `${blok.maat.tekst * 100}%` } as React.CSSProperties}
          >
            <h3 className="t-titel">{blok.naam}</h3>
            <p className="t-tekst">{blok.regel}</p>
            <p className="t-label">{blok.prijs}</p>

            <Link
              href={`/services/${blok.slug}`}
              className="t-label mt-2 inline-block self-start rounded-full border px-5 py-2.5 transition-all duration-300 hover:opacity-90"
              style={{ borderColor: "var(--color-almond)", color: "var(--color-champagne)" }}
            >
              {copy.more}
            </Link>
          </div>
        );

        const beeld = (
          <Link
            href={`/services/${blok.slug}`}
            className="group relative aspect-[4/3] w-full overflow-hidden md:aspect-auto md:h-[var(--hoog)] md:w-[var(--beeld)]"
            style={{ "--beeld": `${blok.maat.beeld * 100}%` } as React.CSSProperties}
          >
            <Image
              src={blok.beeld}
              alt={blok.naam}
              fill
              loading="lazy"
              sizes={`(max-width: 768px) 100vw, ${Math.round(blok.maat.beeld * 100)}vw`}
              className="object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-[1.025]"
            />
          </Link>
        );

        return (
          <div
            key={blok.slug}
            className="flex w-full flex-col md:flex-row"
            style={{ "--hoog": blok.maat.hoogte } as React.CSSProperties}
          >
            {blok.maat.tekstLinks ? (
              <>
                {tegel}
                {beeld}
              </>
            ) : (
              <>
                {beeld}
                {tegel}
              </>
            )}
          </div>
        );
      })}
    </section>
  );
}
