"use client";

import Image from "next/image";
import Link from "next/link";

import Footer from "./Footer";
import { useLanguage } from "./LanguageProvider";
import type { Project } from "@/app/content/projects";

const overviewCopy = {
  en: { label: "PROJECTS", title1: "Selected works.", title2: "One vision." },
  nl: { label: "PROJECTEN", title1: "Geselecteerd werk.", title2: "Eén visie." },
};

const serif = { fontFamily: "var(--font-cormorant-garamond), serif" } as const;
const sans = { fontFamily: "var(--font-montserrat)" } as const;

/*
 * De categorie uit het beheer draagt het jaartal mee — "INTERIOR DESIGN — 2024".
 * Op het overzicht staat alleen waar het project over gaat; het jaartal hoort
 * bij het project zelf, niet bij de rij eronder.
 */
function zonderJaartal(category: string): string {
  return category.replace(/\s*[—–-]\s*\d{4}\s*$/, "");
}

/*
 * Het projectenoverzicht.
 *
 * Het eerste project ligt over de volle breedte, de rest in twee kolommen met
 * ruimte ertussen. De eerste kaart rechts begint een stuk lager, zodat de twee
 * kolommen niet als een raster lezen maar als twee eigen reeksen.
 *
 * De tekst staat onder het beeld in plaats van eroverheen: een foto van een
 * interieur heeft geen rustig vlak om letters op te zetten, en een donkere waas
 * eroverheen kost precies het licht waar het project om draait.
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

function ProjectCard({
  project,
  language,
  featured = false,
  className,
}: {
  project: Project;
  language: "nl" | "en";
  featured?: boolean;
  className?: string;
}) {
  return (
    <Link href={`/projecten/${project.slug}`} className={`group block ${className ?? ""}`}>
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: featured ? "16 / 9" : "3 / 4" }}>
        <Image
          src={project.cardImage}
          alt={project.title}
          fill
          priority={featured}
          loading={featured ? undefined : "lazy"}
          sizes={featured ? "(max-width: 768px) 100vw, 1100px" : "(max-width: 768px) 100vw, 50vw"}
          className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
        />
      </div>

      <div className="mt-6 flex items-end justify-between gap-6">
        <div>
          <p
            className="mb-2 text-xs uppercase md:text-[13px]"
            style={{ ...sans, letterSpacing: "0.2em", color: "var(--color-almond)" }}
          >
            {zonderJaartal(project[language].category)}
          </p>

          <h2
            className={`font-light ${featured ? "text-3xl md:text-5xl" : "text-2xl md:text-3xl"}`}
            style={{ ...serif, color: "var(--color-champagne)" }}
          >
            {project.title}
          </h2>
        </div>

        {/* Schuift een haarbreedte mee als je de kaart aanwijst. */}
        <span
          aria-hidden
          className="mb-1 shrink-0 text-xl transition-transform duration-500 ease-out group-hover:translate-x-1.5"
          style={{ color: "var(--color-almond)" }}
        >
          &rarr;
        </span>
      </div>
    </Link>
  );
}
