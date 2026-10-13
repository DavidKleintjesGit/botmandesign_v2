"use client";

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
 * De breedteverdelingen, nagemeten op kabaz.nl: hele breedte, twee halve,
 * drie derde, of een tweederde met een derde ernaast — in beide volgordes.
 *
 * Elke rij is precies één scherm hoog. Dat is het hele idee: je ziet er nooit
 * twee tegelijk, dus er is ook niets om op één lijn mee te liggen. Lagere
 * rijen maakten er een raster van; dat was wat er misging.
 */
const RITME: number[][] = [
  [1],
  [1 / 3, 1 / 3, 1 / 3],
  [1 / 2, 1 / 2],
  [2 / 3, 1 / 3],
  [1 / 2, 1 / 2],
  [1 / 3, 2 / 3],
  [1],
  [2 / 3, 1 / 3],
  [1 / 3, 1 / 3, 1 / 3],
  [1 / 3, 2 / 3],
  [1 / 2, 1 / 2],
  [2 / 3, 1 / 3],
];

/** Minimaal aantal rijen beeld tussen twee tekststroken. */
const MINSTENS_RIJEN_TUSSEN = 2;

type Rij = { soort: "rij"; breedtes: number[]; beelden: string[] };
type Tekst = { soort: "tekst"; sub: string; kop: string; body: string };
type Blok = Rij | Tekst;

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

/** De tekstvlakken die in de reeks staan. */
function tekstenVoor(slides: ProjectSlide[]): Tekst[] {
  return slides
    .filter((s) => (s.layout === "rust" || s.layout === "tekst") && (s.caption || s.body))
    .map((s) => ({ soort: "tekst" as const, sub: s.sub, kop: s.caption, body: s.body }));
}

/**
 * Zet de rijen en de tekstvlakken achter elkaar.
 *
 * Tekst staat alleen tússen beeld. Nooit als laatste: dan eindigt een project
 * op een alinea in plaats van op een ruimte, en dat is precies waar je
 * doorheen wil blijven scrollen.
 */
function blokkenVoor(slides: ProjectSlide[], opening: string, inleiding: Tekst): Blok[] {
  const beelden = beeldenVoor(slides, opening);
  const teksten = [inleiding, ...tekstenVoor(slides)];

  const rijen: Rij[] = [];
  let i = 0;

  while (i < beelden.length) {
    const breedtes = RITME[rijen.length % RITME.length];
    const deel = beelden.slice(i, i + breedtes.length);

    rijen.push({
      soort: "rij",
      breedtes: deel.length < breedtes.length ? deel.map(() => 1 / deel.length) : breedtes,
      beelden: deel,
    });

    i += deel.length;
  }

  /*
   * De afstand tussen twee stroken hangt af van hoeveel beeld er is. Bij veel
   * foto's staan ze ver uit elkaar, bij weinig schuiven ze naar elkaar toe —
   * maar nooit dichter dan twee rijen, en nooit achter de laatste rij. Zo valt
   * er ook geen tekst weg omdat er net geen plek meer was.
   */
  const ruimte = Math.max(MINSTENS_RIJEN_TUSSEN, Math.floor(rijen.length / (teksten.length + 1)));

  const blokken: Blok[] = [];
  let volgende = 0;

  rijen.forEach((rij, index) => {
    blokken.push(rij);

    const laatste = index === rijen.length - 1;

    if (!laatste && (index + 1) % ruimte === 0 && volgende < teksten.length) {
      blokken.push(teksten[volgende]);
      volgende += 1;
    }
  });

  return blokken;
}

/*
 * Een projectpagina als doorlopend muurvlak van beeld, zoals kabaz.nl.
 *
 * Geen bijschriften bij de beelden: je loopt van ruimte naar ruimte en de
 * foto's doen het werk. Af en toe een smalle strook om iets te vertellen, en
 * onderaan blijft een balk staan met de weg terug.
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
          <TekstStrook key={`tekst-${index}`} sub={blok.sub} kop={blok.kop} body={blok.body} />
        ) : (
          <div key={`rij-${index}`} className="flex h-[60vh] w-full md:h-screen">
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
                  className="object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-[1.025]"
                />
              </div>
            ))}
          </div>
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
 * Een smalle strook om iets te vertellen, tussen twee rijen beeld door.
 *
 * Op cedar, dezelfde grond als de footer: een lichte strook hield het beeld te
 * lang tegen. En laag gehouden — je komt hier langs, je gaat er niet zitten.
 */
function TekstStrook({ sub, kop, body }: { sub?: string; kop?: string; body?: string }) {
  if (!kop && !body) return null;

  return (
    <section className="w-full py-14 md:py-16" style={{ backgroundColor: "var(--color-cedar)" }}>
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-3xl">
          {sub && (
            <p
              className="mb-4 text-[11px] uppercase md:text-xs"
              style={{ ...sans, letterSpacing: "0.2em", color: "var(--color-almond)" }}
            >
              {sub}
            </p>
          )}

          {kop && (
            <h2
              className="mb-5 text-2xl font-light md:text-3xl"
              style={{ ...serif, color: "var(--color-champagne)" }}
            >
              {kop}
            </h2>
          )}

          {body && (
            <p
              className="max-w-prose text-base leading-relaxed md:text-lg"
              style={{ ...serif, color: "var(--color-almond)" }}
            >
              {body}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
