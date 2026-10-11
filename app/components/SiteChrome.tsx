"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import SiteHeader from "./SiteHeader";
import LanguageLabel from "./LanguageLabel";
import SocialMediaLabel from "./SocialMediaLabel";

/*
 * De navigatie en de taalschakelaar staan hier, in de layout, in plaats van in
 * elke pagina apart.
 *
 * Stonden ze in de pagina, dan werden ze bij elke navigatie opnieuw opgebouwd.
 * Een vers element verschijnt meteen in zijn eindkleur, dus de balk sprong van
 * champagne naar cedar terwijl de achtergrond eronder nog aan het verlopen was.
 * Nu blijven ze staan en verloopt hun kleur mee.
 */

const SetHiddenContext = createContext<(hidden: boolean) => void>(() => {});

/**
 * Verbergt de balk zolang de aanroepende pagina dat vraagt — de projectpagina
 * doet dat terwijl de beeldvullende diashow loopt.
 */
export function useNavHidden(hidden: boolean) {
  const setHidden = useContext(SetHiddenContext);

  useEffect(() => {
    setHidden(hidden);
    return () => setHidden(false);
  }, [hidden, setHidden]);
}

export default function SiteChrome({ children }: { children: ReactNode }) {
  const [hidden, setHidden] = useState(false);

  return (
    <SetHiddenContext.Provider value={setHidden}>
      <SiteHeader hidden={hidden} />

      {/*
       * De rail rechts: social boven het midden, taal eronder — op elke
       * pagina, behalve zolang de diashow het scherm vult. Daar hoort niets
       * overheen te liggen; je kijkt dan naar een ruimte, niet naar een site.
       */}
      <div
        className="transition-all duration-500"
        style={{
          transform: hidden ? "translateX(100%)" : "translateX(0)",
          opacity: hidden ? 0 : 1,
          pointerEvents: hidden ? "none" : "auto",
        }}
      >
        <SocialMediaLabel />
        <LanguageLabel />
      </div>
      {children}
    </SetHiddenContext.Provider>
  );
}
