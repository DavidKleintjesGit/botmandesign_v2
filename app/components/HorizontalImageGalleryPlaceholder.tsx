"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useLanguage } from "./LanguageProvider";

gsap.registerPlugin(ScrollTrigger);

/**
 * Hoeveel pixels de sectie vastgepind blijft. Dit was 5400, toen 1800, nu 900:
 * er staat één regel, dus er valt niets meer af te wachten. Lang genoeg om het
 * beeld te laten komen en gaan, kort genoeg om niet vast te zitten.
 */
const SCROLL_HOLD = 900;

/** Crossing this progress (increasing) → starts timed fade-out animation. */
const FADE_OUT_ENTER_PROGRESS = 0.62;

/** Crossing below this (decreasing) → timed fade-in again (hysteresis). */
const FADE_OUT_EXIT_PROGRESS = 0.56;

/**
 * Crossing into this band finishes the shell to opacity 0. Lower = longer scroll after (no image)
 * before the pin ends: tail is (1 − this) × SCROLL_HOLD px once the short finish tween completes.
 */
const SHELL_HARD_OFF_PROGRESS = 0.85;

/** Fast finish when entering the hard-off band (still animated, not a 1-frame set). */
const SHELL_HARD_OFF_FINISH_SEC = 0.3;

const SHELL_FADE_IN_SEC = 0.8;
const SHELL_FADE_IN_DELAY_SEC = 0.1;
const SHELL_FADE_OUT_SEC = 0.7;

const SECTION_IMAGE = "/images/botman_design_second_section.png";

/*
 * Eén regel. Er stonden er drie, die elkaar aflosten terwijl je scrolde, maar
 * dat vroeg om aandacht die het niet terugbetaalde: je stond stil om tekst te
 * zien veranderen. Nu staat er wat er staat, en scroll je er zo doorheen.
 */
const LINES = {
  nl: [{ from: 0, text: ["“Gebouwd in lagen.", "Gevoeld in stilte.”"] }],
  en: [{ from: 0, text: ["“Built in layers.", "Felt in silence.”"] }],
} as const;

/** Welke regel hoort bij deze positie in het blok. */
function lineAt(progress: number): number {
  const steps = LINES.nl;
  for (let i = steps.length - 1; i >= 0; i -= 1) {
    if (progress >= steps[i].from) return i;
  }
  return 0;
}

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
  const { language } = useLanguage();
  const [activeLine, setActiveLine] = useState(0);
  const activeLineRef = useRef(0);
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

        // Alleen bijwerken bij een wissel; onUpdate vuurt elke frame.
        const next = lineAt(p);
        if (next !== activeLineRef.current) {
          activeLineRef.current = next;
          setActiveLine(next);
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

      <div className="relative z-10 flex flex-col items-center justify-center gap-8 px-12 text-center md:px-20 lg:px-28">
        <p
          className="text-sm leading-relaxed uppercase md:text-base"
          style={{
            color: "var(--color-champagne)",
            fontFamily: "var(--font-montserrat)",
          }}
        >
          BAS BOTMAN
        </p>

        {/*
          De regels liggen over elkaar heen zodat de hoogte niet verspringt bij
          een wissel; alleen de actieve is zichtbaar.
        */}
        <div className="relative mx-auto w-full max-w-3xl">
          {LINES[language].map((line, index) => (
            <h2
              key={line.from}
              className={`flex flex-col items-center gap-0 text-3xl font-light uppercase tracking-wider transition-all duration-700 md:text-5xl lg:text-6xl ${
                index === 0 ? "relative" : "absolute inset-0"
              }`}
              style={{
                fontFamily: "var(--font-cormorant-garamond), serif",
                letterSpacing: "0.04em",
                wordSpacing: "0.25em",
                color: "var(--color-champagne)",
                opacity: index === activeLine ? 1 : 0,
                transform: index === activeLine ? "translateY(0)" : "translateY(12px)",
              }}
              aria-hidden={index !== activeLine}
            >
              {line.text.map((regel) => (
                <span key={regel} className="block w-full text-center">
                  {regel}
                </span>
              ))}
            </h2>
          ))}
        </div>
      </div>
    </section>
  );
}
