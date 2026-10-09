"use client";

import Image from "next/image";
import Link from "next/link";

import { useLanguage } from "./LanguageProvider";
import { homeCopy } from "@/app/content/home";

/*
 * De afsluiter van de homepage. Het beeld blijft, maar draagt nu de tekst uit
 * Bas zijn ontwerp: "Klaar voor uw huis?" met de doorklik naar contact.
 */
export default function CTA() {
  const { language } = useLanguage();
  const copy = homeCopy[language];

  return (
    <section className="relative h-screen w-full overflow-hidden" style={{ zIndex: 10 }}>
      <div className="absolute inset-0 h-full w-full">
        <Image
          src="/images/image (3).png"
          alt="CTA background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Verloop vanaf de AboutSection erboven */}
      <div
        className="pointer-events-none absolute left-0 right-0 top-0 z-20 h-96"
        style={{
          background:
            "linear-gradient(to bottom, var(--color-cedar) 0%, rgba(103, 92, 83, 0.9) 30%, rgba(103, 92, 83, 0.5) 60%, rgba(103, 92, 83, 0) 100%)",
        }}
      />

      {/* Verloop naar de footer eronder, zodat de tekst leesbaar blijft */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 h-[70%]"
        style={{
          background:
            "linear-gradient(to top, var(--color-cedar) 0%, rgba(103, 92, 83, 0.92) 35%, rgba(103, 92, 83, 0.55) 65%, rgba(103, 92, 83, 0) 100%)",
        }}
      />

      <div className="absolute inset-x-0 bottom-0 z-30 pb-20 md:pb-28">
        <div className="container mx-auto flex flex-col items-center gap-6 px-4 text-center md:px-8">
          <h2
            className="text-4xl font-light uppercase tracking-wider md:text-5xl"
            style={{
              fontFamily: "var(--font-cormorant-garamond), serif",
              letterSpacing: "0.15em",
              color: "var(--color-champagne)",
            }}
          >
            {copy.ctaTitle}
          </h2>

          <p
            className="max-w-xl text-lg leading-relaxed md:text-xl"
            style={{
              fontFamily: "var(--font-cormorant-garamond), serif",
              color: "var(--color-almond)",
            }}
          >
            {copy.ctaBody}
          </p>

          <Link
            href="/contact"
            className="mt-4 inline-block rounded-full border px-6 py-2.5 text-sm font-light uppercase tracking-wider transition-all duration-300 hover:opacity-90"
            style={{
              fontFamily: "var(--font-montserrat)",
              letterSpacing: "0.15em",
              backgroundColor: "var(--color-champagne)",
              borderColor: "var(--color-champagne)",
              color: "var(--color-cedar)",
            }}
          >
            {copy.ctaButton}
          </Link>
        </div>
      </div>
    </section>
  );
}
