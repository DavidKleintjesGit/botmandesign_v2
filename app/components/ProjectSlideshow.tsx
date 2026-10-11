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
    /* Op een telefoon passen twee staande beelden niet naast elkaar; daar
       staan ze boven elkaar, elk op de halve hoogte. */
    return (
      <div className="absolute inset-0 z-[3] flex flex-col justify-center gap-6 px-[clamp(16px,5vw,80px)] py-[clamp(64px,10vh,120px)] md:gap-8" style={laag}>
        <div className="flex min-h-0 flex-1 flex-col gap-3 md:flex-row md:gap-[clamp(12px,2vw,28px)]">
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

  if (slide.layout === "versprongen") {
    /*
     * Twee beelden van verschillende maat, waarvan het tweede een stuk zakt.
     * Een paar van gelijke blokken is rustig; dit geeft spanning zonder dat het
     * rommelig wordt.
     */
    return (
      <div className="absolute inset-0 z-[3] flex flex-col items-stretch gap-4 px-[clamp(16px,5vw,80px)] py-[clamp(64px,10vh,120px)] md:flex-row md:items-center md:gap-[clamp(16px,3vw,48px)]" style={laag}>
        <div className="relative h-[46%] overflow-hidden md:h-[78%] md:basis-[58%]">
          <Image
            src={slide.img}
            alt={slide.caption || title}
            fill
            loading={eerste ? undefined : "lazy"}
            priority={eerste}
            sizes="58vw"
            className="object-cover"
            style={{
              transform: active ? "translateY(0)" : "translateY(26px)",
              transition: "transform 1000ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />
        </div>

        <div className="flex min-h-0 flex-1 flex-col justify-end md:h-full md:pb-[6%]">
          {slide.imgTwo && (
            <div className="relative h-[60%] w-full overflow-hidden md:h-[58%]">
              <Image
                src={slide.imgTwo}
                alt={slide.caption || title}
                fill
                loading="lazy"
                sizes="38vw"
                className="object-cover"
                style={{
                  transform: active ? "translateY(0)" : "translateY(40px)",
                  transition: "transform 1000ms cubic-bezier(0.22, 1, 0.36, 1) 160ms",
                }}
              />
            </div>
          )}

          {slide.caption && (
            <div className="mt-7">
              <Tekst slide={slide} nummer={nummer} actief={active} />
            </div>
          )}
        </div>
      </div>
    );
  }

  if (slide.layout === "portret") {
    /* Eén staand beeld met veel lucht eromheen — een stil moment in de reeks. */
    return (
      <div className="absolute inset-0 z-[3] flex flex-col items-center justify-center gap-5 px-[clamp(16px,5vw,80px)] py-[clamp(64px,10vh,120px)] md:flex-row md:gap-[clamp(24px,5vw,80px)]" style={laag}>
        <div className="relative h-[62%] w-full shrink-0 overflow-hidden md:h-full md:w-[min(42vw,480px)]">
          <Image
            src={slide.img}
            alt={slide.caption || title}
            fill
            loading={eerste ? undefined : "lazy"}
            priority={eerste}
            sizes="(max-width: 768px) 100vw, 480px"
            className="object-cover"
            style={{
              transform: active ? "scale(1)" : "scale(1.05)",
              transition: "transform 1400ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />
        </div>

        {slide.caption && (
          <div className="w-full max-w-sm">
            <Tekst slide={slide} nummer={nummer} actief={active} />
          </div>
        )}
      </div>
    );
  }

  if (slide.layout === "tekst") {
    /*
     * Beeld links, een echt stuk tekst rechts. Hier is ruimte voor uitleg: wat
     * er gedaan is en waarom. Vandaar de bredere regel en de lijn erboven —
     * het moet lezen als een alinea, niet als een bijschrift dat te groot is
     * uitgevallen.
     */
    return (
      <div className="absolute inset-0 z-[3] grid grid-cols-1 content-center items-center gap-6 overflow-y-auto px-[clamp(16px,5vw,80px)] py-[clamp(64px,10vh,120px)] md:grid-cols-[1fr_1fr] md:gap-[clamp(24px,4vw,72px)] md:overflow-visible" style={laag}>
        <div className="relative h-[34vh] overflow-hidden md:h-full">
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
          <Tekst slide={slide} nummer={nummer} actief={active} uitgebreid />
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
  uitgebreid = false,
}: {
  slide: ProjectSlide;
  nummer: string;
  actief: boolean;
  groot?: boolean;
  centered?: boolean;
  /** Een stuk uitleg in plaats van een bijschrift: bredere regel, meer lucht. */
  uitgebreid?: boolean;
}) {
  const beweging = {
    opacity: actief ? 1 : 0,
    transform: actief ? "translateY(0)" : "translateY(12px)",
    transition: "opacity 700ms ease 120ms, transform 700ms cubic-bezier(0.22, 1, 0.36, 1) 120ms",
  };

  return (
    <div className={centered ? "max-w-3xl text-center" : undefined} style={beweging}>
      {uitgebreid && (
        <span
          className="mb-7 block h-px w-14"
          style={{ backgroundColor: "rgba(182, 163, 144, 0.6)" }}
          aria-hidden
        />
      )}

      <p
        className={`text-[11px] uppercase md:text-xs ${uitgebreid ? "mb-5" : "mb-4"}`}
        style={{ ...sans, letterSpacing: "0.2em", color: "#cbbfa9" }}
      >
        {nummer}
        {slide.sub && <> &mdash; {slide.sub}</>}
      </p>

      {slide.caption && (
        <p
          className={`font-light italic ${uitgebreid ? "mb-6" : "mb-4"} ${
            groot ? "text-4xl md:text-6xl" : uitgebreid ? "text-3xl md:text-5xl" : "text-3xl md:text-4xl"
          }`}
          style={{ ...serif, color: "var(--color-champagne)" }}
        >
          {slide.caption}
        </p>
      )}

      {slide.body && (
        <p
          className={
            uitgebreid
              ? "max-w-prose text-lg leading-[1.75] md:text-xl"
              : `text-base leading-relaxed md:text-lg ${centered ? "mx-auto max-w-xl" : "max-w-md"}`
          }
          style={{ ...serif, color: "var(--color-almond)" }}
        >
          {slide.body}
        </p>
      )}
    </div>
  );
}
