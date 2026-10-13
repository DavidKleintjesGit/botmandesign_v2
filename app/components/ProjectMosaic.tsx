"use client";

import Image from "next/image";
import Link from "next/link";

import Footer from "./Footer";
import { zonderJaartal } from "./ProjectCard";
import { useLanguage } from "./LanguageProvider";
import {
  projectContent,
  type Project,
  type ProjectSlide,
} from "@/app/content/projects";

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

/*
 * De breedteverdelingen, nagemeten op kabaz.nl: hele breedte, twee halve,
 * drie derde, of een tweederde met een derde ernaast — in beide volgordes.
 *
 * Elke rij is precies één scherm hoog. Dat is het hele idee: je ziet er nooit
 * twee tegelijk, dus er is ook niets om op één lijn mee te liggen. Lagere
 * rijen maakten er een raster van; dat was wat er misging.
 */
const RITME: { breedtes: number[]; hoogte: string }[] = [
  { breedtes: [1], hoogte: "92vh" },
  { breedtes: [0.38, 0.62], hoogte: "78vh" },
  { breedtes: [0.55, 0.45], hoogte: "88vh" },
  { breedtes: [0.3, 0.44, 0.26], hoogte: "64vh" },
  { breedtes: [0.62, 0.38], hoogte: "82vh" },
  { breedtes: [0.46, 0.54], hoogte: "72vh" },
  { breedtes: [1], hoogte: "86vh" },
  { breedtes: [0.28, 0.4, 0.32], hoogte: "68vh" },
  { breedtes: [0.58, 0.42], hoogte: "80vh" },
  { breedtes: [0.42, 0.58], hoogte: "76vh" },
  { breedtes: [0.34, 0.3, 0.36], hoogte: "62vh" },
  { breedtes: [0.52, 0.48], hoogte: "84vh" },
];

/* De rij waarin een tekstvlak staat; ook die wisselt van maat. */
const TEKSTRIJ = [
  { tekst: 0.34, beeld: 0.66, hoogte: "74vh" },
  { tekst: 0.3, beeld: 0.7, hoogte: "80vh" },
  { tekst: 0.38, beeld: 0.62, hoogte: "70vh" },
];


/** Minimaal aantal rijen beeld tussen twee tekststroken. */
const MINSTENS_RIJEN_TUSSEN = 2;

type Tekst = { sub: string; kop: string; body: string };
type Cel = { breedte: number } & (
  { soort: "beeld"; src: string } | ({ soort: "tekst" } & Tekst)
);
type Rij = { cellen: Cel[]; hoogte: string };

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
    .filter(
      (s) =>
        (s.layout === "rust" || s.layout === "tekst") && (s.caption || s.body),
    )
    .map((s) => ({
      soort: "tekst" as const,
      sub: s.sub,
      kop: s.caption,
      body: s.body,
    }));
}

/**
 * Zet de rijen op.
 *
 * Tekst is hier geen balk over de volle breedte maar een tegel in de rij,
 * naast een beeld: een derde tekst en tweederde beeld, en de volgende keer
 * andersom. Zo hoort het bij de galerij in plaats van dat het hem onderbreekt.
 *
 * Nooit in de laatste rij: een project hoort te eindigen op een ruimte, niet
 * op een alinea.
 */
