"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import type { ProjectSlide } from "@/app/content/projects";

/*
 * De diashow van een projectpagina.
 *
 * De wikkel is net zo hoog als het aantal dia's maal een schermhoogte;
 * daarbinnen blijft één venster plakken. Hoeveel schermhoogtes je het blok in
 * bent gescrold bepaalt welke dia zichtbaar is. Dat is wat het de ervaring
 * geeft van door een huis lopen in plaats van een pagina afrollen.
 *
 * Wat verandert is niet die mechaniek maar wat er in zo'n venster staat. Elke
 * dia kiest zelf zijn vorm: schermvullend, twee beelden naast elkaar, een
 * beeld met tekst ernaast, of alleen tekst. Een reeks van alleen maar
 * schermvullende foto's leest uiteindelijk vlak — door af en toe lucht of een
 * woord te geven krijgt het ritme.
 */

const serif = { fontFamily: "var(--font-cormorant-garamond), serif" } as const;
const sans = { fontFamily: "var(--font-montserrat)" } as const;

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
      <div className="sticky top-0 h-screen overflow-hidden" style={{ backgroundColor: "var(--color-cedar)" }}>
        {slides.map((slide, index) => (
          <Slide
            key={`${slide.img}-${index}`}
            slide={slide}
            index={index}
            total={slides.length}
            title={title}
            active={index === active}
          />
        ))}

        <Link
          href={backHref}
          className="absolute left-[clamp(16px,3vw,32px)] top-[clamp(16px,3vw,28px)] z-[5] border px-4 py-2.5 text-[11px] uppercase backdrop-blur-sm transition-opacity duration-300"
          style={{
            ...sans,
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

        <div className="absolute bottom-[clamp(20px,4vw,32px)] right-[clamp(16px,3vw,32px)] z-[5] flex flex-col gap-2">
          {slides.map((slide, index) => (
            <span
              key={`${slide.img}-${index}-dot`}
              className="h-2.5 w-2.5 rounded-full transition-colors duration-300"
              style={{
                backgroundColor: index === active ? "var(--color-champagne)" : "rgba(237,227,209,0.35)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Scrollhoogte: één schermhoogte per dia */}
      {slides.map((slide, index) => (
        <div key={`${slide.img}-${index}-trigger`} className="h-screen" aria-hidden />
      ))}
    </div>
  );
}

/* Eén dia, in de vorm die hij zelf meebrengt. */
function Slide({
  slide,
  index,
  total,
  title,
  active,
}: {
  slide: ProjectSlide;
  index: number;
  total: number;
  title: string;
  active: boolean;
}) {
  const laag = {
    opacity: active ? 1 : 0,
    transition: "opacity 700ms ease",
    pointerEvents: active ? ("auto" as const) : ("none" as const),
  };

  const eerste = index === 0;
  const nummer = `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;

  if (slide.layout === "rust") {
    return (
      <div className="absolute inset-0 z-[3] flex items-center justify-center px-6" style={laag}>
        <Tekst slide={slide} nummer={nummer} groot centered actief={active} />
      </div>
    );
  }

  if (slide.layout === "duo") {
    return (
      <div className="absolute inset-0 z-[3] flex flex-col justify-center gap-8 px-[clamp(20px,5vw,80px)] py-[clamp(72px,10vh,120px)]" style={laag}>
        <div className="flex min-h-0 flex-1 gap-[clamp(12px,2vw,28px)]">
          {[slide.img, slide.imgTwo].filter(Boolean).map((src, i) => (
            <div key={src} className="relative min-h-0 flex-1 overflow-hidden">
              <Image
                src={src as string}
                alt={slide.caption || title}
                fill
                loading={eerste ? undefined : "lazy"}
                priority={eerste}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                style={{
                  /* De twee komen net niet gelijk op; dat geeft het leven. */
                  transform: active ? "translateY(0)" : "translateY(18px)",
                  transition: `transform 900ms cubic-bezier(0.22, 1, 0.36, 1) ${i * 110}ms`,
                }}
              />
            </div>
          ))}
        </div>

        {slide.caption && (
          <div className="shrink-0">
            <Tekst slide={slide} nummer={nummer} actief={active} />
          </div>
        )}
      </div>
    );
  }

  if (slide.layout === "tekst") {
    return (
      <div className="absolute inset-0 z-[3] grid grid-cols-1 items-center gap-[clamp(24px,4vw,64px)] px-[clamp(20px,5vw,80px)] py-[clamp(72px,10vh,120px)] md:grid-cols-2" style={laag}>
        <div className="relative hidden h-full overflow-hidden md:block">
          <Image
            src={slide.img}
            alt={slide.caption || title}
            fill
            loading={eerste ? undefined : "lazy"}
            priority={eerste}
            sizes="50vw"
            className="object-cover"
            style={{
              transform: active ? "scale(1)" : "scale(1.06)",
              transition: "transform 1200ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />
        </div>

        <div className="max-w-xl">
          <Tekst slide={slide} nummer={nummer} actief={active} />
        </div>
      </div>
    );
  }

  /* vol — schermvullend beeld met de tekst eroverheen */
  return (
    <div className="absolute inset-0 z-[3]" style={laag}>
      <Image
        src={slide.img}
        alt={slide.caption || title}
        fill
        priority={eerste}
        loading={eerste ? undefined : "lazy"}
        sizes="100vw"
        className="object-cover"
        style={{
          /* Heel traag inzoomen terwijl de dia in beeld staat. */
          transform: active ? "scale(1.04)" : "scale(1)",
          transition: "transform 7000ms linear",
        }}
      />

      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(0deg, rgba(10,9,7,0.55) 0%, rgba(10,9,7,0) 45%)" }}
      />

      {slide.caption && (
        <div className="pointer-events-none absolute bottom-[clamp(28px,5vw,52px)] left-[clamp(20px,4vw,48px)] max-w-xl">
          <Tekst slide={slide} nummer={nummer} actief={active} />
        </div>
      )}
    </div>
  );
}

/* De tekst bij een dia: nummer en bovenschrift, titel, toelichting. */
function Tekst({
  slide,
  nummer,
  actief,
  groot = false,
  centered = false,
}: {
  slide: ProjectSlide;
  nummer: string;
  actief: boolean;
  groot?: boolean;
  centered?: boolean;
}) {
  const beweging = {
    opacity: actief ? 1 : 0,
    transform: actief ? "translateY(0)" : "translateY(12px)",
    transition: "opacity 700ms ease 120ms, transform 700ms cubic-bezier(0.22, 1, 0.36, 1) 120ms",
  };

  return (
    <div className={centered ? "max-w-3xl text-center" : undefined} style={beweging}>
      <p
        className="mb-4 text-[11px] uppercase md:text-xs"
        style={{ ...sans, letterSpacing: "0.2em", color: "#cbbfa9" }}
      >
        {nummer}
        {slide.sub && <> &mdash; {slide.sub}</>}
      </p>

      {slide.caption && (
        <p
          className={`mb-4 font-light italic ${groot ? "text-4xl md:text-6xl" : "text-3xl md:text-4xl"}`}
          style={{ ...serif, color: "var(--color-champagne)" }}
        >
          {slide.caption}
        </p>
      )}

      {slide.body && (
        <p
          className={`text-base leading-relaxed md:text-lg ${centered ? "mx-auto max-w-xl" : "max-w-md"}`}
          style={{ ...serif, color: "var(--color-almond)" }}
        >
          {slide.body}
        </p>
      )}
    </div>
  );
}
