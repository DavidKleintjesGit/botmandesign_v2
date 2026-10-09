import type { Language } from "./i18n";

/*
 * Het productmodel van de webshop.
 *
 * De gegevens staan voorlopig in dit bestand, zodat de winkelkant gebouwd en
 * bekeken kan worden voordat er een motor onder zit. Zodra die er is (Medusa,
 * Shopify of iets anders) verdwijnt deze lijst en komen de producten daarvandaan;
 * de vorm hieronder is bewust die van elke commerce-API, zodat alleen de bron
 * verandert en de pagina's niet.
 *
 * Prijzen in centen, niet in euro's: rekenen met kommagetallen levert vroeg of
 * laat een cent verschil op in een totaal.
 */

export type ProductCategory = "textiel" | "objecten" | "verlichting" | "kunst";

export interface ProductContent {
  name: string;
  /** Eén regel onder de titel, in de overzichtskaart en op de detailpagina. */
  tagline: string;
  description: string;
  /** Materiaal, afmeting, herkomst — wat er op het kaartje hoort. */
  specs: Array<{ label: string; value: string }>;
}

export interface Product {
  slug: string;
  category: ProductCategory;
  priceCents: number;
  currency: "EUR";
  /** null betekent onbeperkt; 0 is uitverkocht. */
  stock: number | null;
  images: string[];
  nl: ProductContent;
  en: ProductContent;
}

export const categoryLabels: Record<ProductCategory, { nl: string; en: string }> = {
  textiel: { nl: "Textiel", en: "Textiles" },
  objecten: { nl: "Objecten", en: "Objects" },
  verlichting: { nl: "Verlichting", en: "Lighting" },
  kunst: { nl: "Kunst", en: "Art" },
};

/*
 * Voorbeeldproducten om de vormgeving op te kunnen beoordelen. De beelden zijn
 * interieurfoto's die we al hadden — er is nog geen productfotografie, en dat
 * is het eerste wat een echte webshop nodig heeft.
 */
export const products: Product[] = [
  {
    slug: "boucle-kussen-zand",
    category: "textiel",
    priceCents: 8900,
    currency: "EUR",
    stock: 12,
    images: ["/images/design/detail-residence-05.jpg"],
    nl: {
      name: "Bouclé kussen — zand",
      tagline: "Zacht volume in een warme, neutrale tint.",
      description:
        "Een royaal kussen van dicht geweven bouclé, gevuld met donsveren zodat het zijn vorm houdt zonder stijf te staan. De zandtint sluit aan op de natuurlijke materialen waar we het liefst mee werken.",
      specs: [
        { label: "Materiaal", value: "Bouclé, donsvulling" },
        { label: "Afmeting", value: "50 × 50 cm" },
        { label: "Onderhoud", value: "Reiniging door een specialist" },
      ],
    },
    en: {
      name: "Bouclé cushion — sand",
      tagline: "Soft volume in a warm, neutral tone.",
      description:
        "A generous cushion in densely woven bouclé, filled with down so it keeps its shape without standing stiff. The sand tone sits with the natural materials we most like to work in.",
      specs: [
        { label: "Material", value: "Bouclé, down filling" },
        { label: "Size", value: "50 × 50 cm" },
        { label: "Care", value: "Specialist cleaning" },
      ],
    },
  },

  {
    slug: "travertijn-schaal",
    category: "objecten",
    priceCents: 16500,
    currency: "EUR",
    stock: 5,
    images: ["/images/design/detail-residence-03.jpg"],
    nl: {
      name: "Travertijnen schaal",
      tagline: "Uit één blok gesneden, met de nerf zichtbaar gelaten.",
      description:
        "Een ondiepe schaal, gesneden uit één blok travertijn en alleen gepolijst waar de hand hem raakt. Elk exemplaar tekent anders, omdat de nerf van de steen bepaalt hoe hij valt.",
      specs: [
        { label: "Materiaal", value: "Travertijn" },
        { label: "Afmeting", value: "Ø 32 cm, h 7 cm" },
        { label: "Herkomst", value: "Italië" },
      ],
    },
    en: {
      name: "Travertine bowl",
      tagline: "Cut from a single block, its grain left visible.",
      description:
        "A shallow bowl, cut from one block of travertine and polished only where the hand meets it. Every piece reads differently, because the grain of the stone decides how it falls.",
      specs: [
        { label: "Material", value: "Travertine" },
        { label: "Size", value: "Ø 32 cm, h 7 cm" },
        { label: "Origin", value: "Italy" },
      ],
    },
  },

  {
    slug: "bronzen-tafellamp",
    category: "verlichting",
    priceCents: 48000,
    currency: "EUR",
    stock: 2,
    images: ["/images/design/detail-residence-06.jpg"],
    nl: {
      name: "Bronzen tafellamp",
      tagline: "Warm, laag licht met een voet die patina opbouwt.",
      description:
        "Een tafellamp met een massief bronzen voet en een linnen kap die het licht zacht maakt. Het brons laat zich niet lakken, dus hij kleurt mee met de jaren.",
      specs: [
        { label: "Materiaal", value: "Brons, linnen kap" },
        { label: "Afmeting", value: "h 46 cm" },
        { label: "Fitting", value: "E27, dimbaar" },
      ],
    },
    en: {
      name: "Bronze table lamp",
      tagline: "Warm, low light on a base that builds patina.",
      description:
        "A table lamp on a solid bronze base with a linen shade that softens the light. The bronze is left unlacquered, so it colours with the years.",
      specs: [
        { label: "Material", value: "Bronze, linen shade" },
        { label: "Size", value: "h 46 cm" },
        { label: "Fitting", value: "E27, dimmable" },
      ],
    },
  },

  {
    slug: "studie-in-zand",
    category: "kunst",
    priceCents: 32500,
    currency: "EUR",
    stock: 1,
    images: ["/images/design/detail-residence-04.jpg"],
    nl: {
      name: "Studie in zand",
      tagline: "Pigment op linnen, in een eiken lijst.",
      description:
        "Een ingetogen werk in gebroken tinten, met de hand opgebracht in dunne lagen pigment. Geleverd in een massief eiken lijst, klaar om te hangen.",
      specs: [
        { label: "Techniek", value: "Pigment op linnen" },
        { label: "Afmeting", value: "80 × 100 cm" },
        { label: "Oplage", value: "Uniek werk" },
      ],
    },
    en: {
      name: "Study in sand",
      tagline: "Pigment on linen, in an oak frame.",
      description:
        "A restrained work in broken tones, laid on by hand in thin layers of pigment. Delivered in a solid oak frame, ready to hang.",
      specs: [
        { label: "Technique", value: "Pigment on linen" },
        { label: "Size", value: "80 × 100 cm" },
        { label: "Edition", value: "Unique work" },
      ],
    },
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function productContent(product: Product, language: Language): ProductContent {
  return product[language];
}

/** Prijzen worden in centen bewaard; dit is de enige plek die er een bedrag van maakt. */
export function formatPrice(priceCents: number, language: Language): string {
  return new Intl.NumberFormat(language === "nl" ? "nl-NL" : "en-GB", {
    style: "currency",
    currency: "EUR",
  }).format(priceCents / 100);
}

export function isSoldOut(product: Product): boolean {
  return product.stock === 0;
}
