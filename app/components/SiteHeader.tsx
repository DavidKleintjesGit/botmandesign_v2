"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { useLanguage } from "./LanguageProvider";

const COMPACT_BREAKPOINT = 1024;
const SCROLL_THRESHOLD = 40;

/*
 * De navigatie van de onderliggende pagina's. Zelfde opmaak als de navbar op de
 * homepage — Montserrat in hoofdletters, het woordmerk gecentreerd, Contact als
 * omlijnde pil — maar hier blijft hij staan in plaats van weg te faden, omdat
 * deze pagina's geen beeldvullende hero hebben om in te verdwijnen.
 */
interface SiteHeaderProps {
  /** Verbergt de balk, bijvoorbeeld terwijl een beeldvullende diashow loopt. */
  hidden?: boolean;
  /*
   * De homepage laat de balk wegvagen zodra je voorbij de hero scrolt. Geef het
   * element mee dat dat moment bepaalt; zonder dit blijft de balk gewoon staan.
   */
  fadeOutAfterRef?: React.RefObject<HTMLElement | null>;
  /*
   * De homepage heeft al een eigen taalwisselaar aan de zijkant, dus daar laten
   * we deze weg om er geen twee op één pagina te hebben.
   */
  showLanguageSwitch?: boolean;
}

export default function SiteHeader({
  hidden = false,
  fadeOutAfterRef,
  showLanguageSwitch = true,
}: SiteHeaderProps) {
  const { language, setLanguage, t } = useLanguage();
  const [compact, setCompact] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const drawerOpen = compact && menuOpen;

  useEffect(() => {
    const check = () => setCompact(window.innerWidth < COMPACT_BREAKPOINT);
    const checkScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);

    check();
    checkScroll();
    window.addEventListener("resize", check);
    window.addEventListener("scroll", checkScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", check);
      window.removeEventListener("scroll", checkScroll);
    };
  }, []);

  const [fadedOut, setFadedOut] = useState(false);

  useEffect(() => {
    const trigger = fadeOutAfterRef?.current;
    if (!trigger) return;

    const onScroll = () => {
      const rect = trigger.getBoundingClientRect();
      setFadedOut(rect.bottom <= 300);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [fadeOutAfterRef]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  useEffect(() => {
    if (!drawerOpen) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [drawerOpen]);

  const leftLinks = [
    { key: "projects", label: t.navProjects, href: "/projecten" },
    { key: "services", label: t.navServices, href: "/services" },
  ];

  const rightLinks = [{ key: "about", label: t.navAbout, href: "/over" }];

  const linkStyle = {
    fontFamily: "var(--font-montserrat)",
    letterSpacing: "0.15em",
    color: "var(--color-champagne)",
  } as const;

  const languageSwitch = (
    <div
      className="flex items-center gap-1 text-[11px]"
      style={{
        fontFamily: "var(--font-montserrat)",
        letterSpacing: "0.1em",
        color: "var(--color-almond)",
      }}
    >
      <button
        type="button"
        onClick={() => setLanguage("nl")}
        className="cursor-pointer bg-transparent p-0"
        style={{ opacity: language === "nl" ? 1 : 0.5, color: "inherit" }}
      >
        NL
      </button>
      <span style={{ opacity: 0.5 }}>/</span>
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className="cursor-pointer bg-transparent p-0"
        style={{ opacity: language === "en" ? 1 : 0.5, color: "inherit" }}
      >
        EN
      </button>
    </div>
  );

  const contactPill = (
    <Link
      href="/contact"
      className="inline-block rounded-full border px-5 py-2.5 text-sm font-light uppercase tracking-wider transition-all duration-300 hover:opacity-90"
      style={{
        fontFamily: "var(--font-montserrat)",
        letterSpacing: "0.15em",
        backgroundColor: "transparent",
        borderColor: "var(--color-almond)",
        color: "var(--color-champagne)",
      }}
    >
      {t.navContact}
    </Link>
  );

  return (
    <>
      <nav
        className="fixed inset-x-0 top-0 z-50 pt-5 transition-all duration-300"
        style={{
          opacity: hidden || fadedOut ? 0 : 1,
          pointerEvents: hidden || fadedOut ? "none" : "auto",
          backgroundColor: scrolled ? "var(--color-cedar)" : "transparent",
          borderBottom: scrolled
            ? "1px solid rgba(182, 163, 144, 0.25)"
            : "1px solid transparent",
        }}
      >
        <div className="container mx-auto px-8 md:px-12">
          <div className="relative flex min-h-[96px] items-center justify-between">
            {!compact ? (
              <>
                <div className="-mt-3 flex items-center gap-8">
                  {leftLinks.map((link) => (
                    <Link
                      key={link.key}
                      href={link.href}
                      className="text-sm font-light uppercase tracking-wider transition-colors"
                      style={linkStyle}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                <Link
                  href="/"
                  className="absolute left-1/2 top-3"
                  style={{ transform: "translateX(-50%)" }}
                  aria-label="Botman Design"
                >
                  <Image
                    src="/images/Botman Design Logo-03-A.png"
                    alt="Botman Design"
                    width={240}
                    height={80}
                    className="h-auto"
                    priority
                  />
                </Link>

                <div className="-mt-3 flex items-center gap-8">
                  {rightLinks.map((link) => (
                    <Link
                      key={link.key}
                      href={link.href}
                      className="text-sm font-light uppercase tracking-wider transition-colors"
                      style={linkStyle}
                    >
                      {link.label}
                    </Link>
                  ))}
                  {languageSwitch}
                  {contactPill}
                </div>
              </>
            ) : (
              <>
                <Link href="/" aria-label="Botman Design">
                  <Image
                    src="/images/Botman Design Logo-03-A.png"
                    alt="Botman Design"
                    width={180}
                    height={60}
                    className="h-auto"
                    priority
                  />
                </Link>

                <div className="flex items-center gap-5">
                  {showLanguageSwitch && languageSwitch}
                  <button
                    type="button"
                    aria-label={t.menu}
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen(true)}
                    className="flex cursor-pointer flex-col gap-[5px] p-[6px]"
                  >
                    <span
                      className="block h-px w-[26px]"
                      style={{ backgroundColor: "var(--color-champagne)" }}
                    />
                    <span
                      className="block h-px w-[26px]"
                      style={{ backgroundColor: "var(--color-champagne)" }}
                    />
                    <span
                      className="block h-px w-[18px] self-end"
                      style={{ backgroundColor: "var(--color-champagne)" }}
                    />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {drawerOpen && (
        <>
          <div
            className="fixed inset-0 z-[70] bg-black/50"
            onClick={() => setMenuOpen(false)}
            aria-hidden
          />
          <div
            className="fixed inset-y-0 right-0 z-[80] flex w-[min(360px,86vw)] flex-col gap-10 p-10"
            style={{
              backgroundColor: "var(--color-cedar)",
              borderLeft: "1px solid rgba(182, 163, 144, 0.25)",
            }}
          >
            <button
              type="button"
              aria-label={t.close}
              onClick={() => setMenuOpen(false)}
              className="cursor-pointer self-end text-2xl leading-none"
              style={{ color: "var(--color-champagne)" }}
            >
              &times;
            </button>

            <nav className="flex flex-col gap-6">
              {[...leftLinks, ...rightLinks].map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-light uppercase tracking-wider"
                  style={linkStyle}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex-1" />

            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="inline-block rounded-full border px-5 py-3 text-center text-sm font-light uppercase tracking-wider"
              style={{
                fontFamily: "var(--font-montserrat)",
                letterSpacing: "0.15em",
                borderColor: "var(--color-almond)",
                color: "var(--color-champagne)",
              }}
            >
              {t.navContact}
            </Link>
          </div>
        </>
      )}
    </>
  );
}
