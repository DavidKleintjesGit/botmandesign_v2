"use client";

import Image from "next/image";

export type DualImageProject = {
  image: string;
  title: string;
};

export type DualImageSectionLayout = "vertical" | "horizontal";

const VERTICAL_HOVERED_SIZE = "76%";
const VERTICAL_SHRUNK_SIZE = "24%";
const HORIZONTAL_HOVERED_SIZE = "86%";
const HORIZONTAL_SHRUNK_SIZE = "14%";
const PANEL_TRANSITION =
  "width 1.2s cubic-bezier(0.4, 0, 0.2, 1), height 1.2s cubic-bezier(0.4, 0, 0.2, 1), filter 1.2s cubic-bezier(0.4, 0, 0.2, 1), opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1)";

function getPanelSizes(
  activeIndex: 0 | 1,
  layout: DualImageSectionLayout,
): [string, string] {
  const hoveredSize =
    layout === "vertical" ? VERTICAL_HOVERED_SIZE : HORIZONTAL_HOVERED_SIZE;
  const shrunkSize =
    layout === "vertical" ? VERTICAL_SHRUNK_SIZE : HORIZONTAL_SHRUNK_SIZE;

  if (activeIndex === 0) {
    return [hoveredSize, shrunkSize];
  }

  return [shrunkSize, hoveredSize];
}

type ProjectImageTileProps = {
  image: string;
  title: string;
  isDimmed: boolean;
  layout: DualImageSectionLayout;
};

function ProjectImageTile({ image, title, isDimmed, layout }: ProjectImageTileProps) {
  const dimGradient =
    layout === "horizontal"
      ? "linear-gradient(to right, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.68) 100%)"
      : "linear-gradient(to bottom, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.68) 100%)";

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
          background: dimGradient,
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
  index: 0 | 1;
  layout: DualImageSectionLayout;
  activeIndex: 0 | 1;
};

function ImagePanel({ image, title, size, index, layout, activeIndex }: ImagePanelProps) {
  const isDimmed =
    (activeIndex === 0 && index === 1) || (activeIndex === 1 && index === 0);
  const isHorizontal = layout === "horizontal";

  return (
    <div
      className={`relative shrink-0 overflow-hidden ${isHorizontal ? "h-full" : "w-full"}`}
      style={{
        width: isHorizontal ? size : undefined,
        height: isHorizontal ? undefined : size,
        transition: PANEL_TRANSITION,
      }}
    >
      <ProjectImageTile image={image} title={title} isDimmed={isDimmed} layout={layout} />
    </div>
  );
}

type TestPageDualImageSectionProps = {
  projects: [DualImageProject, DualImageProject];
  layout?: DualImageSectionLayout;
  activeIndex: 0 | 1;
};

export default function TestPageDualImageSection({
  projects,
  layout = "vertical",
  activeIndex,
}: TestPageDualImageSectionProps) {
  const [firstSize, secondSize] = getPanelSizes(activeIndex, layout);
  const isHorizontal = layout === "horizontal";

  return (
    <section
      className="h-full w-full"
      style={{ backgroundColor: "var(--color-cedar)" }}
    >
      <div className={`flex h-full w-full ${isHorizontal ? "flex-row" : "flex-col"}`}>
        <ImagePanel
          image={projects[0].image}
          title={projects[0].title}
          size={firstSize}
          index={0}
          layout={layout}
          activeIndex={activeIndex}
        />
        <ImagePanel
          image={projects[1].image}
          title={projects[1].title}
          size={secondSize}
          index={1}
          layout={layout}
          activeIndex={activeIndex}
        />
      </div>
    </section>
  );
}
