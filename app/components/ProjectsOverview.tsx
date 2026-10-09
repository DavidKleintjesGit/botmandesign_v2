"use client";

import Image from "next/image";
import Link from "next/link";

import SiteHeader from "./SiteHeader";
import Footer from "./Footer";
import PageIntro from "./PageIntro";
import { useLanguage } from "./LanguageProvider";
import { projects } from "@/app/content/projects";

const overviewCopy = {
  en: { label: "PROJECTS", title1: "Selected works.", title2: "One vision.", viewProject: "View project" },
  nl: { label: "PROJECTEN", title1: "Geselecteerd werk.", title2: "Eén visie.", viewProject: "Bekijk project" },
};

/*
 * Het projectenoverzicht in de opmaak van de homepage: cedar als grond,
 * champagne koppen, almond lopende tekst. Het eerste project vult de breedte,
 * de rest valt in een raster van twee.
 */
export default function ProjectsOverview() {
  const { language } = useLanguage();
  const copy = overviewCopy[language];

  const [lead, ...rest] = projects;

  return (
    <div style={{ backgroundColor: "var(--color-cedar)" }}>
      <SiteHeader />

      <PageIntro label={copy.label} title={copy.title1} titleAccent={copy.title2} />

      <section className="w-full pb-24 md:pb-32">
        <div className="container mx-auto px-4 md:px-8">
          <ProjectCard project={lead} label={copy.viewProject} priority wide />

          <div className="mt-6 grid grid-cols-1 gap-6 md:mt-8 md:grid-cols-2 md:gap-8">
            {rest.map((project) => (
              <ProjectCard key={project.slug} project={project} label={copy.viewProject} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function ProjectCard({
  project,
  label,
  priority = false,
  wide = false,
}: {
  project: (typeof projects)[number];
  label: string;
  priority?: boolean;
  wide?: boolean;
}) {
  return (
    <Link
      href={`/projecten/${project.slug}`}
      className="group relative block overflow-hidden rounded-lg"
      style={{ aspectRatio: wide ? "16 / 9" : "4 / 3" }}
    >
      <Image
        src={project.cardImage}
        alt={project.title}
        fill
        priority={priority}
        sizes={wide ? "(max-width: 768px) 100vw, 1200px" : "(max-width: 768px) 100vw, 600px"}
        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
      />

      <div
        className="pointer-events-none absolute inset-0 rounded-lg border"
        style={{ borderColor: "rgba(182, 163, 144, 0.4)" }}
      />

      <div
        className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 px-6 pb-8 pt-24 text-center"
        style={{
          background:
            "linear-gradient(to top, rgba(103, 92, 83, 0.95) 0%, rgba(103, 92, 83, 0.6) 45%, rgba(103, 92, 83, 0) 100%)",
        }}
      >
        <h2
          className="text-xl font-light uppercase tracking-wider md:text-2xl"
          style={{
            fontFamily: "var(--font-cormorant-garamond), serif",
            letterSpacing: "0.15em",
            color: "var(--color-champagne)",
          }}
        >
          {project.title}
        </h2>

        <span
          className="text-[11px] uppercase tracking-wider opacity-0 transition-opacity duration-500 group-hover:opacity-100 md:text-xs"
          style={{ fontFamily: "var(--font-montserrat)", letterSpacing: "0.15em", color: "var(--color-almond)" }}
        >
          {label} &rarr;
        </span>
      </div>
    </Link>
  );
}
