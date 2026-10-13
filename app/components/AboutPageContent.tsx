"use client";

import Image from "next/image";
import Link from "next/link";

import Footer from "./Footer";
import { useLanguage } from "./LanguageProvider";
import { aboutCopy } from "@/app/content/about";

/** De biografie van Bas: portret links, verhaal rechts, in de opmaak van de site. */
export default function AboutPageContent() {
  const { language } = useLanguage();
  const copy = aboutCopy[language];

  return (
    <div>
      <section className="w-full pt-40 pb-16 md:pt-52 md:pb-24">
        <div className="container mx-auto px-4 md:px-8">
          <p className="t-label t-label--sterk mb-6">{copy.label}</p>

          <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
            <h1 className="t-kop">{copy.title}</h1>

            <p className="t-tekst max-w-md">{copy.lead}</p>
          </div>
        </div>
      </section>

      <section className="w-full pb-24 md:pb-32">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col gap-12 md:flex-row md:gap-20">
            <div className="md:w-2/5">
              <div
                className="relative overflow-hidden rounded-lg"
                style={{ aspectRatio: "4 / 5" }}
              >
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
                  <p key={paragraph.slice(0, 40)} className="t-tekst">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-12 flex flex-wrap gap-4">
                <Link
                  href="/services"
                  className="t-label inline-block rounded-full border px-5 py-2.5 transition-all duration-300 hover:opacity-90"
                  style={{
                    backgroundColor: "var(--color-champagne)",
                    borderColor: "var(--color-champagne)",
                    color: "var(--color-cedar)",
                  }}
                >
                  {copy.servicesLink}
                </Link>

                <Link
                  href="/contact"
                  className="t-label inline-block rounded-full border px-5 py-2.5 transition-all duration-300 hover:opacity-90"
                  style={{
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
