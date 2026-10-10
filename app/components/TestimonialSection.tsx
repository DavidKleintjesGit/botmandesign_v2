"use client";

import { useCallback, useEffect, useState } from "react";

import { useLanguage } from "./LanguageProvider";
import { homeCopy } from "@/app/content/home";
import type { Testimonial } from "@/app/content/testimonials";

const ROTATION_MS = 8000;
const FADE_MS = 700;

const serif = { fontFamily: "var(--font-cormorant-garamond), serif" } as const;
const sans = { fontFamily: "var(--font-montserrat)" } as const;

/*
 * "Wat klanten zeggen". De citaten komen uit het beheerpaneel en wisselen om
 * de acht seconden. Staat er maar één, dan blijft die gewoon staan en
 * verschijnen de bolletjes niet.
 *
 * De tekst vervaagt tussen twee citaten in plaats van te verspringen: de hoogte
 * verschilt per citaat en zonder die overgang zou de pagina zichtbaar
 * verspringen.
 */
export default function TestimonialSection({ testimonials }: { testimonials: Testimonial[] }) {
  const { language } = useLanguage();
  const copy = homeCopy[language];

  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(true);

  const goTo = useCallback(
    (index: number) => {
      if (index === active) return;
      setVisible(false);
      window.setTimeout(() => {
        setActive(index);
        setVisible(true);
      }, FADE_MS);
    },
    [active],
  );

  useEffect(() => {
    if (testimonials.length < 2) return;

    const timer = window.setInterval(() => {
      setVisible(false);
      window.setTimeout(() => {
        setActive((current) => (current + 1) % testimonials.length);
        setVisible(true);
      }, FADE_MS);
    }, ROTATION_MS);

    return () => window.clearInterval(timer);
  }, [testimonials.length]);

  if (testimonials.length === 0) return null;

  const current = testimonials[active][language];

  return (
    <section
      className="w-full py-20 md:py-28"
      style={{
        backgroundColor: "var(--color-cedar)",
        borderTop: "1px solid rgba(182, 163, 144, 0.25)",
      }}
    >
      <div className="container mx-auto px-4 text-center md:px-8">
        <p
          className="mb-10 text-sm uppercase md:mb-14 md:text-base"
          style={{ ...sans, color: "var(--color-champagne)" }}
        >
          {copy.customersLabel}
        </p>

        <div
          className="transition-opacity"
          style={{ opacity: visible ? 1 : 0, transitionDuration: `${FADE_MS}ms` }}
        >
          <blockquote
            className="mx-auto mb-8 max-w-3xl text-xl font-light leading-relaxed md:text-2xl"
            style={{ ...serif, color: "var(--color-champagne)" }}
          >
            &ldquo;{current.quote}&rdquo;
          </blockquote>

          <p
            className="text-[11px] uppercase tracking-wider md:text-xs"
            style={{ ...sans, letterSpacing: "0.15em", color: "var(--color-almond)" }}
          >
            {current.attribution}
          </p>
        </div>

        {testimonials.length > 1 && (
          <div className="mt-12 flex justify-center gap-3">
            {testimonials.map((testimonial, index) => (
              <button
                key={testimonial.id}
                type="button"
                onClick={() => goTo(index)}
                aria-label={
                  language === "nl" ? `Citaat ${index + 1}` : `Quote ${index + 1}`
                }
                aria-current={index === active}
                className="h-2 w-2 cursor-pointer rounded-full border-0 p-0 transition-colors duration-300"
                style={{
                  backgroundColor:
                    index === active ? "var(--color-champagne)" : "rgba(182, 163, 144, 0.45)",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
