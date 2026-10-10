import type { CollectionConfig } from "payload";

/*
 * Een project zoals het op /projecten en /projecten/[slug] verschijnt.
 *
 * De velden volgen wat de pagina's nu uit app/content/projects.ts halen, zodat
 * de overstap naar deze collectie geen herontwerp vraagt.
 */
export const Projects: CollectionConfig = {
  slug: "projects",
  labels: {
    singular: "Project",
    plural: "Projecten",
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "number", "year", "published"],
    group: "Website",
    description: "De projecten op de projectenpagina en op de homepage.",
  },
  access: {
    read: () => true,
  },
  defaultSort: "number",
  fields: [
    {
      name: "title",
      type: "text",
      label: "Titel",
      required: true,
      localized: true,
    },
    {
      name: "slug",
      type: "text",
      label: "Adres in de URL",
      required: true,
      unique: true,
      admin: {
        description: "Bijvoorbeeld villa-oltera — dit wordt /projecten/villa-oltera.",
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "number",
          type: "text",
          label: "Volgnummer",
          required: true,
          admin: {
            width: "33%",
            description: "01, 02, 03 — bepaalt ook de volgorde.",
          },
        },
        {
          name: "year",
          type: "text",
          label: "Jaar",
          required: true,
          admin: { width: "33%" },
        },
        {
          name: "category",
          type: "text",
          label: "Categorie",
          defaultValue: "Interior design",
          localized: true,
          admin: { width: "34%" },
        },
      ],
    },
    {
      name: "cardImage",
      type: "upload",
      relationTo: "media",
      label: "Hoofdbeeld",
      required: true,
      admin: {
        description: "Het beeld in het overzicht en bovenaan de projectpagina.",
      },
    },
    {
      name: "intro",
      type: "textarea",
      label: "Inleiding",
      localized: true,
      required: true,
    },
    {
      name: "slides",
      type: "array",
      label: "Beeldenreeks",
      labels: { singular: "Beeld", plural: "Beelden" },
      admin: {
        description:
          "De diashow op de projectpagina. Elk beeld vult één scherm; een bijschrift is optioneel.",
      },
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          label: "Beeld",
          required: true,
        },
        {
          name: "caption",
          type: "text",
          label: "Bijschrift",
          localized: true,
        },
        {
          name: "sub",
          type: "text",
          label: "Bovenschrift",
          localized: true,
          admin: { description: "Bijvoorbeeld EIKENHOUT — NATUURSTEEN." },
        },
        {
          name: "body",
          type: "textarea",
          label: "Toelichting",
          localized: true,
        },
      ],
    },
    {
      type: "collapsible",
      label: "Materiaal",
      fields: [
        {
          name: "materialQuote",
          type: "textarea",
          label: "Citaat",
          localized: true,
        },
        {
          name: "materialsList",
          type: "text",
          label: "Materialen",
          localized: true,
          admin: { description: "Bijvoorbeeld Boucle · Eikenhout · Natuursteen · Brons." },
        },
      ],
    },
    {
      name: "published",
      type: "checkbox",
      label: "Zichtbaar op de site",
      defaultValue: true,
      admin: { position: "sidebar" },
    },
  ],
};
