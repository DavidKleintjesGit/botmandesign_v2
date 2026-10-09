"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const SECTION_IMAGE = "/images/botman_design_second_section.png";
const IMAGE_FADE_IN_DELAY_MS = 350;
const IMAGE_FADE_IN_MS = 2800;
export const GALLERY_CONTENT_FADE_OUT_MS = 900;
const LABEL_ANIMATION_DELAY_MS = 500;
const LABEL_FADE_MS = 500;

const CEDAR = "#675C53";
const CEDAR_RGB = "103, 92, 83";

const FRAME_GRADIENTS = `
  linear-gradient(to bottom, rgba(0, 0, 0, 0.22) 0%, rgba(0, 0, 0, 0.22) 100%),
  linear-gradient(to bottom, rgba(0, 0, 0, 0.45) 0%, rgba(0, 0, 0, 0.22) 12%, rgba(0, 0, 0, 0.08) 26%, rgba(0, 0, 0, 0) 44%),
  linear-gradient(to bottom, ${CEDAR} 0%, rgba(${CEDAR_RGB}, 0.93) 10%, rgba(${CEDAR_RGB}, 0.65) 26%, rgba(${CEDAR_RGB}, 0.25) 42%, rgba(${CEDAR_RGB}, 0) 58%),
  linear-gradient(to top, ${CEDAR} 0%, rgba(${CEDAR_RGB}, 0.93) 10%, rgba(${CEDAR_RGB}, 0.65) 26%, rgba(${CEDAR_RGB}, 0.25) 42%, rgba(${CEDAR_RGB}, 0) 58%),
  linear-gradient(to right, ${CEDAR} 0%, rgba(${CEDAR_RGB}, 0.93) 8%, rgba(${CEDAR_RGB}, 0.65) 22%, rgba(${CEDAR_RGB}, 0.25) 36%, rgba(${CEDAR_RGB}, 0) 50%),
  linear-gradient(to left, ${CEDAR} 0%, rgba(${CEDAR_RGB}, 0.93) 8%, rgba(${CEDAR_RGB}, 0.65) 22%, rgba(${CEDAR_RGB}, 0.25) 36%, rgba(${CEDAR_RGB}, 0) 50%)
`;

type TestPageGallerySectionProps = {
  isActive: boolean;
};

export default function TestPageGallerySection({ isActive }: TestPageGallerySectionProps) {
  const [imageVisible, setImageVisible] = useState(false);
  const [labelVisible, setLabelVisible] = useState(false);
  const [labelAnimationKey, setLabelAnimationKey] = useState(0);
  const imageTimeoutRef = useRef<number | null>(null);
  const labelTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (imageTimeoutRef.current) {
      window.clearTimeout(imageTimeoutRef.current);
      imageTimeoutRef.current = null;
    }

    if (labelTimeoutRef.current) {
      window.clearTimeout(labelTimeoutRef.current);
      labelTimeoutRef.current = null;
    }

    if (isActive) {
      imageTimeoutRef.current = window.setTimeout(() => {
        setImageVisible(true);
      }, IMAGE_FADE_IN_DELAY_MS);

      labelTimeoutRef.current = window.setTimeout(() => {
        setLabelAnimationKey((current) => current + 1);
        setLabelVisible(true);
      }, LABEL_ANIMATION_DELAY_MS);
    } else {
      setImageVisible(false);
      setLabelVisible(false);
    }

    return () => {
      if (imageTimeoutRef.current) {
        window.clearTimeout(imageTimeoutRef.current);
        imageTimeoutRef.current = null;
      }

      if (labelTimeoutRef.current) {
        window.clearTimeout(labelTimeoutRef.current);
        labelTimeoutRef.current = null;
      }
    };
  }, [isActive]);

  return (
    <section
      className="h-full w-full relative overflow-hidden flex items-center justify-center px-5 sm:px-8 md:px-12 py-10 sm:py-14"
      style={{
        backgroundColor: "var(--color-cedar)",
      }}
    >
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        aria-hidden
        style={{
          opacity: imageVisible ? 1 : 0,
          transition: `opacity ${imageVisible ? IMAGE_FADE_IN_MS : GALLERY_CONTENT_FADE_OUT_MS}ms ease-out`,
        }}
      >
        <div className="absolute inset-0" style={{ filter: "brightness(0.72)" }}>
          <Image
            src={SECTION_IMAGE}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{ background: FRAME_GRADIENTS }}
        />
      </div>

      <div className="relative z-10 mx-auto w-[88vw] max-w-[360px] sm:w-[82vw] sm:max-w-[480px] md:w-[76vw] md:max-w-[620px] lg:w-[min(78vmin,840px)] lg:max-w-[840px]">
        <div className="relative flex aspect-square w-full flex-col items-center justify-center px-6 text-center sm:px-10">
          <h1
            className="text-3xl md:text-5xl lg:text-6xl font-light uppercase tracking-wider max-w-3xl mx-auto flex flex-col items-center gap-0"
            style={{
              fontFamily: "var(--font-cormorant-garamond), serif",
              letterSpacing: "0.04em",
              wordSpacing: "0.25em",
              color: "var(--color-champagne)",
            }}
          >
            <span className="block text-center w-full">&ldquo;Built in layers.</span>
            <span className="block text-center w-full">Felt in silence.&rdquo;</span>
          </h1>
          <p
            key={labelAnimationKey}
            className={`absolute bottom-[10%] text-sm md:text-base leading-relaxed uppercase transition-opacity duration-700 ${
              labelVisible ? "animate-active-projects-label opacity-100" : "opacity-0"
            }`}
            style={{
              color: "var(--color-champagne)",
              fontFamily: "var(--font-montserrat)",
              letterSpacing: "0.12em",
              transitionDuration: `${LABEL_FADE_MS}ms`,
            }}
          >
            ACTIVE PROJECTS BELOW
          </p>
        </div>
      </div>
    </section>
  );
}
