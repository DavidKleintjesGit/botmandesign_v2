/*
 * Hoe elke collectie in de lijst wordt getoond: welke kolommen, waar de titel
 * vandaan komt en of er een zichtbaarheidsfilter bij hoort.
 *
 * Eén component toont alle collecties; dit bestand is het enige dat per
 * collectie verschilt.
 */

export type ColumnKind = "text" | "number" | "price" | "date";

export interface ColumnSpec {
  label: string;
  field: string;
  kind?: ColumnKind;
  /** Breedte in de grid; samen vormen ze grid-template-columns. */
  width: string;
}

export interface ListSpec {
  label: string;
  description: string;
  newLabel: string;
  searchLabel: string;
  /** Veld waarop de titel in de eerste kolom staat. */
  titleField: string;
  /** Kleine regel onder de titel. */
  subField?: string;
  /** Veld waarop gezocht wordt. */
  searchField: string;
  columns: ColumnSpec[];
  hasVisibility: boolean;
  /** Media toont een raster met voorbeelden in plaats van een tabel. */
  isMedia?: boolean;
  defaultSort: string;
}

export const LIST_SPECS: Record<string, ListSpec> = {
  projects: {
    label: "Projecten",
    description: "De projecten op de projectenpagina en op de homepage.",
    newLabel: "Nieuw project",
    searchLabel: "Zoek op titel",
    titleField: "title",
    subField: "slug",
    searchField: "title",
    columns: [
      { label: "Nummer", field: "number", width: "90px" },
      { label: "Jaar", field: "year", width: "90px" },
    ],
    hasVisibility: true,
    defaultSort: "number",
  },

  services: {
    label: "Services",
    description: "De diensten op de homepage, het overzicht en de detailpagina's.",
    newLabel: "Nieuwe service",
    searchLabel: "Zoek op naam",
    titleField: "name",
    subField: "slug",
    searchField: "name",
    columns: [
      { label: "Nummer", field: "number", width: "90px" },
      { label: "Prijs", field: "price", width: "140px" },
    ],
    hasVisibility: true,
    defaultSort: "number",
  },

  testimonials: {
    label: "Wat klanten zeggen",
    description: "De citaten die op de homepage rouleren.",
    newLabel: "Nieuw citaat",
    searchLabel: "Zoek op naam",
    titleField: "attribution",
    subField: "quote",
    searchField: "attribution",
    columns: [{ label: "Volgorde", field: "order", kind: "number", width: "110px" }],
    hasVisibility: true,
    defaultSort: "order",
  },

  products: {
    label: "Producten",
    description: "De artikelen in de collectie.",
    newLabel: "Nieuw product",
    searchLabel: "Zoek op naam",
    titleField: "name",
    subField: "slug",
    searchField: "name",
    columns: [
      { label: "Categorie", field: "category", width: "130px" },
      { label: "Prijs", field: "priceCents", kind: "price", width: "110px" },
      { label: "Voorraad", field: "stock", kind: "number", width: "100px" },
    ],
    hasVisibility: true,
    defaultSort: "name",
  },

  media: {
    label: "Media",
    description: "De beelden die op de site gebruikt worden.",
    newLabel: "Uploaden",
    searchLabel: "Zoek op omschrijving",
    titleField: "filename",
    subField: "alt",
    searchField: "alt",
    columns: [],
    hasVisibility: false,
    isMedia: true,
    defaultSort: "-createdAt",
  },

  users: {
    label: "Gebruikers",
    description: "Wie er in dit paneel mag.",
    newLabel: "Nieuwe gebruiker",
    searchLabel: "Zoek op e-mailadres",
    titleField: "email",
    subField: "name",
    searchField: "email",
    columns: [],
    hasVisibility: false,
    defaultSort: "email",
  },
};

export const CATEGORY_LABELS: Record<string, string> = {
  vazen: "Vazen",
  schalen: "Schalen",
  verlichting: "Verlichting",
  objecten: "Sculptuur",
};

/** Maakt van een veldwaarde de tekst die in de cel komt. */
export function cellValue(raw: unknown, kind: ColumnKind = "text"): string {
  if (raw === null || raw === undefined || raw === "") return "—";

  if (kind === "price" && typeof raw === "number") {
    return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(raw / 100);
  }

  if (kind === "date" && typeof raw === "string") {
    return new Intl.DateTimeFormat("nl-NL", { day: "numeric", month: "short", year: "numeric" }).format(
      new Date(raw),
    );
  }

  const text = String(raw);
  return CATEGORY_LABELS[text] ?? text;
}
