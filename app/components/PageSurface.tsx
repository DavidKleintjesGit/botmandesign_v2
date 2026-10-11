"use client";

import { usePathname } from "next/navigation";

/*
 * De achtergrondkleur van een pagina wordt hier bepaald en op body gezet.
 *
 * Paginacomponenten schilderen hun eigen grond niet meer. Zouden ze dat wel
 * doen, dan zou elke navigatie een nieuw element opleveren dat meteen in de
 * nieuwe kleur verschijnt — een harde omslag. Body blijft bij een navigatie
 * staan, dus daar verandert alleen de waarde en kan CSS er een overgang van
 * maken.
 *
 * Het gaat via een <style>-regel en niet via een effect, zodat de kleur al in
 * het antwoord van de server staat. Anders zou een pagina die je rechtstreeks
 * opent eerst in de standaardkleur verschijnen en daarna pas omslaan.
 */

/** Hoe lang de kleur erover doet. Lang genoeg om te zien, kort genoeg om niet te wachten. */
const DURATION_MS = 650;

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

  return <style>{`body { background-color: ${color}; }`}</style>;
}
