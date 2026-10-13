"use client";

import type { ReactNode } from "react";

import SiteHeader from "./SiteHeader";
import LanguageLabel from "./LanguageLabel";
import SocialMediaLabel from "./SocialMediaLabel";

/*
 * De navigatie, de taalschakelaar en de social-rail staan hier, in de layout,
 * in plaats van in elke pagina apart.
 *
 * Stonden ze in de pagina, dan werden ze bij elke navigatie opnieuw opgebouwd.
 * Een vers element verschijnt meteen in zijn eindkleur, dus de balk sprong van
 * champagne naar cedar terwijl de achtergrond eronder nog aan het verlopen was.
 * Nu blijven ze staan en verloopt hun kleur mee.
 */
export default function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <SocialMediaLabel />
      <LanguageLabel />
      {children}
    </>
  );
}
