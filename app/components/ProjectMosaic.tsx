"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

import Footer from "./Footer";
import { zonderJaartal } from "./ProjectCard";
import { useLanguage } from "./LanguageProvider";
import { projectContent, type Project, type ProjectSlide } from "@/app/content/projects";

const copyPer = {
  nl: {
    terug: "Terug",
    vraag: "Interesse om samen iets te maken?",
    meer: "Meer inspiratie",
    mail: "studio@botmandesign.com",
    tel: "+31 6 12 34 56 78",
  },
  en: {
    terug: "Back",
    vraag: "Interested in making something together?",
    meer: "More inspiration",
    mail: "studio@botmandesign.com",
    tel: "+31 6 12 34 56 78",
  },
};

const serif = { fontFamily: "var(--font-cormorant-garamond), serif" } as const;
const sans = { fontFamily: "var(--font-montserrat)" } as const;

/*
 * Het ritme van de rijen. Elk getal is een breuk van de schermbreedte; elke
 * rij is samen precies één scherm breed.
 *
 * Alleen het openingsbeeld krijgt het hele scherm. Daaronder staan er altijd
 * twee of drie naast elkaar: een reeks waarin steeds één beeld het scherm
 * vult leest als een diavoorstelling, en dit hoort een galerij te zijn. De
 * hoogtes blijven onder de halve schermhoogte, zodat je altijd meer dan één
 * rij tegelijk ziet — dat is wat het raster laat lezen als raster.
 */
const VERHOUDINGEN = ["4 / 5", "1 / 1", "3 / 4", "4 / 3", "5 / 6", "1 / 1", "16 / 11", "3 / 4"];

/** Hoe hoog een beeld wordt bij breedte 1 — om de kolommen in balans te houden. */
function hoogteVan(verhouding: string): number {
  const [breed, hoog] = verhouding.split("/").map((deel) => Number(deel.trim()));
  return hoog / breed;
}

/** Hoeveel lager de ene kolom begint dan de andere. */
const VERSPRINGING = "clamp(40px, 7vw, 120px)";

/** Hoeveel beelden er in één metselvlak gaan voordat er tekst tussen mag. */
const BEELDEN_PER_VLAK = 6;

type Tegel = { src: string; verhouding: string };
type Vlak = { soort: "vlak"; kolommen: Tegel[][]; beurt: number };
type Tekst = { soort: "tekst"; sub: string; kop: string; body: string };
type Blok = Vlak | Tekst;

/** Alle beelden uit de reeks, op volgorde, zonder het openingsbeeld. */
function beeldenVoor(slides: ProjectSlide[], opening: string): string[] {
  const uit: string[] = [];

  for (const slide of slides) {
    for (const src of [slide.img, slide.imgTwo]) {
      if (src && src !== opening && !uit.includes(src)) uit.push(src);
    }
  }

  return uit;
}

/**
 * Verdeelt beelden over twee kolommen, elk met een eigen verhouding.
 *
 * Elk beeld gaat naar de kolom die op dat moment het laagst is. Omdat de
 * verhoudingen verschillen lopen de kolommen vanzelf uit de pas — en dat is
 * precies de bedoeling: niets ligt op dezelfde lijn, maar onderaan komen ze
 * weer ongeveer gelijk uit.
 */
function vlakVan(beelden: string[], begin: number, beurt: number): Vlak {
  const kolommen: Tegel[][] = [[], []];
  const hoogtes = [0, 0];

  beelden.forEach((src, i) => {
    const verhouding = VERHOUDINGEN[(begin + i) % VERHOUDINGEN.length];
    const kolom = hoogtes[0] <= hoogtes[1] ? 0 : 1;

    kolommen[kolom].push({ src, verhouding });
    hoogtes[kolom] += hoogteVan(verhouding);
  });

  return { soort: "vlak", kolommen, beurt };
}

/** De tekstvlakken die Bas in de reeks heeft gezet. */
function tekstenVoor(slides: ProjectSlide[]): Tekst[] {
  return slides
    .filter((s) => (s.layout === "rust" || s.layout === "tekst") && (s.caption || s.body))
    .map((s) => ({ soort: "tekst" as const, sub: s.sub, kop: s.caption, body: s.body }));
}

/**
 * Zet de metselvlakken en de tekstvlakken achter elkaar.
 *
 * Het beeld wordt in porties geknipt; tussen twee porties past een tekstvlak.
 * Zo staat de tekst nooit tegen een ander tekstvlak aan en onderbreekt hij het
 * beeld op een plek waar de kolommen toch al gelijk uitkomen.
 */
