"use client";

import { useLanguage } from "./LanguageProvider";
import { homeCopy } from "@/app/content/home";

/** "Wat klanten zeggen" uit Bas zijn ontwerp. */
export default function TestimonialSection() {
  const { language } = useLanguage();
  const copy = homeCopy[language];

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
          style={{ fontFamily: "var(--font-montserrat)", color: "var(--color-champagne)" }}
        >
          {copy.customersLabel}
        </p>

        <blockquote
          className="mx-auto mb-8 max-w-3xl text-xl font-light leading-relaxed md:text-2xl"
          style={{ fontFamily: "var(--font-cormorant-garamond), serif", color: "var(--color-champagne)" }}
        >
          &ldquo;{copy.testimonial}&rdquo;
        </blockquote>

        <p
          className="text-[11px] uppercase tracking-wider md:text-xs"
          style={{
            fontFamily: "var(--font-montserrat)",
            letterSpacing: "0.15em",
            color: "var(--color-almond)",
          }}
        >
          {copy.testimonialAttr}
        </p>
      </div>
    </section>
  );
}
