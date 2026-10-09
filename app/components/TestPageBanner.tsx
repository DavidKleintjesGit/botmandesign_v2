"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const FADE_IN_DELAY_MS = 1000;
const FADE_IN_DURATION_MS = 2800;
const ARROW_HIDE_SCROLL_PX = 24;
const ARROW_FADE_OUT_MS = 500;

export default function TestPageBanner() {
  const [contentVisible, setContentVisible] = useState(false);
  const [arrowHidden, setArrowHidden] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setContentVisible(true), FADE_IN_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const hideArrow = () => {
      if (window.scrollY > ARROW_HIDE_SCROLL_PX) {
        setArrowHidden(true);
      }
    };

    hideArrow();
    window.addEventListener("scroll", hideArrow, { passive: true });

    return () => {
      window.removeEventListener("scroll", hideArrow);
    };
  }, []);

  const arrowVisible = contentVisible && !arrowHidden;

  return (
    <section
      className="h-full w-full relative overflow-hidden flex items-center justify-center px-5 sm:px-8 md:px-12 py-10 sm:py-14"
      style={{
        backgroundColor: "var(--color-cedar)",
      }}
    >
      <div className="relative mx-auto w-[90vw] max-w-[380px] -translate-y-6 sm:w-[76vw] sm:max-w-[440px] sm:-translate-y-8 md:w-[72vw] md:max-w-[560px] lg:w-[min(72vmin,760px)] lg:max-w-[760px]">
        <div
          style={{
            opacity: contentVisible ? 1 : 0,
            transition: `opacity ${FADE_IN_DURATION_MS}ms ease-out`,
          }}
        >
          <Image
            src="/images/Botman Design Logo-03.svg"
            alt="Botman Design"
            width={840}
            height={840}
            priority
            className="block h-auto w-full"
          />
        </div>

        <button
          type="button"
          className="group absolute left-1/2 top-full mt-16 flex h-9 w-9 sm:mt-2 sm:h-14 sm:w-14 -translate-x-1/2 items-center justify-center rounded-full border transition-colors duration-300 hover:bg-[var(--color-champagne)]"
          style={{
            borderColor: "var(--color-almond)",
            color: "var(--color-champagne)",
            opacity: arrowVisible ? 1 : 0,
            transition: `opacity ${arrowHidden ? ARROW_FADE_OUT_MS : FADE_IN_DURATION_MS}ms ease-out`,
            pointerEvents: arrowVisible ? "auto" : "none",
          }}
          aria-label="Scroll down"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 sm:h-6 sm:w-6 transition-colors duration-300 group-hover:text-[var(--color-cedar)]"
          >
            <path d="M12 5v14" />
            <path d="m6 13 6 6 6-6" />
          </svg>
        </button>
      </div>
    </section>
  );
}
