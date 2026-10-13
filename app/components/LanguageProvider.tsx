"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";

import {
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  siteCopy,
  type Language,
  type SiteCopy,
} from "@/app/content/i18n";

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: SiteCopy;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

/*
 * localStorage als externe store. useSyncExternalStore laat React de opgeslagen
 * taal lezen zonder setState in een effect: de server rendert DEFAULT_LANGUAGE
 * (getServerSnapshot) en de client leest de echte keuze meteen bij hydratie.
 * Een wissel in een ander tabblad komt via het storage-event binnen.
 */
const listeners = new Set<() => void>();

function subscribe(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getSnapshot(): Language {
  try {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return stored === "nl" || stored === "en" ? stored : DEFAULT_LANGUAGE;
  } catch {
    // Private mode of geblokkeerde opslag: we houden de standaardtaal aan.
    return DEFAULT_LANGUAGE;
  }
}

function getServerSnapshot(): Language {
  return DEFAULT_LANGUAGE;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const language = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((next: Language) => {
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
    } catch {
      // Niet kunnen opslaan mag de wissel zelf niet tegenhouden.
    }
    // Het storage-event vuurt niet in het tabblad dat schrijft, dus zelf melden.
    listeners.forEach((listener) => listener());
  }, []);

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, t: siteCopy[language] }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context)
    throw new Error("useLanguage must be used inside a LanguageProvider");
  return context;
}
