"use client";

import Image from "next/image";
import Link from "next/link";

import Footer from "./Footer";
import { zonderJaartal } from "./ProjectCard";
import { useLanguage } from "./LanguageProvider";
import { projectContent, type Project } from "@/app/content/projects";

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
 * rij is samen precies één scherm breed en één scherm hoog.
 *
 * Het patroon herhaalt zich zolang er beeld is, maar begint nooit op dezelfde
 * plek: een rij van twee halve wordt gevolgd door een hele, dan een tweederde
 * met een derde ernaast. Daardoor leest het als compositie en niet als raster.
 */
const RITME: number[][] = [
  [1],
  [2 / 3, 1 / 3],
  [1 / 2, 1 / 2],
  [1],
  [1 / 3, 2 / 3],
  [1 / 2, 1 / 2],
  [1],
  [2 / 3, 1 / 3],
  [1 / 3, 1 / 3, 1 / 3],
  [1 / 2, 1 / 2],
];

/** Verdeelt de beelden over de banden, zolang er beeld is. */
function bandenVoor(beelden: string[]): { breedtes: number[]; beelden: string[] }[] {
  const banden: { breedtes: number[]; beelden: string[] }[] = [];
  let i = 0;
  let stap = 0;

  while (i < beelden.length) {
    const breedtes = RITME[stap % RITME.length];
    const deel = beelden.slice(i, i + breedtes.length);

    // Een laatste rij die niet vol raakt wordt zo breed als wat er nog is.
    if (deel.length < breedtes.length) {
      banden.push({
        breedtes: deel.map(() => 1 / deel.length),
        beelden: deel,
      });
    } else {
      banden.push({ breedtes, beelden: deel });
    }

    i += deel.length;
    stap += 1;
  }

  return banden;
}

/*
 * Een projectpagina als doorlopend muurvlak van beeld.
 *
 * Geen bijschriften, geen tussenkoppen: je loopt van ruimte naar ruimte en de
 * foto's doen het werk. De naam van het project staat één keer, rechtsonder op
 * het openingsbeeld, en onderaan blijft een smalle balk staan met de weg terug
 * en de vraag of je zelf iets wil beginnen.
 */
export default function ProjectMosaic({ slug, projects }: { slug: string; projects: Project[] }) {
  const { language } = useLanguage();
  const copy = copyPer[language];

  const project = projects.find((item) => item.slug === slug);

  if (!project) return null;

  const content = projectContent(project, language);

  /* Alles wat er aan beeld is, in volgorde en zonder dubbelingen. */
  const beelden = Array.from(
    new Set(
      [project.cardImage, ...content.slides.flatMap((s) => [s.img, s.imgTwo])].filter(
        (src): src is string => Boolean(src),
      ),
    ),
  );

  const [opening, ...rest] = beelden;
  const banden = bandenVoor(rest);

  const anderen = projects.filter((item) => item.slug !== slug).slice(0, 3);

  return (
    // Onderaan ruimte voor de balk die blijft staan, anders dekt hij de footer af.
    <div style={{ backgroundColor: "var(--color-cedar)", paddingBottom: "56px" }}>
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
      {banden.map((band, index) => (
        <div key={`band-${index}`} className="flex h-[70vh] w-full md:h-screen">
          {band.beelden.map((src, kolom) => (
            <div
              key={`${src}-${kolom}`}
              className="relative h-full overflow-hidden"
              style={{ width: `${band.breedtes[kolom] * 100}%` }}
            >
              <Image
                src={src}
                alt={project.title}
                fill
                loading="lazy"
                sizes={`${Math.round(band.breedtes[kolom] * 100)}vw`}
                className="object-cover"
              />
            </div>
          ))}
        </div>
      ))}

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
              <Link key={ander.slug} href={`/concept-2/${ander.slug}`} className="group block">
                <div className="relative w-full overflow-hidden" style={{ aspectRatio: "3 / 4" }}>
                  <Image
                    src={ander.cardImage}
                    alt={ander.title}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
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
              href="/concept-2"
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
