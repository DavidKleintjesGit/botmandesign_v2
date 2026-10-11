"use client";

import Link from "next/link";

import ProjectCard from "./ProjectCard";
import { useLanguage } from "./LanguageProvider";
import type { Project } from "@/app/content/projects";

const sectionCopy = {
  nl: {
    label: "Werk",
    title: "Geselecteerd werk",
    body: "Elk project begint bij hoe iemand wil leven. De indeling, de materialen en het licht volgen daaruit — niet andersom.",
    link: "Alle projecten",
  },
  en: {
    label: "Work",
    title: "Selected work",
    body: "Every project starts with how someone wants to live. The layout, the materials and the light follow from that — not the other way round.",
    link: "All projects",
  },
};

const serif = { fontFamily: "var(--font-cormorant-garamond), serif" } as const;
const sans = { fontFamily: "var(--font-montserrat)" } as const;

/*
 * Twee projecten op de homepage, niet het hele overzicht.
 *
 * Hier hoort een voorproefje te staan, geen tweede overzichtspagina: wie meer
 * wil zien klikt door. De rechterkaart zakt een stuk, hetzelfde ritme als op
 * de overzichtspagina, zodat de twee niet als een raster lezen.
 */
export default function HomeProjectsSection({ projects }: { projects: Project[] }) {
  const { language } = useLanguage();
  const copy = sectionCopy[language];

  const uitgelicht = projects.slice(0, 2);

  return (
    <section className="w-full" style={{ backgroundColor: "var(--color-cedar)" }}>
      <div className="container mx-auto px-4 pb-16 pt-20 md:px-8 md:pb-24 md:pt-28">
        <p className="mb-6 text-sm uppercase md:text-base" style={{ ...sans, color: "var(--color-champagne)" }}>
          {copy.label}
        </p>

        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <h2
            className="text-3xl font-light uppercase tracking-wider md:text-4xl lg:text-5xl"
            style={{ ...serif, letterSpacing: "0.15em", color: "var(--color-champagne)" }}
          >
            {copy.title}
          </h2>

          <div className="flex max-w-md flex-col">
            <p className="mb-8 text-lg leading-relaxed md:text-xl" style={{ ...serif, color: "var(--color-almond)" }}>
              {copy.body}
            </p>

            <Link
              href="/projecten"
              className="inline-block self-start rounded-full border px-5 py-2.5 text-sm font-light uppercase tracking-wider transition-all duration-300 hover:opacity-90"
              style={{
                ...sans,
                letterSpacing: "0.15em",
                backgroundColor: "transparent",
                borderColor: "var(--color-almond)",
                color: "var(--color-champagne)",
              }}
            >
              {copy.link}
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-20 md:px-8 md:pb-28">
        <div className="grid grid-cols-1 gap-x-16 gap-y-16 md:grid-cols-2">
          {uitgelicht.map((project, index) => (
            <ProjectCard
              key={project.slug}
              project={project}
              language={language}
              className={index === 1 ? "md:mt-20" : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
