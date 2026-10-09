"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface BusinessCardComponentProps {
  showCardAfterRef: React.RefObject<HTMLElement | null>;
  hideCardAfterRef?: React.RefObject<HTMLElement | null>;
  forceHidden?: boolean;
}

const CARD_SURFACE_STYLE = {
  fontFamily: "var(--font-cormorant-garamond), serif",
  color: "var(--color-champagne)",
  backgroundColor: "rgba(103, 92, 83, 0.34)",
  border: "0.5px solid rgba(238, 227, 211, 0.12)",
  boxShadow: `
    inset 0 1px 1px rgba(255, 255, 255, 0.12),
    inset 0 -1px 1px rgba(0, 0, 0, 0.03),
    0 4px 24px rgba(0, 0, 0, 0.08)
  `,
  transition: "background-color 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease",
} as const;

const DIVIDER_STYLE = {
  background:
    "linear-gradient(to bottom, transparent, rgba(238, 227, 211, 0.14) 20%, rgba(238, 227, 211, 0.08) 50%, rgba(182, 163, 144, 0.05) 80%, transparent)",
} as const;

function CardDivider() {
  return (
    <div
      className="h-8 w-px shrink-0 md:h-10"
      style={DIVIDER_STYLE}
      aria-hidden
    />
  );
}

