"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { useLanguage } from "./LanguageProvider";
import { usePageSurface, INK_TRANSITION, FADE_TRANSITION } from "./PageSurface";

/*
 * Het woordmerk is champagne, en op de champagne grond van de collectie
 * verdwijnt het dus. Er is een tweede bestand in cedar — alleen de kleur
 * verschilt, de vorm van de letters is dezelfde. Een afbeelding kan niet van
 * kleur verlopen, dus liggen ze over elkaar en wisselen ze met hun dekking.
 */
function Wordmark({
  light,
  width,
  height,
}: {
  light: boolean;
  width: number;
  height: number;
}) {
  const common = {
    alt: "Botman Design",
    width,
    height,
    className: "h-auto",
    priority: true,
  };

  return (
    <span className="relative block" style={{ width }}>
      <Image
        {...common}
        src="/images/Botman Design Logo-03-A.png"
        style={{ opacity: light ? 0 : 1, transition: FADE_TRANSITION }}
      />
      <Image
        {...common}
        src="/images/Botman Design Logo-03-A-cedar.png"
        className="absolute inset-0 h-auto"
        style={{ opacity: light ? 1 : 0, transition: FADE_TRANSITION }}
      />
    </span>
  );
}

const COMPACT_BREAKPOINT = 1024;
const SCROLL_THRESHOLD = 40;

/*
 * De navigatie van de onderliggende pagina's. Zelfde opmaak als de navbar op de
 * homepage — Montserrat in hoofdletters, het woordmerk gecentreerd, Contact als
 * omlijnde pil — maar hier blijft hij staan in plaats van weg te faden, omdat
 * deze pagina's geen beeldvullende hero hebben om in te verdwijnen.
 */
export default function SiteHeader() {
  const { t } = useLanguage();
  /*
   * De balk staat op elke pagina, en niet elke pagina heeft dezelfde grond. Op
   * de collectie is die champagne, en daar valt champagne tekst weg; cedar
   * haalt er 5,1:1. De kleur verloopt mee met de achtergrond.
   */
  const { light } = usePageSurface();
  const [compact, setCompact] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  /*
   * De balk hoort bij de bovenkant van de pagina en nergens anders. Hij kwam
   * eerder terug zodra je omhoog scrolde, maar dan schuift er halverwege een
   * balk over het beeld dat je aan het bekijken bent. Nu is hij er alleen
   * bovenaan.
   */
  const [atTop, setAtTop] = useState(true);

  const drawerOpen = compact && menuOpen;

  useEffect(() => {
    const check = () => setCompact(window.innerWidth < COMPACT_BREAKPOINT);

    const onScroll = () => setAtTop(window.scrollY <= SCROLL_THRESHOLD);

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

  const visible = atTop;

  // De collectie staat er tijdelijk niet in; die komt terug als de webshop zover is.
  const leftLinks = [
    { key: "projects", label: t.navProjects, href: "/projecten" },
    { key: "services", label: t.navServices, href: "/services" },
  ];

  const rightLinks = [{ key: "about", label: t.navAbout, href: "/over" }];

  const inkColor = light ? "var(--color-cedar)" : "var(--color-champagne)";

  /* De navigatie gebruikt de labelstijl; alleen de kleur verloopt per pagina. */
  const linkStyle = { color: inkColor, transition: INK_TRANSITION } as const;

  const contactPill = (
    <Link
      href="/contact"
      className="t-label inline-block rounded-full border px-5 py-2.5 transition-all duration-300 hover:opacity-90"
      style={{
        backgroundColor: "transparent",
        borderColor: light ? "rgba(103, 92, 83, 0.45)" : "var(--color-almond)",
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
              ? "rgba(238, 227, 211, 0.6)"
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
                      className="t-label transition-colors"
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
                  <Wordmark light={light} width={240} height={80} />
                </Link>

                <div className="-mt-3 flex items-center gap-8">
                  {rightLinks.map((link) => (
                    <Link
                      key={link.key}
                      href={link.href}
                      className="t-label transition-colors"
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
                  <Wordmark light={light} width={180} height={60} />
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

      {/*
       * De la schuift van rechts naar binnen in plaats van er ineens te staan.
       * Hij blijft in de boom zolang hij dichtgaat, anders is er niets om de
       * beweging op te hangen.
       */}
      {compact && (
        <>
          <div
            className="fixed inset-0 z-[70] bg-black/50 transition-opacity duration-500"
            onClick={() => setMenuOpen(false)}
            style={{
              opacity: drawerOpen ? 1 : 0,
              pointerEvents: drawerOpen ? "auto" : "none",
            }}
            aria-hidden
          />
          <div
            className="fixed inset-y-0 right-0 z-[80] flex w-[min(360px,86vw)] flex-col gap-10 p-10"
            style={{
              backgroundColor: "var(--color-cedar)",
              borderLeft: "1px solid rgba(182, 163, 144, 0.25)",
              transform: drawerOpen ? "translateX(0)" : "translateX(100%)",
              transition: "transform 520ms cubic-bezier(0.22, 1, 0.36, 1)",
              visibility: drawerOpen ? "visible" : "hidden",
              transitionProperty: "transform, visibility",
              transitionDelay: drawerOpen ? "0ms, 0ms" : "0ms, 520ms",
            }}
          >
            <button
              type="button"
              aria-label={t.close}
              onClick={() => setMenuOpen(false)}
              className="-mr-2 -mt-2 cursor-pointer self-end p-2 text-5xl font-light leading-none transition-opacity duration-300 hover:opacity-70"
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
                  className="t-label"
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
              className="t-label inline-block rounded-full border px-5 py-3 text-center"
              style={{
                fontFamily: "var(--font-montserrat)",
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
