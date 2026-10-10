"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import SiteHeader from "./SiteHeader";
import LanguageLabel from "./LanguageLabel";
import Footer from "./Footer";
import ProjectSlideshow from "./ProjectSlideshow";
import { useLanguage } from "./LanguageProvider";
import { projectContent, type Project } from "@/app/content/projects";

const detailCopy = {
  en: { allProjects: "All projects", nextProject: "Next project" },
  nl: { allProjects: "Alle projecten", nextProject: "Volgend project" },
};

const serif = { fontFamily: "var(--font-cormorant-garamond), serif" } as const;
const sans = { fontFamily: "var(--font-montserrat)" } as const;

export default function ProjectDetail({ slug, projects }: { slug: string; projects: Project[] }) {
  const { language } = useLanguage();
  const [navHidden, setNavHidden] = useState(false);
  const handleImmersiveChange = useCallback((immersive: boolean) => setNavHidden(immersive), []);
  const project = projects.find((item) => item.slug === slug);

  if (!project) return null;

  const copy = detailCopy[language];
  const content = projectContent(project, language);
  // Het volgende project in de reeks, zodat de pagina altijd verder kan.
  const next = projects[(projects.findIndex((item) => item.slug === slug) + 1) % projects.length];

  return (
    <div>
      <SiteHeader hidden={navHidden} />
      <LanguageLabel />

      {/* HERO */}
      <header className="relative h-screen w-full overflow-hidden">
        <Image
          src={project.cardImage}
          alt={project.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-20 h-64"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0))" }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-96"
          style={{
            background:
              "linear-gradient(to top, var(--color-cedar) 0%, rgba(103, 92, 83, 0.9) 30%, rgba(103, 92, 83, 0.5) 60%, rgba(103, 92, 83, 0) 100%)",
          }}
        />

        <div className="absolute inset-x-0 bottom-0 z-30 pb-20 md:pb-28">
          <div className="container mx-auto px-4 text-center md:px-8">
            <p
              className="mb-6 text-sm uppercase md:text-base"
              style={{ ...sans, color: "var(--color-champagne)" }}
            >
              {content.category}
            </p>
            <h1
              className="text-4xl font-light uppercase tracking-wider md:text-5xl"
              style={{ ...serif, letterSpacing: "0.15em", color: "var(--color-champagne)" }}
            >
              {project.title}
            </h1>
          </div>
        </div>
      </header>

      {/* INTRO */}
      <section className="w-full py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-8">
          <p
            className="mx-auto max-w-3xl text-center text-lg leading-relaxed md:text-xl"
            style={{ ...serif, color: "var(--color-almond)" }}
          >
            {content.intro}
          </p>
        </div>
      </section>

      {/* BEELDENREEKS — sticky diashow zoals in het ontwerp */}
      <ProjectSlideshow
        slides={content.slides}
        title={project.title}
        backHref="/projecten"
        backLabel={copy.allProjects}
        onImmersiveChange={handleImmersiveChange}
      />

      {/* MATERIAAL */}
      <section
        className="w-full py-20 md:py-28"
        style={{ borderTop: "1px solid rgba(182, 163, 144, 0.25)" }}
      >
        <div className="container mx-auto px-4 text-center md:px-8">
          <p
            className="mx-auto mb-10 max-w-3xl text-xl font-light leading-relaxed md:text-2xl"
            style={{ ...serif, color: "var(--color-champagne)" }}
          >
            {content.materialQuote}
          </p>
          <p
            className="mb-4 text-sm uppercase md:text-base"
            style={{ ...sans, color: "var(--color-champagne)" }}
          >
            {content.materialsLabel}
          </p>
          <p className="text-lg" style={{ ...serif, color: "var(--color-almond)" }}>
            {content.materialsList}
          </p>
        </div>
      </section>

      {/* VOLGEND PROJECT */}
      <Link
        href={`/projecten/${next.slug}`}
        className="group relative block h-[60vh] min-h-[360px] w-full overflow-hidden"
      >
        <Image
          src={next.cardImage}
          alt={next.title}
          fill
          sizes="100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-5 text-center"
          style={{ backgroundColor: "rgba(103, 92, 83, 0.65)" }}
        >
          <p
            className="text-sm uppercase md:text-base"
            style={{ ...sans, color: "var(--color-almond)" }}
          >
            {copy.nextProject}
          </p>
          <h2
            className="text-3xl font-light uppercase tracking-wider md:text-4xl"
            style={{ ...serif, letterSpacing: "0.15em", color: "var(--color-champagne)" }}
          >
            {next.title}
          </h2>
        </div>
      </Link>

      <div className="w-full py-10 text-center" style={{ backgroundColor: "var(--color-cedar)" }}>
        <Link
          href="/projecten"
          className="inline-block rounded-full border px-5 py-2.5 text-sm font-light uppercase tracking-wider transition-all duration-300 hover:opacity-90"
          style={{
            ...sans,
            letterSpacing: "0.15em",
            backgroundColor: "transparent",
            borderColor: "var(--color-almond)",
            color: "var(--color-champagne)",
          }}
        >
          &larr; {copy.allProjects}
        </Link>
      </div>

      <Footer />
    </div>
  );
}
