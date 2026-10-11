import type { Language } from "./i18n";

/*
 * Hoe een dia in beeld komt. Niet elke dia hoeft een schermvullende foto te
 * zijn: twee beelden naast elkaar geven lucht, een beeld met tekst ernaast
 * geeft ruimte om iets uit te leggen, en een dia met alleen tekst is een
 * adempauze tussen twee reeksen beeld door.
 */
export type SlideLayout = "vol" | "duo" | "tekst" | "rust";

export interface ProjectSlide {
  layout: SlideLayout;
  img: string;
  /** Het tweede beeld, alleen bij twee naast elkaar. */
  imgTwo?: string;
  caption: string;
  sub: string;
  body: string;
}

export interface ProjectContent {
  category: string;
  intro: string;
  materialQuote: string;
  materialsLabel: string;
  materialsList: string;
  slides: ProjectSlide[];
}

export interface Project {
  slug: string;
  title: string;
  /** Volgnummer en jaar zoals ze op de kaart staan: "01 — INTERIOR DESIGN — 2024". */
  number: string;
  year: string;
  cardImage: string;
  en: ProjectContent;
  nl: ProjectContent;
}

/*
 * De beeldenreeks van de projectpagina. In Bas zijn ontwerp deelt elk project
 * dezelfde reeks; zodra er per project eigen fotografie is, krijgt elk project
 * hier zijn eigen slides.
 */
const sharedSlides: { en: ProjectSlide[]; nl: ProjectSlide[] } = {
  en: [
    {
      layout: "vol",
      img: "/images/design/detail-residence-01.jpg",
      caption: "Living room",
      sub: "LIGHT & SPACE",
      body: "Large windows and a soft, natural palette let daylight shape the room — calm as the starting point.",
    },
    { layout: "vol", img: "/images/design/detail-residence-02.jpg", caption: "", sub: "", body: "" },
    {
      layout: "vol",
      img: "/images/design/detail-residence-03.jpg",
      caption: "Material palette",
      sub: "OAK — NATURAL STONE",
      body: "",
    },
    { layout: "vol", img: "/images/design/detail-residence-04.jpg", caption: "", sub: "", body: "" },
    {
      layout: "vol",
      img: "/images/design/detail-residence-05.jpg",
      caption: "Seating area",
      sub: "DETAIL",
      body: "Boucle, bronze and oak meet in a corner that invites you to stay a while.",
    },
    {
      layout: "vol",
      img: "/images/design/detail-residence-06.jpg",
      caption: "Closing image",
      sub: "STYLING",
      body: "",
    },
  ],
  nl: [
    {
      layout: "vol",
      img: "/images/design/detail-residence-01.jpg",
      caption: "Woonkamer",
      sub: "LICHT & RUIMTE",
      body: "Grote ramen en een zacht, natuurlijk kleurenpalet laten daglicht de ruimte vormgeven — rust als uitgangspunt.",
    },
    { layout: "vol", img: "/images/design/detail-residence-02.jpg", caption: "", sub: "", body: "" },
    {
      layout: "vol",
      img: "/images/design/detail-residence-03.jpg",
      caption: "Materiaalpalet",
      sub: "EIKENHOUT — NATUURSTEEN",
      body: "",
    },
    { layout: "vol", img: "/images/design/detail-residence-04.jpg", caption: "", sub: "", body: "" },
    {
      layout: "vol",
      img: "/images/design/detail-residence-05.jpg",
      caption: "Zithoek",
      sub: "DETAIL",
      body: "Boucle, brons en eikenhout ontmoeten elkaar in een hoek die uitnodigt om te blijven zitten.",
    },
    {
      layout: "vol",
      img: "/images/design/detail-residence-06.jpg",
      caption: "Slotbeeld",
      sub: "STYLING",
      body: "",
    },
  ],
};

const sharedCopy = {
  en: {
    category: "INTERIOR DESIGN — 2024",
    intro:
      "A complete interior designed around calm, texture and light. Natural materials, soft tones and custom furniture bring warmth to a clean architectural frame.",
    materialQuote:
      '"Material, light and texture compose a space that feels calm — considered in every corner."',
    materialsLabel: "MATERIALS",
    materialsList: "Boucle · Oak · Natural stone · Bronze",
    slides: sharedSlides.en,
  },
  nl: {
    category: "INTERIOR DESIGN — 2024",
    intro:
      "Een volledig interieur ontworpen rond rust, textuur en licht. Natuurlijke materialen, zachte tinten en maatwerk meubilair brengen warmte in een strak architectonisch kader.",
    materialQuote:
      '"Materiaal, licht en textuur componeren tot een ruimte die kalm aanvoelt — in elke hoek doordacht."',
    materialsLabel: "MATERIALEN",
    materialsList: "Boucle · Eikenhout · Natuursteen · Brons",
    slides: sharedSlides.nl,
  },
};

const projectList: Array<{ slug: string; title: string; number: string; year: string; cardImage: string }> = [
  { slug: "villa-oltera", title: "Villa Oltera", number: "01", year: "2024", cardImage: "/images/design/project-villa-oltera.jpg" },
  { slug: "villa-alero", title: "Villa Alero", number: "02", year: "2024", cardImage: "/images/design/project-villa-alero.jpg" },
  { slug: "onderzeeen-apartment", title: "Onderzeeën Apartment", number: "03", year: "2023", cardImage: "/images/design/project-onderzeeen-apartment.jpg" },
  { slug: "villa-nera", title: "Villa Nera", number: "04", year: "2023", cardImage: "/images/design/project-villa-nera.jpg" },
  { slug: "villa-rivenna", title: "Villa Rivenna", number: "05", year: "2022", cardImage: "/images/design/project-villa-rivenna.jpg" },
  { slug: "cliara-villa", title: "Cliara Villa", number: "06", year: "2022", cardImage: "/images/design/project-cliara-villa.jpg" },
  { slug: "villa-vitael", title: "Villa Vitael", number: "07", year: "2021", cardImage: "/images/design/project-villa-vitael.jpg" },
];

export const projects: Project[] = projectList.map((p) => ({
  ...p,
  en: sharedCopy.en,
  nl: sharedCopy.nl,
}));

export const projectSlugs = projects.map((p) => p.slug);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function projectContent(project: Project, language: Language): ProjectContent {
  return project[language];
}

/** Het volgende project in de reeks, zodat de detailpagina altijd verder kan. */
export function nextProject(slug: string): Project {
  const index = projects.findIndex((p) => p.slug === slug);
  return projects[(index + 1) % projects.length];
}
