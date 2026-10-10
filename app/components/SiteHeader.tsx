"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { useLanguage } from "./LanguageProvider";
import { usePageSurface, INK_TRANSITION } from "./PageSurface";

const COMPACT_BREAKPOINT = 1024;
const SCROLL_THRESHOLD = 40;

/** Hoeveel pixels richtingverandering nodig is voordat de balk reageert. */
const DIRECTION_THRESHOLD = 8;

/*
 * De navigatie van de onderliggende pagina's. Zelfde opmaak als de navbar op de
 * homepage — Montserrat in hoofdletters, het woordmerk gecentreerd, Contact als
 * omlijnde pil — maar hier blijft hij staan in plaats van weg te faden, omdat
 * deze pagina's geen beeldvullende hero hebben om in te verdwijnen.
 */
interface SiteHeaderProps {
  /** Verbergt de balk, bijvoorbeeld terwijl een beeldvullende diashow loopt. */
  hidden?: boolean;
}

export default function SiteHeader({ hidden = false }: SiteHeaderProps) {
  const { t } = useLanguage();
  /*
   * De balk staat op elke pagina, en niet elke pagina heeft dezelfde grond. Op
   * de collectie is die licht, en daar valt champagne tekst weg (1,9:1); zwart
   * haalt er 8,5:1. De kleur verloopt mee met de achtergrond.
   */
  const { light } = usePageSurface();
  const [compact, setCompact] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  /*
   * De balk mag het beeld niet in de weg zitten maar moet wel bereikbaar
   * blijven. Hij verdwijnt daarom zodra je naar beneden scrolt en komt terug
   * zodra je omhoog gaat — dan is hij nodig. Bovenaan de pagina staat hij
   * gewoon.
   */
  const [revealed, setRevealed] = useState(true);
  const [atTop, setAtTop] = useState(true);

  const drawerOpen = compact && menuOpen;

  useEffect(() => {
    const check = () => setCompact(window.innerWidth < COMPACT_BREAKPOINT);

    let last = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const top = y <= SCROLL_THRESHOLD;

      setAtTop(top);

      // Kleine bewegingen negeren, anders knippert de balk bij elke rimpel.
      if (Math.abs(y - last) > DIRECTION_THRESHOLD) {
        setRevealed(top || y < last);
        last = y;
      }
    };

    check();
    onScroll();
    window.addEventListener("resize", check);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", check);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

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

  // De diashow op een projectpagina kan de balk ook helemaal onderdrukken.
  const visible = revealed && !hidden;

  const leftLinks = [
    { key: "projects", label: t.navProjects, href: "/projecten" },
    { key: "services", label: t.navServices, href: "/services" },
    { key: "shop", label: t.navShop, href: "/collectie" },
  ];

  const rightLinks = [{ key: "about", label: t.navAbout, href: "/over" }];

  const inkColor = light ? "var(--color-black)" : "var(--color-champagne)";

  const linkStyle = {
    fontFamily: "var(--font-montserrat)",
    letterSpacing: "0.15em",
    color: inkColor,
    transition: INK_TRANSITION,
  } as const;

  const contactPill = (
    <Link
      href="/contact"
      className="inline-block rounded-full border px-5 py-2.5 text-sm font-light uppercase tracking-wider transition-all duration-300 hover:opacity-90"
      style={{
        fontFamily: "var(--font-montserrat)",
        letterSpacing: "0.15em",
        backgroundColor: "transparent",
        borderColor: light ? "rgba(2, 2, 3, 0.32)" : "var(--color-almond)",
        color: inkColor,
        transition: INK_TRANSITION,
      }}
    >
      {t.navContact}
    </Link>
  );

  return (
    <>
      <nav
        className="fixed inset-x-0 top-0 z-50 pt-5 transition-all duration-500"
        style={{
          // Wegschuiven in plaats van alleen vervagen: zo neemt hij ook geen
          // ruimte meer in beeld in zodra hij weg is.
          transform: visible ? "translateY(0)" : "translateY(-100%)",
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? "auto" : "none",
          /*
           * Bovenaan helemaal doorzichtig. Daarna een waas in plaats van een
           * vlak: genoeg om de links leesbaar te houden boven een foto, te
           * weinig om de aandacht te trekken.
           */
          backgroundColor: atTop
            ? "transparent"
            : light
              ? "rgba(182, 163, 144, 0.55)"
              : "rgba(103, 92, 83, 0.38)",
          backdropFilter: atTop ? "none" : "blur(14px)",
          WebkitBackdropFilter: atTop ? "none" : "blur(14px)",
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
                  <button
                    type="button"
                    aria-label={t.menu}
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen(true)}
                    className="flex cursor-pointer flex-col gap-[5px] p-[6px]"
                  >
                    <span
                      className="block h-px w-[26px]"
                      style={{ backgroundColor: inkColor }}
                    />
                    <span
                      className="block h-px w-[26px]"
                      style={{ backgroundColor: inkColor }}
                    />
                    <span
                      className="block h-px w-[18px] self-end"
                      style={{ backgroundColor: inkColor }}
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