function blokkenVoor(slides: ProjectSlide[], opening: string, inleiding: Tekst): Blok[] {
  const beelden = beeldenVoor(slides, opening);
  const teksten = [inleiding, ...tekstenVoor(slides)];

  const blokken: Blok[] = [];
  let i = 0;
  let volgende = 0;
  let vlakken = 0;

  while (i < beelden.length) {
    const portie = beelden.slice(i, i + BEELDEN_PER_VLAK);
    blokken.push(vlakVan(portie, i, vlakken));
    vlakken += 1;
    i += portie.length;

    // Ook na het laatste vlak mag er tekst staan; alleen nooit twee op rij.
    if (volgende < teksten.length) {
      blokken.push(teksten[volgende]);
      volgende += 1;
    }
  }

  // Wat er niet tussen paste komt achteraan, zodat er niets wegvalt.
  return [...blokken, ...teksten.slice(volgende)];
}

/*
 * Een projectpagina als doorlopend muurvlak van beeld, met af en toe een vlak
 * om iets uit te leggen.
 *
 * De blokken komen zacht in beeld in plaats van er ineens te staan. Dat is wat
 * het scrollen rustig maakt — ik heb het bij kabaz nagemeten: geen vloeiende
 * scroll, geen parallax, maar blokken die invloeien terwijl ze binnenkomen.
 */
