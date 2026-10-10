"use client";

import { useLanguage } from "./LanguageProvider";
import { usePageSurface, INK_TRANSITION } from "./PageSurface";

interface LanguageLabelProps {
  onLanguageChange?: () => void;
}

export default function LanguageLabel({ onLanguageChange }: LanguageLabelProps) {
  const { language, setLanguage } = useLanguage();
  const selectedLanguage = language === "nl" ? "NL" : "EN";

  /*
   * Op een lichte grond is almond onzichtbaar — het is dezelfde kleur — en
   * champagne bijna. Daar wordt de gekozen taal zwart en de andere grijs.
   */
  const { light } = usePageSurface();
  const chosen = light ? "var(--color-black)" : "var(--color-champagne)";
  const other = light ? "rgba(2, 2, 3, 0.45)" : "var(--color-almond)";

  /* De schakelaar deelt nu dezelfde taalstatus als de rest van de site. */
  const handleLanguageClick = (next: "NL" | "EN") => {
    if (next === selectedLanguage) return;
    setLanguage(next === "NL" ? "nl" : "en");
    onLanguageChange?.();
  };

  return (
    <div className="fixed right-0 top-1/2 transform translate-y-28 z-40">
      <div 
        className="backdrop-blur-xl pl-4 pr-2 py-4 rounded-l-[2rem] border-l"
        style={{ 
          fontFamily: 'var(--font-cormorant-garamond), serif',
          width: '50px',
          backgroundColor: 'transparent',
          borderColor: light ? 'rgba(2, 2, 3, 0.28)' : 'var(--color-almond)',
          transition: INK_TRANSITION,
          boxShadow: '0 4px 30px rgba(0,0,0,0.08)',
        }}
      >
        <div className="flex flex-col items-center gap-6">
          <button 
            onClick={() => handleLanguageClick("NL")}
            className="uppercase text-sm font-semibold tracking-wider transition-all duration-300 hover:scale-110 cursor-pointer"
            style={{
              fontFamily: 'var(--font-cormorant-garamond), serif',
              letterSpacing: '0.15em',
              color: selectedLanguage === "NL" ? chosen : other,
              transition: INK_TRANSITION + ", transform 300ms ease",
            }}
            aria-label="Dutch"
          >
            NL
          </button>
          <button 
            onClick={() => handleLanguageClick("EN")}
            className="uppercase text-sm font-semibold tracking-wider transition-all duration-300 hover:scale-110 cursor-pointer"
            style={{
              fontFamily: 'var(--font-cormorant-garamond), serif',
              letterSpacing: '0.15em',
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

