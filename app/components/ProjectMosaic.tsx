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
 * Het ritme van de banden. Elk getal is een breuk van de schermbreedte; elke
 * rij is samen precies één scherm breed.
 *
 * De hoogtes wisselen mee: een hele band staat hoger dan een rij van drie. Dat
 * verschil is wat het laat lezen als compositie en niet als raster.
 */
const RITME: { breedtes: number[]; hoogte: string }[] = [
  { breedtes: [1], hoogte: "88vh" },
  { breedtes: [2 / 3, 1 / 3], hoogte: "76vh" },
  { breedtes: [1 / 2, 1 / 2], hoogte: "82vh" },
  { breedtes: [1], hoogte: "94vh" },
  { breedtes: [1 / 3, 2 / 3], hoogte: "76vh" },
  { breedtes: [1 / 2, 1 / 2], hoogte: "70vh" },
  { breedtes: [1 / 3, 1 / 3, 1 / 3], hoogte: "64vh" },
];

type Band = { soort: "band"; breedtes: number[]; hoogte: string; beelden: string[] };
type Tekst = { soort: "tekst"; sub: string; kop: string; body: string };
type Blok = Band | Tekst;

/*
 * De reeks uit het beheer wordt een reeks blokken.
 *
 * Een dia die op "alleen tekst" of "beeld met tekst" staat wordt hier een
 * tekstvlak; de rest levert zijn beeld aan de banden. Zo bepaalt Bas per dia
 * waar de woorden vallen, zonder dat daar een apart veld voor nodig is.
 */
function blokkenVoor(slides: ProjectSlide[], opening: string): Blok[] {
  const blokken: Blok[] = [];
  let wachtrij: string[] = [];
  let stap = 0;

  const legen = () => {
    while (wachtrij.length > 0) {
      const { breedtes, hoogte } = RITME[stap % RITME.length];
      const deel = wachtrij.slice(0, breedtes.length);

      blokken.push({
        soort: "band",
        // Een rij die niet vol raakt verdeelt de breedte over wat er is.
        breedtes: deel.length < breedtes.length ? deel.map(() => 1 / deel.length) : breedtes,
        hoogte,
        beelden: deel,
      });

      wachtrij = wachtrij.slice(deel.length);
      stap += 1;
    }
  };

  for (const slide of slides) {
    if (slide.layout === "rust" || slide.layout === "tekst") {
      legen();

      if (slide.caption || slide.body) {
        blokken.push({ soort: "tekst", sub: slide.sub, kop: slide.caption, body: slide.body });
      }

      // Een dia met tekst én beeld geeft zijn beeld alsnog aan de reeks mee.
      if (slide.layout === "tekst" && slide.img && slide.img !== opening) {
        wachtrij.push(slide.img);
      }

      continue;
    }

    for (const src of [slide.img, slide.imgTwo]) {
      if (src && src !== opening && !wachtrij.includes(src)) wachtrij.push(src);
    }
  }

  legen();
  return blokken;
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
  const blokken = blokkenVoor(content.slides, opening);
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

      {/* De inleiding, direct onder het openingsbeeld. */}
      <Onthulling>
        <TekstVlak sub={zonderJaartal(content.category)} kop={project.title} body={content.intro} />
      </Onthulling>

      {/* HET MUURVLAK */}
      {blokken.map((blok, index) =>
        blok.soort === "tekst" ? (
          <Onthulling key={`tekst-${index}`}>
            <TekstVlak sub={blok.sub} kop={blok.kop} body={blok.body} />
          </Onthulling>
        ) : (
          <Onthulling key={`band-${index}`}>
            <div className="flex w-full" style={{ height: blok.hoogte }}>
              {blok.beelden.map((src, kolom) => (
                <div
                  key={`${src}-${kolom}`}
                  className="group relative h-full overflow-hidden"
                  style={{ width: `${blok.breedtes[kolom] * 100}%` }}
                >
                  <Image
                    src={src}
                    alt={project.title}
                    fill
                    loading="lazy"
                    sizes={`${Math.round(blok.breedtes[kolom] * 100)}vw`}
                    className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
                  />
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
                    className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
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
