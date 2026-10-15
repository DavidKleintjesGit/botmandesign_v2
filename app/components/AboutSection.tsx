"use client";

import Image from "next/image";
import Link from "next/link";

import { useLanguage } from "./LanguageProvider";
import { homeCopy } from "@/app/content/home";

/*
 * Het verhaal uit Bas zijn ontwerp: "De kunst van thuis voelen".
 *
 * Dezelfde taal als de projectpagina's en de diensten erboven: één rij van
 * rand tot rand, met de tekst als tegel ernaast in plaats van als blok met
 * marges eromheen.
 *
 * Hiervoor stond de kop bovenaan, dan een gat van een halve schermhoogte, en
 * daaronder pas de tekst met het beeld ernaast — drie losse dingen op een
 * pagina die verder alles aan elkaar sluit. De kop hoort bij de tekst, dus
 * staat hij nu in dezelfde tegel.
 */
export default function AboutSection() {
  const { language } = useLanguage();
  const copy = homeCopy[language];

  return (
    <section className="w-full" style={{ backgroundColor: "var(--color-cedar)" }}>
      <div className="flex w-full flex-col md:h-[88vh] md:flex-row">
        <div className="flex w-full flex-col justify-center gap-7 px-[clamp(20px,4vw,64px)] py-16 md:h-full md:w-[46%] md:py-12">
          <h2 className="t-kop">
            {copy.storyLabel}
            <br />
            <span style={{ color: "var(--ink-zacht)" }}>{copy.storyTitle}</span>
          </h2>

          <div className="space-y-5">
            {copy.storyParagraphs.map((paragraph) => (
              <p key={paragraph} className="t-tekst max-w-prose">
                {paragraph}
              </p>
            ))}
          </div>

          <Link
            href="/services"
            className="t-label mt-2 inline-block self-start rounded-full border px-5 py-2.5 transition-all duration-300 hover:opacity-90"
            style={{ borderColor: "var(--color-almond)", color: "var(--color-champagne)" }}
          >
            {copy.storyLink}
          </Link>
        </div>

        <div className="group relative aspect-[4/3] w-full overflow-hidden md:aspect-auto md:h-full md:w-[54%]">
          <Image
            src="/images/DSC08890.jpg"
            alt="Bas Botman"
            fill
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 54vw"
            quality={95}
            className="object-cover object-bottom transition-transform duration-[2000ms] ease-out group-hover:scale-[1.025]"
          />
        </div>
      </div>
    </section>
  );
}