function rijenVoor(
  slides: ProjectSlide[],
  opening: string,
  inleiding: Tekst,
): Rij[] {
  const beelden = beeldenVoor(slides, opening);
  const teksten = [inleiding, ...tekstenVoor(slides)];

  /*
   * Hoeveel rijen er ongeveer komen, om de tekst gelijkmatig te verdelen. Een
   * rij pakt gemiddeld ruim twee beelden; een rij met tekst pakt er één.
   * Afronden en niet afkappen, anders schuift alles naar voren en staat de
   * laatste helft van de pagina zonder woorden.
   */
  const schatting = Math.max(
    1,
    Math.round(beelden.length / 2.2) + teksten.length,
  );
  const ruimte = Math.max(
    MINSTENS_RIJEN_TUSSEN,
    Math.round(schatting / (teksten.length + 1)),
  );

  const rijen: Rij[] = [];
  let i = 0;
  let volgende = 0;
  let stap = 0;

  while (i < beelden.length) {
    const nummer = rijen.length + 1;
    const nogBeeldNa = beelden.length - i > 1;
    const tekstBeurt =
      nogBeeldNa && nummer % ruimte === 0 && volgende < teksten.length;

    if (tekstBeurt) {
      const tekst = teksten[volgende];
      const linksTekst = volgende % 2 === 0;
      volgende += 1;

      const maat = TEKSTRIJ[(volgende - 1) % TEKSTRIJ.length];
      const beeld: Cel = { soort: "beeld", src: beelden[i], breedte: maat.beeld };
      const vak: Cel = { soort: "tekst", breedte: maat.tekst, ...tekst };

      rijen.push({
        cellen: linksTekst ? [vak, beeld] : [beeld, vak],
        hoogte: maat.hoogte,
      });
      i += 1;
      continue;
    }

    /*
     * Nooit twee schermvullende beelden achter elkaar: twee keer een heel
     * scherm op rij leest als een diavoorstelling in plaats van als een
     * galerij. Staat de volgende verdeling op vol terwijl de vorige dat ook
     * was, dan slaan we hem over.
     */
    /*
     * Een eigen teller en niet het aantal rijen: sla je een verdeling over,
     * dan moet de volgende rij verder in het ritme beginnen. Anders komt die
     * overgeslagen stap terug en staan er twee rijen met dezelfde verdeling
     * onder elkaar — precies de naden die op één lijn liggen.
     */

    /*
     * Het openingsbeeld is zelf al een vol scherm, dus de eerste rij telt als
     * de tweede: ook die mag niet de volle breedte pakken.
     */
    const vorigeVol =
      rijen.length === 0 || rijen[rijen.length - 1].cellen.length === 1;

    if (vorigeVol && RITME[stap % RITME.length].breedtes.length === 1) stap += 1;

    const { breedtes, hoogte } = RITME[stap % RITME.length];
    stap += 1;
    const deel = beelden.slice(i, i + breedtes.length);

    rijen.push({
      cellen: deel.map((src, k) => ({
        soort: "beeld" as const,
        src,
        breedte: deel.length < breedtes.length ? 1 / deel.length : breedtes[k],
      })),
      hoogte,
    });

    i += deel.length;
  }

  return rijen;
}

/*
 * Een projectpagina als doorlopend muurvlak van beeld, zoals kabaz.nl.
 *
 * Geen bijschriften bij de beelden: je loopt van ruimte naar ruimte en de
 * foto's doen het werk. Af en toe een smalle strook om iets te vertellen, en
 * onderaan blijft een balk staan met de weg terug.
 */
