"use client";

import Image from "next/image";
import Link from "next/link";

import Footer from "./Footer";
import { zonderJaartal } from "./ProjectCard";
import { useLanguage } from "./LanguageProvider";
import { projectContent, type Project } from "@/app/content/projects";

const overviewCopy = {
  en: { label: "PROJECTS", title1: "Selected works.", title2: "One vision." },
  nl: { label: "PROJECTEN", title1: "Geselecteerd werk.", title2: "Eén visie." },
};

const serif = { fontFamily: "var(--font-cormorant-garamond), serif" } as const;
const sans = { fontFamily: "var(--font-montserrat)" } as const;

/*
 * De breedteverdeling per project, nagemeten op kabaz.nl/projecten: twee
 * gelijke helften, dan een derde met een tweederde ernaast, weer twee helften,
 * en dan andersom. Elke rij is een half scherm hoog.
 */
const RITME: number[][] = [
  [1 / 2, 1 / 2],
  [1 / 3, 2 / 3],
  [1 / 2, 1 / 2],
  [2 / 3, 1 / 3],
];

/** Twee beelden per project: de voorkant en het eerste beeld uit de reeks. */
function beeldenVan(project: Project, language: "nl" | "en"): string[] {
  const content = projectContent(project, language);
  const uit = [project.cardImage];

  for (const slide of content.slides) {
    if (slide.img && !uit.includes(slide.img)) uit.push(slide.img);
    if (uit.length === 2) break;
  }

  // Heeft een project maar één beeld, dan staat dat er twee keer.
  return uit.length === 2 ? uit : [uit[0], uit[0]];
}

/*
 * Het projectenoverzicht: één rij per project.
 *
 * Twee beelden naast elkaar, allebei een ingang naar hetzelfde project. Geen
 * kaarten met tekst eronder maar beeld van rand tot rand — wie hier komt wil
 * zien, niet lezen. De naam komt pas als je er met de muis overheen gaat.
 */
export default function ProjectsOverview({ projects }: { projects: Project[] }) {
  const { language } = useLanguage();
  const copy = overviewCopy[language];

  return (
    <div>
      <section className="w-full pt-40 pb-14 md:pt-52 md:pb-20">
        <div className="container mx-auto px-4 md:px-8">
          <p className="mb-6 text-sm uppercase md:text-base" style={{ ...sans, color: "var(--color-champagne)" }}>
            {copy.label}
          </p>

          <h1
            className="text-3xl font-light uppercase tracking-wider md:text-4xl lg:text-5xl"
            style={{ ...serif, letterSpacing: "0.15em", color: "var(--color-champagne)" }}
          >
            {copy.title1}
            <br />
            <span className="italic" style={{ color: "var(--color-almond)" }}>
              {copy.title2}
            </span>
          </h1>
        </div>
      </section>

      {projects.map((project, index) => {
        const breedtes = RITME[index % RITME.length];
        const beelden = beeldenVan(project, language);
        const content = projectContent(project, language);

        return (
          <div key={project.slug} className="flex w-full flex-col md:h-[50vh] md:flex-row">
            {beelden.map((src, k) => (
              <Link
                key={`${project.slug}-${k}`}
                href={`/projecten/${project.slug}`}
                className="group relative aspect-[4/3] w-full overflow-hidden md:aspect-auto md:h-full md:w-[var(--breed)]"
                style={{ "--breed": `${breedtes[k] * 100}%` } as React.CSSProperties}
              >
                <Image
                  src={src}
                  alt={project.title}
                  fill
                  priority={index === 0}
                  loading={index === 0 ? undefined : "lazy"}
                  sizes={`(max-width: 768px) 100vw, ${Math.round(breedtes[k] * 100)}vw`}
                  className="object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-[1.025]"
                />

                {/* De naam komt pas op als je er met de muis overheen gaat. */}
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ backgroundColor: "rgba(10, 9, 7, 0.42)" }}
                >
                  <p
                    className="text-[11px] uppercase md:text-xs"
                    style={{ ...sans, letterSpacing: "0.2em", color: "var(--color-almond)" }}
                  >
                    {zonderJaartal(content.category)}
                  </p>

                  <p
                    className="text-3xl font-light md:text-4xl"
                    style={{ ...serif, color: "var(--color-champagne)" }}
                  >
                    {project.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        );
      })}

      <Footer />
    </div>
  );
}
