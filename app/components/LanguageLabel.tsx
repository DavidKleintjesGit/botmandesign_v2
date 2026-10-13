"use client";

import { useLanguage } from "./LanguageProvider";
import { usePageSurface, INK_TRANSITION } from "./PageSurface";

export default function LanguageLabel() {
  const { language, setLanguage } = useLanguage();
  const selectedLanguage = language === "nl" ? "NL" : "EN";

  /*
   * Op de champagne grond van de collectie is champagne tekst onzichtbaar — het
   * is dezelfde kleur. Daar wordt de gekozen taal cedar en de andere een
   * lichtere cedar.
   */
  const { light } = usePageSurface();
  const chosen = light ? "var(--color-cedar)" : "var(--color-champagne)";
  const other = light ? "rgba(103, 92, 83, 0.5)" : "var(--color-almond)";

  /* De schakelaar deelt nu dezelfde taalstatus als de rest van de site. */
  const handleLanguageClick = (next: "NL" | "EN") => {
    if (next === selectedLanguage) return;
    setLanguage(next === "NL" ? "nl" : "en");
  };

  return (
    <div className="fixed right-0 top-1/2 transform translate-y-28 z-40">
      <div
        className="backdrop-blur-xl pl-4 pr-2 py-4 rounded-l-[2rem] border-l"
        style={{
          width: "50px",
          /*
           * Een waas met een vleugje kleur in plaats van helemaal doorzichtig:
           * zo is het een vlak dat je kunt aanwijzen, zonder de foto eronder
           * dicht te gooien.
           */
          backgroundColor: light ? "rgba(238, 227, 211, 0.5)" : "rgba(103, 92, 83, 0.42)",
          borderColor: light ? "rgba(103, 92, 83, 0.25)" : "rgba(238, 227, 211, 0.35)",
          transition: INK_TRANSITION,
          boxShadow: "0 6px 34px rgba(0,0,0,0.14)",
        }}
      >
        <div className="flex flex-col items-center gap-6">
          <button
            onClick={() => handleLanguageClick("NL")}
            className="t-label transition-all duration-300 hover:scale-110 cursor-pointer"
            style={{
              color: selectedLanguage === "NL" ? chosen : other,
              transition: INK_TRANSITION + ", transform 300ms ease",
            }}
            aria-label="Dutch"
          >
            NL
          </button>
          <button
            onClick={() => handleLanguageClick("EN")}
            className="t-label transition-all duration-300 hover:scale-110 cursor-pointer"
            style={{
              color: selectedLanguage === "EN" ? chosen : other,
              transition: INK_TRANSITION + ", transform 300ms ease",
            }}
            aria-label="English"
          >
            EN
          </button>
        </div>
      </div>
    </div>
  );
}
