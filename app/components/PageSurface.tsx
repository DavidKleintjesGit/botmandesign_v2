"use client";

import { usePathname } from "next/navigation";

/*
 * De achtergrondkleur van een pagina staat hier, in één laag die in de layout
 * hangt en dus blijft staan terwijl je van pagina naar pagina gaat.
 *
 * Paginacomponenten schilderen hun eigen grond niet meer. Zouden ze dat wel
 * doen, dan zou elke navigatie een nieuw element opleveren dat meteen in de
 * nieuwe kleur verschijnt — een harde omslag. Door de kleur in een blijvende
 * laag te zetten verandert alleen de waarde, en kan CSS er een overgang van
 * maken.
 */

/** Hoe lang de kleur erover doet. Lang genoeg om te zien, kort genoeg om niet te wachten. */
const DURATION_MS = 650;

export const SURFACE_TRANSITION = `background-color ${DURATION_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`;
export const INK_TRANSITION = `color ${DURATION_MS}ms cubic-bezier(0.4, 0, 0.2, 1), border-color ${DURATION_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`;

interface Surface {
  /** De achtergrond van deze pagina. */
  color: string;
  /** Lichte grond: tekst moet dan zwart zijn in plaats van champagne. */
  light: boolean;
}

/*
 * De collectie staat op champagne, de rest van de site op cedar. Champagne is
 * licht, dus daar valt champagne tekst weg en gaat de tekst naar zwart en
 * cedar — 16,4:1 en 5,1:1.
 */
function surfaceFor(pathname: string): Surface {
  if (pathname.startsWith("/collectie")) {
    return { color: "var(--color-champagne)", light: true };
  }

  return { color: "var(--color-cedar)", light: false };
}

/** Voor componenten die zich naar de grond moeten voegen, zoals de navigatie. */
export function usePageSurface(): Surface {
  return surfaceFor(usePathname() ?? "/");
}

export default function PageSurface() {
  const { color } = usePageSurface();

  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10"
      style={{ backgroundColor: color, transition: SURFACE_TRANSITION }}
    />
  );
}
