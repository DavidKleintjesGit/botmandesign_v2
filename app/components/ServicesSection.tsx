"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import type { Service } from "@/app/content/services";
import { useLanguage } from "./LanguageProvider";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const sectionCopy = {
  en: { label: "Our studio services", more: "More info" },
  nl: { label: "Onze studio services", more: "Meer info" },
};

export default function ServicesSection({
  services,
}: {
  services: Record<string, Service>;
}) {
  const { language } = useLanguage();
  const copy = sectionCopy[language];
  const sectionRef = useRef<HTMLElement>(null);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current || blockRefs.current.length === 0) return;

    const blocks = blockRefs.current.filter(Boolean);
    gsap.set(blocks, { opacity: 0, y: 24 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 90%",
        end: "top 15%",
        // 0.6 houdt de beweging vloeiend zonder merkbaar achter de scroll aan te lopen.
        scrub: 0.6,
      },
    });

    tl.to(
      blocks,
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
      },
      0,
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars.trigger === sectionRef.current) t.kill();
      });
    };
  }, []);

  /*
   * De drie studio services uit Bas zijn ontwerp. De teksten komen uit
   * app/content/services.ts, zodat de homepage, het overzicht en de
   * detailpagina's niet uit elkaar kunnen lopen.
   */
  const blocks = Object.entries(services).map((entry) => {
    const [slug, service] = entry;
    const content = service[language];

    return {
      slug,
      title: content.name,
      text: content.tagline,
      description: content.introOne,
      descriptionExtra: content.introTwo,
      priceFrom: content.price,
      buttonLabel: copy.more,
    };
  });

  return (
    <section
      ref={sectionRef}
      // De onderruimte was 224 tot 384 pixels kale cedar; daar viel de pagina
      // stil voordat het verhaal eronder begon.
      className="w-full relative overflow-hidden flex flex-col items-center pt-10 pb-24 md:pb-32"
      style={{
        backgroundColor: "var(--color-cedar)",
      }}
    >
      <div className="container mx-auto px-4 md:px-8 w-full">
        <p className="t-label t-label--sterk mb-8 md:mb-10">{copy.label}</p>
        <div className="flex flex-col md:flex-row md:items-stretch gap-12 md:gap-0">
          {blocks.map((block, i) => (
            <div
              key={block.slug}
              className="flex flex-col md:flex-1 md:flex-row md:min-h-0"
            >
              <div
                ref={(el) => {
                  blockRefs.current[i] = el;
                }}
                className="flex flex-col text-center items-center md:flex-1 md:px-8 md:h-full min-h-0"
              >
                <h3 className="t-titel mb-8">{block.title}</h3>
                <p className="t-tekst t-tekst--sterk mb-2">{block.text}</p>
                <div className="flex-1 space-y-4 mb-10">
                  <p className="t-tekst">{block.description}</p>
                  <p className="t-tekst">{block.descriptionExtra}</p>
                </div>
                <div className="mt-auto flex flex-col items-center gap-3">
                  <p className="t-tekst t-tekst--sterk">{block.priceFrom}</p>
                  <Link
                    href={`/services/${block.slug}`}
                    className="t-label inline-block px-5 py-2.5 rounded-full border transition-all duration-300 hover:opacity-90"
                    style={{
                      fontFamily: "var(--font-montserrat)",
                      letterSpacing: "0.15em",
                      backgroundColor: "var(--color-champagne)",
                      borderColor: "var(--color-champagne)",
                      color: "var(--color-cedar)",
                    }}
                  >
                    {block.buttonLabel}
                  </Link>
                </div>
              </div>
              {i < blocks.length - 1 && (
                <div className="hidden md:flex md:items-center md:flex-shrink-0 md:self-stretch">
                  <div
                    className="w-px h-40 md:h-52"
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
  );
}
