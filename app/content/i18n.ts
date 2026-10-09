export type Language = "nl" | "en";

export const LANGUAGE_STORAGE_KEY = "botman_lang";

export const DEFAULT_LANGUAGE: Language = "nl";

/**
 * Teksten die op elke pagina terugkomen: de navigatie en de footer. Pagina-
 * eigen teksten staan bij de pagina zelf of in projects.ts / services.ts.
 */
export const siteCopy = {
  en: {
    navHome: "HOME",
    navAbout: "ABOUT",
    navProjects: "PROJECTS",
    navShop: "COLLECTION",
    navServices: "SERVICES",
    navStudio: "STUDIO",
    navContact: "CONTACT",
    inquiry: "INQUIRY",
    menu: "Menu",
    close: "Close",
    footerAbout:
      "Botman Design is a luxury design studio that focuses on multiple services, all catered around your life and your needs.",
    rightsReserved: "All rights reserved.",
  },
  nl: {
    navHome: "HOME",
    navAbout: "OVER",
    navProjects: "PROJECTEN",
    navShop: "COLLECTIE",
    navServices: "SERVICES",
    navStudio: "STUDIO",
    navContact: "CONTACT",
    inquiry: "AANVRAAG",
    menu: "Menu",
    close: "Sluiten",
    footerAbout:
      "Botman Design is een luxe designstudio die zich richt op meerdere diensten, allemaal afgestemd op uw leven en wensen.",
    rightsReserved: "Alle rechten voorbehouden.",
  },
} as const;

export type SiteCopy = (typeof siteCopy)[Language];

export const studioDetails = {
  email: "studio@botmandesign.com",
  phone: "+31 6 52621881",
  phoneHref: "tel:+31652621881",
  city: "Amstelveen, The Netherlands",
  handle: "@botmandesign",
};
