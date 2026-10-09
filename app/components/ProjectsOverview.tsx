"use client";

import Image from "next/image";
import Link from "next/link";

import SiteHeader from "./SiteHeader";
import Footer from "./Footer";
import { useLanguage } from "./LanguageProvider";
import { projects, type Project } from "@/app/content/projects";

const overviewCopy = {
  en: { label: "PROJECTS", title1: "Selected works.", title2: "One vision.", viewProject: "VIEW PROJECT" },
  nl: { label: "PROJECTEN", title1: "Geselecteerd werk.", title2: "Eén visie.", viewProject: "BEKIJK PROJECT" },
};

const serif = { fontFamily: "var(--font-cormorant-garamond), serif" } as const;
const sans = { fontFamily: "var(--font-montserrat)" } as const;

/*
 * Het projectenoverzicht: één beeld over de volle breedte, daaronder twee
 * kolommen die tegen elkaar aan liggen — geen marges, geen tussenruimte. De
 * rechterkolom start een stuk lager, zodat de kaarten onderling verspringen.
 */
export default function ProjectsOverview() {
  const { language } = useLanguage();
  const copy = overviewCopy[language];

  const [featured, ...rest] = projects;
  const leftColumn = rest.filter((_, index) => index % 2 === 0);
  const rightColumn = rest.filter((_, index) => index % 2 === 1);

  return (
    <div style={{ backgroundColor: "var(--color-cedar)" }}>
      <SiteHeader />

      <section className="w-full pt-40 pb-12 md:pt-52 md:pb-16">
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

      {/* Uitgelicht project, over de volle breedte en zonder marge */}
      <ProjectCard project={featured} label={copy.viewProject} priority featured />

      {/* Twee kolommen, strak tegen elkaar; rechts verspringt naar beneden */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col">
          {leftColumn.map((project) => (
            <ProjectCard key={project.slug} project={project} label={copy.viewProject} />
          ))}
        </div>

        <div className="flex flex-col md:mt-[clamp(28px,5vw,56px)]">
          {rightColumn.map((project) => (
            <ProjectCard key={project.slug} project={project} label={copy.viewProject} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

function ProjectCard({
  project,
  label,
  priority = false,
  featured = false,
}: {
  project: Project;
  label: string;
  priority?: boolean;
  featured?: boolean;
}) {
  return (
    <Link
      href={`/projecten/${project.slug}`}
      className="group relative block overflow-hidden"
      style={{ aspectRatio: featured ? "16 / 8" : "4 / 5" }}
    >
      <Image
        src={project.cardImage}
        alt={project.title}
        fill
        priority={priority}
        loading={priority ? undefined : "lazy"}
        sizes={featured ? "100vw" : "(max-width: 768px) 100vw, 50vw"}
        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(0deg, rgba(10,9,7,0.68) 0%, rgba(10,9,7,0.3) 45%, rgba(10,9,7,0.5) 100%)",
        }}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center md:p-10">
        <p
          className={`mb-4 uppercase ${featured ? "text-sm" : "text-[13px]"}`}
          style={{ ...sans, letterSpacing: "0.2em", color: "#cbbfa9" }}
        >
          {project.number} &mdash; Interior design &mdash; {project.year}
        </p>

        <h2
          className={`mb-5 font-light italic ${featured ? "text-4xl md:text-6xl" : "text-3xl md:text-5xl"}`}
          style={{ ...serif, color: "var(--color-champagne)" }}
        >
          {project.title}
        </h2>

        <span
          className="inline-block border-b pb-1.5 text-xs uppercase"
          style={{ ...sans, letterSpacing: "0.15em", borderColor: "#d8cdbb", color: "var(--color-champagne)" }}
        >
          {label} &rarr;
        </span>
      </div>
    </Link>
  );
}
