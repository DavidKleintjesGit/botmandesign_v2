"use client";

import Image from "next/image";
import Link from "next/link";

import { useLanguage } from "./LanguageProvider";
import { projects } from "@/app/content/projects";

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
 * Twee kolommen beeld van rand tot rand, zonder tussenruimte. De hoogtes
 * verschillen per beeld, waardoor de kolommen vanzelf uit de pas gaan lopen —
 * dat is wat het rustige ritme geeft. In het gat dat daardoor links ontstaat
 * valt een tekstblok op cedar, zodat de reeks ademt.
 */
export default function HomeProjectsSection() {
  const { language } = useLanguage();
  const copy = sectionCopy[language];

  // Zes projecten: drie links, drie rechts, om en om uit de reeks gehaald.
  const [a, b, c, d, e, f] = projects.slice(0, 6);

  return (
    <section className="w-full" style={{ backgroundColor: "var(--color-cedar)" }}>
      {/* Kop boven de reeks */}
      <div className="container mx-auto px-4 pb-14 pt-20 md:px-8 md:pb-20 md:pt-28">
        <p className="mb-6 text-sm uppercase md:text-base" style={{ ...sans, color: "var(--color-champagne)" }}>
          {copy.label}
        </p>

        <h2
          className="text-3xl font-light uppercase tracking-wider md:text-4xl lg:text-5xl"
          style={{ ...serif, letterSpacing: "0.15em", color: "var(--color-champagne)" }}
        >
          {copy.title}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col">
          <ProjectTile project={a} ratio="4 / 5" priority />
          <TextTile body={copy.body} link={copy.link} />
          <ProjectTile project={c} ratio="4 / 3" />
          <ProjectTile project={e} ratio="1 / 1" />
        </div>

        <div className="flex flex-col">
          <ProjectTile project={b} ratio="1 / 1" />
          <ProjectTile project={d} ratio="4 / 5" />
          <ProjectTile project={f} ratio="4 / 3" />
        </div>
      </div>
    </section>
  );
}

function ProjectTile({
  project,
  ratio,
  priority = false,
}: {
  project: (typeof projects)[number];
  ratio: string;
  priority?: boolean;
}) {
  const { language } = useLanguage();

  return (
    <Link
      href={`/projecten/${project.slug}`}
      className="group relative block overflow-hidden"
      style={{ aspectRatio: ratio }}
    >
      <Image
        src={project.cardImage}
        alt={project.title}
        fill
        priority={priority}
        loading={priority ? undefined : "lazy"}
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
      />

      {/* De naam komt pas op bij aanwijzen, zodat de reeks als beeld blijft lezen. */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ backgroundColor: "rgba(10, 9, 7, 0.45)" }}
      >
        <p className="text-xs uppercase" style={{ ...sans, letterSpacing: "0.2em", color: "#cbbfa9" }}>
          {project.number} &mdash; {project.year}
        </p>

        <p
          className="text-2xl font-light italic md:text-3xl"
          style={{ ...serif, color: "var(--color-champagne)" }}
        >
          {project.title}
        </p>
      </div>

      <span className="sr-only">{language === "nl" ? "Bekijk project" : "View project"}</span>
    </Link>
  );
}

function TextTile({ body, link }: { body: string; link: string }) {
  return (
    <div
      className="flex flex-col justify-center px-8 py-16 md:px-14 md:py-24"
      style={{ backgroundColor: "var(--color-cedar)" }}
    >
      <p className="mb-10 text-lg leading-relaxed md:text-xl" style={{ ...serif, color: "var(--color-almond)" }}>
        {body}
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
        {link}
      </Link>
    </div>
  );
}
