import type { Language } from "./i18n";

/*
 * Het productmodel van de webshop.
 *
 * De gegevens komen uit de database; wat hieronder staat is de vorm plus de
 * beginvulling waarmee de collectie gevuld is. Prijzen in centen, niet in
 * euro's: rekenen met kommagetallen levert vroeg of laat een cent verschil op
 * in een totaal.
 */

/*
 * De indeling volgt wat er in de collectie staat, niet een bedachte boom.
 * "Objecten" was eerst een vergaarbak met zes van de acht artikelen; daar
 * filtert niemand iets mee.
 */
export type ProductCategory = "vazen" | "schalen" | "verlichting" | "objecten";

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
  vazen: { nl: "Vazen", en: "Vases" },
  schalen: { nl: "Schalen", en: "Bowls" },
  verlichting: { nl: "Verlichting", en: "Lighting" },
  objecten: { nl: "Sculptuur", en: "Sculpture" },
};

/*
 * De beginvulling van de collectie. De beelden zijn uitgeknipte productfoto's
 * in public/images/shop — placeholders tot er fotografie is van wat Bas
 * werkelijk verkoopt.
 */
export const products: Product[] = [
  {
    slug: "ronde-vaas-zand",
    category: "vazen",
    priceCents: 16500,
    currency: "EUR",
    stock: 6,
    images: ["/images/shop/donutvaas.png"],
    nl: {
      name: "Ronde vaas — zand",
      tagline: "Eén gesloten vorm, gedraaid uit de hand.",
      description:
        "Een vaas die eerder als sculptuur leest dan als bloemenhouder. De ongeglazuurde buitenkant houdt het licht vast in plaats van het terug te kaatsen, waardoor de vorm zacht blijft in een ruimte.",
      specs: [
        { label: "Materiaal", value: "Ongeglazuurd keramiek" },
        { label: "Afmeting", value: "h 30 cm, b 28 cm" },
        { label: "Onderhoud", value: "Droog afnemen" },
      ],
    },
    en: {
      name: "Round vase — sand",
      tagline: "A single closed form, turned by hand.",
      description:
        "A vase that reads as sculpture more than as a holder for flowers. The unglazed surface holds the light rather than throwing it back, which keeps the form soft in a room.",
      specs: [
        { label: "Material", value: "Unglazed ceramic" },
        { label: "Size", value: "h 30 cm, w 28 cm" },
        { label: "Care", value: "Wipe dry" },
      ],
    },
  },

  {
    slug: "tafellamp-linnen",
    category: "verlichting",
    priceCents: 48000,
    currency: "EUR",
    stock: 2,
    images: ["/images/shop/lamp.png"],
    nl: {
      name: "Tafellamp met linnen kap",
      tagline: "Warm, laag licht met een gestructureerde voet.",
      description:
        "De linnen kap maakt het licht zacht en warm — geen lamp om bij te lezen, maar om een hoek mee te laten gloeien. De voet heeft een fijn reliëf dat bij daglicht meespeelt.",
      specs: [
        { label: "Materiaal", value: "Keramiek, linnen kap" },
        { label: "Afmeting", value: "h 42 cm" },
        { label: "Fitting", value: "E27, dimbaar" },
      ],
    },
    en: {
      name: "Table lamp with linen shade",
      tagline: "Warm, low light on a textured base.",
      description:
        "The linen shade softens the light and warms it — not a lamp to read by, but one to let a corner glow. The base carries a fine relief that catches the daylight.",
      specs: [
        { label: "Material", value: "Ceramic, linen shade" },
        { label: "Size", value: "h 42 cm" },
        { label: "Fitting", value: "E27, dimmable" },
      ],
    },
  },

  {
    slug: "bolvaas-steengrijs",
    category: "vazen",
    priceCents: 21500,
    currency: "EUR",
    stock: 4,
    images: ["/images/shop/vaas-grijs.png"],
    nl: {
      name: "Bolvaas — steengrijs",
      tagline: "Zware vorm, smalle opening, rustige tint.",
      description:
        "Een bolle vaas met een opvallend kleine hals, zodat één tak al genoeg is. Het steengrijs staat goed tegen warme materialen — eikenhout, brons, wol.",
      specs: [
        { label: "Materiaal", value: "Gestookt steengoed" },
        { label: "Afmeting", value: "h 26 cm, Ø 28 cm" },
        { label: "Waterdicht", value: "Ja" },
      ],
    },
    en: {
      name: "Globe vase — stone grey",
      tagline: "Heavy form, narrow mouth, quiet tone.",
      description:
        "A rounded vase with a strikingly small neck, so a single branch is enough. The stone grey sits well against warm materials — oak, bronze, wool.",
      specs: [
        { label: "Material", value: "Fired stoneware" },
        { label: "Size", value: "h 26 cm, Ø 28 cm" },
        { label: "Watertight", value: "Yes" },
      ],
    },
  },

  {
    slug: "ovale-schaal-albast",
    category: "schalen",
    priceCents: 27500,
    currency: "EUR",
    stock: 3,
    images: ["/images/shop/object-wit.png"],
    nl: {
      name: "Ovale schaal — albast",
      tagline: "Lage, langgerekte vorm die licht doorlaat.",
      description:
        "Uit één blok gesneden en zo dun geslepen dat de steen aan de randen oplicht. Ondiep genoeg om leeg te blijven staan zonder dat het leeg oogt.",
      specs: [
        { label: "Materiaal", value: "Albast" },
        { label: "Afmeting", value: "l 38 cm, b 18 cm" },
        { label: "Herkomst", value: "Italië" },
      ],
    },
    en: {
      name: "Oval bowl — alabaster",
      tagline: "A low, drawn-out form that lets light through.",
      description:
        "Cut from a single block and ground thin enough that the stone lights up at its edges. Shallow enough to stand empty without looking empty.",
      specs: [
        { label: "Material", value: "Alabaster" },
        { label: "Size", value: "l 38 cm, w 18 cm" },
        { label: "Origin", value: "Italy" },
      ],
    },
  },

  {
    slug: "schalen-set-keramiek",
    category: "schalen",
    priceCents: 14500,
    currency: "EUR",
    stock: 8,
    images: ["/images/shop/schaal-wit.png"],
    nl: {
      name: "Schalenset — keramiek",
      tagline: "Drie maten, dezelfde hand.",
      description:
        "Een grote schaal met twee kleintjes, met het spikkelige glazuur dat bij het stoken ontstaat. Bedoeld om te gebruiken, niet om weg te zetten.",
      specs: [
        { label: "Materiaal", value: "Gespikkeld keramiek" },
        { label: "Afmeting", value: "Ø 24, 12 en 10 cm" },
        { label: "Onderhoud", value: "Vaatwasserbestendig" },
      ],
    },
    en: {
      name: "Bowl set — ceramic",
      tagline: "Three sizes, one hand.",
      description:
        "A large bowl with two small ones, carrying the speckled glaze that comes out of the firing. Meant to be used, not put away.",
      specs: [
        { label: "Material", value: "Speckled ceramic" },
        { label: "Size", value: "Ø 24, 12 and 10 cm" },
        { label: "Care", value: "Dishwasher safe" },
      ],
    },
  },

  {
    slug: "vaasjes-trio",
    category: "vazen",
    priceCents: 9500,
    currency: "EUR",
    stock: 10,
    images: ["/images/shop/vazen-drie.png"],
    nl: {
      name: "Vaasjes — trio",
      tagline: "Klein genoeg om op een boekenplank te staan.",
      description:
        "Drie vaasjes in dezelfde vorm maar net verschillend van maat. Samen op een rij, of verspreid door een ruimte als terugkerend accent.",
      specs: [
        { label: "Materiaal", value: "Mat geglazuurd porselein" },
        { label: "Afmeting", value: "h 14, 12 en 11 cm" },
        { label: "Levering", value: "Als set van drie" },
      ],
    },
    en: {
      name: "Small vases — trio",
      tagline: "Small enough to live on a bookshelf.",
      description:
        "Three vases in the same shape but slightly different in size. Lined up together, or spread through a room as a returning accent.",
      specs: [
        { label: "Material", value: "Matt glazed porcelain" },
        { label: "Size", value: "h 14, 12 and 11 cm" },
        { label: "Delivery", value: "As a set of three" },
      ],
    },
  },

  {
    slug: "sokkel-travertijn",
    category: "objecten",
    priceCents: 34500,
    currency: "EUR",
    stock: 2,
    images: ["/images/shop/schaal-houder.png"],
    nl: {
      name: "Sokkel in travertijn",
      tagline: "Een voetstuk dat zelf het object is.",
      description:
        "Een zuil uit travertijn met een ondiepe kom in het bovenvlak. Bedoeld om iets kleins op te laten staan, maar hij houdt zich ook alleen staande prima.",
      specs: [
        { label: "Materiaal", value: "Travertijn" },
        { label: "Afmeting", value: "h 32 cm, Ø 12 cm" },
        { label: "Gewicht", value: "Circa 6 kg" },
      ],
    },
    en: {
      name: "Travertine plinth",
      tagline: "A pedestal that is the object itself.",
      description:
        "A travertine column with a shallow dish set into its top. Meant to hold something small, though it holds its own standing alone.",
      specs: [
        { label: "Material", value: "Travertine" },
        { label: "Size", value: "h 32 cm, Ø 12 cm" },
        { label: "Weight", value: "Around 6 kg" },
      ],
    },
  },

  {
    slug: "wandobject-gevlochten",
    category: "objecten",
    priceCents: 39500,
    currency: "EUR",
    stock: 1,
    images: ["/images/shop/object-rond.png"],
    nl: {
      name: "Wandobject — gevlochten",
      tagline: "Een rond reliëf dat met het licht meebeweegt.",
      description:
        "Honderden kleine vormen die vanuit het midden naar buiten draaien. Het reliëf vangt schaduw, dus het object verandert door de dag heen.",
      specs: [
        { label: "Materiaal", value: "Keramiek op paneel" },
        { label: "Afmeting", value: "Ø 44 cm" },
        { label: "Oplage", value: "Uniek werk" },
      ],
    },
    en: {
      name: "Wall piece — woven",
      tagline: "A round relief that moves with the light.",
      description:
        "Hundreds of small forms turning outward from the centre. The relief catches shadow, so the piece changes through the day.",
      specs: [
        { label: "Material", value: "Ceramic on panel" },
        { label: "Size", value: "Ø 44 cm" },
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
