import type { CollectionConfig } from "payload";

/*
 * De studio services. De velden die Bas nog niet heeft aangeleverd — redenen,
 * stappen en een klantcitaat — staan er wel in maar zijn optioneel: de
 * detailpagina slaat die secties over zolang ze leeg zijn.
 */
export const ServicesCollection: CollectionConfig = {
  slug: "services",
  labels: {
    singular: "Service",
    plural: "Services",
  },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "number", "price", "published"],
    group: "Website",
    description: "De diensten op de homepage, het overzicht en de detailpagina's.",
  },
  access: {
    read: () => true,
  },
  defaultSort: "number",
  fields: [
    {
      name: "name",
      type: "text",
      label: "Naam",
      required: true,
      localized: true,
    },
    {
      name: "slug",
      type: "text",
      label: "Adres in de URL",
      required: true,
      unique: true,
    },
    {
      type: "row",
      fields: [
        {
          name: "number",
          type: "text",
          label: "Volgnummer",
          required: true,
          admin: { width: "50%", description: "01, 02, 03 — bepaalt de volgorde." },
        },
        {
          name: "price",
          type: "text",
          label: "Prijs",
          required: true,
          localized: true,
          admin: { width: "50%", description: "Bijvoorbeeld Vanaf € 7.500." },
        },
      ],
    },
    {
      name: "tagline",
      type: "text",
      label: "Eén regel onder de titel",
      localized: true,
      required: true,
    },
    {
      name: "introOne",
      type: "textarea",
      label: "Beschrijving",
      localized: true,
      required: true,
    },
    {
      name: "introTwo",
      type: "textarea",
      label: "Tweede alinea",
      localized: true,
    },
    {
      type: "row",
      fields: [
        {
          name: "cardImage",
          type: "upload",
          relationTo: "media",
          label: "Beeld in het overzicht",
          admin: { width: "50%" },
        },
        {
          name: "heroImage",
          type: "upload",
          relationTo: "media",
          label: "Beeld bovenaan de pagina",
          admin: { width: "50%" },
        },
      ],
    },
    {
      type: "collapsible",
      label: "Waarom deze service",
      admin: {
        description: "Laat leeg en de sectie verschijnt niet op de pagina.",
      },
      fields: [
        {
          name: "reasons",
          type: "array",
          label: "Redenen",
          labels: { singular: "Reden", plural: "Redenen" },
          fields: [
            {
              name: "text",
              type: "textarea",
              label: "Reden",
              localized: true,
            },
          ],
        },
      ],
    },
    {
      type: "collapsible",
      label: "Hoe het werkt",
      admin: {
        description: "De stappen van het traject. Leeg laten mag ook.",
      },
      fields: [
        {
          name: "steps",
          type: "array",
          label: "Stappen",
          labels: { singular: "Stap", plural: "Stappen" },
          fields: [
            {
              name: "title",
              type: "text",
              label: "Titel",
              localized: true,
            },
            {
              name: "body",
              type: "textarea",
              label: "Toelichting",
              localized: true,
            },
            {
              name: "image",
              type: "upload",
              relationTo: "media",
              label: "Beeld",
            },
          ],
        },
      ],
    },
    {
      type: "collapsible",
      label: "Klantcitaat",
      admin: {
        description: "Alleen invullen als de klant hier toestemming voor heeft gegeven.",
      },
      fields: [
        {
          name: "quote",
          type: "textarea",
          label: "Citaat",
          localized: true,
        },
        {
          name: "quoteAttr",
          type: "text",
          label: "Van wie",
          localized: true,
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
