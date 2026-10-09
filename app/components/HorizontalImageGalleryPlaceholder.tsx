"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Total pinned scroll (px). Larger = more room, especially the cedar-only tail after images.
 */
const SCROLL_HOLD = 5400;

/** Crossing this progress (increasing) → starts timed fade-out animation. */
const FADE_OUT_ENTER_PROGRESS = 0.54;

/** Crossing below this (decreasing) → timed fade-in again (hysteresis). */
const FADE_OUT_EXIT_PROGRESS = 0.5;

/**
 * Crossing into this band finishes the shell to opacity 0. Lower = longer scroll after (no image)
 * before the pin ends: tail is (1 − this) × SCROLL_HOLD px once the short finish tween completes.
 */
const SHELL_HARD_OFF_PROGRESS = 0.66;

/** Fast finish when entering the hard-off band (still animated, not a 1-frame set). */
const SHELL_HARD_OFF_FINISH_SEC = 0.55;

const SHELL_FADE_IN_SEC = 2.75;
const SHELL_FADE_IN_DELAY_SEC = 0.35;
const SHELL_FADE_OUT_SEC = 2.5;

const SECTION_IMAGE = "/images/botman_design_second_section.png";

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

export default function HorizontalImageGalleryPlaceholder() {
  const sectionRef = useRef<HTMLElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const prevProgressRef = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    const shell = shellRef.current;
    if (!section || !shell) return;

    const fadeInShell = (delay = 0) => {
      gsap.to(shell, {
        opacity: 1,
        duration: SHELL_FADE_IN_SEC,
        delay,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    const fadeOutShell = () => {
      gsap.to(shell, {
        opacity: 0,
        duration: SHELL_FADE_OUT_SEC,
        ease: "power3.inOut",
        overwrite: "auto",
      });
    };

    /** Short tween to 0 when crossing into the tail band — never kill() here. */
    const hardOffFinishShell = () => {
      gsap.to(shell, {
        opacity: 0,
        duration: SHELL_HARD_OFF_FINISH_SEC,
        ease: "power2.in",
        overwrite: "auto",
      });
    };

    gsap.set(shell, { opacity: 0 });

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: `+=${SCROLL_HOLD}`,
      pin: true,
      pinSpacing: true,
      onEnter: (self) => {
        prevProgressRef.current = self.progress;
        fadeInShell(SHELL_FADE_IN_DELAY_SEC);
      },
      onEnterBack: (self) => {
        prevProgressRef.current = self.progress;
        fadeInShell(SHELL_FADE_IN_DELAY_SEC);
      },
      onLeave: () => {
        fadeOutShell();
      },
      onLeaveBack: () => {
        fadeOutShell();
      },
      onUpdate: (self) => {
        const p = self.progress;

        if (!self.isActive) {
          prevProgressRef.current = p;
          return;
        }

        const prev = prevProgressRef.current;

        if (prev >= SHELL_HARD_OFF_PROGRESS && p < SHELL_HARD_OFF_PROGRESS) {
          fadeInShell();
        }
        if (prev < SHELL_HARD_OFF_PROGRESS && p >= SHELL_HARD_OFF_PROGRESS) {
          hardOffFinishShell();
        }

        if (p < SHELL_HARD_OFF_PROGRESS) {
          if (prev < FADE_OUT_ENTER_PROGRESS && p >= FADE_OUT_ENTER_PROGRESS) {
            fadeOutShell();
          }
          if (prev > FADE_OUT_EXIT_PROGRESS && p <= FADE_OUT_EXIT_PROGRESS) {
            fadeInShell();
          }
        }

        prevProgressRef.current = p;
      },
      onToggle: (self) => {
        if (!self.isActive) {
          fadeOutShell();
        }
      },
    });

    requestAnimationFrame(() => {
      const p = st.progress;
      prevProgressRef.current = p;
      if (!st.isActive) return;
      if (p >= SHELL_HARD_OFF_PROGRESS) {
        hardOffFinishShell();
      } else if (p >= FADE_OUT_ENTER_PROGRESS) {
        fadeOutShell();
      } else {
        fadeInShell(SHELL_FADE_IN_DELAY_SEC);
      }
    });

    return () => {
      st.kill();
      gsap.killTweensOf(shell);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full relative overflow-hidden flex flex-col items-center justify-center gap-6"
      style={{
        backgroundColor: "var(--color-cedar)",
        minHeight: "100vh",
      }}
    >
      <div
        ref={shellRef}
        className="absolute inset-0 z-0 pointer-events-none"
        aria-hidden
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

      <div className="relative z-10 flex flex-col items-center justify-center gap-6 text-center px-12 md:px-20 lg:px-28">
        <p
          className="text-sm md:text-base leading-relaxed uppercase"
          style={{
            color: "var(--color-champagne)",
            fontFamily: "var(--font-montserrat)",
          }}
        >
          BAS BOTMAN
        </p>
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
      </div>
    </section>
  );
}
