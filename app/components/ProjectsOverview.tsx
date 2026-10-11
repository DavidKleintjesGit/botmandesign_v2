"use client";

import Footer from "./Footer";
import ProjectCard from "./ProjectCard";
import { useLanguage } from "./LanguageProvider";
import type { Project } from "@/app/content/projects";

const overviewCopy = {
  en: { label: "PROJECTS", title1: "Selected works.", title2: "One vision." },
  nl: { label: "PROJECTEN", title1: "Geselecteerd werk.", title2: "Eén visie." },
};

const serif = { fontFamily: "var(--font-cormorant-garamond), serif" } as const;
const sans = { fontFamily: "var(--font-montserrat)" } as const;

/*
 * Het projectenoverzicht.
 *
 * Het eerste project ligt over de volle breedte, de rest in twee kolommen met
 * ruimte ertussen. De eerste kaart rechts begint een stuk lager, zodat de twee
 * kolommen niet als een raster lezen maar als twee eigen reeksen.
 */
export default function ProjectsOverview({ projects }: { projects: Project[] }) {
  const { language } = useLanguage();
  const copy = overviewCopy[language];

  const [featured, ...rest] = projects;

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

      <div className="container mx-auto px-4 pb-24 md:px-8 md:pb-36">
        {featured && <ProjectCard project={featured} language={language} featured />}

        <div className="mt-20 grid grid-cols-1 gap-x-16 gap-y-20 md:mt-28 md:grid-cols-2">
          {rest.map((project, index) => (
            <ProjectCard
              key={project.slug}
              project={project}
              language={language}
              /* Alleen de eerste rechts zakt; daarna lopen de kolommen gelijk op. */
              className={index === 1 ? "md:mt-20" : undefined}
            />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
