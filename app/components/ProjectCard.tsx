"use client";

import Image from "next/image";
import Link from "next/link";

import type { Project } from "@/app/content/projects";

/*
 * De categorie uit het beheer draagt het jaartal mee — "INTERIOR DESIGN — 2024".
 * Op een kaart staat alleen waar het project over gaat; het jaartal hoort bij
 * het project zelf, niet bij de rij eronder.
 */
export function zonderJaartal(category: string): string {
  return category.replace(/\s*[—–-]\s*\d{4}\s*$/, "");
}

/*
 * Eén kaart voor zowel het projectenoverzicht als de homepage, zodat de twee
 * niet uit elkaar kunnen lopen.
 *
 * De tekst staat onder het beeld en niet eroverheen: een interieurfoto heeft
 * geen rustig vlak om letters op te zetten, en de donkere waas die daarvoor
 * nodig is kost precies het licht waar het project om draait.
 */
export default function ProjectCard({
  project,
  language,
  featured = false,
  className,
}: {
  project: Project;
  language: "nl" | "en";
  /** Breed beeld in plaats van staand, voor het eerste project van een reeks. */
  featured?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={`/projecten/${project.slug}`}
      className={`group block ${className ?? ""}`}
    >
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: featured ? "16 / 9" : "3 / 4" }}
      >
        <Image
          src={project.cardImage}
          alt={project.title}
          fill
          priority={featured}
          loading={featured ? undefined : "lazy"}
          sizes={
            featured
              ? "(max-width: 768px) 100vw, 1100px"
              : "(max-width: 768px) 100vw, 50vw"
          }
          className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
        />
      </div>

      <div className="mt-6 flex items-end justify-between gap-6">
        <div>
          <p className="t-label mb-2">
            {zonderJaartal(project[language].category)}
          </p>

          <h3 className="t-titel">{project.title}</h3>
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
