"use client";

import Image from "next/image";
import Link from "next/link";

import { useLanguage } from "./LanguageProvider";
import { homeCopy } from "@/app/content/home";

/*
 * Het verhaal uit Bas zijn ontwerp: "De kunst van thuis voelen". Tekst links,
 * beeld rechts tegen de rand — dezelfde opbouw als de rest van de homepage.
 */
export default function AboutSection() {
  const { language } = useLanguage();
  const copy = homeCopy[language];

  return (
    <section
      className="relative w-full overflow-hidden pt-20 pb-32 md:pt-32 md:pb-48"
      style={{ backgroundColor: "var(--color-cedar)" }}
    >
      <div className="container relative z-20 mx-auto px-4 md:pr-[50%] md:pb-0 md:px-8">
        <div className="flex max-w-2xl flex-col">
          <h2
            className="mb-8 text-3xl font-light uppercase tracking-wider md:text-4xl lg:text-5xl"
            style={{
              fontFamily: "var(--font-cormorant-garamond), serif",
              letterSpacing: "0.15em",
              color: "var(--color-champagne)",
            }}
          >
            {copy.storyLabel}
            <br />
            <span style={{ color: "var(--color-almond)" }}>{copy.storyTitle}</span>
          </h2>

          <div className="space-y-6">
            {copy.storyParagraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="text-lg leading-relaxed md:text-xl"
                style={{
                  fontFamily: "var(--font-cormorant-garamond), serif",
                  color: "var(--color-almond)",
                }}
              >
                {paragraph}
              </p>
            ))}
          </div>

          <Link
            href="/services"
            className="mt-10 inline-block self-start rounded-full border px-5 py-2.5 text-sm font-light uppercase tracking-wider transition-all duration-300 hover:opacity-90"
            style={{
              fontFamily: "var(--font-montserrat)",
              letterSpacing: "0.15em",
              backgroundColor: "transparent",
              borderColor: "var(--color-almond)",
              color: "var(--color-champagne)",
            }}
          >
            {copy.storyLink}
          </Link>
        </div>
      </div>

      {/* Beeld — op desktop tegen de rechterrand, op mobiel onder de tekst */}
      <div className="relative mt-12 h-[400px] w-full overflow-hidden rounded-l-lg md:absolute md:right-0 md:top-0 md:bottom-0 md:mt-0 md:h-auto md:w-1/2">
        <Image
          src="/images/DSC08890.jpg"
          alt="Bas Botman"
          fill
          className="object-cover object-bottom opacity-90"
          sizes="(max-width: 768px) 100vw, 50vw"
          quality={95}
          priority
        />
        <div
          className="absolute inset-0 rounded-l-lg border-b border-l border-t"
          style={{ borderColor: "rgba(182, 163, 144, 0.4)" }}
        />

        {/*
         * Het beeld liep met een kaarsrechte rand tegen de cedar aan, boven en
         * onder. Deze twee banden laten het eruit opkomen en er weer in
         * verdwijnen — dezelfde manier waarop beeld elders op de site in de
         * grond oplost.
         */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-28 md:h-40"
          style={{
            background:
              "linear-gradient(to bottom, var(--color-cedar) 0%, rgba(103, 92, 83, 0.75) 35%, rgba(103, 92, 83, 0) 100%)",
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-28 md:h-40"
          style={{
            background:
              "linear-gradient(to top, var(--color-cedar) 0%, rgba(103, 92, 83, 0.75) 35%, rgba(103, 92, 83, 0) 100%)",
          }}
          aria-hidden
        />
      </div>
    </section>
  );
}
