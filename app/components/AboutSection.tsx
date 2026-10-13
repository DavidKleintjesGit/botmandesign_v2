"use client";

import Image from "next/image";
import Link from "next/link";

import { useLanguage } from "./LanguageProvider";
import { homeCopy } from "@/app/content/home";

/*
 * Het verhaal uit Bas zijn ontwerp: "De kunst van thuis voelen".
 *
 * Het beeld stond hier eerst over de volle hoogte tegen de rechterrand, en
 * begon precies waar de dienstensectie ophield. Je las een scherm vol
 * gecentreerde tekst en kreeg dan ineens een omlijst vlak van ruim achthonderd
 * pixels hoog naast je. Een verloop eroverheen maakte dat niet zachter, alleen
 * doffer: bruine mist over een foto.
 *
 * Nu opent de sectie met de kop over de volle breedte, zoals elke andere
 * sectie op de homepage, en komt het beeld daarónder pas in beeld — naast de
 * tekst, binnen dezelfde marges als de projecten erboven. Het raakt de naad
 * niet meer, dus hoeft er ook niets weggemoffeld te worden.
 */
export default function AboutSection() {
  const { language } = useLanguage();
  const copy = homeCopy[language];

  return (
    <section
      className="w-full pt-24 pb-24 md:pt-32 md:pb-32"
      style={{ backgroundColor: "var(--color-cedar)" }}
    >
      <div className="container mx-auto px-4 md:px-8">
        <h2 className="t-kop">
          {copy.storyLabel}
          <br />
          <span style={{ color: "var(--color-almond)" }}>
            {copy.storyTitle}
          </span>
        </h2>

        <div className="mt-14 grid grid-cols-1 items-center gap-12 md:mt-20 md:grid-cols-2 md:gap-20">
          <div className="flex flex-col">
            <div className="space-y-6">
              {copy.storyParagraphs.map((paragraph) => (
                <p key={paragraph} className="t-tekst">
                  {paragraph}
                </p>
              ))}
            </div>

            <Link
              href="/services"
              className="t-label mt-10 inline-block self-start rounded-full border px-5 py-2.5 transition-all duration-300 hover:opacity-90"
              style={{
                backgroundColor: "transparent",
                borderColor: "var(--color-almond)",
                color: "var(--color-champagne)",
              }}
            >
              {copy.storyLink}
            </Link>
          </div>

          <div
            className="relative w-full overflow-hidden"
            style={{ aspectRatio: "4 / 5" }}
          >
            <Image
              src="/images/DSC08890.jpg"
              alt="Bas Botman"
              fill
              className="object-cover object-bottom"
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={95}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