export default function ProjectMosaic({
  slug,
  projects,
}: {
  slug: string;
  projects: Project[];
}) {
  const { language } = useLanguage();
  const copy = copyPer[language];

  const project = projects.find((item) => item.slug === slug);

  if (!project) return null;

  const content = projectContent(project, language);
  const opening = project.cardImage;
  const rijen = rijenVoor(content.slides, opening, {
    sub: zonderJaartal(content.category),
    kop: project.title,
    body: content.intro,
  });
  const anderen = projects.filter((item) => item.slug !== slug).slice(0, 3);

  return (
    <div
      style={{ backgroundColor: "var(--color-cedar)", paddingBottom: "56px" }}
    >
      {/* OPENING — één beeld, met de naam rechtsonder */}
      <header className="relative h-screen w-full overflow-hidden">
        <Image
          src={opening}
          alt={project.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(0deg, rgba(10,9,7,0.45) 0%, rgba(10,9,7,0) 45%)",
          }}
        />

        <div className="absolute bottom-[clamp(96px,16vh,160px)] right-[clamp(20px,5vw,72px)] text-right">
          <p className="t-label mb-3">{zonderJaartal(content.category)}</p>
          <h1 className="t-kop">{project.title}</h1>
        </div>
      </header>

      {/* HET MUURVLAK */}
      {rijen.map((rij, index) => (
        <div
          key={`rij-${index}`}
          className="flex w-full flex-col md:flex-row"
          style={{ "--hoog": rij.hoogte } as React.CSSProperties}
        >
          {rij.cellen.map((cel, k) =>
            cel.soort === "tekst" ? (
              <TekstTegel
                key={`tekst-${index}-${k}`}
                breedte={cel.breedte}
                sub={cel.sub}
                kop={cel.kop}
                body={cel.body}
              />
            ) : (
              <div
                key={`${cel.src}-${k}`}
                className="group relative aspect-[4/3] w-full overflow-hidden md:aspect-auto md:h-[var(--hoog)] md:w-[var(--breed)]"
                style={
                  { "--breed": `${cel.breedte * 100}%` } as React.CSSProperties
                }
              >
                <Image
                  src={cel.src}
                  alt={project.title}
                  fill
                  loading="lazy"
                  sizes={`${Math.round(cel.breedte * 100)}vw`}
                  className="object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-[1.025]"
                />
              </div>
            ),
          )}
        </div>
      ))}

      {/* MEER INSPIRATIE */}
      <section className="w-full py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-8">
          <p className="t-label mb-10">{copy.meer}</p>

          <div className="grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-3">
            {anderen.map((ander) => (
              <Link
                key={ander.slug}
                href={`/projecten/${ander.slug}`}
                className="group block"
              >
                <div
                  className="relative w-full overflow-hidden"
                  style={{ aspectRatio: "3 / 4" }}
                >
                  <Image
                    src={ander.cardImage}
                    alt={ander.title}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-[1.025]"
                  />
                </div>

                <h2 className="t-titel mt-5">{ander.title}</h2>
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
        style={{
          backgroundColor: "rgba(103, 92, 83, 0.82)",
          borderTop: "1px solid rgba(182, 163, 144, 0.3)",
        }}
      >
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-x-8 gap-y-2 px-[clamp(16px,4vw,48px)] py-3.5">
          <div className="flex items-center gap-6">
            <Link
              href="/projecten"
              className="t-label t-label--sterk transition-opacity duration-300 hover:opacity-70"
            >
              &larr; {copy.terug}
            </Link>

            <span className="t-tekst hidden md:inline">{copy.vraag}</span>
          </div>

          <div className="flex items-center gap-5">
            <a
              href={`mailto:${copy.mail}`}
              className="t-label t-label--sterk transition-opacity duration-300 hover:opacity-70"
            >
              {copy.mail}
            </a>
            <span aria-hidden style={{ color: "rgba(182, 163, 144, 0.5)" }}>
              |
            </span>
            <a
              href={`tel:${copy.tel.replace(/\s/g, "")}`}
              className="t-label t-label--sterk transition-opacity duration-300 hover:opacity-70"
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
 * Een tegel met tekst, even hoog als de rij waarin hij staat.
 *
 * Hij ligt op cedar — dezelfde grond als de footer — zodat hij tussen de
 * beelden leest als een stuk muur in plaats van als een onderbreking.
 */
function TekstTegel({
  breedte,
  sub,
  kop,
  body,
}: {
  breedte: number;
  sub?: string;
  kop?: string;
  body?: string;
}) {
  return (
    <div
      className="flex w-full flex-col justify-center px-[clamp(20px,3vw,44px)] py-14 md:h-[var(--hoog)] md:w-[var(--breed)] md:py-10"
      style={
        {
          "--breed": `${breedte * 100}%`,
          backgroundColor: "var(--color-cedar)",
        } as React.CSSProperties
      }
    >
      {sub && <p className="t-label mb-4">{sub}</p>}
      {kop && <h2 className="t-titel mb-5">{kop}</h2>}
      {body && <p className="t-tekst">{body}</p>}
    </div>
  );
}
