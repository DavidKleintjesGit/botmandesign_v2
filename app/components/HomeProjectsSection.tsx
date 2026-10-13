"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useLanguage } from "./LanguageProvider";
import type { Project } from "@/app/content/projects";

gsap.registerPlugin(ScrollTrigger);

/*
 * Hoeveel de kolommen opschuiven terwijl je er langs scrollt. De rechterkolom
 * loopt iets verder door dan de linker, waardoor het beeld blijft bewegen
 * zonder dat er iets verspringt.
 */
const LOOP_LINKS = -90;
const LOOP_RECHTS = -150;

/*
 * Beeld, verder niets.
 *
 * Hier stond een kop, een tekstblok en een verloop aan de boven- en onderkant.
 * Dat haalde de vaart eruit: je kwam uit een stilstaand citaat en kreeg eerst
 * weer woorden. Nu komt het werk meteen, en komt het al scrollend omhoog.
 */
export default function HomeProjectsSection({ projects }: { projects: Project[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const rechtsRef = useRef<HTMLDivElement>(null);

  const [a, b, c, d, e, f] = projects.slice(0, 6);

  useEffect(() => {
    const sectie = sectionRef.current;
    const links = linksRef.current;
    const rechts = rechtsRef.current;
    if (!sectie || !links || !rechts) return;

    // Op een smal scherm staan de kolommen onder elkaar; dan heeft het geen zin.
    const smal = window.matchMedia("(max-width: 768px)");
    const stil = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (smal.matches || stil.matches) return;

    const ctx = gsap.context(() => {
      gsap.to(links, {
        y: LOOP_LINKS,
        ease: "none",
        scrollTrigger: { trigger: sectie, start: "top bottom", end: "bottom top", scrub: 0.6 },
      });

      gsap.to(rechts, {
        y: LOOP_RECHTS,
        ease: "none",
        scrollTrigger: { trigger: sectie, start: "top bottom", end: "bottom top", scrub: 0.6 },
      });
    }, sectie);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full overflow-hidden"
      style={{ backgroundColor: "var(--color-cedar)" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div ref={linksRef} className="flex flex-col">
          <ProjectTile project={a} ratio="4 / 5" priority />
          <ProjectTile project={c} ratio="4 / 3" />
          <ProjectTile project={e} ratio="1 / 1" />
        </div>

        <div ref={rechtsRef} className="flex flex-col">
          <ProjectTile project={b} ratio="1 / 1" />
          <ProjectTile project={d} ratio="4 / 5" />
          <ProjectTile project={f ?? a} ratio="4 / 3" />
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
  project?: Project;
  ratio: string;
  priority?: boolean;
}) {
  const { language } = useLanguage();

  if (!project) return null;

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
        className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
      />

      <span className="sr-only">
        {language === "nl" ? `Bekijk ${project.title}` : `View ${project.title}`}
      </span>
    </Link>
  );
}
