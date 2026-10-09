import type { Language } from "./i18n";

export interface ServiceStep {
  title: string;
  body: string;
  img: string;
}

export interface ServiceReason {
  n: string;
  text: string;
}

export interface ServiceContent {
  name: string;
  tagline: string;
  price: string;
  introOne: string;
  /** Een tweede alinea als de dienst er een heeft; anders leeg. */
  introTwo?: string;
  /*
   * Redenen, stappen en een klantquote staan in het ontwerp, maar Bas heeft
   * die teksten nog niet aangeleverd. Zolang ze leeg zijn slaat de pagina die
   * secties over — liever een korte pagina dan een pagina met verzonnen tekst
   * onder zijn naam.
   */
  reasons?: ServiceReason[];
  steps?: ServiceStep[];
  quote?: string;
  quoteAttr?: string;
}

export interface Service {
  number: string;
  heroImage: string;
  cardImage: string;
  en: ServiceContent;
  nl: ServiceContent;
}

/*
 * De diensten zoals Bas ze zelf beschreef (9 oktober 2026). De Nederlandse
 * teksten zijn letterlijk van hem; de Engelse zijn een vertaling daarvan en
 * mogen nog langs hem.
 */
export const services: Record<string, Service> = {
  "turn-key-projects": {
    number: "01",
    heroImage: "/images/design/svc-style-consult-hero.jpg",
    cardImage: "/images/design/service-style-consult.jpg",
    nl: {
      name: "Turn-key Projects",
      tagline: "Van concept tot realisatie, volledig uit handen genomen.",
      price: "Vanaf € 7.500",
      introOne:
        "Volledige interieurprojecten van concept tot realisatie. Denk aan ontwerp, materiaalkeuzes, maatwerk, inkoop, styling en projectbegeleiding.",
    },
    en: {
      name: "Turn-key Projects",
      tagline: "From concept to completion, entirely taken care of.",
      price: "From € 7,500",
      introOne:
        "Complete interior projects from concept through to realization. Design, material selection, bespoke work, sourcing, styling and project management.",
    },
  },

  "interior-upgrade": {
    number: "02",
    heroImage: "/images/design/svc-signature-design-hero.jpg",
    cardImage: "/images/design/service-signature-design.jpg",
    nl: {
      name: "Interior Upgrade",
      tagline: "Een bestaande ruimte naar een hoger niveau, zonder verbouwing.",
      price: "Vanaf € 5.000",
      introOne:
        "Een gerichte vernieuwing van een bestaande ruimte, waarbij indeling, sfeer, materialen, meubels en styling naar een hoger niveau worden gebracht zonder volledige verbouwing.",
    },
    en: {
      name: "Interior Upgrade",
      tagline: "An existing space lifted, without a full renovation.",
      price: "From € 5,000",
      introOne:
        "A focused renewal of an existing space, raising the layout, atmosphere, materials, furniture and styling to a higher level without a full renovation.",
    },
  },

  restyling: {
    number: "03",
    heroImage: "/images/design/svc-home-couture-hero.jpg",
    cardImage: "/images/design/service-home-couture.jpg",
    nl: {
      name: "Restyling",
      tagline: "Verfijnde herinrichting met oog voor sfeer en detail.",
      price: "Vanaf € 2.500",
      introOne:
        "Een verfijnde herinrichting of afstyling van een bestaande ruimte met focus op meubels, accessoires, verlichting, kunst en sfeer.",
    },
    en: {
      name: "Restyling",
      tagline: "A refined rearrangement, with an eye for mood and detail.",
      price: "From € 2,500",
      introOne:
        "A refined rearrangement or restyling of an existing space, focused on furniture, accessories, lighting, art and atmosphere.",
    },
  },
};

export const serviceSlugs = Object.keys(services);

export function getService(slug: string): Service | undefined {
  return services[slug];
}

export function serviceContent(service: Service, language: Language): ServiceContent {
  return service[language];
}
