"use client";

import Image from "next/image";
import type { DualImageProject } from "./TestPageDualImageSection";

const ACTIVE_SIZE = "52%";
const INACTIVE_SIZE = "16%";
const PANEL_TRANSITION =
  "width 1.2s cubic-bezier(0.4, 0, 0.2, 1), height 1.2s cubic-bezier(0.4, 0, 0.2, 1), filter 1.2s cubic-bezier(0.4, 0, 0.2, 1), opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1)";

function getPanelSize(index: number, activeIndex: 0 | 1 | 2 | 3) {
  return index === activeIndex ? ACTIVE_SIZE : INACTIVE_SIZE;
}

type ProjectImageTileProps = {
  image: string;
  title: string;
  isDimmed: boolean;
};

function ProjectImageTile({ image, title, isDimmed }: ProjectImageTileProps) {
  return (
    <div className="relative h-full w-full min-h-0 min-w-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          filter: isDimmed ? "brightness(0.38)" : "brightness(1)",
          transition: PANEL_TRANSITION,
        }}
      >
        <Image
          src={image}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background: "rgba(0, 0, 0, 0.1)",
        }}
        aria-hidden
      />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: isDimmed ? 1 : 0,
          transition: PANEL_TRANSITION,
          background:
            "linear-gradient(to bottom, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.68) 100%)",
        }}
        aria-hidden
      />

      <div
        className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6 sm:px-10"
        style={{
          opacity: isDimmed ? 0 : 1,
          transition: PANEL_TRANSITION,
        }}
      >
        <div className="relative w-full max-w-full px-4 py-8 sm:px-8 sm:py-10">
          <div
            className="pointer-events-none absolute inset-0 -inset-x-4 sm:-inset-x-6"
            style={{
              background:
                "radial-gradient(ellipse 85% 70% at center, rgba(0, 0, 0, 0.38) 0%, rgba(0, 0, 0, 0.16) 48%, transparent 72%)",
            }}
            aria-hidden
          />
          <p
            className="relative w-full overflow-hidden text-ellipsis whitespace-nowrap text-center font-light uppercase leading-none tracking-[0.04em] sm:tracking-[0.06em]"
            style={{
              fontFamily: "var(--font-cormorant-garamond), serif",
              color: "var(--color-champagne)",
              fontSize: "clamp(1rem, 4.2vw, 3rem)",
              textShadow: "0 2px 24px rgba(0, 0, 0, 0.45)",
            }}
          >
            {title}
          </p>
        </div>
      </div>
    </div>
  );
}

type ImagePanelProps = {
  image: string;
  title: string;
  size: string;
  index: 0 | 1 | 2 | 3;
  activeIndex: 0 | 1 | 2 | 3;
};

function ImagePanel({ image, title, size, index, activeIndex }: ImagePanelProps) {
  const isDimmed = index !== activeIndex;

  return (
    <div
      className="relative w-full shrink-0 overflow-hidden"
      style={{
        height: size,
        transition: PANEL_TRANSITION,
      }}
    >
      <ProjectImageTile image={image} title={title} isDimmed={isDimmed} />
    </div>
  );
}

type TestPageQuadImageSectionProps = {
  projects: [DualImageProject, DualImageProject, DualImageProject, DualImageProject];
  activeIndex: 0 | 1 | 2 | 3;
};

export default function TestPageQuadImageSection({
  projects,
  activeIndex,
}: TestPageQuadImageSectionProps) {
  return (
    <section
      className="h-full w-full"
      style={{ backgroundColor: "var(--color-cedar)" }}
    >
      <div className="flex h-full w-full flex-col">
        {projects.map((project, index) => (
          <ImagePanel
            key={project.image}
            image={project.image}
            title={project.title}
            size={getPanelSize(index, activeIndex)}
            index={index as 0 | 1 | 2 | 3}
            activeIndex={activeIndex}
          />
        ))}
      </div>
    </section>
  );
}