export default function ProjectMosaic({ slug, projects }: { slug: string; projects: Project[] }) {
  const { language } = useLanguage();
  const copy = copyPer[language];

  const project = projects.find((item) => item.slug === slug);

  if (!project) return null;

  const content = projectContent(project, language);
  const opening = project.cardImage;
  const blokken = blokkenVoor(content.slides, opening, {
    soort: "tekst",
    sub: zonderJaartal(content.category),
    kop: project.title,
    body: content.intro,
  });
  const anderen = projects.filter((item) => item.slug !== slug).slice(0, 3);

  return (
    <div style={{ backgroundColor: "var(--color-cedar)", paddingBottom: "56px" }}>
      {/*
       * Zonder JavaScript komt er niets in beeld — de blokken beginnen immers
       * doorzichtig en worden pas door de waarnemer aangezet. Dan staat alles
       * er gewoon meteen.
       */}
      <noscript>
        <style>{"[data-onthulling]{opacity:1!important;transform:none!important}"}</style>
      </noscript>

      {/* OPENING — één beeld, met de naam rechtsonder */}
      <header className="relative h-screen w-full overflow-hidden">
        <Image src={opening} alt={project.title} fill priority sizes="100vw" className="object-cover" />

        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(0deg, rgba(10,9,7,0.45) 0%, rgba(10,9,7,0) 45%)" }}
        />

        <div className="absolute bottom-[clamp(96px,16vh,160px)] right-[clamp(20px,5vw,72px)] text-right">
          <p
            className="mb-2 text-sm uppercase md:text-base"
            style={{ ...sans, letterSpacing: "0.2em", color: "var(--color-almond)" }}
          >
            {zonderJaartal(content.category)}
          </p>
          <h1
            className="text-[clamp(38px,6vw,76px)] font-light leading-[1.05]"
            style={{ ...serif, color: "var(--color-champagne)" }}
          >
            {project.title}
          </h1>
        </div>
      </header>

      {/* HET MUURVLAK */}
      {blokken.map((blok, index) =>
        blok.soort === "tekst" ? (
          <Onthulling key={`tekst-${index}`}>
            <TekstVlak sub={blok.sub} kop={blok.kop} body={blok.body} />
          </Onthulling>
        ) : (
          <Onthulling key={`vlak-${index}`}>
            <div className="grid grid-cols-1 md:grid-cols-2">
              {blok.kolommen.map((kolom, k) => (
                <div
                  key={`kolom-${k}`}
                  className="flex flex-col"
                  /*
                   * Eén van de twee kolommen begint lager, en per vlak wisselt
                   * welke. Anders ligt de bovenrand van elk vlak toch weer op
                   * één lijn en leest het alsnog als een raster.
                   */
                  style={{ marginTop: k === blok.beurt % 2 ? VERSPRINGING : undefined }}
                >
                  {kolom.map((tegel) => (
                    <div
                      key={tegel.src}
                      className="group relative w-full overflow-hidden"
                      style={{ aspectRatio: tegel.verhouding }}
                    >
                      <Image
                        src={tegel.src}
                        alt={project.title}
                        fill
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-[1.025]"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Onthulling>
        ),
      )}

      {/* MEER INSPIRATIE */}
      <section className="w-full py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-8">
          <p
            className="mb-10 text-sm uppercase md:text-base"
            style={{ ...sans, letterSpacing: "0.2em", color: "var(--color-almond)" }}
          >
            {copy.meer}
          </p>

          <div className="grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-3">
            {anderen.map((ander) => (
              <Link key={ander.slug} href={`/projecten/${ander.slug}`} className="group block">
                <div className="relative w-full overflow-hidden" style={{ aspectRatio: "3 / 4" }}>
                  <Image
                    src={ander.cardImage}
                    alt={ander.title}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-[1.025]"
                  />
                </div>

                <h2
                  className="mt-5 text-2xl font-light md:text-3xl"
                  style={{ ...serif, color: "var(--color-champagne)" }}
                >
                  {ander.title}
                </h2>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {/*
       * De balk onderaan blijft staan: de weg terug en de vraag of je zelf iets
       * wil beginnen, zonder dat je eerst helemaal naar beneden moet.
       */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 backdrop-blur-md"
        style={{ backgroundColor: "rgba(103, 92, 83, 0.82)", borderTop: "1px solid rgba(182, 163, 144, 0.3)" }}
      >
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-x-8 gap-y-2 px-[clamp(16px,4vw,48px)] py-3.5">
          <div className="flex items-center gap-6">
            <Link
              href="/projecten"
              className="text-[11px] uppercase transition-opacity duration-300 hover:opacity-70 md:text-xs"
              style={{ ...sans, letterSpacing: "0.2em", color: "var(--color-champagne)" }}
            >
              &larr; {copy.terug}
            </Link>

            <span className="hidden text-base md:inline" style={{ ...serif, color: "var(--color-almond)" }}>
              {copy.vraag}
            </span>
          </div>

          <div className="flex items-center gap-5">
            <a
              href={`mailto:${copy.mail}`}
              className="text-[11px] uppercase transition-opacity duration-300 hover:opacity-70 md:text-xs"
              style={{ ...sans, letterSpacing: "0.15em", color: "var(--color-champagne)" }}
            >
              {copy.mail}
            </a>
            <span aria-hidden style={{ color: "rgba(182, 163, 144, 0.5)" }}>
              |
            </span>
            <a
              href={`tel:${copy.tel.replace(/\s/g, "")}`}
              className="text-[11px] uppercase transition-opacity duration-300 hover:opacity-70 md:text-xs"
              style={{ ...sans, letterSpacing: "0.15em", color: "var(--color-champagne)" }}
            >
              {copy.tel}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/*
 * Laat zien wat erin zit zodra het in beeld komt, één keer.
 *
 * Een waarnemer en geen scrollteller: die kost niets zolang er niets gebeurt,
 * en hij werkt ook als je met een sprong ergens middenin belandt.
 */
function Onthulling({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [zichtbaar, setZichtbaar] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Zonder waarnemer staat alles er gewoon; het effect is een toevoeging.
    if (typeof IntersectionObserver === "undefined") {
      setZichtbaar(true);
      return;
    }

    const waarnemer = new IntersectionObserver(
      ([item]) => {
        if (item.isIntersecting) {
          setZichtbaar(true);
          waarnemer.disconnect();
        }
      },
      // Pas beginnen als het blok een stuk voorbij de onderrand is.
      { rootMargin: "0px 0px -12% 0px" },
    );

    waarnemer.observe(el);
    return () => waarnemer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-onthulling
      style={{
        opacity: zichtbaar ? 1 : 0,
        transform: zichtbaar ? "translateY(0)" : "translateY(28px)",
        transition: "opacity 900ms ease-out, transform 900ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      {children}
    </div>
  );
}

/* Een vlak om iets uit te leggen, tussen het beeld door. */
function TekstVlak({ sub, kop, body }: { sub?: string; kop?: string; body?: string }) {
  if (!kop && !body) return null;

  return (
    <section className="w-full py-24 md:py-32" style={{ backgroundColor: "var(--color-champagne)" }}>
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-3xl">
          {sub && (
            <p
              className="mb-6 text-[11px] uppercase md:text-xs"
              style={{ ...sans, letterSpacing: "0.2em", color: "var(--color-cedar)" }}
            >
              {sub}
            </p>
          )}

          {kop && (
            <h2 className="mb-8 text-3xl font-light md:text-4xl" style={{ ...serif, color: "var(--color-black)" }}>
              {kop}
            </h2>
          )}

          {body && (
            <p
              className="max-w-prose text-lg leading-[1.75] md:text-xl"
              style={{ ...serif, color: "var(--color-cedar)" }}
            >
              {body}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