function SocialIconLink({
  href,
  label,
  children,
  external = false,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      className="opacity-90 transition-opacity hover:opacity-100"
      aria-label={label}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}

export default function BusinessCardComponent({
  showCardAfterRef,
  hideCardAfterRef,
  forceHidden = false,
}: BusinessCardComponentProps) {
  const [hasEntered, setHasEntered] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [pastHidePoint, setPastHidePoint] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInSection = showCard && !pastHidePoint && !forceHidden;

  useEffect(() => {
    const trigger = showCardAfterRef?.current;
    if (!trigger) return;

    const st = ScrollTrigger.create({
      trigger,
      start: "bottom top",
      onEnter: () => {
        setHasEntered(true);
        setShowCard(true);
      },
      onLeaveBack: () => setShowCard(false),
    });

    return () => {
      st.kill();
    };
  }, [showCardAfterRef]);

  useEffect(() => {
    if (!hideCardAfterRef) return;

    const trigger = hideCardAfterRef.current;
    if (!trigger) return;

    const st = ScrollTrigger.create({
      trigger,
      start: "top top",
      onEnter: () => setPastHidePoint(true),
      onLeaveBack: () => setPastHidePoint(false),
    });

    return () => {
      st.kill();
    };
  }, [hideCardAfterRef]);

  useEffect(() => {
    if (!hasEntered || !cardRef.current) return;
    gsap.to(cardRef.current, {
      opacity: isInSection ? 1 : 0,
      duration: isInSection ? 0.4 : 1.8,
      ease: "power2.out",
      overwrite: true,
    });
  }, [hasEntered, isInSection]);

  if (!hasEntered) return null;

  return (
    <div
      ref={cardRef}
      className="fixed bottom-[max(0.875rem,env(safe-area-inset-bottom))] left-1/2 z-40 w-[calc(100%-1.5rem)] max-w-none -translate-x-1/2 rounded-2xl px-4 py-3 backdrop-blur-2xl backdrop-saturate-150 sm:bottom-6 sm:max-w-3xl sm:rounded-[2rem] sm:px-7 sm:py-5"
      style={{
        ...CARD_SURFACE_STYLE,
        opacity: 0,
        pointerEvents: isInSection ? "auto" : "none",
      }}
    >
      <div className="flex w-full flex-col items-center gap-2 sm:hidden">
            <div className="flex items-center justify-center gap-4">
              <SocialIconLink href="#" label="Instagram">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </SocialIconLink>
              <SocialIconLink href="#" label="LinkedIn">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </SocialIconLink>
              <SocialIconLink href="https://wa.me/31652621881" label="WhatsApp" external>
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M20.463,3.488C18.217,1.24,15.231,0.001,12.05,0 C5.495,0,0.16,5.334,0.157,11.892c-0.001,2.096,0.547,4.142,1.588,5.946L0.057,24l6.304-1.654 c1.737,0.948,3.693,1.447,5.683,1.448h0.005c6.554,0,11.89-5.335,11.893-11.893C23.944,8.724,22.708,5.735,20.463,3.488z M12.05,21.785h-0.004c-1.774,0-3.513-0.477-5.031-1.378l-0.361-0.214l-3.741,0.981l0.999-3.648l-0.235-0.374 c-0.99-1.574-1.512-3.393-1.511-5.26c0.002-5.45,4.437-9.884,9.889-9.884c2.64,0,5.122,1.03,6.988,2.898 c1.866,1.869,2.893,4.352,2.892,6.993C21.932,17.351,17.498,21.785,12.05,21.785z M17.472,14.382 c-0.297-0.149-1.758-0.868-2.031-0.967c-0.272-0.099-0.47-0.149-0.669,0.148s-0.767,0.967-0.941,1.166 c-0.173,0.198-0.347,0.223-0.644,0.074c-0.297-0.149-1.255-0.462-2.39-1.475c-0.883-0.788-1.48-1.761-1.653-2.059 s-0.018-0.458,0.13-0.606c0.134-0.133,0.297-0.347,0.446-0.521C9.87,9.97,9.919,9.846,10.019,9.647 c0.099-0.198,0.05-0.372-0.025-0.521C9.919,8.978,9.325,7.515,9.078,6.92c-0.241-0.58-0.486-0.501-0.669-0.51 C8.236,6.401,8.038,6.4,7.839,6.4c-0.198,0-0.52,0.074-0.792,0.372c-0.272,0.298-1.04,1.017-1.04,2.479 c0,1.463,1.065,2.876,1.213,3.074c0.148,0.198,2.095,3.2,5.076,4.487c0.709,0.306,1.263,0.489,1.694,0.626 c0.712,0.226,1.36,0.194,1.872,0.118c0.571-0.085,1.758-0.719,2.006-1.413c0.248-0.694,0.248-1.29,0.173-1.413 C17.967,14.605,17.769,14.531,17.472,14.382z"
                  />
                </svg>
              </SocialIconLink>
            </div>

            <div
              className="h-px w-full max-w-xs"
              style={{
                background:
                  "linear-gradient(to right, transparent, rgba(238, 227, 211, 0.18) 50%, transparent)",
              }}
              aria-hidden
            />

            <div className="flex w-full min-w-0 items-center justify-between gap-3 px-1">
              <a
                href="tel:+31652621881"
                className="shrink-0 text-[11px] font-medium tracking-[0.04em] opacity-90 transition-opacity hover:opacity-100"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                +31 6 52621881
              </a>
              <a
                href="mailto:studio@botmandesign.com"
                className="min-w-0 truncate text-right text-[11px] font-medium tracking-[0.04em] opacity-90 transition-opacity hover:opacity-100"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                studio@botmandesign.com
              </a>
            </div>
          </div>

      <div className="hidden w-full items-center gap-5 sm:flex">
            <div className="flex min-w-0 flex-[0.85] items-center justify-evenly px-2">
              <SocialIconLink href="#" label="Instagram">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </SocialIconLink>
              <SocialIconLink href="#" label="LinkedIn">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </SocialIconLink>
              <SocialIconLink href="https://wa.me/31652621881" label="WhatsApp" external>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M20.463,3.488C18.217,1.24,15.231,0.001,12.05,0 C5.495,0,0.16,5.334,0.157,11.892c-0.001,2.096,0.547,4.142,1.588,5.946L0.057,24l6.304-1.654 c1.737,0.948,3.693,1.447,5.683,1.448h0.005c6.554,0,11.89-5.335,11.893-11.893C23.944,8.724,22.708,5.735,20.463,3.488z M12.05,21.785h-0.004c-1.774,0-3.513-0.477-5.031-1.378l-0.361-0.214l-3.741,0.981l0.999-3.648l-0.235-0.374 c-0.99-1.574-1.512-3.393-1.511-5.26c0.002-5.45,4.437-9.884,9.889-9.884c2.64,0,5.122,1.03,6.988,2.898 c1.866,1.869,2.893,4.352,2.892,6.993C21.932,17.351,17.498,21.785,12.05,21.785z M17.472,14.382 c-0.297-0.149-1.758-0.868-2.031-0.967c-0.272-0.099-0.47-0.149-0.669,0.148s-0.767,0.967-0.941,1.166 c-0.173,0.198-0.347,0.223-0.644,0.074c-0.297-0.149-1.255-0.462-2.39-1.475c-0.883-0.788-1.48-1.761-1.653-2.059 s-0.018-0.458,0.13-0.606c0.134-0.133,0.297-0.347,0.446-0.521C9.87,9.97,9.919,9.846,10.019,9.647 c0.099-0.198,0.05-0.372-0.025-0.521C9.919,8.978,9.325,7.515,9.078,6.92c-0.241-0.58-0.486-0.501-0.669-0.51 C8.236,6.401,8.038,6.4,7.839,6.4c-0.198,0-0.52,0.074-0.792,0.372c-0.272,0.298-1.04,1.017-1.04,2.479 c0,1.463,1.065,2.876,1.213,3.074c0.148,0.198,2.095,3.2,5.076,4.487c0.709,0.306,1.263,0.489,1.694,0.626 c0.712,0.226,1.36,0.194,1.872,0.118c0.571-0.085,1.758-0.719,2.006-1.413c0.248-0.694,0.248-1.29,0.173-1.413 C17.967,14.605,17.769,14.531,17.472,14.382z"
                  />
                </svg>
              </SocialIconLink>
            </div>
            <CardDivider />
            <div className="flex min-w-0 flex-[1.3] items-center justify-center px-2">
              <a
                href="mailto:studio@botmandesign.com"
                className="truncate text-sm font-medium opacity-90 transition-opacity hover:opacity-100 whitespace-nowrap"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                studio@botmandesign.com
              </a>
            </div>
            <CardDivider />
            <div className="flex min-w-0 flex-[0.85] items-center justify-center px-2">
              <a
                href="tel:+31652621881"
                className="truncate text-sm font-medium opacity-90 transition-opacity hover:opacity-100 whitespace-nowrap"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                +31 6 52621881
              </a>
            </div>
          </div>
    </div>
  );
}
