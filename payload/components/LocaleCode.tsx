"use client";

import { useEffect, type ReactNode } from "react";
import { useLocale } from "@payloadcms/ui";

/*
 * Zet de taalcode van de gekozen taal in --bd-locale op <html>.
 *
 * Payload schrijft achter een vertaalbaar veld "— Nederlands". Het ontwerp
 * heeft daar een klein omlijnd blokje met NL of EN. Dat blokje wordt in CSS
 * gemaakt, en CSS kan niet weten welke taal gekozen is — vandaar deze
 * tussenstap. Verder rendert dit niets.
 */
export default function LocaleCode({ children }: { children?: ReactNode }) {
  const locale = useLocale();

  useEffect(() => {
    const code = String(locale?.code ?? "nl")
      .slice(0, 2)
      .toUpperCase();

    document.documentElement.style.setProperty("--bd-locale", `"${code}"`);
  }, [locale]);

  return <>{children}</>;
}
