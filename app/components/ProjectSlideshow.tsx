"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import type { ProjectSlide } from "@/app/content/projects";

/*
 * De diashow uit Bas zijn ontwerp. De wikkel is net zo hoog als het aantal
 * beelden maal een schermhoogte; daarbinnen blijft één venster plakken. Hoeveel
 * schermhoogtes je het blok in bent gescrold bepaalt welk beeld zichtbaar is,
 * zodat de beelden tijdens het scrollen in elkaar overvloeien.
 */
export default function ProjectSlideshow({
  slides,
  title,
  backHref,
  backLabel,
  onImmersiveChange,
}: {
  slides: ProjectSlide[];
  title: string;
  backHref: string;
  backLabel: string;
  /** Meldt of de diashow het hele scherm vult, zodat de navigatie kan wijken. */
  onImmersiveChange?: (immersive: boolean) => void;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let frame = 0;

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;

        const rect = wrapper.getBoundingClientRect();
        const viewport = window.innerHeight;
        const scrolledInto = Math.max(0, -rect.top);
        const index = Math.max(0, Math.min(slides.length - 1, Math.floor(scrolledInto / viewport)));

        setActive(index);
        setStarted(scrolledInto > 4);
        onImmersiveChange?.(rect.top <= 0 && rect.bottom > viewport);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [slides.length, onImmersiveChange]);

  return (
    <div ref={wrapperRef} className="relative">
      <div className="sticky top-0 h-screen overflow-hidden">
        {slides.map((slide, index) => (
          <Image
            key={slide.img}
            src={slide.img}
            alt={slide.caption || title}
            fill
            priority={index === 0}
            loading={index === 0 ? undefined : "lazy"}
            sizes="100vw"
            className="object-cover transition-opacity duration-700"
            style={{ opacity: index === active ? 1 : 0 }}
          />
        ))}

        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(0deg, rgba(10,9,7,0.5) 0%, rgba(10,9,7,0) 40%)" }}
        />

        <Link
          href={backHref}
          className="absolute left-[clamp(16px,3vw,32px)] top-[clamp(16px,3vw,28px)] z-[5] border px-4 py-2.5 text-[11px] uppercase backdrop-blur-sm transition-opacity duration-300"
          style={{
            fontFamily: "var(--font-montserrat)",
            letterSpacing: "0.15em",
            color: "var(--color-champagne)",
            background: "rgba(10,9,7,0.35)",
            borderColor: "rgba(237,227,209,0.35)",
            opacity: started ? 1 : 0,
            pointerEvents: started ? "auto" : "none",
          }}
        >
          &larr; {backLabel}
        </Link>

        {slides.map((slide, index) =>
          slide.caption ? (
            <div
              key={`${slide.img}-caption`}
              className="pointer-events-none absolute bottom-[clamp(28px,5vw,52px)] left-[clamp(20px,4vw,48px)] z-[4] max-w-xl transition-all duration-700"
              style={{
                opacity: index === active ? 1 : 0,
                transform: index === active ? "translateY(0)" : "translateY(10px)",
              }}
            >
              {slide.sub && (
                <p
                  className="mb-4 text-[11px] uppercase md:text-xs"
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    letterSpacing: "0.2em",
                    color: "#cbbfa9",
                  }}
                >
                  {String(index + 1).padStart(2, "0")} &mdash; {slide.sub}
                </p>
              )}

              <p
                className="mb-4 text-3xl font-light italic md:text-4xl"
                style={{
                  fontFamily: "var(--font-cormorant-garamond), serif",
                  color: "var(--color-champagne)",
                }}
              >
                {slide.caption}
              </p>

              {slide.body && (
                <p
                  className="max-w-md text-base leading-relaxed md:text-lg"
                  style={{
                    fontFamily: "var(--font-cormorant-garamond), serif",
                    color: "var(--color-almond)",
                  }}
                >
                  {slide.body}
                </p>
              )}
            </div>
          ) : null,
        )}

        <div className="absolute bottom-[clamp(20px,4vw,32px)] right-[clamp(16px,3vw,32px)] z-[5] flex flex-col gap-2">
          {slides.map((slide, index) => (
            <span
              key={`${slide.img}-dot`}
              className="h-2.5 w-2.5 rounded-full transition-colors duration-300"
              style={{
                backgroundColor: index === active ? "var(--color-champagne)" : "rgba(237,227,209,0.35)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Scrollhoogte: één schermhoogte per beeld */}
      {slides.map((slide) => (
        <div key={`${slide.img}-trigger`} className="h-screen" aria-hidden />
      ))}
    </div>
  );
}
